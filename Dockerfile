FROM node:alpine

WORKDIR /app
COPY package.json ./
EXPOSE 2021
RUN npm install
RUN npm install --global nodemon
COPY ./ ./

CMD [ "node", "server"]