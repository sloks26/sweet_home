#!/bin/bash
set -e

VPS_HOST="root@174.138.62.86"
REMOTE_DIR="/root/sweet_home"

echo "✨ Compilando frontend..."
cd frontend && npm run build && cd ..

echo "🚀 Sincronizando archivos al VPS ($VPS_HOST)..."
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'backend/uploads' ./ $VPS_HOST:$REMOTE_DIR/

echo "🔄 Generando cliente Prisma y reiniciando proceso sweet-home-8081 en PM2..."
ssh $VPS_HOST "cd $REMOTE_DIR/backend && npm install --omit=dev && npx prisma db push && npx prisma generate && cd $REMOTE_DIR && node scratch/update-categories-and-banners.mjs && node scratch/seed-store-settings.mjs && (pm2 restart sweet-home-8081 || pm2 start backend/src/index.js --name sweet-home-8081)"

echo "✅ Despliegue completado con éxito en http://174.138.62.86:8081"
