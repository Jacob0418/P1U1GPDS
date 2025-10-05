#!/bin/sh
set -e

echo "Running inject-env.sh to replace environment variables in index.html"

echo "VITE_SUPABASE_URL: $VITE_SUPABASE_URL"
echo "VITE_SUPABASE_ANON_KEY: $VITE_SUPABASE_ANON_KEY"

# Reemplaza las variables de entorno en el archivo index.html
envsubst '${VITE_SUPABASE_URL} ${VITE_SUPABASE_ANON_KEY}' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html

echo "Environment variables replaced successfully"

exec "$@"