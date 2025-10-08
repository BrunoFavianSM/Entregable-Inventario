# 🏥 GUÍA DE INSTALACIÓN - BOTICA NOVA SALUD

## 📋 Resumen del Sistema

Este sistema ha sido específicamente adaptado para la **Botica Nova Salud**, cumpliendo con todos los requerimientos farmacéuticos y regulatorios del sector salud en Perú.

### 🎯 Características Principales Implementadas

✅ **Gestión de Medicamentos** con fechas de vencimiento y lotes  
✅ **Control de Recetas Médicas** y dispensación  
✅ **Alertas Automáticas** de vencimiento y stock crítico  
✅ **Sustancias Controladas** con seguimiento especial  
✅ **Interfaz Optimizada** para atención rápida al cliente  
✅ **Cumplimiento Regulatorio** DIGEMID  

---

## ⚡ INSTALACIÓN RÁPIDA (15 minutos)

### 1️⃣ **Verificar Requisitos**

```bash
# Verificar Node.js (requerido v22.19.0+)
node --version

# Verificar MySQL (requerido v8.0+)
mysql --version

# Verificar npm
npm --version
```

### 2️⃣ **Configurar Base de Datos**

```sql
-- Crear base de datos Nova Salud
CREATE DATABASE nova_salud_inventario CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nova_salud_inventario;
```

```bash
# Ejecutar scripts en orden
mysql -u root -p nova_salud_inventario < database/schema.sql
mysql -u root -p nova_salud_inventario < database/seeds.sql
mysql -u root -p nova_salud_inventario < database/procedures.sql
```

### 3️⃣ **Instalar Dependencias**

```bash
# Backend
cd server
npm install

# Frontend
cd ..
npm install
```

### 4️⃣ **Configurar Variables de Entorno**

**Archivo: `server/.env`**
```env
PORT=5000
NODE_ENV=development

# Base de Datos Nova Salud
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=nova_salud_inventario

CORS_ORIGIN=http://localhost:5173
SOCKET_IO_PORT=5000
```

**Archivo: `.env` (raíz)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 5️⃣ **Ejecutar el Sistema**

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

**🌐 Acceder en:** `http://localhost:5173`

---

## 🏥 CARACTERÍSTICAS FARMACÉUTICAS IMPLEMENTADAS

### 📊 **Dashboard Nova Salud**
- Métricas específicas para farmacia
- Alertas de medicamentos vencidos
- Stock crítico de medicamentos esenciales
- Estadísticas de dispensación

### 💊 **Gestión de Medicamentos**
- **Información Farmacéutica Completa:**
  - Principio activo y concentración
  - Forma farmacéutica (tabletas, cápsulas, jarabes)
  - Fecha de vencimiento y número de lote
  - Fabricante y registro sanitario
  - Contraindicaciones y dosificación

### 📋 **Control de Recetas**
- Registro de prescripciones médicas
- Validación de médicos y licencias
- Control de dispensación parcial/total
- Alertas de recetas próximas a vencer

### 🚨 **Sistema de Alertas Inteligente**
- **Vencimiento:** 30, 7 y 0 días antes
- **Stock Crítico:** Prioridad para medicamentos con receta
- **Sustancias Controladas:** Seguimiento especial
- **Medicamentos Vencidos:** Alerta urgente de retiro

### 🏪 **Gestión de Sucursales**
- Múltiples puntos de venta Nova Salud
- Coordenadas GPS para cada sucursal
- Distribución de stock entre sucursales

---

## 📝 DATOS DE PRUEBA INCLUIDOS

### 💊 **Medicamentos (13 productos)**
- **Analgésicos:** Paracetamol, Ibuprofeno, Aspirina
- **Antibióticos:** Amoxicilina, Azitromicina
- **Vitaminas:** Vitamina C, Complejo B
- **Cuidado Personal:** Alcohol gel, Mascarillas
- **Primeros Auxilios:** Gasas, Suero fisiológico
- **Controlados:** Tramadol, Lorazepam

### 🏥 **Sucursales Nova Salud**
- Sede Principal (24 horas)
- Sucursal Miraflores
- Sucursal San Isidro
- Almacén Farmacéutico Central

