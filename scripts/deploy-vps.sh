#!/bin/bash
set -e

VPS_HOST="root@174.138.62.86"
REMOTE_DIR="/root/sweet_home"

echo "✨ Compilando frontend..."
cd frontend && npm run build && cd ..

echo "🚀 Sincronizando archivos al VPS ($VPS_HOST)..."
# Se excluyen secretos (.env), respaldos de entorno, uploads y comprobantes privados del servidor
rsync -avz \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude 'backend/uploads' \
  --exclude 'backend/private' \
  --exclude '.env' \
  --exclude '.env.*' \
  --exclude 'backend/.env' \
  --exclude 'backend/.env.*' \
  --exclude 'scratch' \
  ./ $VPS_HOST:$REMOTE_DIR/

# IMPORTANTE: el despliegue NO ejecuta seeds. Antes se re-escribían los ajustes de la tienda y las
# imágenes de categorías en cada despliegue, pisando los cambios hechos desde el panel de administración.
echo "🔄 Generando cliente Prisma y reiniciando proceso sweet-home-8081 en PM2..."
ssh $VPS_HOST "cd $REMOTE_DIR/backend && npm install --omit=dev && npx prisma db push && npx prisma generate && cd $REMOTE_DIR && (pm2 restart sweet-home-8081 --update-env || pm2 start backend/src/index.js --name sweet-home-8081)"

echo "✅ Despliegue completado con éxito en https://sweethomeandboutiquecr.com"
