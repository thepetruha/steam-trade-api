FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

CMD ["sh", "-c", "npm run build && node dist/main.js"]