import { 
  Business, 
  BusinessSize, 
  Task, 
  TaskFrequency, 
  TaskPriority, 
  TaskStatus, 
  TaskCategory,
  Tip,
  User
} from "@/types/database";

// Mock Users
export const users: User[] = [
  {
    id: "usr_1",
    name: "Jane Smith",
    email: "jane@example.com",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15")
  }
];

// Mock Businesses
export const businesses: Business[] = [
  {
    id: "biz_1",
    userId: "usr_1",
    name: "Coastal Cafe",
    type: "Cafe",
    location: "San Francisco, CA",
    industry: "Food & Beverage",
    size: "small" as BusinessSize,
    description: "A cozy cafe offering artisanal coffee and homemade pastries with ocean views.",
    foundedYear: 2020,
    website: "https://coastalcafe.example.com",
    logoUrl: "/placeholder.svg",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-06-22")
  },
  {
    id: "biz_2",
    userId: "usr_1",
    name: "TechNova Solutions",
    type: "Consultancy",
    location: "Boston, MA",
    industry: "Technology",
    size: "medium" as BusinessSize,
    description: "IT consultancy specializing in cloud solutions and digital transformation.",
    foundedYear: 2018,
    website: "https://technovasolutions.example.com",
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2023-05-10")
  }
];

// Mock Tasks
export const tasks: Task[] = [
  {
    id: "task_1",
    businessId: "biz_1",
    title: "Update social media profiles with summer specials",
    description: "Create engaging posts about our new summer drink menu and pastry selection for Instagram, Facebook, and Twitter.",
    frequency: "weekly" as TaskFrequency,
    priority: "medium" as TaskPriority,
    status: "pending" as TaskStatus,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    category: "marketing" as TaskCategory,
    tags: ["social media", "promotion", "summer"],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: "task_2",
    businessId: "biz_1",
    title: "Review monthly expenses and update budget",
    description: "Go through all receipts and invoices for the past month, categorize expenses, and update the budget spreadsheet.",
    frequency: "monthly" as TaskFrequency,
    priority: "high" as TaskPriority,
    status: "in_progress" as TaskStatus,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    category: "finance" as TaskCategory,
    tags: ["budget", "accounting", "expense tracking"],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: "task_3",
    businessId: "biz_1",
    title: "Schedule staff training for new POS system",
    description: "Coordinate with the vendor to arrange a training session for all staff on how to use the new point-of-sale system.",
    frequency: "once" as TaskFrequency,
    priority: "critical" as TaskPriority,
    status: "pending" as TaskStatus,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    category: "operations" as TaskCategory,
    tags: ["training", "POS", "staff development"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: "task_4",
    businessId: "biz_1",
    title: "Renew business license",
    description: "Complete paperwork and submit payment for annual business license renewal with the city.",
    frequency: "yearly" as TaskFrequency,
    priority: "high" as TaskPriority,
    status: "completed" as TaskStatus,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Completed 2 days ago
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Due 1 day ago
    category: "legal" as TaskCategory,
    tags: ["compliance", "licensing"],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    id: "task_5",
    businessId: "biz_2",
    title: "Prepare quarterly client progress reports",
    description: "Create detailed reports for all active clients showcasing project progress, milestones achieved, and next steps.",
    frequency: "quarterly" as TaskFrequency,
    priority: "high" as TaskPriority,
    status: "in_progress" as TaskStatus,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    category: "operations" as TaskCategory,
    tags: ["client management", "reporting", "quarterly review"],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: "task_6",
    businessId: "biz_2",
    title: "Update company website with new team members",
    description: "Add profiles for new hires to the team page including photos, bios, and roles.",
    frequency: "once" as TaskFrequency,
    priority: "medium" as TaskPriority,
    status: "pending" as TaskStatus,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    category: "marketing" as TaskCategory,
    tags: ["website", "team updates"],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  }
];

// Mock Tips
export const tips: Tip[] = [
  {
    id: "tip_1",
    businessId: "biz_1",
    title: "Engaging Social Media Strategies for Cafes",
    content: "Post behind-the-scenes content of your baristas creating signature drinks. Customers love seeing the craft behind their coffee. Try to post during peak coffee hours (7-9am and 2-4pm) for maximum engagement.",
    category: "marketing" as TaskCategory,
    source: "Coffee Business Monthly",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
  },
  {
    id: "tip_2",
    businessId: "biz_1",
    title: "Efficient Inventory Management for Small Cafes",
    content: "Use the first-in, first-out (FIFO) method for all perishable items. Consider implementing a digital inventory system that can track expiration dates and automatically generate purchase orders when supplies run low.",
    category: "operations" as TaskCategory,
    source: "Restaurant Management Today",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
  },
  {
    id: "tip_3",
    businessId: "biz_2",
    title: "Maximizing Client Retention in Tech Consulting",
    content: "Schedule regular 'value check-ins' that aren't tied to project milestones. Use these meetings to understand evolving client needs and identify opportunities to provide additional value beyond the current scope of work.",
    category: "sales" as TaskCategory,
    source: "Tech Consulting Insider",
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000)
  }
];

// Service functions to simulate database operations
export const mockDataService = {
  // User operations
  getUser: (userId: string) => users.find(user => user.id === userId),
  
  // Business operations
  getBusinesses: (userId: string) => businesses.filter(business => business.userId === userId),
  getBusiness: (businessId: string) => businesses.find(business => business.id === businessId),
  
  // Task operations
  getTasks: (businessId: string) => tasks.filter(task => task.businessId === businessId),
  getTask: (taskId: string) => tasks.find(task => task.id === taskId),
  getTasksByStatus: (businessId: string, status: TaskStatus) => 
    tasks.filter(task => task.businessId === businessId && task.status === status),
  getTasksByCategory: (businessId: string, category: TaskCategory) => 
    tasks.filter(task => task.businessId === businessId && task.category === category),
  
  // Tip operations
  getTips: (businessId: string) => tips.filter(tip => tip.businessId === businessId),
  getTipsByCategory: (businessId: string, category: TaskCategory) => 
    tips.filter(tip => tip.businessId === businessId && tip.category === category),
  
  // Service function to generate tasks for a business
  generateTasksForBusiness: (businessId: string): Task[] => {
    const business = businesses.find(b => b.id === businessId);
    if (!business) return [];
    
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
    return newTasks;
  }
};
