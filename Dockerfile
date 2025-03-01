FROM node as base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .