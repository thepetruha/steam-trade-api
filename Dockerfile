FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN rm -rf node_modules package-lock.json && \
    npm install bcryptjs && \
    npm install

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

CMD ["sh", "-c", "npm run build && node dist/main.js"]