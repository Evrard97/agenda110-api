# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copie les fichiers nécessaires et installe les dépendances avec npm
COPY package*.json ./
RUN npm install --force

# Copie le reste des fichiers et construit l'application
COPY . .
RUN npm run build
# Assurez-vous que "build" est bien défini dans package.json

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 3000
CMD ["npm", "start"]
