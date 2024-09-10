# Stage 1: Build Stage
FROM node:16-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Stage 2: Production Stage
FROM node:16-alpine

# Set the working directory in the production image
WORKDIR /app

# Copy only the node_modules from the build stage
COPY --from=build /app/node_modules ./node_modules

# Copy the application files from the build stage
COPY --from=build /app ./

# Expose port 5000 to the outside world
EXPOSE 5000

# Set environment variables (make sure you have these in .env)
ENV NODE_ENV production

# Start the application
CMD ["npm", "start"]

