
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  id: string;
  userId: string;
  name: string;
  type: string;
  location: string;
  industry: string;
  size: BusinessSize;
  description: string;
  foundedYear?: number;
  website?: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BusinessSize = 'sole_proprietor' | 'micro' | 'small' | 'medium' | 'large' | 'enterprise';

export interface Task {
  id: string;
  businessId: string;
  title: string;
  description: string;
  frequency: TaskFrequency;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  completedAt?: Date;
  category: TaskCategory;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type TaskFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskCategory = 
  | 'marketing' 
  | 'finance' 
  | 'operations' 
  | 'legal' 
  | 'sales' 
  | 'customer_service' 
  | 'human_resources' 
  | 'technology' 
  | 'administration'
  | 'strategy'
  | 'other';

export interface Tip {
  id: string;
  businessId: string;
  title: string;
  content: string;
  category: TaskCategory;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LLMPrompt {
  id: string;
  name: string;
  description: string;
  template: string;
  modelId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  version: string;
  apiEndpoint: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LLMResponse {
  id: string;
  promptId: string;
  businessId: string;
  input: string;
  output: string;
  createdAt: Date;
  processingTime: number;
  tokenCount: number;
}
