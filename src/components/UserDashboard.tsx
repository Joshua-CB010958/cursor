import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import ActivityChart from './ActivityChart';
import QuickActions from './QuickActions';
import { User, DashboardMetrics, DailyActivity, QuickAction, UserDashboardProps } from '../types/dashboard';

const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  metrics,
  dailyActivity,
  isLoading = false
}) => {
  const [localUser, setLocalUser] = useState<User | undefined>(user);
  const [localMetrics, setLocalMetrics] = useState<DashboardMetrics | undefined>(metrics);
  const [localDailyActivity, setLocalDailyActivity] = useState<DailyActivity[] | undefined>(dailyActivity);
  const [localIsLoading] = useState<boolean>(isLoading);

  // Mock data for demonstration
  useEffect(() => {
    if (!localUser) {
      setLocalUser({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        streakCount: 7,
        avatar: '👤'
      });
    }

    if (!localMetrics) {
      setLocalMetrics({
        activeProjects: 5,
        completedTasks: 23,
        pointsEarned: 1250
      });
    }

    if (!localDailyActivity) {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toISOString().split('T')[0],
          activity: Math.floor(Math.random() * 10) + 1
        };
      });
      setLocalDailyActivity(last7Days);
    }
  }, [localUser, localMetrics, localDailyActivity]);

  const quickActions: QuickAction[] = [
    {
      id: 'new-project',
      label: 'Start New Project',
      icon: '🚀',
      variant: 'primary',
      onClick: () => {
        console.log('Start New Project clicked');
        alert('Start New Project functionality would be implemented here');
      }
    },
    {
      id: 'analytics',
      label: 'View Analytics',
      icon: '📊',
      variant: 'secondary',
      onClick: () => {
        console.log('View Analytics clicked');
        alert('View Analytics functionality would be implemented here');
      }
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      variant: 'outline',
      onClick: () => {
        console.log('Settings clicked');
        alert('Settings functionality would be implemented here');
      }
    }
  ];

  if (localIsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading header */}
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          
          {/* Loading metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {localUser?.name}! 👋
              </h1>
              <p className="text-gray-600">
                You're on a {localUser?.streakCount} day streak! Keep up the great work!
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
              <span className="text-2xl">🔥</span>
              <span className="font-semibold text-gray-900">{localUser?.streakCount}</span>
              <span className="text-gray-600">days</span>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Active Projects"
            value={localMetrics?.activeProjects || 0}
            icon="📁"
            color="blue"
          />
          <MetricCard
            title="Completed Tasks"
            value={localMetrics?.completedTasks || 0}
            icon="✅"
            color="green"
          />
          <MetricCard
            title="Points Earned"
            value={localMetrics?.pointsEarned?.toLocaleString() || '0'}
            icon="⭐"
            color="orange"
          />
        </div>

        {/* Chart and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ActivityChart data={localDailyActivity || []} />
          </div>
          <div>
            <QuickActions actions={quickActions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 