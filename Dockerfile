# --- Base Image ---
    FROM node:18-alpine AS base

    # Set working directory
    WORKDIR /app
    
    # --- Build Stage ---
    FROM base AS builder
    
    # Copy root package files
    COPY package*.json ./
    
    # Copy server and client package files
    COPY server/package*.json ./server/
    COPY client/package*.json ./client/
    
    # Install server dependencies
    WORKDIR /app/server
    RUN npm install
    
    # Install client dependencies
    WORKDIR /app/client
    RUN npm install
    
    # Copy application source files
    WORKDIR /app
    COPY . .
    
    # Build Next.js client
    WORKDIR /app/client
    RUN npm run build
    
    # --- Final Stage ---
    FROM base AS production
    
    # Set working directory
    WORKDIR /app
    
    # Copy server and client production files from builder
    COPY --from=builder /app/server ./server
    COPY --from=builder /app/client/.next ./client/.next
    COPY --from=builder /app/client/package*.json ./client/
    COPY --from=builder /app/server/package*.json ./server/
    COPY --from=builder /app/start.sh ./start.sh
    
    # Install production dependencies for server
    WORKDIR /app/server
    RUN npm install
    
    # Install production dependencies for client
    WORKDIR /app/client
    RUN npm install
    
    # Set environment variables
    ENV CORS_ORIGIN="*" \
        HOST="localhost" \
        PORT=3000 \
        CLIENT_URL="http://localhost:3000" \
        NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
    
    # Expose ports for server and client
    EXPOSE 4000 3000
    
    # Make start.sh executable
    WORKDIR /app
    RUN chmod +x ./start.sh
    
    # Start the application
    CMD ["sh", "./start.sh"]
    