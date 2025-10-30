FROM node:20-alpine

WORKDIR /app

# Copy package files for backend to leverage Docker layer caching
COPY package*.json ./

# Install dependencies (full install since build might require dev deps)
RUN npm install

# Copy source code
COPY . .

# Expose backend port
EXPOSE 5000

# Run the backend (adjust command as per your package.json scripts, e.g., 'npm start')
CMD ["npm", "run", "start"]