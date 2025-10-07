import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../ui/Card';
import clsx from 'clsx';

const DashboardCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'primary',
  loading = false 
}) => {
  const colors = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    danger: 'bg-danger-100 text-danger-600',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 animate-pulse rounded" />
          ) : (
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
          )}
          {trend && trendValue && (
            <div className="flex items-center gap-1 mt-2">
              {trend === 'up' ? (
                <TrendingUp size={16} className="text-success-600" />
              ) : (
                <TrendingDown size={16} className="text-danger-600" />
              )}
              <span
                className={clsx(
                  'text-sm font-medium',
                  trend === 'up' ? 'text-success-600' : 'text-danger-600'
                )}
              >
                {trendValue}
              </span>
              <span className="text-sm text-gray-500">vs mes anterior</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={clsx('p-3 rounded-lg', colors[color])}>
            <Icon size={28} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default DashboardCard;
