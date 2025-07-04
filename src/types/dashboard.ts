export interface User {
  id: string;
  name: string;
  email: string;
  streakCount: number;
  avatar?: string;
}

export interface DashboardMetrics {
  activeProjects: number;
  completedTasks: number;
  pointsEarned: number;
}

export interface DailyActivity {
  date: string;
  activity: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface UserDashboardProps {
  user?: User;
  metrics?: DashboardMetrics;
  dailyActivity?: DailyActivity[];
  isLoading?: boolean;
} 