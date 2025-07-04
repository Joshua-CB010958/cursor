import { useState, useEffect } from 'react';
import { Automation, AutomationFilters, PaginatedResponse } from '../../types';

export const useAutomations = (filters: AutomationFilters) => {
  const [automations, setAutomations] = useState<PaginatedResponse<Automation> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });

      const response = await fetch(`/api/automations?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch automations');
      }

      const data = await response.json();
      setAutomations(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/automations/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle automation');
      }

      // Refresh the automations list
      await fetchAutomations();
    } catch (err) {
      throw err;
    }
  };

  const deleteAutomation = async (id: string) => {
    try {
      const response = await fetch(`/api/automations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete automation');
      }

      // Refresh the automations list
      await fetchAutomations();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, [filters]);

  return {
    automations,
    loading,
    error,
    toggleAutomation,
    deleteAutomation,
    refetch: fetchAutomations,
  };
}; 