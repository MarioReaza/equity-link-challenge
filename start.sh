#!/bin/bash

echo "Iniciando Equity Link..."
echo ""

# Start backend
cd backend
./vendor/bin/sail up -d
cd ..

echo "✓ Backend iniciado en http://localhost"
echo ""

# Start frontend
echo "Iniciando frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "==================================="
echo "Aplicación iniciada"
echo "==================================="
echo ""
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost"
echo ""
echo "Para detener:"
echo "  Frontend: Ctrl+C"
echo "  Backend:  cd backend && ./vendor/bin/sail down"
echo ""

# Keep script running
wait $FRONTEND_PID
