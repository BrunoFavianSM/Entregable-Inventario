import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  MapPin, 
  AlertTriangle,
  X
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      path: '/',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      path: '/products',
      icon: Package,
      label: 'Productos',
    },
    {
      path: '/sales',
      icon: ShoppingCart,
      label: 'Ventas',
    },
    {
      path: '/customers',
      icon: Users,
      label: 'Clientes',
    },
    {
      path: '/locations',
      icon: MapPin,
      label: 'Ubicaciones',
    },
    {
      path: '/alerts',
      icon: AlertTriangle,
      label: 'Alertas',
    },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 lg:translate-x-0 lg:mt-[73px]',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header móvil */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <h2 className="text-lg font-bold">Menú</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                    className={({ isActive }) =>
                      clsx(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      )
                    }
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-primary-50 rounded-lg p-3">
              <p className="text-xs text-primary-900 font-medium mb-1">
                Sistema de Gestión
              </p>
              <p className="text-xs text-primary-700">
                Versión 1.0.0
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
