# # Use an official Node runtime as a parent image
# FROM node:18

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install the dependencies
# RUN npm install --legacy-peer-deps

# # Copy the source code to the working directory
# COPY . .

# # Expose the port your app will run on
# EXPOSE 3000

# # Start the development server on port 3000
# CMD ["npm", "start"]


# # Use an official nginx image as a base
# FROM nginx:alpine

# # Copy the build folder content to nginx html folder
# COPY build /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# # Start nginx server
# CMD ["nginx", "-g", "daemon off;"]

# Use an official nginx image as a base
FROM nginx:alpine

# Copy the build folder content to nginx html folder
COPY build /usr/share/nginx/html

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
