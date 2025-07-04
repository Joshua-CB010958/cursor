export interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  assigneeId?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export class TaskService {
  // In a real implementation, this would connect to a task management system
  // For now, we'll simulate task creation
  
  async createTask(request: CreateTaskRequest): Promise<Task> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const task: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: request.title,
      description: request.description,
      assigneeId: request.assigneeId,
      priority: request.priority,
      status: 'pending',
      dueDate: request.dueDate,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // In real implementation, save to database or external system
    console.log('Task created:', task);
    
    return task;
  }
  
  async getTask(taskId: string): Promise<Task | null> {
    // Simulate task retrieval
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // In real implementation, fetch from database or external system
    return null;
  }
  
  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    // Simulate task update
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In real implementation, update in database or external system
    return null;
  }
} 