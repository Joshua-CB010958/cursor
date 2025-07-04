// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  token: string;
  expiresAt: Date;
}

// Automation Types
export type TriggerType = 'new_lead' | 'payment_received' | 'email_opened' | 'custom_schedule';
export type ActionType = 'send_email' | 'create_task' | 'update_crm' | 'generate_report';
export type AutomationStatus = 'active' | 'inactive' | 'draft';
export type AutomationCategory = 'sales' | 'marketing' | 'support' | 'general';

export interface TriggerConfig {
  new_lead?: {
    source?: string[];
    minValue?: number;
  };
  payment_received?: {
    minAmount?: number;
    currency?: string;
    productIds?: string[];
  };
  email_opened?: {
    campaignId?: string;
    subjectKeywords?: string[];
  };
  custom_schedule?: {
    cronExpression: string;
    timezone?: string;
  };
}

export interface ActionConfig {
  send_email?: {
    templateId: string;
    recipients: string[];
    subject: string;
    variables?: Record<string, any>;
  };
  create_task?: {
    title: string;
    description?: string;
    assigneeId?: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
  };
  update_crm?: {
    recordType: 'contact' | 'deal' | 'company';
    recordId: string;
    fields: Record<string, any>;
  };
  generate_report?: {
    reportType: string;
    parameters: Record<string, any>;
    recipients: string[];
  };
}

export interface Automation {
  id: string;
  userId: string;
  name: string;
  description?: string;
  category: AutomationCategory;
  triggerType: TriggerType;
  triggerConfig: TriggerConfig;
  actionType: ActionType;
  actionConfig: ActionConfig;
  status: AutomationStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  nextRun?: Date;
  executionCount: number;
  successCount: number;
  failureCount: number;
}

// Automation Log Types
export type LogStatus = 'success' | 'failure' | 'pending' | 'cancelled';

export interface AutomationLog {
  id: string;
  automationId: string;
  userId: string;
  status: LogStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  errorMessage?: string;
  triggerData?: Record<string, any>;
  actionResult?: Record<string, any>;
  metadata?: Record<string, any>;
}

// Analytics Types
export interface AutomationMetrics {
  totalAutomations: number;
  activeAutomations: number;
  tasksCompletedToday: number;
  successRate: number;
  averageExecutionTime: number;
  timeSaved: number; // in minutes
  categoryBreakdown: Record<AutomationCategory, number>;
  recentExecutions: AutomationLog[];
}

export interface DashboardStats {
  totalAutomations: number;
  activeAutomations: number;
  tasksCompletedToday: number;
  successRate: number;
  timeSaved: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface CreateAutomationForm {
  name: string;
  description?: string;
  category: AutomationCategory;
  triggerType: TriggerType;
  triggerConfig: TriggerConfig;
  actionType: ActionType;
  actionConfig: ActionConfig;
}

export interface UpdateAutomationForm extends Partial<CreateAutomationForm> {
  isActive?: boolean;
}

// Filter Types
export interface AutomationFilters {
  status?: AutomationStatus;
  category?: AutomationCategory;
  triggerType?: TriggerType;
  actionType?: ActionType;
  search?: string;
  page?: number;
  limit?: number;
}

// Webhook Types
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: {
      id: string;
      amount: number;
      currency: string;
      status: string;
      customer?: string;
      metadata?: Record<string, any>;
    };
  };
  created: number;
}

export interface EmailWebhookEvent {
  event: string;
  email: string;
  timestamp: number;
  messageId: string;
  campaignId?: string;
}

// Component Props Types
export interface AutomationCardProps {
  automation: Automation;
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: any;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: any;
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
} 