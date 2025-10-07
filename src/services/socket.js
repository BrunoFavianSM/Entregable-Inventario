import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Crear instancia de socket
let socket = null;

// Conectar al servidor de WebSocket
export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('✅ Conectado a Socket.io:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Desconectado de Socket.io');
    });

    socket.on('connect_error', (error) => {
      console.error('⚠️ Error de conexión Socket.io:', error.message);
    });
  }
  return socket;
};

// Desconectar socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('🔌 Socket desconectado manualmente');
  }
};

// Obtener instancia del socket
export const getSocket = () => {
  if (!socket) {
    return connectSocket();
  }
  return socket;
};

// ==================== LISTENERS ====================

// Escuchar actualizaciones de productos
export const onProductUpdate = (callback) => {
  const socket = getSocket();
  socket.on('product:created', callback);
  socket.on('product:updated', callback);
  socket.on('product:deleted', callback);
};

// Escuchar actualizaciones de stock
export const onStockUpdate = (callback) => {
  const socket = getSocket();
  socket.on('stock:updated', callback);
};

// Escuchar nuevas ventas
export const onSaleCreated = (callback) => {
  const socket = getSocket();
  socket.on('sale:created', callback);
};

// Escuchar nuevas alertas
export const onAlertCreated = (callback) => {
  const socket = getSocket();
  socket.on('alert:created', callback);
};

// Escuchar resolución de alertas
export const onAlertResolved = (callback) => {
  const socket = getSocket();
  socket.on('alert:resolved', callback);
};

// Escuchar actualizaciones de clientes
export const onCustomerUpdate = (callback) => {
  const socket = getSocket();
  socket.on('customer:created', callback);
  socket.on('customer:updated', callback);
  socket.on('customer:deleted', callback);
};

// Escuchar actualizaciones de ubicaciones
export const onLocationUpdate = (callback) => {
  const socket = getSocket();
  socket.on('location:created', callback);
  socket.on('location:updated', callback);
  socket.on('location:deleted', callback);
};

// ==================== EMITTERS ====================

// Unirse a una sala
export const joinRoom = (room) => {
  const socket = getSocket();
  socket.emit('join:room', room);
};

// Salir de una sala
export const leaveRoom = (room) => {
  const socket = getSocket();
  socket.emit('leave:room', room);
};

// Solicitar datos del dashboard
export const requestDashboardData = () => {
  const socket = getSocket();
  socket.emit('dashboard:request');
};

// ==================== CLEANUP ====================

// Limpiar listeners específicos
export const removeListener = (event, callback) => {
  const socket = getSocket();
  if (callback) {
    socket.off(event, callback);
  } else {
    socket.off(event);
  }
};

// Limpiar todos los listeners
export const removeAllListeners = () => {
  const socket = getSocket();
  socket.removeAllListeners();
};

export default {
  connect: connectSocket,
  disconnect: disconnectSocket,
  getSocket,
  onProductUpdate,
  onStockUpdate,
  onSaleCreated,
  onAlertCreated,
  onAlertResolved,
  onCustomerUpdate,
  onLocationUpdate,
  joinRoom,
  leaveRoom,
  requestDashboardData,
  removeListener,
  removeAllListeners,
};
