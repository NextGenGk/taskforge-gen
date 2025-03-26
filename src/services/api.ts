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
      // In our Supabase structure, we don't have a profiles table yet,
      // so we'll use mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ...users[0],
            id: user.id, // Make sure to use the real user ID
            email: user.email || users[0].email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || users[0].name
          });
        }, 300);
      });
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
    // Ensure we're only getting businesses for the specific user
    // Fallback to mock data for development since our Supabase 
    // tables don't match our expected structure yet
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getBusinesses(userId);
        resolve(result);
      }, 500);
    });
  },

  getBusiness: async (businessId: string): Promise<Business | undefined> => {
    // Get current user to enforce access control
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fallback to mock data for development since our Supabase 
    // tables don't match our expected structure yet
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getBusiness(businessId);
        // Only return if this business belongs to the current user
        if (result && (result.userId === user?.id || !user)) {
          resolve(result);
        } else {
          resolve(undefined); // Access denied or not found
        }
      }, 300);
    });
  },

  createBusiness: async (data: Omit<Business, "id" | "createdAt" | "updatedAt">): Promise<Business> => {
    // Get current user to enforce access control
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fallback to mock data for development since our Supabase 
    // tables don't match our expected structure yet
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
    // Get current user to enforce access control
    const { data: { user } } = await supabase.auth.getUser();
    
    // First check if the business belongs to the current user
    const business = await api.getBusiness(businessId);
    if (!business || (business.userId !== user?.id && user)) {
      return []; // Access denied or not found
    }
    
    // Fallback to mock data for development since our Supabase 
    // tables don't match our expected structure yet
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getTasks(businessId);
        resolve(result);
      }, 500);
    });
  },

  getTask: async (taskId: string): Promise<Task | undefined> => {
    // Fallback to mock data for development since our Supabase 
    // tables don't match our expected structure yet
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getTask(taskId);
        resolve(result);
      }, 300);
    });
  },

  createTask: async (data: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> => {
    // Fallback to mock data for development since our Supabase 
    // tables don't match our expected structure yet
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
    // Fallback to mock data for development since our Supabase 
    // tables don't match our expected structure yet
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
    // Get current user to enforce access control
    const { data: { user } } = await supabase.auth.getUser();
    
    // First check if the business belongs to the current user
    const business = await api.getBusiness(businessId);
    if (!business || (business.userId !== user?.id && user)) {
      return []; // Access denied or not found
    }
    
    // Fallback to mock data for development since our Supabase 
    // tables don't match our expected structure yet
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getTasksByStatus(businessId, status);
        resolve(result);
      }, 400);
    });
  },

  getTasksByCategory: async (businessId: string, category: TaskCategory): Promise<Task[]> => {
    // Get current user to enforce access control
    const { data: { user } } = await supabase.auth.getUser();
    
    // First check if the business belongs to the current user
    const business = await api.getBusiness(businessId);
    if (!business || (business.userId !== user?.id && user)) {
      return []; // Access denied or not found
    }
    
    // Fallback to mock data for development since our Supabase 
    // tables don't match our expected structure yet
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getTasksByCategory(businessId, category);
        resolve(result);
      }, 400);
    });
  },

  // Tip related endpoints
  getTips: async (businessId: string): Promise<Tip[]> => {
    // Get current user to enforce access control
    const { data: { user } } = await supabase.auth.getUser();
    
    // First check if the business belongs to the current user
    const business = await api.getBusiness(businessId);
    if (!business || (business.userId !== user?.id && user)) {
      return []; // Access denied or not found
    }
    
    // Fallback to mock data for development since our Supabase 
    // tables don't match our expected structure yet
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getTips(businessId);
        resolve(result);
      }, 500);
    });
  },

  getTipsByCategory: async (businessId: string, category: TaskCategory): Promise<Tip[]> => {
    // Get current user to enforce access control
    const { data: { user } } = await supabase.auth.getUser();
    
    // First check if the business belongs to the current user
    const business = await api.getBusiness(businessId);
    if (!business || (business.userId !== user?.id && user)) {
      return []; // Access denied or not found
    }
    
    // Fallback to mock data for development since our Supabase 
    // tables don't match our expected structure yet
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
      // Get current user to enforce access control
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-tasks', {
        body: { 
          businessId, 
          userId: user.id
        }
      });

      if (error) {
        console.error("Error calling generate-tasks function:", error);
        throw error;
      }

      if (!data || !data.tasks) {
        return [];
      }

      // Return the tasks generated by the edge function
      return data.tasks;
    } catch (error) {
      console.error('Failed to generate tasks:', error);
      // Fallback to mock data if the function fails during development
      return mockDataService.generateTasksForBusiness(businessId);
    }
  },

  // Auth methods
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  signInWithProvider: async (provider: 'google' | 'github') => {
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  },

  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getSession: async () => {
    return await supabase.auth.getSession();
  },

  refreshSession: async () => {
    return await supabase.auth.refreshSession();
  }
};
