import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import Card from '../ui/Card';
import clsx from 'clsx';

const AlertsList = ({ alerts = [], loading = false }) => {
  const getAlertIcon = (level) => {
    switch (level) {
      case 'critical':
        return AlertTriangle;
      case 'warning':
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'critical':
        return 'text-danger-600 bg-danger-50';
      case 'warning':
        return 'text-warning-600 bg-warning-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Alertas Recientes</Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Card.Title>Alertas Recientes</Card.Title>
      </Card.Header>
      <Card.Body>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Info size={32} className="text-success-600" />
            </div>
            <p className="text-gray-500">No hay alertas activas</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {alerts.map((alert) => {
              const Icon = getAlertIcon(alert.alert_level);
              return (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className={clsx('p-2 rounded-lg', getAlertColor(alert.alert_level))}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {alert.product_name}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(alert.created_at).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span
                    className={clsx(
                      'badge text-xs',
                      alert.alert_level === 'critical' && 'badge-danger',
                      alert.alert_level === 'warning' && 'badge-warning',
                      alert.alert_level === 'info' && 'badge-info'
                    )}
                  >
                    {alert.alert_type === 'low_stock' && 'Stock Bajo'}
                    {alert.alert_type === 'out_of_stock' && 'Sin Stock'}
                    {alert.alert_type === 'overstock' && 'Sobre Stock'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AlertsList;
