# Step 1: Build the frontend app using Node.js 16
FROM node:16 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy `package.json` and `package-lock.json` first to cache dependencies
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the React app for production
RUN npm run build

# Step 2: Serve the app using Node.js Alpine
FROM node:16-alpine

# Set the working directory inside the production image
WORKDIR /app

# Copy the build output from the previous stage
COPY --from=build /app/build /app/build

# Install a simple HTTP server to serve the React app
RUN npm install -g serve

# Expose the port 3000 (or any other port you want to use)
EXPOSE 3000

# Start the app using the `serve` package
CMD ["serve", "-s", "build", "-l", "3000"]

