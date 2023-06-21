FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run prisma:generate

RUN npm run build

EXPOSE 3000

CMD npx prisma migrate deploy && npm start
