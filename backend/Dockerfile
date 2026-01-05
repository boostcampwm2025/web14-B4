FROM node:20-alpine AS dependencies

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
COPY .env ./.env.production
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]