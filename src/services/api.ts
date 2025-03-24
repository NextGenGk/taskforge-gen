
import { 
  mockDataService, 
  businesses, 
  tasks,
  tips,
  users
} from "./mockData";

import { 
  Business, 
  Task, 
  TaskStatus, 
  TaskCategory,
  Tip,
  User
} from "@/types/database";

import { supabase } from "@/integrations/supabase/client";

// Supabase API integration
export const api = {
  // Auth related endpoints
  getCurrentUser: async (): Promise<User> => {
    // Try to get the user from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Get the user profile from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at)
        };
      }
    }
    
    // Fallback to mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(users[0]);
      }, 300);
    });
  },

  // Business related endpoints
  getBusinesses: async (userId: string): Promise<Business[]> => {
    // Try to get businesses from Supabase
    const { data: businessesData, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('user_id', userId);
    
    if (businessesData && !error) {
      return businessesData.map(b => ({
        id: b.id,
        userId: b.user_id,
        name: b.name,
        type: b.type,
        location: b.location,
        industry: b.industry,
        size: b.size,
        description: b.description,
        foundedYear: b.founded_year,
        website: b.website,
        logoUrl: b.logo_url,
        createdAt: new Date(b.created_at),
        updatedAt: new Date(b.updated_at)
      }));
    }
    
    // Fallback to mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getBusinesses(userId);
        resolve(result);
      }, 500);
    });
  },

  getBusiness: async (businessId: string): Promise<Business | undefined> => {
    // Try to get business from Supabase
    const { data: business, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();
    
    if (business && !error) {
      return {
        id: business.id,
        userId: business.user_id,
        name: business.name,
        type: business.type,
        location: business.location,
        industry: business.industry,
        size: business.size,
        description: business.description,
        foundedYear: business.founded_year,
        website: business.website,
        logoUrl: business.logo_url,
        createdAt: new Date(business.created_at),
        updatedAt: new Date(business.updated_at)
      };
    }
    
    // Fallback to mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getBusiness(businessId);
        resolve(result);
      }, 300);
    });
  },

  createBusiness: async (data: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>): Promise<Business> => {
    // Create business in Supabase
    const { data: newBusiness, error } = await supabase
      .from('businesses')
      .insert({
        user_id: data.userId,
        name: data.name,
        type: data.type,
        location: data.location,
        industry: data.industry,
        size: data.size,
        description: data.description,
        founded_year: data.foundedYear,
        website: data.website,
        logo_url: data.logoUrl
      })
      .select()
      .single();
    
    if (newBusiness && !error) {
      return {
        id: newBusiness.id,
        userId: newBusiness.user_id,
        name: newBusiness.name,
        type: newBusiness.type,
        location: newBusiness.location,
        industry: newBusiness.industry,
        size: newBusiness.size,
        description: newBusiness.description,
        foundedYear: newBusiness.founded_year,
        website: newBusiness.website,
        logoUrl: newBusiness.logo_url,
        createdAt: new Date(newBusiness.created_at),
        updatedAt: new Date(newBusiness.updated_at)
      };
    }
    
    if (error) {
      console.error('Error creating business:', error);
    }
    
    // Fallback to mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBusiness: Business = {
          ...data,
          id: `biz_${businesses.length + 1}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        businesses.push(newBusiness);
        resolve(newBusiness);
      }, 700);
    });
  },

  // Task related endpoints
  getTasks: async (businessId: string): Promise<Task[]> => {
    // Try to get tasks from Supabase
    const { data: tasksData, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('business_id', businessId);
    
    if (tasksData && !error) {
      return tasksData.map(t => ({
        id: t.id,
        businessId: t.business_id,
        title: t.title,
        description: t.description,
        frequency: t.frequency,
        priority: t.priority,
        status: t.status,
        dueDate: t.due_date ? new Date(t.due_date) : undefined,
        completedAt: t.completed_at ? new Date(t.completed_at) : undefined,
        category: t.category,
        tags: t.tags || [],
        createdAt: new Date(t.created_at),
        updatedAt: new Date(t.updated_at)
      }));
    }
    
    // Fallback to mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getTasks(businessId);
        resolve(result);
      }, 500);
    });
  },

  getTask: async (taskId: string): Promise<Task | undefined> => {
    // Try to get task from Supabase
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single();
    
    if (task && !error) {
      return {
        id: task.id,
        businessId: task.business_id,
        title: task.title,
        description: task.description,
        frequency: task.frequency,
        priority: task.priority,
        status: task.status,
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
        category: task.category,
        tags: task.tags || [],
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at)
      };
    }
    
    // Fallback to mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getTask(taskId);
        resolve(result);
      }, 300);
    });
  },

  createTask: async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    // Create task in Supabase
    const { data: newTask, error } = await supabase
      .from('tasks')
      .insert({
        business_id: data.businessId,
        title: data.title,
        description: data.description,
        frequency: data.frequency,
        priority: data.priority,
        status: data.status,
        due_date: data.dueDate,
        completed_at: data.completedAt,
        category: data.category,
        tags: data.tags
      })
      .select()
      .single();
    
    if (newTask && !error) {
      return {
        id: newTask.id,
        businessId: newTask.business_id,
        title: newTask.title,
        description: newTask.description,
        frequency: newTask.frequency,
        priority: newTask.priority,
        status: newTask.status,
        dueDate: newTask.due_date ? new Date(newTask.due_date) : undefined,
        completedAt: newTask.completed_at ? new Date(newTask.completed_at) : undefined,
        category: newTask.category,
        tags: newTask.tags || [],
        createdAt: new Date(newTask.created_at),
        updatedAt: new Date(newTask.updated_at)
      };
    }
    
    // Fallback to mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask: Task = {
          ...data,
          id: `task_${tasks.length + 1}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        tasks.push(newTask);
        resolve(newTask);
      }, 600);
    });
  },

  updateTaskStatus: async (taskId: string, status: TaskStatus): Promise<Task | undefined> => {
    // Update task status in Supabase
    const updates: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };
    
    // If task is completed, set completed_at
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }
    
    const { data: updatedTask, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select()
      .single();
    
    if (updatedTask && !error) {
      return {
        id: updatedTask.id,
        businessId: updatedTask.business_id,
        title: updatedTask.title,
        description: updatedTask.description,
        frequency: updatedTask.frequency,
        priority: updatedTask.priority,
        status: updatedTask.status,
        dueDate: updatedTask.due_date ? new Date(updatedTask.due_date) : undefined,
        completedAt: updatedTask.completed_at ? new Date(updatedTask.completed_at) : undefined,
        category: updatedTask.category,
        tags: updatedTask.tags || [],
        createdAt: new Date(updatedTask.created_at),
        updatedAt: new Date(updatedTask.updated_at)
      };
    }
    
    // Fallback to mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          const updatedTask = {
            ...tasks[taskIndex],
            status,
            updatedAt: new Date(),
            completedAt: status === 'completed' ? new Date() : tasks[taskIndex].completedAt
          };
          tasks[taskIndex] = updatedTask;
          resolve(updatedTask);
        } else {
          resolve(undefined);
        }
      }, 400);
    });
  },

  getTasksByStatus: async (businessId: string, status: TaskStatus): Promise<Task[]> => {
    // Try to get tasks from Supabase
    const { data: tasksData, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('business_id', businessId)
      .eq('status', status);
    
    if (tasksData && !error) {
      return tasksData.map(t => ({
        id: t.id,
        businessId: t.business_id,
        title: t.title,
        description: t.description,
        frequency: t.frequency,
        priority: t.priority,
        status: t.status,
        dueDate: t.due_date ? new Date(t.due_date) : undefined,
        completedAt: t.completed_at ? new Date(t.completed_at) : undefined,
        category: t.category,
        tags: t.tags || [],
        createdAt: new Date(t.created_at),
        updatedAt: new Date(t.updated_at)
      }));
    }
    
    // Fallback to mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getTasksByStatus(businessId, status);
        resolve(result);
      }, 400);
    });
  },

  getTasksByCategory: async (businessId: string, category: TaskCategory): Promise<Task[]> => {
    // Try to get tasks from Supabase
    const { data: tasksData, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('business_id', businessId)
      .eq('category', category);
    
    if (tasksData && !error) {
      return tasksData.map(t => ({
        id: t.id,
        businessId: t.business_id,
        title: t.title,
        description: t.description,
        frequency: t.frequency,
        priority: t.priority,
        status: t.status,
        dueDate: t.due_date ? new Date(t.due_date) : undefined,
        completedAt: t.completed_at ? new Date(t.completed_at) : undefined,
        category: t.category,
        tags: t.tags || [],
        createdAt: new Date(t.created_at),
        updatedAt: new Date(t.updated_at)
      }));
    }
    
    // Fallback to mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getTasksByCategory(businessId, category);
        resolve(result);
      }, 400);
    });
  },

  // Tip related endpoints
  getTips: async (businessId: string): Promise<Tip[]> => {
    // Try to get tips from Supabase
    const { data: tipsData, error } = await supabase
      .from('tips')
      .select('*')
      .eq('business_id', businessId);
    
    if (tipsData && !error) {
      return tipsData.map(t => ({
        id: t.id,
        businessId: t.business_id,
        title: t.title,
        content: t.content,
        category: t.category,
        source: t.source,
        createdAt: new Date(t.created_at),
        updatedAt: new Date(t.updated_at)
      }));
    }
    
    // Fallback to mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getTips(businessId);
        resolve(result);
      }, 500);
    });
  },

  getTipsByCategory: async (businessId: string, category: TaskCategory): Promise<Tip[]> => {
    // Try to get tips from Supabase
    const { data: tipsData, error } = await supabase
      .from('tips')
      .select('*')
      .eq('business_id', businessId)
      .eq('category', category);
    
    if (tipsData && !error) {
      return tipsData.map(t => ({
        id: t.id,
        businessId: t.business_id,
        title: t.title,
        content: t.content,
        category: t.category,
        source: t.source,
        createdAt: new Date(t.created_at),
        updatedAt: new Date(t.updated_at)
      }));
    }
    
    // Fallback to mock data for development
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getTipsByCategory(businessId, category);
        resolve(result);
      }, 400);
    });
  },

  // LLM Integration for task generation
  generateTasksFromBusinessData: async (businessId: string): Promise<Task[]> => {
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-tasks', {
        body: { businessId },
      });
      
      if (error) {
        console.error('Error calling generate-tasks function:', error);
        throw error;
      }
      
      if (data.error) {
        console.error('Error in generate-tasks function:', data.error);
        throw new Error(data.error);
      }
      
      console.log('Tasks generated successfully:', data.message);
      
      // Return the generated tasks
      return data.tasks.map((t: any) => ({
        id: t.id,
        businessId: t.business_id,
        title: t.title,
        description: t.description,
        frequency: t.frequency,
        priority: t.priority,
        status: t.status,
        dueDate: t.due_date ? new Date(t.due_date) : undefined,
        completedAt: t.completed_at ? new Date(t.completed_at) : undefined,
        category: t.category,
        tags: t.tags || [],
        createdAt: new Date(t.created_at),
        updatedAt: new Date(t.updated_at)
      }));
    } catch (error) {
      console.error('Failed to generate tasks:', error);
      
      // Fallback to mock data for development
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate an LLM generating tasks based on business data
          const business = mockDataService.getBusiness(businessId);
          if (!business) resolve([]);
          
          // Create new tasks based on business type
          const newTasks: Task[] = [];
          
          if (business?.type === 'Cafe') {
            newTasks.push({
              id: `task_${tasks.length + 1}`,
              businessId,
              title: "Create seasonal menu specials",
              description: "Develop and test new seasonal menu items using locally sourced ingredients. Focus on both beverages and food items.",
              frequency: "quarterly",
              priority: "medium",
              status: "pending",
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
              category: "operations",
              tags: ["menu development", "seasonal", "local sourcing"],
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
          
          if (business?.type === 'Consultancy') {
            newTasks.push({
              id: `task_${tasks.length + 2}`,
              businessId,
              title: "Develop client onboarding process documentation",
              description: "Create comprehensive documentation for the client onboarding process to ensure consistency and quality in service delivery.",
              frequency: "once",
              priority: "high",
              status: "pending",
              dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
              category: "operations",
              tags: ["process improvement", "documentation", "client management"],
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
          
          // Add these tasks to our mock database
          tasks.push(...newTasks);
          resolve(newTasks);
        }, 1500);
      });
    }
  }
};
