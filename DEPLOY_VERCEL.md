# Guía de Despliegue en Vercel - Sistema Nova Salud

## Consideraciones Importantes

### ¿Qué se puede desplegar en Vercel?

**SÍ se puede desplegar:**
- ✅ Frontend (React + Vite)

**NO se puede desplegar directamente en Vercel:**
- ❌ Backend (Node.js + Express)
- ❌ Base de datos MySQL

### Arquitectura de Despliegue Recomendada

Para un despliegue completo del sistema, necesitarás:

1. **Frontend en Vercel** (Gratis)
2. **Backend en Railway/Render/Heroku** (Gratis con limitaciones)
3. **Base de datos MySQL en Railway/PlanetScale** (Gratis con limitaciones)

---

## Opción 1: Desplegar Solo el Frontend (Demo)

Esta opción es útil para mostrar la interfaz, pero no funcionará completamente sin el backend.

### Paso 1: Preparar el Proyecto

1. **Crear archivo de configuración para Vercel**

Crea un archivo `vercel.json` en la raíz del proyecto:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

2. **Modificar package.json**

Asegúrate de que tu `package.json` tenga el script de build:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Paso 2: Crear Cuenta en Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Regístrate con GitHub, GitLab o email

### Paso 3: Subir el Proyecto a GitHub

**Opción A: Desde la terminal**

```bash
# Inicializar repositorio Git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Proyecto Nova Salud - Sistema de Inventario Farmacéutico"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/TU_USUARIO/nova-salud-inventario.git
git branch -M main
git push -u origin main
```

**Opción B: Desde GitHub Desktop**

1. Descarga GitHub Desktop: https://desktop.github.com/
2. Abre GitHub Desktop
3. File → Add Local Repository
4. Selecciona la carpeta del proyecto
5. Publish repository

### Paso 4: Desplegar en Vercel

