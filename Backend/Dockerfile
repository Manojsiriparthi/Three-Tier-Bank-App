# Step 1: Use Node.js 16 as the build stage
FROM node:16 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy `package.json` and `package-lock.json` to cache dependencies
COPY package.json package-lock.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code to the container
COPY . .

# Step 2: Create the production image
FROM node:16-alpine

# Set the working directory inside the final production image
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app /app

# Expose the port 5000 for the backend API
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]

