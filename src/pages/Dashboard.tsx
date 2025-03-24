
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpRight, BarChart3, Calendar, CheckCircle, ClipboardList, Clock, Lightbulb, PlusCircle } from "lucide-react";
import { api } from "@/services/api";
import { Business, Task, TaskStatus, Tip, User } from "@/types/database";
import TaskCard from "@/components/TaskCard";
import TipCard from "@/components/TipCard";
import BusinessForm from "@/components/BusinessForm";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);

  // Set up realtime subscription
  useEffect(() => {
    if (!selectedBusiness) return;

    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tasks',
          filter: `business_id=eq.${selectedBusiness.id}`
        },
        () => {
          // Refetch tasks when there's a change
          queryClient.invalidateQueries({ queryKey: ["tasks", selectedBusiness.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedBusiness, queryClient]);

  // Fetch current user
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => api.getCurrentUser(),
  });

  // Fetch businesses for the current user
  const { 
    data: businesses,
    isLoading: isLoadingBusinesses, 
    refetch: refetchBusinesses 
  } = useQuery({
    queryKey: ["businesses", currentUser?.id],
    queryFn: () => currentUser ? api.getBusinesses(currentUser.id) : Promise.resolve([]),
    enabled: !!currentUser,
  });

  // Set selected business when businesses are loaded
  useEffect(() => {
    if (businesses?.length && !selectedBusiness) {
      setSelectedBusiness(businesses[0]);
    }
  }, [businesses, selectedBusiness]);

  // Fetch tasks for the selected business
  const { 
    data: tasks,
    isLoading: isLoadingTasks,
    refetch: refetchTasks
  } = useQuery({
    queryKey: ["tasks", selectedBusiness?.id],
    queryFn: () => selectedBusiness ? api.getTasks(selectedBusiness.id) : Promise.resolve([]),
    enabled: !!selectedBusiness,
  });

  // Fetch tips for the selected business
  const { 
    data: tips,
    isLoading: isLoadingTips
  } = useQuery({
    queryKey: ["tips", selectedBusiness?.id],
    queryFn: () => selectedBusiness ? api.getTips(selectedBusiness.id) : Promise.resolve([]),
    enabled: !!selectedBusiness,
  });

  // Generate tasks with LLM
  const generateTasks = async () => {
    if (!selectedBusiness) return;
    
    setIsGeneratingTasks(true);
    toast({
      title: "Generating tasks...",
      description: "Our AI is analyzing your business data to create personalized tasks.",
    });
    
    try {
      const newTasks = await api.generateTasksFromBusinessData(selectedBusiness.id);
      
      toast({
        title: `${newTasks.length} new tasks created!`,
        description: "The AI has generated new tasks based on your business information.",
      });
      
      refetchTasks();
    } catch (error) {
      toast({
        title: "Task generation failed",
        description: "There was an error generating tasks. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating tasks:", error);
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const handleBusinessCreated = (business: Business) => {
    refetchBusinesses();
    setSelectedBusiness(business);
    setShowBusinessForm(false);
  };

  // Handle task status change
  const handleTaskStatusChange = (updatedTask: Task) => {
    queryClient.invalidateQueries({ queryKey: ["tasks", selectedBusiness?.id] });
  };

  // Render loading state
  if (isLoadingUser) {
    return (
      <div className="container max-w-6xl px-4 py-8 animate-fade-in">
        <div className="flex flex-col gap-8">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    );
  }

  // Render business form if no businesses or form is shown
  if (showBusinessForm || (businesses && businesses.length === 0)) {
    return (
      <div className="container max-w-3xl px-4 py-12 animate-fade-in">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-3">Let's get started!</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Tell us about your business to help our AI generate personalized tasks and tips for your success.
          </p>
        </div>
        
        <Card className="border shadow-md animate-zoom-in">
          <CardHeader className="pb-3">
            <CardTitle>Business Information</CardTitle>
            <CardDescription>
              This information will be used to generate customized tasks for your business.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentUser && (
              <BusinessForm 
                onSubmitSuccess={handleBusinessCreated} 
                userId={currentUser.id}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate task stats
  const pendingTasks = tasks?.filter(task => task.status === "pending") || [];
  const inProgressTasks = tasks?.filter(task => task.status === "in_progress") || [];
  const completedTasks = tasks?.filter(task => task.status === "completed") || [];

  return (
    <div className="container max-w-6xl px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl font-bold">{currentUser?.name}</h1>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setShowBusinessForm(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Business</span>
          </Button>
          <Button 
            onClick={generateTasks} 
            className="flex items-center gap-2"
            disabled={isGeneratingTasks}
          >
            <PlusCircle className="h-4 w-4" />
            <span>{isGeneratingTasks ? "Generating..." : "Generate Tasks"}</span>
          </Button>
        </div>
      </div>
      
      {businesses && businesses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Business</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <h3 className="text-2xl font-bold">{selectedBusiness?.name}</h3>
                <p className="text-muted-foreground text-sm">{selectedBusiness?.type} · {selectedBusiness?.location}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950 dark:to-green-950 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold">{tasks?.length || 0}</h3>
                  <p className="text-muted-foreground text-sm">Total Tasks</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="text-amber-500 font-semibold">{pendingTasks.length}</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-blue-500 font-semibold">{inProgressTasks.length}</div>
                    <div className="text-xs text-muted-foreground">In Progress</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-green-500 font-semibold">{completedTasks.length}</div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tips & Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="text-2xl font-bold">{tips?.length || 0}</h3>
                  <p className="text-muted-foreground text-sm">Business Tips</p>
                </div>
                <Lightbulb className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="tasks" className="animate-fade-in">
        <TabsList className="mb-6">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            <span>Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span>Tips & Suggestions</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Insights</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Button 
              variant="outline" 
              className="flex items-center justify-between h-auto py-3 px-4"
              onClick={() => {
                // Filter to show only pending tasks
                queryClient.setQueryData(["tasks", selectedBusiness?.id], 
                  tasks?.filter(t => t.status === "pending") || []);
                
                // After 3 seconds, refetch to show all tasks again
                setTimeout(() => {
                  refetchTasks();
                }, 3000);
              }}
            >
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>Pending Tasks</span>
              </div>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center justify-between h-auto py-3 px-4"
              onClick={() => {
                // Filter to show only in progress tasks
                queryClient.setQueryData(["tasks", selectedBusiness?.id], 
                  tasks?.filter(t => t.status === "in_progress") || []);
                
                // After 3 seconds, refetch to show all tasks again
                setTimeout(() => {
                  refetchTasks();
                }, 3000);
              }}
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-purple-500" />
                <span>In Progress</span>
              </div>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center justify-between h-auto py-3 px-4"
              onClick={() => {
                // Filter to show only completed tasks
                queryClient.setQueryData(["tasks", selectedBusiness?.id], 
                  tasks?.filter(t => t.status === "completed") || []);
                
                // After 3 seconds, refetch to show all tasks again
                setTimeout(() => {
                  refetchTasks();
                }, 3000);
              }}
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Completed Tasks</span>
              </div>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
          
          <h2 className="text-xl font-bold mb-4">All Tasks</h2>
          
          {isLoadingTasks ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border">
                  <Skeleton className="h-[200px] w-full" />
                </Card>
              ))}
            </div>
          ) : tasks && tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onStatusChange={handleTaskStatusChange} 
                />
              ))}
            </div>
          ) : (
            <Card className="border p-8 text-center">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Generate your first tasks based on your business information.
                  </p>
                  <Button 
                    onClick={generateTasks} 
                    className="flex items-center gap-2"
                    disabled={isGeneratingTasks}
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>{isGeneratingTasks ? "Generating..." : "Generate Tasks"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="tips" className="animate-fade-in">
          <h2 className="text-xl font-bold mb-4">Business Tips & Suggestions</h2>
          
          {isLoadingTips ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border">
                  <Skeleton className="h-[200px] w-full" />
                </Card>
              ))}
            </div>
          ) : tips && tips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tips.map((tip) => (
                <TipCard key={tip.id} tip={tip} />
              ))}
            </div>
          ) : (
            <Card className="border p-8 text-center">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No tips yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Tips will be generated as you add more information about your business.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="insights" className="animate-fade-in">
          <Card className="border p-8 text-center">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Business Insights Coming Soon</h3>
                <p className="text-muted-foreground">
                  We're working on analytics and insights for your business performance.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
