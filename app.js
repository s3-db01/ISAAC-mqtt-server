const http = require('http');
const url = require("url");
const fs = require("fs");
const mqtt = require("mqtt");

const hostname = '127.0.0.1';
const port = 3001

const server = http.createServer((req, res) => {
    options={
        clientId:"mqtt.fhict.nl",
        username:"i459821_isaac",
        password:"Gdu7grSJH06E5c",
        port: 8883,
        clean:true
    };
    var client  = mqtt.connect('mqtts://mqtt.fhict.nl', options)

    client.on('connect', function () {
        console.log("connected")
        client.subscribe('private/i459821/#',  function(err){
            if(!err){
                console.log("subscribed");
            }
            else{
                console.log(err);
            }
        })
    })
    client.on('message', function (topic, message) {
        // message is Buffer
        console.log("recieved");
        console.log(topic.toString());
        console.log(message.toString())
        client.end()
    })

    res.end("run");
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});