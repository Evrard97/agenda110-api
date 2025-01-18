# Étape 1 : Construire l'application
FROM node:18-alpine AS builder
WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste du projet
COPY . .

# Renommer .env.example en .env
RUN cp .env.example .env || true

# Construire l'application
RUN npm run build

# Étape 2 : Exécuter l'application
FROM node:18-alpine
WORKDIR /app

# Copier les fichiers de l'étape de construction
COPY --from=builder /app ./

# Installer les dépendances nécessaires pour la production
RUN npm install --production

# Commande pour démarrer l'application
CMD ["npm", "start"]

EXPOSE 3000
