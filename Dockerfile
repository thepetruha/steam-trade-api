# Базовый образ
FROM node:latest

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Указываем переменную окружения по умолчанию
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Выполняем сборку, если NODE_ENV=production
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# Запускаем приложение
CMD ["npm", "run", "start"]