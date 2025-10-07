// Manejador de eventos Socket.io para actualizaciones en tiempo real
export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ Cliente conectado: ${socket.id}`);

    // Evento: Cliente solicita unirse a una sala específica
    socket.on('join:room', (room) => {
      socket.join(room);
      console.log(`📍 Cliente ${socket.id} se unió a la sala: ${room}`);
    });

    // Evento: Cliente abandona una sala
    socket.on('leave:room', (room) => {
      socket.leave(room);
      console.log(`🚪 Cliente ${socket.id} abandonó la sala: ${room}`);
    });

    // Evento: Actualización manual de stock solicitada
    socket.on('stock:update', (data) => {
      console.log('📦 Actualización de stock recibida:', data);
      // Emitir a todos los clientes excepto el emisor
      socket.broadcast.emit('stock:updated', data);
    });

    // Evento: Nueva venta creada
    socket.on('sale:new', (data) => {
      console.log('💰 Nueva venta registrada:', data);
      io.emit('sale:created', data);
    });

    // Evento: Nueva alerta
    socket.on('alert:new', (data) => {
      console.log('🔔 Nueva alerta:', data);
      io.emit('alert:created', data);
    });

    // Evento: Solicitar datos del dashboard
    socket.on('dashboard:request', () => {
      console.log('📊 Solicitud de datos del dashboard');
      // Aquí podrías emitir datos en tiempo real del dashboard
      socket.emit('dashboard:data', {
        timestamp: new Date(),
        message: 'Datos del dashboard actualizados'
      });
    });

    // Evento: Desconexión del cliente
    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });

    // Evento: Error
    socket.on('error', (error) => {
      console.error('⚠️ Error en socket:', error);
    });
  });

  // Función para emitir notificaciones globales
  io.emitNotification = (event, data) => {
    io.emit(event, data);
  };

  // Función para emitir a una sala específica
  io.emitToRoom = (room, event, data) => {
    io.to(room).emit(event, data);
  };

  console.log('🔌 Socket.io configurado correctamente');
  
  return io;
};

// Función auxiliar para emitir actualizaciones de stock
export const emitStockUpdate = (io, productData) => {
  io.emit('stock:updated', {
    product_id: productData.id,
    product_name: productData.name,
    new_stock: productData.stock_quantity,
    timestamp: new Date()
  });
};

// Función auxiliar para emitir nuevas alertas
export const emitNewAlert = (io, alertData) => {
  io.emit('alert:created', {
    alert: alertData,
    timestamp: new Date()
  });
};

// Función auxiliar para emitir estadísticas actualizadas
export const emitStatsUpdate = (io, stats) => {
  io.emit('stats:updated', {
    stats,
    timestamp: new Date()
  });
};
