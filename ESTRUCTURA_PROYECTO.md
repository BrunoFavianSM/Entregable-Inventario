# 🏗️ ESTRUCTURA DEL PROYECTO - SISTEMA DE GESTIÓN DE INVENTARIO

```
gestion-inventario/
│
├── 📁 server/                          # Backend (Node.js + Express)
│   ├── 📁 config/
│   │   └── database.js                # Configuración de MySQL
│   ├── 📁 controllers/
│   │   ├── productController.js       # Lógica de productos
│   │   ├── saleController.js          # Lógica de ventas
│   │   ├── customerController.js      # Lógica de clientes
│   │   ├── alertController.js         # Lógica de alertas
│   │   └── locationController.js      # Lógica de coordenadas
│   ├── 📁 models/
│   │   ├── Product.js                 # Modelo de productos
│   │   ├── Sale.js                    # Modelo de ventas
│   │   ├── Customer.js                # Modelo de clientes
│   │   ├── Alert.js                   # Modelo de alertas
│   │   └── Location.js                # Modelo de ubicaciones
│   ├── 📁 routes/
│   │   ├── productRoutes.js           # Rutas de productos
│   │   ├── saleRoutes.js              # Rutas de ventas
│   │   ├── customerRoutes.js          # Rutas de clientes
│   │   ├── alertRoutes.js             # Rutas de alertas
│   │   └── locationRoutes.js          # Rutas de coordenadas
│   ├── 📁 middleware/
│   │   ├── errorHandler.js            # Manejo de errores
│   │   └── validator.js               # Validación de datos
│   ├── 📁 socket/
│   │   └── socketHandler.js           # Manejo de WebSocket (tiempo real)
│   ├── .env.example                   # Variables de entorno ejemplo
│   ├── package.json                   # Dependencias del backend
│   └── server.js                      # Punto de entrada del servidor
│
├── 📁 database/                       # Scripts de Base de Datos
│   ├── schema.sql                     # Estructura de tablas
│   ├── seeds.sql                      # Datos de prueba
│   └── procedures.sql                 # Procedimientos almacenados
│
├── 📁 src/                            # Frontend (React)
│   ├── 📁 components/
│   │   ├── 📁 layout/
│   │   │   ├── Navbar.jsx            # Barra de navegación
│   │   │   ├── Sidebar.jsx           # Menú lateral
│   │   │   └── Footer.jsx            # Pie de página
│   │   ├── 📁 dashboard/
│   │   │   ├── DashboardCard.jsx     # Tarjetas de estadísticas
│   │   │   ├── StockChart.jsx        # Gráficos de stock
│   │   │   └── AlertsList.jsx        # Lista de alertas
│   │   ├── 📁 products/
│   │   │   ├── ProductList.jsx       # Lista de productos
│   │   │   ├── ProductForm.jsx       # Formulario de productos
│   │   │   ├── ProductCard.jsx       # Tarjeta de producto
│   │   │   └── StockUpdate.jsx       # Actualización de stock
│   │   ├── 📁 sales/
│   │   │   ├── SalesList.jsx         # Lista de ventas
│   │   │   ├── SaleForm.jsx          # Formulario de ventas
│   │   │   └── SaleDetail.jsx        # Detalle de venta
│   │   ├── 📁 customers/
│   │   │   ├── CustomerList.jsx      # Lista de clientes
│   │   │   ├── CustomerForm.jsx      # Formulario de clientes
│   │   │   └── CustomerDetail.jsx    # Detalle de cliente
│   │   ├── 📁 locations/
│   │   │   ├── LocationMap.jsx       # Mapa de ubicaciones
│   │   │   └── LocationForm.jsx      # Formulario de coordenadas
│   │   └── 📁 ui/
│   │       ├── Button.jsx            # Componente de botón
│   │       ├── Card.jsx              # Componente de tarjeta
│   │       ├── Input.jsx             # Componente de input
│   │       ├── Modal.jsx             # Componente de modal
│   │       └── Alert.jsx             # Componente de alerta
│   ├── 📁 pages/
│   │   ├── Dashboard.jsx             # Página principal
│   │   ├── Products.jsx              # Página de productos
│   │   ├── Sales.jsx                 # Página de ventas
│   │   ├── Customers.jsx             # Página de clientes
│   │   ├── Locations.jsx             # Página de ubicaciones
│   │   └── Alerts.jsx                # Página de alertas
│   ├── 📁 services/
│   │   ├── api.js                    # Cliente HTTP (Axios)
│   │   ├── socket.js                 # Cliente WebSocket
│   │   └── storage.js                # LocalStorage helper
│   ├── 📁 hooks/
│   │   ├── useProducts.js            # Hook de productos
│   │   ├── useSales.js               # Hook de ventas
│   │   ├── useCustomers.js           # Hook de clientes
│   │   ├── useAlerts.js              # Hook de alertas
│   │   └── useRealTime.js            # Hook de tiempo real
│   ├── 📁 context/
│   │   └── AppContext.jsx            # Context API global
│   ├── 📁 utils/
│   │   ├── formatters.js             # Funciones de formato
│   │   └── validators.js             # Funciones de validación
│   ├── 📁 styles/
│   │   └── globals.css               # Estilos globales
│   ├── App.jsx                       # Componente principal
│   └── main.jsx                      # Punto de entrada
│
├── 📁 public/                        # Archivos estáticos
│   └── vite.svg                      # Logo
│
├── .env.example                      # Variables de entorno (frontend)
├── .gitignore                        # Archivos ignorados
├── package.json                      # Dependencias del frontend
├── vite.config.js                    # Configuración de Vite
├── tailwind.config.js                # Configuración de Tailwind
├── postcss.config.js                 # Configuración de PostCSS
└── README.md                         # Documentación principal
```

## 🎯 Tecnologías Utilizadas

### Backend
- **Node.js** v22.19.0
- **Express.js** - Framework web
- **MySQL2** - Driver de MySQL
- **Socket.io** - WebSockets para tiempo real
- **dotenv** - Variables de entorno
- **cors** - Cross-Origin Resource Sharing
- **express-validator** - Validación de datos

### Frontend
- **React** 18+ con Vite
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **Socket.io-client** - Cliente WebSocket
- **TailwindCSS** - Framework CSS
- **Lucide React** - Iconos
- **Recharts** - Gráficos
- **React Hook Form** - Manejo de formularios
- **React Hot Toast** - Notificaciones

### Base de Datos
- **MySQL** 8.0+

## 🚀 Características Principales

1. ✅ **Gestión de Inventario**: CRUD completo de productos
2. ✅ **Actualización en Tiempo Real**: Socket.io para cambios instantáneos
3. ✅ **Alertas Automáticas**: Sistema de notificaciones para stock bajo
4. ✅ **Registro de Ventas**: Historial completo de transacciones
5. ✅ **Gestión de Clientes**: Base de datos de clientes
6. ✅ **Geolocalización**: Almacenamiento de coordenadas
7. ✅ **Dashboard Interactivo**: Visualización de métricas clave
8. ✅ **UI/UX Moderna**: Diseño responsive y amigable
