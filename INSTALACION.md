# 📦 GUÍA COMPLETA DE INSTALACIÓN

Esta guía te llevará paso a paso a través del proceso de instalación del Sistema de Gestión de Inventario.

## ⏱️ Tiempo estimado: 15-20 minutos

---

## 🎯 PASO 1: Verificar Requisitos Previos

### 1.1 Verificar Node.js y npm

Abre PowerShell o CMD y ejecuta:

```bash
node --version
```
**Resultado esperado**: `v22.19.0` o superior

```bash
npm --version
```
**Resultado esperado**: `10.9.3` o superior

### 1.2 Verificar MySQL

```bash
mysql --version
```
**Resultado esperado**: MySQL 8.0 o superior

Si no tienes alguno instalado:
- **Node.js**: Descarga desde https://nodejs.org/
- **MySQL**: Descarga desde https://dev.mysql.com/downloads/mysql/

---

## 🗄️ PASO 2: Configurar Base de Datos

### 2.1 Iniciar MySQL

Asegúrate de que el servicio MySQL esté ejecutándose:

**Windows**:
```bash
# Verificar si MySQL está corriendo
sc query MySQL80

# Si no está corriendo, iniciarlo
net start MySQL80
```

### 2.2 Crear la Base de Datos

Opción A - **MySQL Workbench** (Recomendado):

1. Abre MySQL Workbench
2. Conéctate a tu servidor local (localhost:3306)
3. Abre el archivo `database/schema.sql`
4. Presiona el botón ⚡ "Execute" o presiona `Ctrl+Shift+Enter`
5. Repite con `database/seeds.sql`
6. Repite con `database/procedures.sql`

Opción B - **Línea de Comandos**:

```bash
# Navegar a la carpeta del proyecto
cd "c:/Users/Admin/OneDrive - SENATI/Documentos/Entregable Full stack/gestion-inventario"

# Ejecutar scripts (ingresa tu contraseña cuando te lo pida)
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seeds.sql
mysql -u root -p < database/procedures.sql
```

### 2.3 Verificar la Instalación

```sql
-- Abrir MySQL y ejecutar:
USE gestion_inventario;
SHOW TABLES;
```

Deberías ver 11 tablas:
- categories
- products
- customers
- sales
- sale_details
- stock_alerts
- stock_movements
- locations
- product_locations
- suppliers
- system_config

---

## 🔧 PASO 3: Instalar Dependencias del Backend

### 3.1 Navegar a la carpeta del servidor

```bash
cd server
```

### 3.2 Instalar paquetes de Node.js

```bash
npm install
```

Esto instalará:
- express
- mysql2
- socket.io
- dotenv
- cors
- y otras dependencias...

**Tiempo estimado**: 2-3 minutos

### 3.3 Configurar Variables de Entorno

Crear archivo `.env` en la carpeta `server/`:

```bash
# Windows
copy .env.example .env

# O créalo manualmente con este contenido:
```

**Contenido del archivo `server/.env`**:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_CONTRASEÑA_MYSQL_AQUI
DB_NAME=gestion_inventario

CORS_ORIGIN=http://localhost:5173
SOCKET_IO_PORT=5000
```

⚠️ **IMPORTANTE**: Reemplaza `TU_CONTRASEÑA_MYSQL_AQUI` con tu contraseña real de MySQL.

---

## ⚛️ PASO 4: Instalar Dependencias del Frontend

### 4.1 Regresar a la raíz del proyecto

```bash
cd ..
```

### 4.2 Instalar paquetes de Node.js

```bash
npm install
```

Esto instalará:
- react
- react-router-dom
- axios
- socket.io-client
- tailwindcss
- lucide-react
- recharts
- y otras dependencias...

**Tiempo estimado**: 3-4 minutos

### 4.3 Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
# Windows
copy .env.example .env

# O créalo manualmente
```

**Contenido del archivo `.env` (raíz)**:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚀 PASO 5: Ejecutar la Aplicación