1. **Inicia sesión en Vercel**
   - Ve a [https://vercel.com/dashboard](https://vercel.com/dashboard)

2. **Importar Proyecto**
   - Clic en "Add New..." → "Project"
   - Selecciona "Import Git Repository"
   - Autoriza a Vercel para acceder a tu GitHub
   - Selecciona el repositorio `nova-salud-inventario`

3. **Configurar el Proyecto**
   ```
   Project Name: nova-salud-inventario
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Variables de Entorno**
   
   En la sección "Environment Variables", agrega:
   
   ```
   VITE_API_URL = https://tu-backend-url.com/api
   VITE_SOCKET_URL = https://tu-backend-url.com
   ```
   
   **NOTA:** Por ahora, si no tienes backend desplegado, puedes dejarlo vacío o usar URLs de prueba.

5. **Deploy**
   - Clic en "Deploy"
   - Espera 2-3 minutos
   - ¡Listo! Tu frontend estará en: `https://nova-salud-inventario.vercel.app`

---

## Opción 2: Despliegue Completo (Frontend + Backend + Base de Datos)

### Arquitectura Completa

```
┌─────────────────┐
│   Vercel        │  ← Frontend (React)
│   (Frontend)    │
└────────┬────────┘
         │
         │ API Calls
         ↓
┌─────────────────┐
│   Railway       │  ← Backend (Node.js + Express)
│   (Backend)     │
└────────┬────────┘
         │
         │ SQL Queries
         ↓
┌─────────────────┐
│   Railway       │  ← Base de Datos (MySQL)
│   (Database)    │
└─────────────────┘
```

### Paso 1: Desplegar Base de Datos en Railway

1. **Crear cuenta en Railway**
   - Ve a [https://railway.app](https://railway.app)
   - Sign up con GitHub

2. **Crear nuevo proyecto**
   - Clic en "New Project"
   - Selecciona "Provision MySQL"
   - Espera a que se cree

3. **Obtener credenciales**
   - Clic en el servicio MySQL
   - Ve a "Connect"
   - Copia las credenciales:
     ```
     MYSQL_HOST
     MYSQL_PORT
     MYSQL_USER
     MYSQL_PASSWORD
     MYSQL_DATABASE
     ```

4. **Importar datos**
   
   Opción A - Desde tu computadora:
   ```bash
   mysql -h MYSQL_HOST -P MYSQL_PORT -u MYSQL_USER -p MYSQL_DATABASE < database/schema.sql
   mysql -h MYSQL_HOST -P MYSQL_PORT -u MYSQL_USER -p MYSQL_DATABASE < database/seeds.sql
   mysql -h MYSQL_HOST -P MYSQL_PORT -u MYSQL_USER -p MYSQL_DATABASE < database/procedures.sql
   ```
   
   Opción B - Desde Railway:
   - Usa la consola de Railway para ejecutar los scripts SQL

### Paso 2: Desplegar Backend en Railway

1. **Preparar el Backend**
   
   Crea un archivo `Procfile` en la carpeta `server/`:
   ```
   web: node server.js
   ```

2. **Modificar server/package.json**
   
   Agrega el script de start:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

3. **Subir Backend a GitHub**
   
   Puedes crear un repositorio separado solo para el backend o usar el mismo.

4. **Crear servicio en Railway**
   - En tu proyecto de Railway, clic en "New"
   - Selecciona "GitHub Repo"
   - Selecciona tu repositorio
   - Root Directory: `server` (si está en subcarpeta)

5. **Configurar Variables de Entorno**
   
   En Railway, agrega estas variables:
   ```
   PORT=5000
   NODE_ENV=production
   DB_HOST=[MYSQL_HOST de Railway]
   DB_PORT=[MYSQL_PORT de Railway]
   DB_USER=[MYSQL_USER de Railway]
   DB_PASSWORD=[MYSQL_PASSWORD de Railway]
   DB_NAME=[MYSQL_DATABASE de Railway]
   CORS_ORIGIN=https://nova-salud-inventario.vercel.app
   ```

6. **Deploy**
   - Railway desplegará automáticamente
   - Obtendrás una URL como: `https://tu-backend.up.railway.app`

### Paso 3: Conectar Frontend con Backend

1. **Actualizar Variables de Entorno en Vercel**
   
   Ve a tu proyecto en Vercel:
   - Settings → Environment Variables
   - Actualiza:
     ```
     VITE_API_URL = https://tu-backend.up.railway.app/api
     VITE_SOCKET_URL = https://tu-backend.up.railway.app
     ```

2. **Redeploy**
   - Ve a Deployments
   - Clic en los tres puntos del último deployment
   - "Redeploy"

---

## Opción 3: Alternativas Gratuitas

### Backend Alternativo: Render.com

**Ventajas:**
- 750 horas gratis al mes
- Fácil de usar
- Soporta Node.js

**Pasos:**
1. Ve a [https://render.com](https://render.com)
2. Sign up con GitHub
3. New → Web Service
4. Conecta tu repositorio
5. Configura:
   ```
   Build Command: cd server && npm install
   Start Command: cd server && npm start
   ```

### Base de Datos Alternativa: PlanetScale

**Ventajas:**
- MySQL compatible
- 5GB gratis
- Fácil de usar

**Pasos:**
1. Ve a [https://planetscale.com](https://planetscale.com)
2. Crea cuenta
3. New Database
4. Obtén credenciales de conexión

---

## Limitaciones de la Versión Gratuita

### Railway (Gratis)
- $5 de crédito mensual
- Suficiente para proyectos pequeños
- Se suspende si excedes el crédito

### Vercel (Gratis)
- 100GB de ancho de banda
- Builds ilimitados
- Perfecto para frontend

### Render (Gratis)
- 750 horas/mes
- Se duerme después de 15 min de inactividad
- Tarda ~30 segundos en despertar

---

## Checklist de Despliegue

### Antes de Desplegar

- [ ] Código subido a GitHub
- [ ] Variables de entorno configuradas
- [ ] Scripts de base de datos listos
- [ ] CORS configurado correctamente
- [ ] URLs de producción actualizadas

### Después de Desplegar

- [ ] Frontend accesible
- [ ] Backend responde a peticiones
- [ ] Base de datos conectada
- [ ] Socket.io funcionando
- [ ] Todas las funcionalidades probadas

---

## Solución de Problemas

### Error: "Failed to fetch"

**Causa:** El frontend no puede conectarse al backend

**Solución:**
1. Verifica que `VITE_API_URL` esté correcta
2. Verifica que el backend esté corriendo
3. Revisa la configuración de CORS en el backend

### Error: "Database connection failed"

**Causa:** El backend no puede conectarse a la base de datos

**Solución:**
1. Verifica las credenciales de la base de datos
2. Asegúrate de que la base de datos esté corriendo
3. Revisa que el host y puerto sean correctos

### Error: "Build failed"

**Causa:** Error durante el build del proyecto

**Solución:**
1. Revisa los logs de Vercel/Railway
2. Asegúrate de que todas las dependencias estén en `package.json`
3. Verifica que el comando de build sea correcto

---

## Recomendación Final

Para un proyecto de producción real, te recomiendo:

1. **Frontend:** Vercel (Gratis y rápido)
2. **Backend:** Railway o Render (Gratis con limitaciones)
3. **Base de Datos:** Railway MySQL o PlanetScale (Gratis con limitaciones)

**Costo total:** $0/mes para empezar

**Cuando crezcas:**
- Railway Pro: $5/mes
- PlanetScale Scaler: $29/mes
- Vercel Pro: $20/mes

---

## Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Railway](https://docs.railway.app)
- [Documentación de Render](https://render.com/docs)
- [Documentación de PlanetScale](https://planetscale.com/docs)

---

**Nota:** Este proyecto fue diseñado para correr localmente. El despliegue en producción requiere configuraciones adicionales de seguridad, optimización y monitoreo que no están cubiertas en esta guía básica.
