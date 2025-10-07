import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { alertAPI } from '../services/api';
import { onAlertCreated, onAlertResolved } from '../services/socket';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAlerts();
    
    onAlertCreated(() => {
      fetchAlerts();
      toast('Nueva alerta creada', { icon: '🔔' });
    });
    
    onAlertResolved(() => {
      fetchAlerts();
    });
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await alertAPI.getAll();
      if (response.success) {
        setAlerts(response.data);
      }
    } catch (error) {
      console.error('Error al cargar alertas:', error);
      toast.error('Error al cargar alertas');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      await alertAPI.resolve(id);
      toast.success('Alerta resuelta');
      fetchAlerts();
    } catch (error) {
      console.error('Error al resolver alerta:', error);
      toast.error('Error al resolver alerta');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta alerta?')) return;
    
    try {
      await alertAPI.delete(id);
      toast.success('Alerta eliminada');
      fetchAlerts();
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar alerta');
    }
  };

  const getAlertIcon = (level) => {
    return AlertTriangle;
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

  const getAlertBadge = (type) => {
    const badges = {
      low_stock: <span className="badge badge-warning">Stock Bajo</span>,
      out_of_stock: <span className="badge badge-danger">Sin Stock</span>,
      overstock: <span className="badge badge-info">Sobre Stock</span>,
    };
    return badges[type] || <span className="badge badge-gray">{type}</span>;
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return !alert.is_resolved;
    if (filter === 'resolved') return alert.is_resolved;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alertas</h1>
          <p className="text-gray-500 mt-1">Sistema de alertas de inventario</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={clsx('btn btn-sm', filter === 'all' ? 'btn-primary' : 'btn-secondary')}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('active')}
            className={clsx('btn btn-sm', filter === 'active' ? 'btn-primary' : 'btn-secondary')}
          >
            Activas
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={clsx('btn btn-sm', filter === 'resolved' ? 'btn-primary' : 'btn-secondary')}
          >
            Resueltas
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded" />
            </Card>
          ))}
        </div>
      ) : filteredAlerts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={32} className="text-success-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay alertas
            </h3>
            <p className="text-gray-500">
              {filter === 'active' ? 'No hay alertas activas en este momento' : 'No hay alertas'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const Icon = getAlertIcon(alert.alert_level);
            return (
              <Card
                key={alert.id}
                className={clsx(
                  'transition-opacity',
                  alert.is_resolved && 'opacity-60'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={clsx('p-3 rounded-lg flex-shrink-0', getAlertColor(alert.alert_level))}>
                    <Icon size={24} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {alert.product_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          SKU: {alert.sku} | Stock: {alert.stock_quantity} unidades
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getAlertBadge(alert.alert_type)}
                        {alert.is_resolved && (
                          <span className="badge badge-success">Resuelta</span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{alert.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        {new Date(alert.created_at).toLocaleString('es-PE', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      
                      <div className="flex gap-2">
                        {!alert.is_resolved && (
                          <Button
                            size="sm"
                            variant="success"
                            icon={CheckCircle}
                            onClick={() => handleResolve(alert.id)}
                          >
                            Resolver
                          </Button>
                        )}
                        <button
                          onClick={() => handleDelete(alert.id)}
                          className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Alerts;
