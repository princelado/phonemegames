FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 3001

CMD ["sh", "-c", "npm run db:migrate && npm run db:seed && npm start"]
