# Use official Node.js base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY src ./src

# Expose the port your app runs on
EXPOSE 3000

# Run the app
CMD ["node", "src/app.js"]
