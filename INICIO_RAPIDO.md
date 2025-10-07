# ⚡ INICIO RÁPIDO - 5 MINUTOS

Guía express para poner en marcha el sistema rápidamente.

---

## 📋 CHECKLIST PRE-INICIO

Antes de comenzar, verifica que tengas:

- [ ] Node.js v22.19.0 instalado (`node --version`)
- [ ] npm v10.9.3 instalado (`npm --version`)
- [ ] MySQL 8.0 corriendo (`mysql --version`)
- [ ] Contraseña de MySQL a mano

---

## 🚀 3 PASOS PARA INICIAR

### PASO 1: Base de Datos (2 minutos)

Abre MySQL Workbench y ejecuta EN ORDEN:

1. `database/schema.sql` ⚡
2. `database/seeds.sql` ⚡
3. `database/procedures.sql` ⚡

**Alternativa por comandos**:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seeds.sql
mysql -u root -p < database/procedures.sql
```

### PASO 2: Backend (1 minuto)

```bash
cd server
npm install
copy .env.example .env
```

**Edita `server/.env`** y pon tu contraseña de MySQL:
```env
DB_PASSWORD=tu_contraseña_aqui
```

**Inicia el servidor**:
```bash
npm run dev
```

✅ Debe decir: "🚀 SERVIDOR INICIADO CORRECTAMENTE"

### PASO 3: Frontend (1 minuto)

**Abre OTRA terminal** (deja la del backend corriendo):

```bash
npm install
copy .env.example .env
npm run dev
```

✅ Debe mostrar: "http://localhost:5173"

---

## 🎉 ¡LISTO!

Abre tu navegador en: **http://localhost:5173**

Deberías ver el Dashboard con:
- 4 tarjetas de estadísticas
- Gráfico de ventas
- Lista de alertas

---

## 🔥 COMANDOS DIARIOS

Para los siguientes usos, solo necesitas:

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend**:
```bash
npm run dev
```

---

## 🧪 PRUEBA RÁPIDA DE FUNCIONALIDADES

### 1. Ver Productos (15 productos pre-cargados)
- Click en "Productos" en el menú lateral
- Deberías ver productos con imágenes

### 2. Crear un Producto Nuevo
- Click en "Nuevo Producto"
- Llena el formulario:
  - Nombre: "Producto de Prueba"
  - SKU: "TEST-001"
  - Precio: 50.00
  - Costo: 30.00
  - Stock: 20
- Click "Crear Producto"
- ✅ Verás una notificación de éxito

### 3. Probar Tiempo Real
- Abre http://localhost:5173 en DOS navegadores
- Edita un producto en uno
- 🎉 Verás el cambio instantáneo en el otro

### 4. Ver Coordenadas GPS
- Click en "Ubicaciones"
- Verás 6 ubicaciones con coordenadas de Lima
- Intenta crear una nueva:
  - Nombre: "Mi Ubicación"
  - Latitud: -12.046374
  - Longitud: -77.042793

### 5. Ver Alertas Automáticas
- Click en "Alertas"
- Deberías ver alertas de productos con stock bajo
- Las alertas se crean automáticamente

---

## 🐛 SI ALGO NO FUNCIONA

### Backend no inicia
```
❌ Error al conectar con MySQL
```
👉 Verifica la contraseña en `server/.env`

### Frontend no conecta al backend
```
❌ Network Error
```
👉 Asegúrate que el backend esté corriendo en puerto 5000

### Puerto ocupado
```
❌ Port 5000 is already in use
```
👉 Ejecuta:
```bash
netstat -ano | findstr :5000
taskkill /PID <numero> /F
```

---

## 📊 DATOS PRE-CARGADOS

El sistema ya incluye:

✅ **15 Productos** en categorías: Electrónica, Alimentos, Ropa, etc.  
✅ **8 Clientes** con diferentes tipos (Regular, VIP, Mayorista)  
✅ **6 Ubicaciones** con coordenadas GPS reales de Lima  
✅ **5 Ventas** registradas como ejemplo  
✅ **Alertas** automáticas de stock bajo  

---

## 🎯 PÁGINAS DISPONIBLES

1. **Dashboard** (`/`) - Estadísticas generales
2. **Productos** (`/products`) - Gestión de inventario
3. **Ventas** (`/sales`) - Historial de ventas
4. **Clientes** (`/customers`) - Base de datos de clientes
5. **Ubicaciones** (`/locations`) - GPS y coordenadas
6. **Alertas** (`/alerts`) - Sistema de alertas

---

## 📱 ACCESO DESDE MÓVIL

El sistema es responsive. Para acceder desde tu celular:

1. Inicia el backend y frontend
2. En la terminal del frontend, busca la IP de red
3. Abre en tu móvil: `http://TU_IP:5173`

Ejemplo: `http://192.168.1.100:5173`

---

## 💡 TIPS ÚTILES

### Ver logs en tiempo real
Los mensajes de Socket.io aparecen en la consola del backend:
- ✅ Cliente conectado
- 📦 Stock actualizado
- 💰 Nueva venta
- 🔔 Nueva alerta

### Consola del navegador (F12)
Presiona F12 en el navegador para:
- Ver errores de JavaScript
- Inspeccionar peticiones HTTP
- Ver mensajes de Socket.io

### Reiniciar todo
Si algo va mal, reinicia:
```bash
# Detén ambas terminales (Ctrl+C)
# Terminal 1
cd server
npm run dev

# Terminal 2
npm run dev
```

---

## 🎓 ESTRUCTURA RÁPIDA

```
gestion-inventario/
├── server/          👉 Backend (puerto 5000)
├── database/        👉 Scripts SQL
├── src/             👉 Frontend React
└── README.md        👉 Documentación completa
```

---

## 📞 ¿PROBLEMAS?

1. Lee `INSTALACION.md` para guía detallada
2. Revisa `README.md` para troubleshooting
3. Verifica que MySQL esté corriendo
4. Revisa los logs en las terminales

---

## ✨ CARACTERÍSTICAS DESTACADAS A PROBAR

### 1. Actualización en Tiempo Real
- Abre 2 navegadores
- Cambia algo en uno
- 🎉 Se actualiza automáticamente en el otro

### 2. Alertas Automáticas
- Edita un producto y baja su stock a 5 o menos
- 🔔 Se crea una alerta automáticamente
- Ve a "Alertas" para verla

### 3. Búsqueda
- En Productos, busca "laptop"
- En Clientes, busca un nombre
- Búsqueda en tiempo real mientras escribes

### 4. Estadísticas
- Dashboard muestra métricas actualizadas
- Gráfico de ventas de la última semana
- Top productos más vendidos

### 5. CRUD Completo
- Crea, edita y elimina productos
- Crea y gestiona clientes
- Crea ubicaciones con GPS

---

## 🏆 ¡ÉXITO!

Si ves el Dashboard funcionando, **¡lo lograste!** 🎉

Ahora tienes un sistema completo de gestión de inventario con:
- ✅ Backend profesional con API REST
- ✅ Frontend moderno con React
- ✅ Base de datos MySQL optimizada
- ✅ Tiempo real con WebSockets
- ✅ Sistema de alertas automáticas
- ✅ Geolocalización GPS

---

**Tiempo total de inicio: ~5 minutos** ⚡

¿Necesitas más ayuda? Revisa los otros archivos de documentación:
- `README.md` - Documentación completa
- `INSTALACION.md` - Guía detallada paso a paso
- `ESTRUCTURA_PROYECTO.md` - Arquitectura del proyecto
- `RESUMEN_PROYECTO.md` - Resumen de entregables
