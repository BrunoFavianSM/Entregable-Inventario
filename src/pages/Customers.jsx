import { useEffect, useState } from 'react';
import { Plus, Search, Mail, Phone, Edit, Trash2, User, MapPin } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { customerAPI } from '../services/api';
import { onCustomerUpdate } from '../services/socket';
import toast from 'react-hot-toast';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
    
    onCustomerUpdate(() => {
      fetchCustomers();
    });
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getAll();
      if (response.success) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      toast.error('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;
    
    try {
      await customerAPI.delete(id);
      toast.success('Cliente eliminado exitosamente');
      fetchCustomers();
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar cliente');
    }
  };

  const getCustomerTypeBadge = (type) => {
    const badges = {
      regular: <span className="badge badge-gray">Regular</span>,
      wholesale: <span className="badge badge-info">Mayorista</span>,
      vip: <span className="badge badge-warning">VIP</span>,
    };
    return badges[type] || <span className="badge badge-gray">{type}</span>;
  };

  const filteredCustomers = customers.filter(customer =>
    customer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">Gestiona tu base de clientes</p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>Nuevo Cliente</Button>
      </div>

      {/* Search */}
      <Card>
        <Input
          icon={Search}
          placeholder="Buscar clientes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Card>

      {/* Customers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-lg">
                      {customer.first_name.charAt(0)}{customer.last_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {customer.first_name} {customer.last_name}
                    </h3>
                    {getCustomerTypeBadge(customer.customer_type)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {customer.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={16} />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={16} />
                    <span>{customer.phone}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Total Compras</p>
                    <p className="text-sm font-semibold text-primary-600">
                      S/ {parseFloat(customer.total_purchases || 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">N° Órdenes</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {customer.total_orders || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-3 border-t border-gray-200">
                <Button 
                  size="sm" 
                  variant="outline" 
                  icon={Edit} 
                  className="flex-1"
                  onClick={() => {
                    setEditingCustomer(customer);
                    setIsModalOpen(true);
                  }}
                >
                  Editar
                </Button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Customer Form Modal */}
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCustomer(null);
        }}
        customer={editingCustomer}
        onSuccess={() => {
          fetchCustomers();
          setIsModalOpen(false);
          setEditingCustomer(null);
        }}
      />
    </div>
  );
};

// Modal de Formulario de Cliente
const CustomerFormModal = ({ isOpen, onClose, customer, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    document_type: 'DNI',
    document_number: '',
    customer_type: 'regular',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        document_type: customer.document_type || 'DNI',
        document_number: customer.document_number || '',
        customer_type: customer.customer_type || 'regular',
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        document_type: 'DNI',
        document_number: '',
        customer_type: 'regular',
      });
    }
  }, [customer, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (customer) {
        await customerAPI.update(customer.id, formData);
        toast.success('Cliente actualizado exitosamente');
      } else {
        await customerAPI.create(formData);
        toast.success('Cliente creado exitosamente');
      }
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer ? 'Editar Cliente' : 'Nuevo Cliente'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre *"
            icon={User}
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
            tooltip="Ingrese el nombre del cliente"
          />
          <Input
            label="Apellido *"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            required
            tooltip="Ingrese el apellido del cliente"
          />
        </div>

        {/* Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            icon={Mail}
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            tooltip="Correo electrónico del cliente (opcional)"
          />
          <Input
            label="Teléfono"
            icon={Phone}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            tooltip="Número de teléfono del cliente"
          />
        </div>

        {/* Documento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo de Documento *"
            value={formData.document_type}
            onChange={(e) => setFormData({ ...formData, document_type: e.target.value })}
            required
            tooltip="Seleccione el tipo de documento de identidad"
          >
            <option value="DNI">DNI</option>
            <option value="RUC">RUC</option>
            <option value="CE">Carnet de Extranjería</option>
            <option value="Pasaporte">Pasaporte</option>
          </Select>
          <Input
            label="Número de Documento *"
            value={formData.document_number}
            onChange={(e) => setFormData({ ...formData, document_number: e.target.value })}
            required
            tooltip="Número del documento de identidad"
          />
        </div>

        {/* Dirección */}
        <Input
          label="Dirección"
          icon={MapPin}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          tooltip="Dirección completa del cliente"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Ciudad"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            tooltip="Ciudad de residencia"
          />
          <Select
            label="Tipo de Cliente *"
            value={formData.customer_type}
            onChange={(e) => setFormData({ ...formData, customer_type: e.target.value })}
            required
            tooltip="Clasificación del cliente según su tipo de compra"
          >
            <option value="regular">Regular</option>
            <option value="wholesale">Mayorista</option>
            <option value="vip">VIP</option>
          </Select>
        </div>

        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {customer ? 'Actualizar' : 'Crear'} Cliente
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default Customers;
