FROM node:alpine

COPY package.json ./
RUN npm install
RUN npm install --global ws
RUN npm install --global mqtt
COPY ./ ./

CMD [ "node", "server"]