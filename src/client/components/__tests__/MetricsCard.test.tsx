import React from 'react';
import { render, screen } from '@testing-library/react';
import { TrendingUp } from 'lucide-react';
import MetricsCard from '../MetricsCard';

describe('MetricsCard', () => {
  const defaultProps = {
    title: 'Test Metric',
    value: '100',
    icon: <TrendingUp className="w-5 h-5" />,
    change: 12,
    changeType: 'increase' as const,
  };

  it('renders the metric title and value', () => {
    render(<MetricsCard {...defaultProps} />);
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders the change indicator when change is provided', () => {
    render(<MetricsCard {...defaultProps} />);
    
    expect(screen.getByText('+12%')).toBeInTheDocument();
    expect(screen.getByText('from last month')).toBeInTheDocument();
  });

  it('renders decrease indicator correctly', () => {
    render(
      <MetricsCard
        {...defaultProps}
        change={-5}
        changeType="decrease"
      />
    );
    
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  it('does not render change indicator when change is undefined', () => {
    render(
      <MetricsCard
        title="Test Metric"
        value="100"
        icon={<TrendingUp className="w-5 h-5" />}
      />
    );
    
    expect(screen.queryByText('from last month')).not.toBeInTheDocument();
  });

  it('renders the icon', () => {
    render(<MetricsCard {...defaultProps} />);
    
    const icon = screen.getByRole('img', { hidden: true });
    expect(icon).toBeInTheDocument();
  });
}); 