### 5.1 Abrir DOS terminales

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
```

Deberías ver:
```
✅ Conexión exitosa a MySQL
╔═══════════════════════════════════════════════════════════╗
║   🚀 SERVIDOR INICIADO CORRECTAMENTE                     ║
║   📡 API REST:        http://localhost:5000              ║
║   🔌 Socket.io:       ws://localhost:5000               ║
╚═══════════════════════════════════════════════════════════╝
```

**Terminal 2 - Frontend**:
```bash
# Desde la raíz del proyecto
npm run dev
```

Deberías ver:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5.2 Acceder a la Aplicación

Abre tu navegador en: **http://localhost:5173**

---

## ✅ PASO 6: Verificar que Todo Funciona

### 6.1 Verificar Dashboard

1. Abre http://localhost:5173
2. Deberías ver:
   - 4 tarjetas con estadísticas
   - Gráfico de ventas de la semana
   - Lista de alertas recientes

### 6.2 Verificar Productos

1. Click en "Productos" en el menú lateral
2. Deberías ver 15 productos con imágenes
3. Intenta buscar un producto

### 6.3 Verificar Tiempo Real

1. Mantén abierta la página del Dashboard
2. En otra pestaña, ve a Productos
3. Crea o edita un producto
4. Observa que el Dashboard se actualiza automáticamente

### 6.4 Verificar Ubicaciones (Coordenadas)

1. Click en "Ubicaciones"
2. Deberías ver 6 ubicaciones con coordenadas GPS
3. Intenta crear una nueva ubicación con coordenadas de Lima:
   - Latitud: -12.046374
   - Longitud: -77.042793

---

## 📝 COMANDOS RÁPIDOS DE REFERENCIA

### Iniciar Backend
```bash
cd server
npm run dev
```

### Iniciar Frontend
```bash
npm run dev
```

### Ver logs en tiempo real
Los mensajes de Socket.io aparecerán en la consola del backend:
- ✅ Cliente conectado
- 📦 Stock actualizado
- 💰 Nueva venta
- 🔔 Nueva alerta

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

### ❌ Error: "Cannot find module 'express'"

**Solución**:
```bash
cd server
npm install
```

### ❌ Error: "Access denied for user 'root'@'localhost'"

**Solución**:
1. Verifica la contraseña en `server/.env`
2. Asegúrate de que MySQL esté corriendo
3. Intenta conectarte manualmente: `mysql -u root -p`

### ❌ Error: "Port 5000 is already in use"

**Solución**:
```bash
# Windows - Encontrar el proceso
netstat -ano | findstr :5000

# Matar el proceso (reemplaza PID con el número que apareció)
taskkill /PID <PID> /F
```

### ❌ Error: "Cannot GET /api/products"

**Solución**:
1. Asegúrate de que el backend esté corriendo
2. Verifica que `VITE_API_URL` en `.env` sea correcto
3. Abre http://localhost:5000 en el navegador para verificar

### ❌ Página en blanco o error 404

**Solución**:
```bash
# Limpiar caché y reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### ❌ Socket.io no conecta

**Solución**:
1. Verifica que el backend esté corriendo en el puerto 5000
2. Abre la consola del navegador (F12) y busca errores de WebSocket
3. Verifica `VITE_SOCKET_URL` en `.env`

---

## 🎓 CONSEJOS ADICIONALES

### Desarrollo Eficiente

1. **Usa dos monitores**: Un monitor para el código y otro para el navegador
2. **Mantén las terminales abiertas**: Una para backend, otra para frontend
3. **Usa la consola del navegador**: Presiona F12 para ver errores en tiempo real
4. **Revisa los logs del servidor**: Todos los eventos aparecen en la terminal del backend

### Datos de Prueba

El sistema viene con datos de ejemplo:
- **Productos**: 15 productos en diferentes categorías
- **Clientes**: 8 clientes con diferentes tipos
- **Ubicaciones**: 6 ubicaciones en Lima con coordenadas GPS reales
- **Ventas**: 5 ventas de ejemplo

### Probar Funcionalidades

1. **Stock bajo**: El producto "Auriculares Sony" tiene solo 3 unidades (stock bajo)
2. **Alertas**: Se crean automáticamente cuando el stock es bajo
3. **Tiempo Real**: Abre dos navegadores y haz cambios en uno para verlos en el otro
4. **Geolocalización**: Todas las ubicaciones tienen coordenadas GPS de Lima real

---

## 📞 ¿NECESITAS AYUDA?

Si sigues teniendo problemas después de seguir esta guía:

1. **Revisa los logs**: Los errores aparecen en las terminales
2. **Verifica versiones**: Asegúrate de tener las versiones correctas de Node.js y MySQL
3. **Revisa la documentación**: Consulta `README.md` para más detalles
4. **Base de datos**: Verifica que todas las tablas se crearon correctamente

---

## ✨ ¡LISTO!

Si llegaste hasta aquí y todo funciona, ¡felicitaciones! 🎉

Ahora tienes un sistema completo de gestión de inventario con:
- ✅ Backend funcional con API REST
- ✅ Frontend moderno con React
- ✅ Base de datos MySQL configurada
- ✅ Actualizaciones en tiempo real con Socket.io
- ✅ Sistema de alertas automáticas
- ✅ Geolocalización con coordenadas GPS

**¡Disfruta tu sistema de gestión de inventario!** 🚀
