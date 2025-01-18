# Étape 1 : Construire l'application
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet dans le conteneur
COPY . .

# Construire l'application Next.js pour la production
RUN npm run build

# Étape 2 : Exécuter l'application
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de l'étape de build
COPY --from=builder /app ./

# Installer uniquement les dépendances nécessaires à l'exécution
RUN npm install --production

# Copier et renommer .env.example en .env
COPY .env.exemple .env

# Commande pour démarrer l'application
CMD ["npm", "start"]

# Exposer le port 3000
EXPOSE 3000
