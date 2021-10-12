const http = require('http');
const url = require("url");
const fs = require("fs");
const graphQL = require("graphql");

// import http from 'http';
// import url from 'url';
// import fs from 'fs';
// import mqtt from 'mqtt';
// import {graphql} from "graphql";
// import WebSocket, {WebSocketServer} from 'ws';

const hostname = '127.0.0.1';
const port = 3001
const server = http.createServer((req, res) => {
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

