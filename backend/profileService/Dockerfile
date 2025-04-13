# Use an official Node.js runtime as a base image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port (match the backend port)
EXPOSE 5002

# Start the backend service
CMD ["npm", "run", "dev"]
