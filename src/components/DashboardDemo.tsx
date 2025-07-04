import React, { useState } from 'react';
import UserDashboard from './UserDashboard';
import { User, DashboardMetrics, DailyActivity } from '../types/dashboard';

const DashboardDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [demoScenario, setDemoScenario] = useState<'default' | 'custom' | 'loading'>('default');

  const customUser: User = {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    streakCount: 15,
    avatar: '👩‍💻'
  };

  const customMetrics: DashboardMetrics = {
    activeProjects: 12,
    completedTasks: 47,
    pointsEarned: 2840
  };

  const customActivity: DailyActivity[] = [
    { date: '2024-01-15', activity: 8 },
    { date: '2024-01-16', activity: 12 },
    { date: '2024-01-17', activity: 6 },
    { date: '2024-01-18', activity: 15 },
    { date: '2024-01-19', activity: 9 },
    { date: '2024-01-20', activity: 11 },
    { date: '2024-01-21', activity: 7 }
  ];

  const handleScenarioChange = (scenario: 'default' | 'custom' | 'loading') => {
    setDemoScenario(scenario);
    if (scenario === 'loading') {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 3000);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Controls */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Dashboard Demo</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleScenarioChange('default')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  demoScenario === 'default'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Default Data
              </button>
              <button
                onClick={() => handleScenarioChange('custom')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  demoScenario === 'custom'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Custom Data
              </button>
              <button
                onClick={() => handleScenarioChange('loading')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  demoScenario === 'loading'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Loading State
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <UserDashboard
        user={demoScenario === 'custom' ? customUser : undefined}
        metrics={demoScenario === 'custom' ? customMetrics : undefined}
        dailyActivity={demoScenario === 'custom' ? customActivity : undefined}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardDemo; 