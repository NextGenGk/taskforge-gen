
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set');
    }

    // Parse request body
    const { businessId, userId } = await req.json();
    
    if (!businessId) {
      return new Response(
        JSON.stringify({ error: 'Business ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch business data
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (businessError || !business) {
      console.error('Error fetching business:', businessError);
      return new Response(
        JSON.stringify({ error: 'Business not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch existing tasks for the business to avoid duplicates
    const { data: existingTasks, error: tasksError } = await supabase
      .from('tasks')
      .select('title')
      .eq('business_id', businessId);

    if (tasksError) {
      console.error('Error fetching existing tasks:', tasksError);
    }

    const existingTaskTitles = existingTasks?.map(task => task.title.toLowerCase()) || [];

    // Build prompt for the LLM
    const prompt = `
      Generate 3-5 actionable business tasks for a ${business.type} business in the ${business.industry} industry, named "${business.name}".
      
      Business Details:
      - Size: ${business.size}
      - Location: ${business.location}
      - Description: ${business.description}
      ${business.founded_year ? `- Founded Year: ${business.founded_year}` : ''}
      ${business.website ? `- Website: ${business.website}` : ''}
      
      For each task, provide the following in JSON format:
      1. title - A clear, concise title
      2. description - Detailed description with actionable steps
      3. frequency - One of: "once", "daily", "weekly", "monthly", "quarterly", "yearly"
      4. priority - One of: "low", "medium", "high", "critical"
      5. category - One of: "marketing", "finance", "operations", "legal", "sales", "customer_service", "human_resources", "technology", "administration", "strategy", "other"
      6. tags - An array of 1-3 relevant tags as strings
      7. due_date - Suggested due date in ISO format (YYYY-MM-DD), reasonable based on priority and current date
      
      Avoid generating tasks with these titles: ${existingTaskTitles.join(', ')}.
      
      Format the response as a valid JSON array of task objects.
    `;

    console.log('Sending prompt to OpenRouter:', prompt.substring(0, 200) + '...');

    // Call OpenRouter API
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.ai',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a business assistant that generates actionable tasks for businesses. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.text();
      console.error('OpenRouter API error:', errorData);
      throw new Error(`OpenRouter API returned ${openRouterResponse.status}: ${errorData}`);
    }

    const llmResponse = await openRouterResponse.json();
    console.log('OpenRouter response received');

    // Extract tasks from LLM response
    const responseContent = llmResponse.choices[0].message.content;
    
    // Parse the JSON from the response
    let tasks;
    try {
      // Extract JSON if it's wrapped in backticks
      const jsonMatch = responseContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                         responseContent.match(/```\s*([\s\S]*?)\s*```/) ||
                         [null, responseContent];
      
      const jsonString = jsonMatch[1].trim();
      tasks = JSON.parse(jsonString);
      
      // Ensure tasks is an array
      if (!Array.isArray(tasks)) {
        if (typeof tasks === 'object') {
          tasks = [tasks]; // Convert single object to array
        } else {
          throw new Error('Response is not an array or object');
        }
      }
    } catch (error) {
      console.error('Error parsing LLM response:', error);
      console.log('Raw response:', responseContent);
      throw new Error('Failed to parse tasks from LLM response');
    }

    console.log(`Successfully parsed ${tasks.length} tasks`);

    // Insert tasks into Supabase
    const insertedTasks = [];
    for (const task of tasks) {
      // Skip if a task with this title already exists
      if (existingTaskTitles.includes(task.title.toLowerCase())) {
        console.log(`Skipping existing task: ${task.title}`);
        continue;
      }

      // Format due date
      let dueDate = null;
      if (task.due_date) {
        try {
          dueDate = new Date(task.due_date).toISOString();
        } catch (e) {
          console.warn('Invalid due date format, setting to null', e);
        }
      }

      // Ensure tags is an array
      const tags = Array.isArray(task.tags) ? task.tags : 
                  (typeof task.tags === 'string' ? [task.tags] : []);

      const { data: insertedTask, error: insertError } = await supabase
        .from('tasks')
        .insert({
          business_id: businessId,
          title: task.title,
          description: task.description,
          frequency: task.frequency,
          priority: task.priority,
          status: 'pending',
          due_date: dueDate,
          category: task.category,
          tags: tags,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting task:', insertError);
      } else {
        insertedTasks.push(insertedTask);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Generated ${insertedTasks.length} tasks`,
        tasks: insertedTasks
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-tasks function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
