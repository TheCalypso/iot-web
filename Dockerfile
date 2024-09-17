# Étape 1 : Construire l'application Angular
FROM 192.168.1.70:8082/node:20.16.0-slim AS build

WORKDIR /app

# Copier les fichiers de package, lockfile et installer les dépendances
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm

# Utilisation de frozen-lockfile pour garantir la cohérence des dépendances
RUN pnpm install --frozen-lockfile

# Copier le reste des fichiers et construire l'application Angular
COPY . .
RUN pnpm build --configuration production

# Étape 2 : Servir les fichiers de build avec Nginx
FROM 192.168.1.70:8082/nginx:stable

# Copier les fichiers construits depuis l'étape précédente
COPY --from=build /app/dist /app

# Démarrer Nginx en mode foreground
CMD ["nginx", "-g", "daemon off;"]