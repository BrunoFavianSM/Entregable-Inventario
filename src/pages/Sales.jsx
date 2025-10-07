import { useEffect, useState } from 'react';
import { Plus, Search, Eye } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { saleAPI } from '../services/api';
import { onSaleCreated } from '../services/socket';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSales();
    
    onSaleCreated(() => {
      fetchSales();
      toast.success('Nueva venta registrada');
    });
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await saleAPI.getAll(50);
      if (response.success) {
        setSales(response.data);
      }
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      toast.error('Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: <span className="badge badge-success">Completada</span>,
      pending: <span className="badge badge-warning">Pendiente</span>,
      cancelled: <span className="badge badge-danger">Cancelada</span>,
    };
    return badges[status] || <span className="badge badge-gray">{status}</span>;
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash: 'Efectivo',
      card: 'Tarjeta',
      transfer: 'Transferencia',
      credit: 'Crédito',
    };
    return labels[method] || method;
  };

  const filteredSales = sales.filter(sale =>
    sale.sale_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ventas</h1>
          <p className="text-gray-500 mt-1">Registro de todas las ventas</p>
        </div>
        <Button icon={Plus}>Nueva Venta</Button>
      </div>

      {/* Search */}
      <Card>
        <Input
          icon={Search}
          placeholder="Buscar por número de venta o cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Card>

      {/* Sales Table */}
      <Card>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>N° Venta</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Método Pago</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="font-medium">{sale.sale_number}</td>
                    <td>
                      {new Date(sale.sale_date).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>{sale.customer_name || 'Cliente General'}</td>
                    <td>{sale.items_count} items</td>
                    <td className="font-semibold text-primary-600">
                      S/ {parseFloat(sale.final_amount).toFixed(2)}
                    </td>
                    <td>{getPaymentMethodLabel(sale.payment_method)}</td>
                    <td>{getStatusBadge(sale.payment_status)}</td>
                    <td>
                      <Button size="sm" variant="outline" icon={Eye}>
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Sales;