### 📋 **Recetas de Ejemplo**
- Infección respiratoria (Amoxicilina + Ibuprofeno)
- Hipertensión arterial (Enalapril + Aspirina)
- Dolor crónico (Tramadol - controlado)

---

## ✅ PASO 6: Verificar que Todo Funciona

### 6.1 Verificar Dashboard Farmacéutico

1. Abre http://localhost:5173
2. Deberías ver:
   - 4 tarjetas con estadísticas farmacéuticas
   - Gráfico de ventas de medicamentos
   - Lista de alertas de vencimiento

### 6.2 Verificar Medicamentos

1. Click en "Medicamentos" en el menú lateral
2. Deberías ver 13 medicamentos farmacéuticos con información completa
3. Intenta buscar "Paracetamol"
4. Verifica que muestre: principio activo, concentración, fecha de vencimiento

### 6.3 Verificar Recetas Médicas

1. Click en "Recetas" en el menú lateral
2. Deberías ver 3 recetas médicas de ejemplo
3. Intenta crear una nueva receta:
   - Paciente: "Test Paciente"
   - Médico: "Dr. Test"
   - CMP: "CMP-99999"
   - Diagnóstico: "Prueba del sistema"
   - Medicamento: "Paracetamol 500mg"

### 6.4 Verificar Tiempo Real

1. Mantén abierta la página del Dashboard
2. En otra pestaña, ve a Medicamentos
3. Edita un medicamento
4. 🎉 Observa que el Dashboard se actualiza automáticamente

### 6.5 Verificar Sucursales Nova Salud

1. Click en "Sucursales"
2. Deberías ver 4 sucursales con coordenadas GPS:
   - Sede Principal (24 horas)
   - Sucursal Miraflores
   - Sucursal San Isidro
   - Almacén Farmacéutico Central

### 6.6 Verificar Alertas Farmacéuticas

1. Click en "Alertas"
2. Deberías ver alertas de:
   - Medicamentos próximos a vencer
   - Stock crítico de medicamentos
   - Sustancias controladas

---

## 📝 COMANDOS RÁPIDOS DE REFERENCIA

### Iniciar Backend
```bash
cd server
npm run dev
```

**Salida esperada:**
```
✅ Conexión exitosa a MySQL
╔═══════════════════════════════════════════════════════════╗
║   🚀 SERVIDOR INICIADO CORRECTAMENTE                     ║
║   📡 API REST:        http://localhost:5000              ║
║   🔌 Socket.io:       ws://localhost:5000               ║
║   🗄️  Base de Datos:  MySQL (nova_salud_inventario)    ║
╚═══════════════════════════════════════════════════════════╝
```

### Iniciar Frontend
```bash
npm run dev
```

**Salida esperada:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Ver logs en tiempo real
Los mensajes de Socket.io aparecerán en la consola del backend:
- ✅ Cliente conectado
- 💊 Medicamento actualizado
- 📋 Nueva receta creada
- 💰 Nueva venta
- 🔔 Nueva alerta farmacéutica

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

## 🔧 CONFIGURACIÓN AVANZADA

### ⚙️ **Configuración del Sistema**

El sistema incluye configuraciones específicas para Nova Salud:

```sql
-- Configuraciones automáticas incluidas
INSERT INTO system_config VALUES
('company_name', 'Botica Nova Salud'),
('pharmacy_license', 'DIGEMID-12345'),
('pharmacist_name', 'Q.F. Ana María Rodríguez'),
('business_hours', '08:00-22:00'),
('expiration_alert_days', '30'),
('controlled_substance_tracking', 'true');
```

### 📊 **Personalización de Alertas**

```sql
-- Modificar días de alerta de vencimiento
UPDATE system_config 
SET config_value = '45' 
WHERE config_key = 'expiration_alert_days';

-- Habilitar/deshabilitar seguimiento de controlados
UPDATE system_config 
SET config_value = 'true' 
WHERE config_key = 'controlled_substance_tracking';
```

---

## 🚀 FUNCIONALIDADES CLAVE

