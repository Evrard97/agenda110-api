# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install -g yarn --force
RUN yarn

# Copy source files and build the project
COPY . .
RUN yarn build # Build the application

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy build output from builder stage
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules

# Expose port and start the app
EXPOSE 3000
CMD ["yarn", "start"]
