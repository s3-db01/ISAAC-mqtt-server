const http = require('http');
const url = require("url");
const fs = require("fs");
const mqtt = require("mqtt");

const hostname = '127.0.0.2';
const port = 3000;

function GenerateJsonReport(amount){
    var reporttemplate = '{"SensorData":[';
    var sensordata = '';

    for (var i = 0; i <= amount; i++){
        var temp = Math.floor(Math.random() * 20) + "C";
        var humidity = Math.floor(Math.random()* 100) + "%";

        if(sensordata !== ''){
            sensordata = sensordata + ',"Sensor #'+ i +'":[{"Temp": "'+ temp +'", "Humidity": "'+ humidity +'"}]';
        }else{
            sensordata = '{"Sensor #1":[{"Temp": "'+ temp +'", "Humidity": "'+ humidity +'"}]'
        }
    }

    var jsonreport = reporttemplate + sensordata + '}]}';

    return JSON.parse(jsonreport);
}

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
                    client.publish('private/i459821/isaac', JSON.stringify(GenerateJsonReport(Math.floor(Math.random()* (5 - 1 + 1) + 1))));
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