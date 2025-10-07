import { useEffect, useState } from 'react';
import { Package, DollarSign, Users, AlertTriangle } from 'lucide-react';
import DashboardCard from '../components/dashboard/DashboardCard';
import StockChart from '../components/dashboard/StockChart';
import AlertsList from '../components/dashboard/AlertsList';
import { dashboardAPI, alertAPI } from '../services/api';
import { onStockUpdate, onSaleCreated, onAlertCreated } from '../services/socket';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_productos: 0,
    ventas_mes: 0,
    total_clientes: 0,
    alertas_activas: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    
    // Configurar listeners de Socket.io
    onStockUpdate(() => {
      fetchDashboardData();
      toast('Stock actualizado', { icon: '📦' });
    });
    
    onSaleCreated(() => {
      fetchDashboardData();
      toast.success('Nueva venta registrada');
    });
    
    onAlertCreated(() => {
      fetchAlerts();
      toast('Nueva alerta', { icon: '🔔' });
    });
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getStats();
      
      if (response.success) {
        setStats(response.data.stats);
        
        // Formatear datos de ventas para el gráfico
        const formattedSales = response.data.weekSales.map(sale => ({
          date: new Date(sale.date).toLocaleDateString('es-PE', { 
            day: '2-digit', 
            month: 'short' 
          }),
          sales_count: sale.sales_count,
          total_amount: parseFloat(sale.total_amount)
        }));
        setSalesData(formattedSales.reverse());
      }
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await alertAPI.getActive();
      if (response.success) {
        setAlerts(response.data.slice(0, 5)); // Mostrar solo 5 alertas
      }
    } catch (error) {
      console.error('Error al cargar alertas:', error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Resumen general del sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Productos"
          value={stats.total_productos}
          icon={Package}
          color="primary"
          loading={loading}
        />
        <DashboardCard
          title="Ventas del Mes"
          value={`S/ ${parseFloat(stats.ventas_mes || 0).toFixed(2)}`}
          icon={DollarSign}
          color="success"
          loading={loading}
        />
        <DashboardCard
          title="Total Clientes"
          value={stats.total_clientes}
          icon={Users}
          color="warning"
          loading={loading}
        />
        <DashboardCard
          title="Alertas Activas"
          value={stats.alertas_activas}
          icon={AlertTriangle}
          color="danger"
          loading={loading}
        />
      </div>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StockChart data={salesData} />
        </div>
        <div className="lg:col-span-1">
          <AlertsList alerts={alerts} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
