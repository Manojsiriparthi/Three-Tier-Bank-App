# Step 1: Use Node.js 16 as the base image for building and running the frontend
FROM node:16

# Step 2: Set the working directory inside the container to `/app`
WORKDIR /app

# Step 3: Copy `package.json` and `package-lock.json` to the working directory
# This ensures dependencies are installed based on these files
COPY package.json package-lock.json ./

# Step 4: Install the dependencies using npm
RUN npm install

# Step 5: Copy the rest of the application code to the working directory
COPY . .

# Step 6: Build the React frontend application
RUN npm run build

# Step 7: Expose the port 3000 to make the frontend accessible
EXPOSE 3000

# Step 8: Start the frontend server with npm
CMD ["npm", "start"]

