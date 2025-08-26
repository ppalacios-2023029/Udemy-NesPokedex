# ==========================
# ETAPA 1: BUILD
# ==========================
# Node 20 Alpine: ligero y compatible con NestJS 11
FROM node:20-alpine AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los package.json y yarn.lock si existe
COPY package*.json ./

# Instalamos todas las dependencias (dev + prod)
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Construimos la aplicación NestJS
RUN npm run build

# ==========================
# ETAPA 2: PRODUCCIÓN
# ==========================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

# Copiamos solo los archivos de dependencias
COPY package*.json ./

# Instalamos solo dependencias de producción
RUN npm install --production

# Copiamos la build de la etapa builder
COPY --from=builder /app/dist ./dist

# Copiamos también los archivos que tu app pueda necesitar en producción (si aplica)
# COPY --from=builder /app/public ./public

# Exponemos el puerto de la app
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD ["node", "dist/main"]
