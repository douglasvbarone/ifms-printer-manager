FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npx prisma generate

RUN cd web && yarn install && cd ..

RUN npm run build

EXPOSE 3000

CMD npx prisma migrate deploy && npm start
