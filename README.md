# Equity Link - Fullstack Challenge

Dashboard de gestión de facturas con autenticación y control de permisos basado en roles.

## Stack Tecnológico

**Backend:**
- Laravel 11.x
- MySQL 8.0
- Redis
- Laravel Sanctum (Autenticación)
- Spatie Laravel Permission (Roles y permisos)
- Laravel Sail (Docker)

**Frontend:**
- React 18.x
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- SweetAlert2

## Características

- ✅ Sistema de autenticación con email/password
- ✅ Control de roles y permisos (Spatie)
- ✅ Gestión de usuarios y asignación de permisos
- ✅ Carga y procesamiento de facturas XML (CFDI 4.0)
- ✅ Consulta automática de tipo de cambio del DOF
- ✅ Notificaciones con SweetAlert2
- ✅ UI moderna con Tailwind CSS

## Requisitos Previos

- **Docker** y **Docker Compose** instalados
- **Node.js 20+** y **npm**
- **Git**

### Instalación de Requisitos

**Ubuntu/Debian:**
```bash
# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Node.js 20 (usando nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
macOS:
bash# Instalar Docker Desktop desde: https://www.docker.com/products/docker-desktop

# Node.js
brew install node@20

Instalación Rápida
Opción 1: Setup Automático (Recomendado)
bash# Clonar repositorio
git clone git@github.com:MarioReaza/equity-link-challenge.git
cd equity-link-challenge

# Ejecutar script de setup (instala todo)
./setup.sh
El script automáticamente:

Configura el backend (Laravel + Docker)
Instala dependencias
Ejecuta migraciones y seeders
Configura el frontend (React)

Opción 2: Setup Manual
<details>
<summary>Click para ver instrucciones manuales</summary>
Backend
bashcd backend

# Copiar archivo de configuración
cp .env.example .env

# Iniciar contenedores Docker
./vendor/bin/sail up -d

# Generar application key
./vendor/bin/sail artisan key:generate

# Ejecutar migraciones
./vendor/bin/sail artisan migrate

# Ejecutar seeders (crea usuarios de prueba)
./vendor/bin/sail artisan db:seed
Frontend
bashcd frontend

# Instalar dependencias
npm install
</details>

Uso
Iniciar la Aplicación
Opción rápida:
bash./start.sh
O manualmente:
Terminal 1 (Backend):
bashcd backend
./vendor/bin/sail up
Terminal 2 (Frontend):
bashcd frontend
npm run dev
Acceder a la Aplicación

Frontend: http://localhost:5173
Backend API: http://localhost

Usuarios de Prueba
EmailPasswordRolPermisosadmin@equitylink.compasswordAdminTodostest@equitylink.compasswordUserview-invoices, upload-invoices

Funcionalidades por Rol
Admin

Ver facturas
Cargar facturas XML
Gestionar usuarios
Asignar permisos

User

Ver facturas
Cargar facturas XML


Cargar Facturas

Inicia sesión en la aplicación
Ve a la sección "Facturas" en el menú lateral
Clic en "Cargar Factura XML"
Selecciona un archivo XML CFDI 4.0

La aplicación automáticamente:

Extrae UUID, Folio, Emisor, Receptor, Moneda, Total
Consulta el tipo de cambio del día (DOF/Banxico)
Almacena la factura en la base de datos
Muestra la factura en la tabla

Archivos XML de Prueba
Hay un archivo de ejemplo en: Ejemplos facturas/ejepmlo1.xml
O descarga ejemplos del SAT: https://www.sat.gob.mx/consulta/16703/conoce-las-caracteristicas-de-la-factura-electronica-cfdi-version-4.0

Scripts Útiles
bash# Setup completo
./setup.sh

# Iniciar aplicación
./start.sh

# Resetear base de datos (elimina todos los datos)
./reset.sh
Comandos de Backend
bashcd backend

# Ver logs
./vendor/bin/sail logs -f

# Ejecutar migraciones
./vendor/bin/sail artisan migrate

# Resetear base de datos
./vendor/bin/sail artisan migrate:fresh --seed

# Limpiar caché
./vendor/bin/sail artisan optimize:clear

# Ver rutas disponibles
./vendor/bin/sail artisan route:list

# Detener contenedores
./vendor/bin/sail down
Comandos de Frontend
bashcd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

Troubleshooting
Puerto 80 ocupado
Si el puerto 80 está en uso, edita backend/docker-compose.yml:
yamlports:
    - '${APP_PORT:-8080}:80'  # Cambiar a puerto 8080
Luego la API estará en http://localhost:8080
Puerto 5173 ocupado
Vite asignará automáticamente el siguiente puerto disponible (5174, 5175, etc.)
Error: "permission denied" al ejecutar scripts
bashchmod +x setup.sh start.sh reset.sh
MySQL no inicia correctamente
bashcd backend
./vendor/bin/sail down -v  # Elimina volúmenes
./vendor/bin/sail up -d
Frontend no se conecta al backend
Verifica que CORS esté configurado correctamente en backend/config/cors.php:
php'allowed_origins' => ['http://localhost:5173', 'http://localhost:5174'],

Estructura del Proyecto
equity-link-challenge/
├── backend/              # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
├── frontend/             # React App
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── services/
│   └── public/
├── setup.sh             # Script de instalación automática
├── start.sh             # Script de inicio rápido
└── reset.sh             # Script de reset de BD

Principios de Desarrollo
Este proyecto fue desarrollado siguiendo:

Principios SOLID
Clean Code
Conventional Commits
Git Flow


API Endpoints
Autenticación

POST /api/login - Login
POST /api/register - Registro
POST /api/logout - Logout (requiere auth)
GET /api/user - Usuario actual (requiere auth)

Facturas

GET /api/invoices - Listar facturas (requiere: view-invoices)
POST /api/invoices - Subir factura XML (requiere: upload-invoices)
DELETE /api/invoices/{id} - Eliminar factura

Usuarios (Admin)

GET /api/users - Listar usuarios (requiere: manage-users)
POST /api/users - Crear usuario (requiere: manage-users)
PUT /api/users/{id} - Actualizar usuario (requiere: manage-users)
DELETE /api/users/{id} - Eliminar usuario (requiere: manage-users)
POST /api/users/{id}/permissions - Asignar permisos (requiere: manage-users)
POST /api/users/{id}/role - Asignar rol (requiere: manage-users)


Licencia
Este proyecto fue desarrollado como parte de un challenge técnico para Equity Link.

Contacto
Desarrollado por Mario Reaza
