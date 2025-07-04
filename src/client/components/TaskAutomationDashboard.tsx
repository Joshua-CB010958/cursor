import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Automation, AutomationFilters, DashboardStats } from '../../types';
import MetricsCard from './MetricsCard';
import AutomationCard from './AutomationCard';
import CreateAutomationModal from './CreateAutomationModal';
import { useAutomations } from '../hooks/useAutomations';
import { useAnalytics } from '../hooks/useAnalytics';

const TaskAutomationDashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<AutomationFilters>({
    page: 1,
    limit: 12,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { automations, loading, error, toggleAutomation, deleteAutomation } = useAutomations(filters);
  const { analytics, loading: analyticsLoading } = useAnalytics();

  // Update filters when search term changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchTerm || undefined,
        page: 1, // Reset to first page when searching
      }));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleFilterChange = (key: keyof AutomationFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    try {
      await toggleAutomation(id, isActive);
    } catch (error) {
      console.error('Failed to toggle automation:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this automation?')) {
      try {
        await deleteAutomation(id);
      } catch (error) {
        console.error('Failed to delete automation:', error);
      }
    }
  };

  const metricsCards = [
    {
      title: 'Total Automations',
      value: analytics?.totalAutomations || 0,
      icon: <TrendingUp className="w-5 h-5" />,
      change: 12,
      changeType: 'increase' as const,
    },
    {
      title: 'Active Automations',
      value: analytics?.activeAutomations || 0,
      icon: <CheckCircle className="w-5 h-5" />,
      change: 8,
      changeType: 'increase' as const,
    },
    {
      title: 'Tasks Completed Today',
      value: analytics?.tasksCompletedToday || 0,
      icon: <Clock className="w-5 h-5" />,
      change: 15,
      changeType: 'increase' as const,
    },
    {
      title: 'Success Rate',
      value: `${analytics?.successRate || 0}%`,
      icon: <AlertCircle className="w-5 h-5" />,
      change: 2.5,
      changeType: 'increase' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Smart Task Automation Engine
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Automate your business workflows and boost productivity
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Automation
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsCards.map((metric, index) => (
            <MetricsCard key={index} {...metric} />
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search automations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="select-field"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>

              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="select-field"
              >
                <option value="">All Categories</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="support">Support</option>
                <option value="general">General</option>
              </select>

              <select
                value={filters.triggerType || ''}
                onChange={(e) => handleFilterChange('triggerType', e.target.value || undefined)}
                className="select-field"
              >
                <option value="">All Triggers</option>
                <option value="new_lead">New Lead</option>
                <option value="payment_received">Payment Received</option>
                <option value="email_opened">Email Opened</option>
                <option value="custom_schedule">Custom Schedule</option>
              </select>
            </div>
          </div>
        </div>

        {/* Automations Grid */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-danger-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading automations</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : automations?.data.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <TrendingUp className="h-full w-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No automations found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filters.status || filters.category || filters.triggerType
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by creating your first automation.'}
              </p>
              {!searchTerm && !filters.status && !filters.category && !filters.triggerType && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-primary"
                >
                  Create Your First Automation
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {automations?.data.map((automation) => (
                  <AutomationCard
                    key={automation.id}
                    automation={automation}
                    onToggle={handleToggle}
                    onEdit={(id) => console.log('Edit automation:', id)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Pagination */}
              {automations && automations.pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(automations.pagination.page - 1)}
                      disabled={automations.pagination.page === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: automations.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          page === automations.pagination.page
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(automations.pagination.page + 1)}
                      disabled={automations.pagination.page === automations.pagination.totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Automation Modal */}
      <CreateAutomationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          // Refresh the automations list
          window.location.reload();
        }}
      />
    </div>
  );
};

export default TaskAutomationDashboard; 