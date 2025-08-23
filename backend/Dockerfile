FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
# Your server should read MONGODB_URI and listen on 0.0.0.0:5000
EXPOSE 5000
CMD ["node","server.js"]
