FROM node:22 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx tsc

EXPOSE 8080

CMD ["npx", "live-server", "--open=./frontend/public"]