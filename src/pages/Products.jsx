import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { productAPI } from '../services/api';
import { onProductUpdate, onStockUpdate } from '../services/socket';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    
    // Socket listeners
    onProductUpdate(() => {
      fetchProducts();
    });
    
    onStockUpdate(() => {
      fetchProducts();
    });
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      if (response.success) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      await productAPI.delete(id);
      toast.success('Producto eliminado exitosamente');
      fetchProducts();
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar producto');
    }
  };

  const getStockBadge = (product) => {
    const { stock_quantity, min_stock_level, stock_status } = product;
    
    if (stock_status === 'out_of_stock') {
      return <span className="badge badge-danger">Sin Stock</span>;
    }
    if (stock_status === 'low_stock') {
      return <span className="badge badge-warning">Stock Bajo</span>;
    }
    if (stock_status === 'overstock') {
      return <span className="badge badge-info">Sobre Stock</span>;
    }
    return <span className="badge badge-success">Normal</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500 mt-1">Gestiona tu inventario de productos</p>
        </div>
        <Button
          icon={Plus}
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          Nuevo Producto
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Buscar por nombre o SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Intenta con otra búsqueda' : 'Comienza agregando tu primer producto'}
            </p>
            {!searchQuery && (
              <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                Agregar Producto
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} hover>
              <div className="relative mb-4">
                <img
                  src={product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {product.stock_quantity <= product.min_stock_level && (
                  <div className="absolute top-2 right-2">
                    <AlertCircle className="text-warning-600" size={24} />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.sku}</p>
                  </div>
                  {getStockBadge(product)}
                </div>
                
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary-600">
                    S/ {parseFloat(product.price).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    / {product.unit}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Stock</p>
                    <p className={clsx(
                      'text-sm font-semibold',
                      product.stock_quantity === 0 && 'text-danger-600',
                      product.stock_quantity <= product.min_stock_level && product.stock_quantity > 0 && 'text-warning-600',
                      product.stock_quantity > product.min_stock_level && 'text-success-600'
                    )}>
                      {product.stock_quantity} {product.unit}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={() => {
          fetchProducts();
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
      />
    </div>
  );
};

// Product Form Modal Component
const ProductFormModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    cost: '',
    stock_quantity: '',
    min_stock_level: '10',
    max_stock_level: '100',
    unit: 'unidad',
    image_url: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        sku: '',
        description: '',
        price: '',
        cost: '',
        stock_quantity: '',
        min_stock_level: '10',
        max_stock_level: '100',
        unit: 'unidad',
        image_url: '',
        status: 'active',
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product) {
        await productAPI.update(product.id, formData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await productAPI.create(formData);
        toast.success('Producto creado exitosamente');
      }
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Editar Producto' : 'Nuevo Producto'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre del Producto *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="SKU *"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            required
          />
        </div>

        <Input
          label="Descripción"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Precio (S/) *"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <Input
            label="Costo (S/) *"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            required
          />
          <Input
            label="Stock Inicial"
            type="number"
            value={formData.stock_quantity}
            onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Stock Mínimo"
            type="number"
            value={formData.min_stock_level}
            onChange={(e) => setFormData({ ...formData, min_stock_level: e.target.value })}
          />
          <Input
            label="Stock Máximo"
            type="number"
            value={formData.max_stock_level}
            onChange={(e) => setFormData({ ...formData, max_stock_level: e.target.value })}
          />
          <Input
            label="Unidad"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          />
        </div>

        <Input
          label="URL de Imagen"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://ejemplo.com/imagen.jpg"
        />

        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading}>
            {product ? 'Actualizar' : 'Crear'} Producto
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default Products;
