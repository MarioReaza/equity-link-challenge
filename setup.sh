#!/bin/bash

set -e  # Exit on error

echo "==================================="
echo "Equity Link - Setup Script"
echo "==================================="
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "Error: Docker no está instalado"
    echo "Por favor instala Docker desde: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check Docker Compose
if ! docker compose version &> /dev/null; then
    echo "Error: Docker Compose no está instalado"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "Error: Node.js no está instalado"
    echo "Por favor instala Node.js 20+ desde: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "Error: Node.js version 20+ requerida (actual: $(node -v))"
    exit 1
fi

echo "✓ Docker y Node.js instalados"
echo ""

# Backend Setup
echo ">>> Configurando Backend (Laravel)..."
cd backend

if [ ! -f .env ]; then
    echo "Copiando .env.example a .env..."
    cp .env.example .env
fi

echo "Iniciando contenedores Docker..."
./vendor/bin/sail up -d

echo "Esperando a que MySQL esté listo..."
sleep 10

echo "Generando application key..."
./vendor/bin/sail artisan key:generate

echo "Ejecutando migraciones..."
./vendor/bin/sail artisan migrate --force

echo "Ejecutando seeders..."
./vendor/bin/sail artisan db:seed --force

echo "Limpiando caché..."
./vendor/bin/sail artisan optimize:clear

echo "✓ Backend configurado"
echo ""

# Frontend Setup
echo ">>> Configurando Frontend (React)..."
cd ../frontend

if [ ! -d node_modules ]; then
    echo "Instalando dependencias npm..."
    npm install
fi

echo "✓ Frontend configurado"
echo ""

# Success message
cd ..
echo "==================================="
echo "✓ Setup completado exitosamente"
echo "==================================="
echo ""
echo "Usuarios de prueba creados:"
echo "  Admin:"
echo "    Email: admin@equitylink.com"
echo "    Password: password"
echo ""
echo "  User:"
echo "    Email: test@equitylink.com"
echo "    Password: password"
echo ""
echo "Para iniciar la aplicación:"
echo "  Backend:  cd backend && ./vendor/bin/sail up -d"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "URLs:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost"
echo ""
