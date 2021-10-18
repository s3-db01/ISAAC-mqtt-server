const mqtt = require("mqtt");
var mqttMessage
var options = {
    clientId: "mqtt.fhict.nl",
    username: "i459821_isaac",
    password: "Gdu7grSJH06E5c",
    port: 8883,
    clean: true
};

var client = mqtt.connect('mqtts://mqtt.fhict.nl', options)

client.on('connect', function () {
    console.log("connected")
    client.subscribe('private/i459821_isaac/#', function (err) {
        if (!err) {
            console.log("subscribed");
        } else {
            console.log(err);
        }
    })
})

var { graphql, buildSchema, GraphQLSchema, GraphQLObjectType, GraphQLString } = require('graphql');
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 2020 })
let websocket = new WebSocket("ws://127.0.0.1:2021/");
wss.on('connection', ws => {
    console.log("connected")
    websocket = ws;
})

wss.on('disconnect', ws => {
    console.log("disconnect")
})

client.on('message', function (topic, message) {
    // message is Buffer
    console.log("recieved");
    //console.log(topic.toString());
    var returnTopic = topic.toString();
    var splitReturnTopic = returnTopic.split("/")

    console.log(splitReturnTopic[2], splitReturnTopic[3], splitReturnTopic[4], splitReturnTopic[5], message.toString());
    websocket.send(JSON.stringify(ConvertToJson(splitReturnTopic, message.toString())));

    mqttMessage = JSON.parse(message.toString());
})

wss.on('error', (error) => {
    //handle error
    console.log(error.message);
})

function ConvertToJson(splitTopic, message){

    var jsontemplate = '{"sensordata":[{"Floor" : '+splitTopic[2]+',"x-coord": '+splitTopic[3]+',"y-coord": '+splitTopic[4]+',"'+splitTopic[5]+'": '+message+'}]}'

    return JSON.parse(jsontemplate);
}



