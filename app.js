const http = require('http');
const url = require("url");
const fs = require("fs");
const mqtt = require("mqtt");

const hostname = '127.0.0.2';
const port = 3000;

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
        console.log("connected");
            client.subscribe('private/i459821/isaac', function (err) {
                if (!err) {
                    console.log("send");
                    client.publish('private/i459821/isaac', '18 grade');
                } else {
                    console.log(err);
                }
            })
    })
    client.on('error', function(e){
        console.log(e);
    } )
    client.on('close', function(){
        console.log("Disconnected")
    })

    res.end("run");
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});