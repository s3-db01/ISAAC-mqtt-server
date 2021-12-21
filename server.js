const mqtt = require("mqtt");
require('dotenv').config();

var mqttMessage
var options = {
    clientId: process.env.MQTT_CLIENT,
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD,
    port: 8883,
    clean: true
};
var rateLimit = require('ws-rate-limit')(100, '10s')
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
const axios = require("axios");
const wss = new WebSocket.Server({ port: 2020 })
let websocket = new WebSocket("ws://127.0.0.1:2020/");
wss.on('connection', ws => {
    rateLimit(ws);
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

    data2 = JSON.stringify(ConvertToJson(splitReturnTopic, message.toString()));

    const data = JSON.parse(data2);
    console.log(data)

    axios
        .get('http://ISAAC-sensor-back-end:3001/api/sensors/')
        .then(res => {

            const sensor = res.data.find( ({ x_coordinate, y_coordinate }) => x_coordinate === data.sensordata[0]["x-coord"] && y_coordinate === data.sensordata[0]["y-coord"])

            if (sensor === undefined) {
                console.log("SENSOR:   " + data.sensordata[0]["x-coord"] +"-"+ data.sensordata[0]["y-coord"]);

                axios
                    .post('http://ISAAC-sensor-back-end:3001/api/sensors', {
                        floor_id: 1,
                        x_coordinate: data.sensordata[0]["x-coord"],
                        y_coordinate: data.sensordata[0]["y-coord"],
                        flagged_faulty: null
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }

            axios
                .post('http://ISAAC-sensor-log-back-end:3002/api/sensorlogs', {
                    x_coordinate : data.sensordata[0]["x-coord"],
                    y_coordinate : data.sensordata[0]["y-coord"],
                    humidity: data.sensordata[0]["humidity"],
                    temperature: data.sensordata[0]["temperature"],
                    up_time:  data.sensordata[0]["uptime"],
                })
                .catch((error) => {
                    console.error(error)
                })
        })
        .catch((error) => {
            console.error(error)
        })
})

wss.on('error', (error) => {
    //handle error
    console.log(error.message);
})

function ConvertToJson(splitTopic, message){

    var jsontemplate = '{"sensordata":[{"Floor" : '+splitTopic[2]+',"x-coord": '+splitTopic[3]+',"y-coord": '+splitTopic[4]+',"'+splitTopic[5]+'": '+message+'}]}'

    return JSON.parse(jsontemplate);
}



