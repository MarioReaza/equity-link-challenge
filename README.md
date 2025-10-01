# Equity Link - Fullstack Challenge

Dashboard de gestión de facturas con autenticación y control de permisos.

## Stack Tecnológico
- **Backend**: Laravel 11.x
- **Frontend**: React 18.x + Vite
- **Base de datos**: MySQL 8.0
- **Cache**: Redis
- **Autenticación**: Laravel Sanctum
- **Permisos**: Spatie Laravel Permission
- **Contenedores**: Docker + Laravel Sail

## Características
- ✅ Sistema de autenticación con email/password
- ✅ Control de roles y permisos (Spatie)
- ✅ Gestión de usuarios y asignación de permisos
- ✅ Carga y procesamiento de facturas XML (CFDI)
- ✅ Consulta automática de tipo de cambio DOF
- ✅ Notificaciones con SweetAlert

## Requisitos
- Docker
- Docker Compose
- Git

## Instalación

### 1. Clonar repositorio
```bash
git clone git@github.com:MarioReaza/equity-link-challenge.git
cd equity-link-challenge
2. Configurar Backend (Laravel Sail)
bashcd backend
cp .env.example .env
./vendor/bin/sail up -d
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate
3. Acceder a la aplicación

Backend API: http://localhost
Frontend: http://localhost:5173 (próximamente)

Comandos Útiles
bash# Iniciar contenedores
sail up -d

# Detener contenedores
sail down

# Ver logs
sail logs -f

# Ejecutar migraciones
sail artisan migrate

# Acceder al contenedor
sail shell

# Ejecutar tests
sail test
Estructura del Proyecto
equity-link-challenge/
├── backend/          # Laravel API
└── frontend/         # React App (próximamente)
Desarrollo
Este proyecto se desarrolló siguiendo:

Principios SOLID
Clean Code
Git Flow


Desarrollado por Mario Reaza para Equity Link
