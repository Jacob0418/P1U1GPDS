#!/bin/sh
set -e

# Reemplaza las variables de entorno en el archivo index.html
envsubst '${VITE_SUPABASE_URL} ${VITE_SUPABASE_ANON_KEY}' < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html

exec "$@"