FROM node:23.3.0

WORKDIR /app

COPY package*.json ./

COPY /web/package*.json ./web/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 8000

CMD npx prisma migrate deploy && npm start
