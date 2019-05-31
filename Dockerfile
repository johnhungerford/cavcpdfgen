# Use an official Python runtime as a parent image
FROM node:8.12-stretch

ARG CONFIG_ARG

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

RUN npm install
RUN npx webpack --mode production

# Make port 3000 available to the world outside this container
EXPOSE 3000

ENV CONFIG=${CONFIG_ARG}

# Run app.py when the container launches
CMD ["npm", "start"]
