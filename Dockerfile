FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY /web/package*.json ./web/

RUN npm install -w web

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 8000

CMD npx prisma migrate deploy && npm start
