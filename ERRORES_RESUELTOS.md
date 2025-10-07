# 🐛 ERRORES RESUELTOS - Guía de Solución de Problemas

Este documento detalla todos los errores encontrados durante la instalación y configuración del sistema, junto con sus soluciones.

---

## 📋 ÍNDICE DE ERRORES

1. [Error de Procedimientos SQL con XAMPP/MariaDB](#error-1-procedimientos-sql-incompatibles-con-xamppmariadb)
2. [Error de CSS - Clase `border-border` no existe](#error-2-clase-border-border-no-existe)
3. [Error de TailwindCSS - Colores personalizados incompletos](#error-3-colores-personalizados-incompletos)
4. [Error de dependencias del Frontend no instaladas](#error-4-dependencias-del-frontend-no-instaladas)
5. [Error de CORS - Puerto incorrecto](#error-5-error-de-cors-puerto-incorrecto)

---

## ❌ Error 1: Procedimientos SQL incompatibles con XAMPP/MariaDB

### Síntomas:
```sql
MySQL ha dicho: 
#1064 - Algo está equivocado en su sintaxis cerca 'JSON
)
BEGIN
    DECLARE sale_id INT;
```

### Causa:
MariaDB (utilizado por XAMPP) no soporta el tipo de dato `JSON` en procedimientos almacenados de la misma forma que MySQL 8.0+.

### Archivo afectado:
`database/procedures.sql`

### Solución implementada:

**1. Cambió la sintaxis de creación de procedimientos:**

**ANTES:**
```sql
CREATE PROCEDURE IF NOT EXISTS sp_get_low_stock_products()
```

**DESPUÉS:**
```sql
DROP PROCEDURE IF EXISTS sp_get_low_stock_products$$
CREATE PROCEDURE sp_get_low_stock_products()
```

**2. Eliminó el procedimiento `sp_process_sale` que usaba JSON:**

Se removió completamente este procedimiento porque:
- Usaba el tipo `JSON` no soportado por MariaDB
- Las ventas se procesan directamente desde el backend Node.js
- No afecta la funcionalidad del sistema

**3. Corrigió la sintaxis de variables en otros procedimientos:**

**ANTES:**
```sql
SELECT COUNT(*) as total_productos FROM products WHERE status = 'active' INTO @total_productos;
```

**DESPUÉS:**
```sql
SELECT COUNT(*) INTO @total_productos FROM products WHERE status = 'active';
```

### ✅ Verificación:
El archivo `database/procedures.sql` ahora se ejecuta sin errores en phpMyAdmin de XAMPP.

---

## ❌ Error 2: Clase `border-border` no existe

### Síntomas:
```
[postcss] The `border-border` class does not exist. 
If `border-border` is a custom class, make sure it is defined within a `@layer` directive.
```

### Causa:
El archivo `src/styles/globals.css` intentaba aplicar una clase `border-border` que no estaba definida en la configuración de TailwindCSS.

### Archivo afectado:
`src/styles/globals.css` (líneas 8-10)

### Solución implementada:

**ANTES:**
```css
@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-gray-50 text-gray-900 font-sans antialiased;
  }
}
```

**DESPUÉS:**
```css
@layer base {
  body {
    @apply bg-gray-50 text-gray-900 font-sans antialiased;
  }
  
  html {
    scroll-behavior: smooth;
  }
}
```

Se eliminaron las líneas 8-10 que aplicaban la clase inexistente.

### ✅ Verificación:
El frontend inicia sin errores de PostCSS.

---

## ❌ Error 3: Colores personalizados incompletos

### Síntomas:
```
[postcss] The `focus:ring-success-200` class does not exist. 
If `focus:ring-success-200` is a custom class, make sure it is defined within a `@layer` directive.
```

### Causa:
El archivo `tailwind.config.js` definía colores personalizados (`success`, `warning`, `danger`) pero solo con algunos tonos (50, 100, 500, 600, 700), faltaban los tonos intermedios (200, 300, 400, 800, 900) que se usaban en el CSS.

### Archivo afectado:
`tailwind.config.js`

### Solución implementada:

**ANTES:**
```javascript
success: {
  50: '#f0fdf4',
  100: '#dcfce7',
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
},
```

**DESPUÉS:**
```javascript
success: {
  50: '#f0fdf4',
  100: '#dcfce7',
  200: '#bbf7d0',    // ✅ AGREGADO
  300: '#86efac',    // ✅ AGREGADO
  400: '#4ade80',    // ✅ AGREGADO
  500: '#22c55e',
  600: '#16a34a',
  700: '#15803d',
  800: '#166534',    // ✅ AGREGADO
  900: '#14532d',    // ✅ AGREGADO
},
```

Se aplicó la misma corrección para `warning` y `danger`.

### ✅ Verificación:
Todos los estilos de TailwindCSS se compilan correctamente.

---

## ❌ Error 4: Dependencias del Frontend no instaladas

### Síntomas:
```
Failed to resolve import "react-hot-toast" from "src/App.jsx". Does the file exist?
Failed to resolve import "lucide-react" from "src/components/layout/Sidebar.jsx". Does the file exist?
Failed to resolve import "axios" from "src/services/api.js". Does the file exist?
Cannot find module 'tailwindcss'
```

### Causa:
No se ejecutó `npm install` en la carpeta raíz del proyecto (frontend), por lo que las dependencias no estaban instaladas.

### Solución implementada:

**Ejecutar desde la carpeta raíz:**
```bash
npm install --legacy-peer-deps
```

**Nota importante:** Se usó el flag `--legacy-peer-deps` porque había un conflicto menor de versiones entre React 18 y 19.

### Paquetes instalados:
- `react-hot-toast` - Notificaciones
- `lucide-react` - Iconos
- `axios` - Peticiones HTTP
- `socket.io-client` - WebSockets tiempo real
- `tailwindcss` - Framework CSS
- `recharts` - Gráficos
- `clsx` - Utilidad para clases CSS
- `react-router-dom` - Enrutamiento

### ✅ Verificación:
El frontend compila sin errores de módulos faltantes.

---

## ❌ Error 5: Error de CORS - Puerto incorrecto

### Síntomas:
```
Access to XMLHttpRequest at 'http://localhost:5000/api/alerts/active' 
from origin 'http://localhost:5174' has been blocked by CORS policy: 
The 'Access-Control-Allow-Origin' header has a value 'http://localhost:5173' 
that is not equal to the supplied origin.
```

### Causa:
El frontend se estaba ejecutando en el puerto **5174** (porque el 5173 estaba ocupado), pero el backend estaba configurado para aceptar peticiones CORS solo desde **5173**.

### Archivo afectado:
`server/.env`

### Solución implementada:

**ANTES:**
```env
CORS_ORIGIN=http://localhost:5173
```

**DESPUÉS:**
```env
CORS_ORIGIN=http://localhost:5174
```

**Pasos adicionales:**
1. Guardar el archivo `.env`
2. Reiniciar el backend con `Ctrl + C` y luego `npm run dev`
3. Recargar el navegador

### ✅ Verificación:
El frontend puede comunicarse correctamente con el backend sin errores de CORS.

---

## 📊 RESUMEN DE ARCHIVOS MODIFICADOS

| Archivo | Líneas modificadas | Tipo de cambio |
|---------|-------------------|----------------|
| `database/procedures.sql` | Múltiples | Compatibilidad MariaDB |
| `src/styles/globals.css` | 8-10 | Eliminación de código |
| `tailwind.config.js` | 22-57 | Ampliación de paleta |
| `server/.env` | 12 | Cambio de configuración |

---

## 🔧 COMANDOS EJECUTADOS PARA RESOLVER

```bash
# 1. Instalación de dependencias del backend
cd server
npm install

# 2. Instalación de dependencias del frontend (con flag especial)
cd ..
npm install --legacy-peer-deps

# 3. Creación de archivos .env
cd server
copy .env.example .env
cd ..
copy .env.example .env

# 4. Edición manual de archivos
# - server/.env (cambiar CORS_ORIGIN a puerto 5174)
# - server/.env (configurar contraseña MySQL si es necesaria)

# 5. Inicio del sistema
# Terminal 1:
cd server
npm run dev

# Terminal 2:
npm run dev
```

---

## 🎯 LECCIONES APRENDIDAS

### 1. **Compatibilidad de Base de Datos**
- XAMPP usa MariaDB, no MySQL puro
- Verificar tipos de datos soportados antes de crear procedimientos
- MariaDB no soporta `JSON` como tipo de parámetro en procedimientos

### 2. **Configuración de TailwindCSS**
- Siempre definir paletas de colores completas (50-900)
- Las clases personalizadas deben estar en `tailwind.config.js`
- Evitar usar `@apply` con clases no definidas

### 3. **Gestión de Dependencias**
- Usar `--legacy-peer-deps` cuando hay conflictos menores de versiones
- Instalar dependencias tanto en backend como frontend
- Verificar que `node_modules` exista antes de iniciar

### 4. **CORS y Puertos**
- Configurar CORS para el puerto correcto del frontend
- Si Vite cambia de puerto automáticamente, actualizar backend
- Reiniciar servidor después de cambiar variables de entorno

### 5. **Estructura del Proyecto**
- Backend y Frontend tienen instalaciones separadas
- Cada uno necesita su propio `npm install`
- Mantener dos terminales abiertas (una para cada servidor)

---

## ✅ CHECKLIST DE VERIFICACIÓN FINAL

Después de resolver todos los errores, verificar:

- [ ] **Base de datos**
  - [ ] MySQL/XAMPP corriendo
  - [ ] Base de datos `gestion_inventario` creada
  - [ ] 11 tablas creadas correctamente
  - [ ] Datos de prueba insertados (15 productos, 8 clientes, etc.)
  - [ ] 7 procedimientos almacenados funcionando

- [ ] **Backend**
  - [ ] `node_modules` instalado en `server/`
  - [ ] Archivo `server/.env` configurado correctamente
  - [ ] Servidor corriendo en puerto 5000
  - [ ] Mensaje "SERVIDOR INICIADO CORRECTAMENTE" visible
  - [ ] Sin errores de conexión a MySQL

- [ ] **Frontend**
  - [ ] `node_modules` instalado en raíz
  - [ ] Vite corriendo (puerto 5173 o 5174)
  - [ ] Sin errores de compilación
  - [ ] Sin errores de módulos faltantes

- [ ] **Conexión Frontend-Backend**
  - [ ] Sin errores de CORS
  - [ ] Datos cargándose correctamente
  - [ ] Socket.io conectado
  - [ ] Dashboard mostrando estadísticas

---

## 📞 SOLUCIÓN RÁPIDA DE ERRORES COMUNES

### Si el frontend no carga datos:
1. Verificar que el backend esté corriendo
2. Verificar puerto en `server/.env` (CORS_ORIGIN)
3. Abrir consola del navegador (F12) para ver errores

### Si hay errores de MySQL:
1. Verificar que XAMPP esté corriendo
2. Verificar contraseña en `server/.env`
3. Verificar nombre de base de datos

### Si los estilos no se ven:
1. Verificar que TailwindCSS esté instalado
2. Revisar `tailwind.config.js`
3. Limpiar caché: `Ctrl + Shift + R` en el navegador

### Si Socket.io no conecta:
1. Verificar que el backend esté corriendo
2. Verificar que no haya errores de CORS
3. Revisar URL en `src/services/socket.js`

---

## 🏆 ESTADO FINAL

✅ **Sistema funcionando al 100%**

- Backend: http://localhost:5000
- Frontend: http://localhost:5174
- Base de datos: MySQL/XAMPP
- Tiempo real: Socket.io funcionando
- Sin errores en consola
- Todos los módulos cargados correctamente

---

**Fecha de última actualización:** 06 de Octubre, 2025  
**Versión del sistema:** 1.0.0  
**Entorno probado:** Windows 10/11 + XAMPP + Node.js v22.19.0

---

## 📚 RECURSOS ADICIONALES

- [Documentación principal](README.md)
- [Guía de instalación](INSTALACION.md)
- [Inicio rápido](INICIO_RAPIDO.md)
- [Estructura del proyecto](ESTRUCTURA_PROYECTO.md)
- [Resumen del proyecto](RESUMEN_PROYECTO.md)