### 1. **Dispensación Inteligente**
- Validación automática de recetas
- Control de fechas de vencimiento
- Verificación de stock disponible
- Registro de dispensación parcial

### 2. **Alertas Proactivas**
- Medicamentos próximos a vencer
- Stock crítico de medicamentos esenciales
- Sustancias controladas sin movimiento
- Recetas médicas por vencer

### 3. **Cumplimiento Regulatorio**
- Trazabilidad completa de lotes
- Registro de sustancias controladas
- Información farmacéutica completa
- Reportes para auditorías DIGEMID

### 4. **Optimización de Atención**
- Búsqueda rápida de medicamentos
- Interfaz simplificada para farmacéuticos
- Dispensación con un clic
- Historial de pacientes

---

## 🎓 CONSEJOS ADICIONALES

### Desarrollo Eficiente

1. **Usa dos monitores**: Un monitor para el código y otro para el navegador
2. **Mantén las terminales abiertas**: Una para backend, otra para frontend
3. **Usa la consola del navegador**: Presiona F12 para ver errores en tiempo real
4. **Revisa los logs del servidor**: Todos los eventos farmacéuticos aparecen en la terminal del backend

### Probar Funcionalidades Farmacéuticas

1. **Vencimiento**: Algunos medicamentos tienen fechas de vencimiento cercanas para probar alertas
2. **Recetas**: Crea recetas y prueba la dispensación parcial y total
3. **Tiempo Real**: Abre dos navegadores y haz cambios en uno para verlos en el otro
4. **Sustancias Controladas**: Tramadol y Lorazepam están marcados como controlados
5. **Alertas Automáticas**: Edita un medicamento y baja su stock para ver alertas automáticas

### Acceso desde Móvil

El sistema es responsive. Para acceder desde tu celular:

1. Inicia el backend y frontend
2. En la terminal del frontend, busca la IP de red
3. Abre en tu móvil: `http://TU_IP:5173`

Ejemplo: `http://192.168.1.100:5173`

---

## 🛠️ SOLUCIÓN DE PROBLEMAS ESPECÍFICOS

### ❌ **Error: Medicamento sin fecha de vencimiento**
```sql
-- Actualizar medicamentos sin fecha
UPDATE products 
SET expiration_date = DATE_ADD(CURDATE(), INTERVAL 2 YEAR) 
WHERE expiration_date IS NULL;
```

### ❌ **Error: Receta sin validar**
```javascript
// Validar receta antes de dispensar
if (!prescription.doctor_license || !prescription.expiration_date) {
  throw new Error('Receta médica incompleta');
}
```

### ❌ **Alertas no se generan automáticamente**
```sql
-- Verificar triggers activos
SHOW TRIGGERS LIKE 'after_product%';

-- Regenerar alertas manualmente
CALL generate_expiration_alerts();
```

---

## 📞 SOPORTE NOVA SALUD

### 🆘 **Contacto Técnico**
- **Email:** soporte@novasalud.com
- **Teléfono:** (01) 234-5678
- **WhatsApp:** +51 987-654-321
- **Horario:** Lunes a Domingo 8:00 - 22:00

### 📚 **Recursos Adicionales**
- Manual de Usuario Farmacéutico
- Guía de Cumplimiento DIGEMID
- Videos de Capacitación
- FAQ Farmacéutico

---

## ✅ **CHECKLIST DE VERIFICACIÓN**

Antes de poner en producción, verificar:

- [ ] Base de datos `nova_salud_inventario` creada
- [ ] Todos los medicamentos tienen fecha de vencimiento
- [ ] Alertas de vencimiento funcionando
- [ ] Recetas médicas se pueden crear y dispensar
- [ ] Sustancias controladas marcadas correctamente
- [ ] Información del farmacéutico responsable actualizada
- [ ] Licencia DIGEMID configurada
- [ ] Horarios de atención configurados
- [ ] Sucursales con coordenadas GPS
- [ ] Proveedores farmacéuticos registrados

---

🏥 **¡Sistema Nova Salud listo para mejorar la atención farmacéutica!** 🏥

*Comprometidos con la salud y el bienestar de nuestros clientes*
