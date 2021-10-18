FROM node:alpine

WORKDIR /app
COPY package.json ./
EXPOSE 2020
RUN npm install
RUN npm install --global ws
RUN npm install --global mqtt
COPY ./ ./

CMD [ "node", "server"]