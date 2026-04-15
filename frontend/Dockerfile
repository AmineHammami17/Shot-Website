# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production server stage
FROM nginx:alpine
# Copy our custom Nginx config to route React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built Vite assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
