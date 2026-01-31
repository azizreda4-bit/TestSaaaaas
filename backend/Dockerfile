# Multi-stage Dockerfile for DeliveryHub API

# Base stage with Node.js
FROM node:18-alpine AS base
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    curl \
    dumb-init \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Development stage
FROM base AS development
ENV NODE_ENV=development

# Install all dependencies (including dev dependencies)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads logs

# Expose port
EXPOSE 3000

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start development server with nodemon
CMD ["npm", "run", "dev"]

# Production dependencies stage
FROM base AS production-deps
ENV NODE_ENV=production

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy production dependencies
COPY --from=production-deps /app/node_modules ./node_modules

# Copy source code
COPY --chown=nodejs:nodejs . .

# Create necessary directories
RUN mkdir -p uploads logs && \
    chown -R nodejs:nodejs uploads logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start production server
CMD ["npm", "start"]

# Build stage for creating optimized production build
FROM production AS build
USER root

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Switch back to nodejs user
USER nodejs

# Run any build steps if needed
RUN npm run build || true

# Final production stage
FROM production AS final
COPY --from=build --chown=nodejs:nodejs /app ./