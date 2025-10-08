import { useEffect, useState } from 'react';
import { Plus, Search, Eye, Trash2, ShoppingCart, User, CreditCard } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import { saleAPI, productAPI, customerAPI } from '../services/api';
import { onSaleCreated } from '../services/socket';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewSaleModalOpen, setIsNewSaleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

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

  const handleViewSale = async (saleId) => {
    try {
      const response = await saleAPI.getById(saleId);
      if (response.success) {
        setSelectedSale(response.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      toast.error('Error al cargar detalles de la venta');
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
        <Button icon={Plus} onClick={() => setIsNewSaleModalOpen(true)}>
          Nueva Venta
        </Button>
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
                      <Button 
                        size="sm" 
                        variant="outline" 
                        icon={Eye}
                        onClick={() => handleViewSale(sale.id)}
                      >
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

      {/* New Sale Modal */}
      <NewSaleModal
        isOpen={isNewSaleModalOpen}
        onClose={() => setIsNewSaleModalOpen(false)}
        onSuccess={() => {
          fetchSales();
          setIsNewSaleModalOpen(false);
        }}
      />

      {/* Sale Detail Modal */}
      <SaleDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSale(null);
        }}
        sale={selectedSale}
      />
    </div>
  );
};

// Modal de Nueva Venta
const NewSaleModal = ({ isOpen, onClose, onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    payment_method: 'cash',
    notes: '',
    discount: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchProduct, setSearchProduct] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchCustomers();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      if (response.success) {
        setProducts(response.data.filter(p => p.status === 'active' && p.stock_quantity > 0));
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar productos');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      if (response.success) {
        setCustomers(response.data.filter(c => c.status === 'active'));
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock_quantity) {
        toast.error(`Stock insuficiente. Solo hay ${product.stock_quantity} disponibles`);
        return;
      }
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        product_id: product.id,
        name: product.name,
        unit_price: parseFloat(product.price),
        quantity: 1,
        max_stock: product.stock_quantity
      }]);
    }
    toast.success(`${product.name} agregado al carrito`);
  };

  const updateQuantity = (productId, newQuantity) => {
    const item = cart.find(i => i.product_id === productId);
    if (newQuantity > item.max_stock) {
      toast.error(`Stock insuficiente. Solo hay ${item.max_stock} disponibles`);
      return;
    }
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.product_id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product_id !== productId));
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const discount = parseFloat(formData.discount) || 0;
    const taxRate = 0.18; // IGV 18%
    const taxAmount = (subtotal - discount) * taxRate;
    const total = subtotal - discount + taxAmount;
    
    return { subtotal, discount, taxAmount, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Debe agregar al menos un producto');
      return;
    }

    setLoading(true);
    try {
      const saleData = {
        customer_id: formData.customer_id || null,
        payment_method: formData.payment_method,
        payment_status: 'completed',
        notes: formData.notes,
        discount: parseFloat(formData.discount) || 0,
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount: 0
        }))
      };

      const response = await saleAPI.create(saleData);
      if (response.success) {
        toast.success('Venta registrada exitosamente');
        setCart([]);
        setFormData({
          customer_id: '',
          payment_method: 'cash',
          notes: '',
          discount: 0
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Error al crear venta:', error);
      toast.error('Error al registrar la venta');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const totals = calculateTotals();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Venta"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cliente y Método de Pago */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Cliente"
            icon={User}
            value={formData.customer_id}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
            tooltip="Seleccione el cliente o deje en blanco para Cliente General"
          >
            <option value="">Cliente General</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.first_name} {customer.last_name}
              </option>
            ))}
          </Select>

          <Select
            label="Método de Pago *"
            icon={CreditCard}
            value={formData.payment_method}
            onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
            required
            tooltip="Seleccione el método de pago utilizado"
          >
            <option value="cash">Efectivo</option>
            <option value="card">Tarjeta</option>
            <option value="transfer">Transferencia</option>
            <option value="credit">Crédito</option>
          </Select>
        </div>

        {/* Búsqueda de Productos */}
        <div>
          <Input
            label="Buscar Producto"
            icon={Search}
            placeholder="Buscar por nombre o SKU..."
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            tooltip="Busque productos disponibles para agregar a la venta"
          />
        </div>

        {/* Lista de Productos Disponibles */}
        <div className="max-h-48 overflow-y-auto border rounded-lg">
          <div className="grid grid-cols-1 gap-2 p-2">
            {filteredProducts.slice(0, 5).map(product => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    SKU: {product.sku} | Stock: {product.stock_quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">S/ {parseFloat(product.price).toFixed(2)}</p>
                  <Button type="button" size="sm" onClick={() => addToCart(product)}>
                    + Agregar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carrito */}
        {cart.length > 0 && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ShoppingCart size={18} />
              Carrito de Compra ({cart.length} items)
            </h3>
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.product_id} className="flex items-center justify-between bg-white p-3 rounded">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">S/ {item.unit_price.toFixed(2)} c/u</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-semibold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.max_stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          updateQuantity(item.product_id, value);
                        }}
                        className="no-spinner w-16 text-center font-medium border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-semibold"
                      >
                        +
                      </button>
                    </div>
                    <p className="w-24 text-right font-semibold">
                      S/ {(item.quantity * item.unit_price).toFixed(2)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-danger-600 hover:text-danger-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>S/ {totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm items-center gap-2">
                <span>Descuento:</span>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-32 text-right"
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>IGV (18%):</span>
                <span>S/ {totals.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary-600">S/ {totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Notas */}
        <Input
          label="Notas"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Observaciones adicionales..."
          tooltip="Agregue cualquier nota o comentario sobre esta venta"
        />

        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={loading} disabled={cart.length === 0}>
            Registrar Venta
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

// Modal de Detalles de Venta
const SaleDetailModal = ({ isOpen, onClose, sale }) => {
  if (!sale) return null;

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalles de Venta - ${sale.sale_number}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Información General */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b">
          <div>
            <p className="text-sm text-gray-500">Fecha</p>
            <p className="font-medium">
              {new Date(sale.sale_date).toLocaleDateString('es-PE', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cliente</p>
            <p className="font-medium">
              {sale.first_name && sale.last_name
                ? `${sale.first_name} ${sale.last_name}`
                : 'Cliente General'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Método de Pago</p>
            <p className="font-medium">{getPaymentMethodLabel(sale.payment_method)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estado</p>
            <div className="mt-1">{getStatusBadge(sale.payment_status)}</div>
          </div>
          {sale.served_by && (
            <div>
              <p className="text-sm text-gray-500">Atendido por</p>
              <p className="font-medium">{sale.served_by}</p>
            </div>
          )}
        </div>

        {/* Productos */}
        <div>
          <h3 className="font-semibold mb-3">Productos</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Producto</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Cantidad</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Precio Unit.</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sale.details?.map((detail, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <p className="font-medium">{detail.product_name}</p>
                      <p className="text-sm text-gray-500">SKU: {detail.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-center">{detail.quantity}</td>
                    <td className="px-4 py-3 text-right">S/ {parseFloat(detail.unit_price).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      S/ {parseFloat(detail.subtotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totales */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>S/ {parseFloat(sale.total_amount).toFixed(2)}</span>
          </div>
          {parseFloat(sale.discount) > 0 && (
            <div className="flex justify-between text-sm text-danger-600">
              <span>Descuento:</span>
              <span>- S/ {parseFloat(sale.discount).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>IGV (18%):</span>
            <span>S/ {parseFloat(sale.tax).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total:</span>
            <span className="text-primary-600">S/ {parseFloat(sale.final_amount).toFixed(2)}</span>
          </div>
        </div>

        {/* Notas */}
        {sale.notes && (
          <div>
            <p className="text-sm text-gray-500 mb-1">Notas</p>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">{sale.notes}</p>
          </div>
        )}

        <Modal.Footer>
          <Button type="button" onClick={onClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default Sales;
