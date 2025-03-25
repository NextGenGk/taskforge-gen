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
          resolve(users[0]);
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
    // Fallback to mock data for development since our Supabase 
    // tables don't match our expected structure yet
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = mockDataService.getBusiness(businessId);
        resolve(result);
      }, 300);
    });
  },

  createBusiness: async (data: Omit<Business, "id" | "createdAt" | "updatedAt">): Promise<Business> => {
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
      // Instead of calling the Supabase Edge function which doesn't exist yet,
      // we'll use mock data for now
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
    } catch (error) {
      console.error('Failed to generate tasks:', error);
      return [];
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
