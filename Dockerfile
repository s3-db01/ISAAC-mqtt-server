FROM node:alpine

WORKDIR /app
COPY package.json ./
EXPOSE 2020
RUN npm install
RUN npm install --global nodemon
COPY ./ ./

CMD [ "node", "server"]