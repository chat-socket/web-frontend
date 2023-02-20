FROM node:19-alpine as builder

WORKDIR /app
ADD package*.json .
RUN npm install

COPY . .
COPY .env .

RUN npm run build

FROM nginx:alpine

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
COPY nginx.conf /etc/nginx/nginx.conf
# Copy static assets from builder stage
COPY --from=builder /app/dist .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]