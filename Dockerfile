# Dockerfile
FROM node:20-alpine AS build

WORKDIR /app

# Copia los archivos necesarios para construir la aplicación
COPY package*.json ./ 
COPY . .

# Instala las dependencias y construye la aplicación
RUN npm ci && npm run build

# Usa Nginx para servir la aplicación
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copia los archivos construidos al contenedor
COPY --from=build /app/dist .

# Copia el script para inyectar las variables de entorno
COPY inject-env.sh /usr/share/nginx/html/

# Asegúrate de que el script tenga permisos de ejecución
RUN chmod +x /usr/share/nginx/html/inject-env.sh

# Reemplaza el comando CMD para ejecutar el script antes de iniciar Nginx
CMD ["/bin/sh", "-c", "/usr/share/nginx/html/inject-env.sh && nginx -g 'daemon off;'"]

# Exponer el puerto 80
EXPOSE 80