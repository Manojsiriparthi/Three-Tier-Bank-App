# Step 1: Use Node.js 16 as the base image for building and running the backend
FROM node:16

# Step 2: Set the working directory inside the container to `/app`
WORKDIR /app

# Step 3: Copy `package.json` and `package-lock.json` to the working directory
COPY package.json package-lock.json ./

# Step 4: Install the backend dependencies using npm
RUN npm install

# Step 5: Copy the rest of the backend application code to the working directory
COPY . .

# Step 6: Expose the port 5000 to make the backend accessible
EXPOSE 5000

# Step 7: Start the backend server with npm
CMD ["npm", "start"]

