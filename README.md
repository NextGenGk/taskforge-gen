
# TaskForge

TaskForge is an elegant business task management application that uses AI to generate personalized tasks based on business information.

## Features

- **Business Profile Management:** Create and manage detailed business profiles with industry, size, location, and other key information.
- **AI Task Generation:** Automatically generate relevant tasks based on business data.
- **Task Management:** Track task status, priority, and categorization.
- **Business Tips:** Get industry-specific tips and suggestions.
- **Clean, Intuitive UI:** Minimal, Apple-inspired design with smooth animations and transitions.

## Database Schema

The application uses the following data model:

### Business
- id: string
- userId: string
- name: string
- type: string
- location: string
- industry: string
- size: BusinessSize (enum)
- description: string
- foundedYear?: number
- website?: string
- logoUrl?: string
- createdAt: Date
- updatedAt: Date

### Task
- id: string
- businessId: string
- title: string
- description: string
- frequency: TaskFrequency (enum)
- priority: TaskPriority (enum)
- status: TaskStatus (enum)
- dueDate?: Date
- completedAt?: Date
- category: TaskCategory (enum)
- tags: string[]
- createdAt: Date
- updatedAt: Date

### Tip
- id: string
- businessId: string
- title: string
- content: string
- category: TaskCategory (enum)
- source?: string
- createdAt: Date
- updatedAt: Date

### LLM Integration
- LLMPrompt: Template for generating tasks
- LLMModel: Model configuration
- LLMResponse: Record of AI interactions

## Technology Stack

- React with TypeScript
- Tailwind CSS for styling
- React Query for data fetching
- Shadcn/UI component library

## Flow

1. User submits business data through the BusinessForm component
2. Data is stored in the database (simulated with mock data service)
3. LLM generates tasks based on business data (simulated in the API service)
4. Tasks are stored in the database
5. Frontend displays tasks in the dashboard interface

This architecture allows for a seamless user experience while providing valuable, AI-generated business tasks.
