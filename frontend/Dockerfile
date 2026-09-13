FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV API_URL_INTERNAL=http://api:3001

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]