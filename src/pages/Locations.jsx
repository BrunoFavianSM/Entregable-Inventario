import { useEffect, useState } from 'react';
import { Plus, MapPin, Edit, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { locationAPI } from '../services/api';
import { onLocationUpdate } from '../services/socket';
import toast from 'react-hot-toast';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  useEffect(() => {
    fetchLocations();
    
    onLocationUpdate(() => {
      fetchLocations();
    });
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await locationAPI.getAll();
      if (response.success) {
        setLocations(response.data);
      }
    } catch (error) {
      console.error('Error al cargar ubicaciones:', error);
      toast.error('Error al cargar ubicaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta ubicación?')) return;
    
    try {
      await locationAPI.delete(id);
      toast.success('Ubicación eliminada exitosamente');
      fetchLocations();
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar ubicación');
    }
  };

  const getLocationTypeLabel = (type) => {
    const labels = {
      warehouse: 'Almacén',
      store: 'Tienda',
      customer: 'Cliente',
      supplier: 'Proveedor',
      other: 'Otro',
    };
    return labels[type] || type;
  };

  const getLocationTypeBadge = (type) => {
    const badges = {
      warehouse: <span className="badge badge-info">Almacén</span>,
      store: <span className="badge badge-success">Tienda</span>,
      customer: <span className="badge badge-warning">Cliente</span>,
      supplier: <span className="badge badge-gray">Proveedor</span>,
      other: <span className="badge badge-gray">Otro</span>,
    };
    return badges[type] || <span className="badge badge-gray">{type}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ubicaciones</h1>
          <p className="text-gray-500 mt-1">Gestiona ubicaciones con coordenadas GPS</p>
        </div>
        <Button
          icon={Plus}
          onClick={() => {
            setEditingLocation(null);
            setIsModalOpen(true);
          }}
        >
          Nueva Ubicación
        </Button>
      </div>

      {/* Locations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <Card key={location.id} hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <MapPin size={24} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {location.name}
                    </h3>
                    {getLocationTypeBadge(location.location_type)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {location.address && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {location.address}
                  </p>
                )}
                <div className="flex gap-4 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Lat:</span> {parseFloat(location.latitude).toFixed(6)}
                  </div>
                  <div>
                    <span className="font-medium">Lng:</span> {parseFloat(location.longitude).toFixed(6)}
                  </div>
                </div>
                {location.contact_name && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Contacto:</span> {location.contact_name}
                    {location.contact_phone && ` - ${location.contact_phone}`}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Productos</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {location.products_count || 0}
                    </p>
                  </div>
                  <div>
                    <span className={`badge ${location.is_active ? 'badge-success' : 'badge-gray'}`}>
                      {location.is_active ? 'Activo' : 'Inactivo'}
                    </span>
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
                    setEditingLocation(location);
                    setIsModalOpen(true);
                  }}
                >
                  Editar
                </Button>
                <button
                  onClick={() => handleDelete(location.id)}
                  className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Location Form Modal */}
      <LocationFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLocation(null);
        }}
        location={editingLocation}
        onSuccess={() => {
          fetchLocations();
          setIsModalOpen(false);
          setEditingLocation(null);
        }}
      />
    </div>
  );
};

// Location Form Modal Component
const LocationFormModal = ({ isOpen, onClose, location, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    location_type: 'warehouse',
    is_active: true,
    contact_name: '',
    contact_phone: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location) {
      setFormData(location);
    } else {
      setFormData({
        name: '',
        description: '',
        address: '',
        latitude: '',
        longitude: '',
        location_type: 'warehouse',
        is_active: true,
        contact_name: '',
        contact_phone: '',
      });
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (location) {
        await locationAPI.update(location.id, formData);
        toast.success('Ubicación actualizada exitosamente');
      } else {
        await locationAPI.create(formData);
        toast.success('Ubicación creada exitosamente');
      }
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar ubicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={location ? 'Editar Ubicación' : 'Nueva Ubicación'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Descripción"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <Input
          label="Dirección"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Latitud *"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            placeholder="-12.046374"
            required
          />
          <Input
            label="Longitud *"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            placeholder="-77.042793"
            required
          />
        </div>

        <div>
          <label className="label">Tipo de Ubicación *</label>
          <select
            className="input"
            value={formData.location_type}
            onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
            required
          >
            <option value="warehouse">Almacén</option>
            <option value="store">Tienda</option>
            <option value="customer">Cliente</option>
            <option value="supplier">Proveedor</option>
            <option value="other">Otro</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre de Contacto"
            value={formData.contact_name}
            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
          />
          <Input
            label="Teléfono de Contacto"
            value={formData.contact_phone}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Ubicación activa
          </label>
        </div>

        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {location ? 'Actualizar' : 'Crear'} Ubicación
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default Locations;
