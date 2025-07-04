import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MetricsCardProps } from '../../types';

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
}) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-2 bg-primary-50 rounded-lg">
          {icon}
        </div>
      </div>
      
      {change !== undefined && (
        <div className="flex items-center mt-4">
          {changeType === 'increase' ? (
            <TrendingUp className="w-4 h-4 text-success-500 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-danger-500 mr-1" />
          )}
          <span
            className={`text-sm font-medium ${
              changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
            }`}
          >
            {change > 0 ? '+' : ''}{change}%
          </span>
          <span className="text-sm text-gray-500 ml-1">from last month</span>
        </div>
      )}
    </div>
  );
};

export default MetricsCard; 