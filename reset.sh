#!/bin/bash

echo "==================================="
echo "Reset de Base de Datos"
echo "==================================="
echo ""
echo "ADVERTENCIA: Esto eliminará todos los datos"
read -p "¿Continuar? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operación cancelada"
    exit 0
fi

cd backend

echo "Eliminando base de datos y recreando..."
./vendor/bin/sail artisan migrate:fresh --seed --force

echo "Limpiando caché..."
./vendor/bin/sail artisan optimize:clear

cd ..

echo ""
echo "✓ Base de datos reseteada"
echo "Usuarios de prueba recreados"
