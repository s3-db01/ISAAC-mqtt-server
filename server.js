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

function createSensorLog(dataMQTT) {
    axios
        .post('http://localhost:3002/api/sensorlogs', {
            x_coordinate: dataMQTT.sensordata[0]["x-coord"],
            y_coordinate: dataMQTT.sensordata[0]["y-coord"],
            humidity: dataMQTT.sensordata[0]["humidity"],
            temperature: dataMQTT.sensordata[0]["temperature"],
            up_time:  dataMQTT.sensordata[0]["uptime"],
        })
        .catch((error) => {
            console.error(error)
        })
}

client.on('message', function (topic, message) {
    console.log("recieved");
    const returnTopic = topic.toString();
    const splitReturnTopic = returnTopic.split("/");

    console.log(splitReturnTopic[2], splitReturnTopic[3], splitReturnTopic[4], splitReturnTopic[5], message.toString());
    websocket.send(JSON.stringify(ConvertToJson(splitReturnTopic, message.toString())));

    let data = JSON.stringify(ConvertToJson(splitReturnTopic, message.toString()));
    const dataMQTT = JSON.parse(data);

    axios
        .get('http://localhost:3001/api/sensors/')
        .then(res => {
            const sensor = res.data.find( ({ x_coordinate, y_coordinate }) => x_coordinate === dataMQTT.sensordata[0]["x-coord"] && y_coordinate === dataMQTT.sensordata[0]["y-coord"])

            if (sensor === undefined) {
                axios
                    .post('http://localhost:3001/api/sensors', {
                        floor_id: 1,
                        x_coordinate: dataMQTT.sensordata[0]["x-coord"],
                        y_coordinate: dataMQTT.sensordata[0]["y-coord"],
                        flagged_faulty: null
                    })
                    .catch((error) => {
                        console.error(error)
                    })

                createSensorLog(dataMQTT)
            }
            else{
                axios
                    .get('http://localhost:3002/api/sensorlogs/'+dataMQTT.sensordata[0]["x-coord"]+"-"+dataMQTT.sensordata[0]["y-coord"])
                    .then(res => {
                        const latestSensorLog = res.data

                        if (dataMQTT.sensordata[0]["humidity"] != null) {
                            if (latestSensorLog[0]["humidity"] == null) {
                                axios
                                    .put('http://localhost:3002/api/sensorlogs/'+dataMQTT.sensordata[0]["x-coord"]+"-"+dataMQTT.sensordata[0]["y-coord"], {
                                        "sensor_id": latestSensorLog[0]["sensor_id:"],
                                        "humidity": dataMQTT.sensordata[0]["humidity"],
                                        "temperature": latestSensorLog[0]["temperature"],
                                        "up_time": latestSensorLog[0]["uptime"],
                                    })
                                    .catch((error) => {
                                        console.error(error)
                                    })
                            }
                            else {
                                createSensorLog(dataMQTT)
                            }
                        }
                        else if (dataMQTT.sensordata[0]["temperature"] != null) {
                            if (latestSensorLog[0]["temperature"] == null) {
                                axios
                                    .put('http://localhost:3002/api/sensorlogs/'+dataMQTT.sensordata[0]["x-coord"]+"-"+dataMQTT.sensordata[0]["y-coord"], {
                                        "id": latestSensorLog[0]["id"],
                                        "sensor_id": latestSensorLog[0]["sensor_id:"],
                                        "humidity": latestSensorLog[0]["humidity:"],
                                        "temperature": dataMQTT.sensordata[0]["temperature"],
                                        "up_time": latestSensorLog[0]["uptime"],
                                    })
                                    .catch((error) => {
                                        console.error(error)
                                    })
                            }
                            else {
                                createSensorLog(dataMQTT)
                            }
                        }
                        else if (dataMQTT.sensordata[0]["uptime"] != null) {
                            if (latestSensorLog[0]["uptime"] == null) {
                                axios
                                    .put('http://localhost:3002/api/sensorlogs/'+dataMQTT.sensordata[0]["x-coord"]+"-"+dataMQTT.sensordata[0]["y-coord"], {
                                        "id": latestSensorLog[0]["id"],
                                        "sensor_id": latestSensorLog[0]["sensor_id:"],
                                        "humidity": latestSensorLog[0]["humidity:"],
                                        "temperature": latestSensorLog[0]["temperature"],
                                        "up_time": dataMQTT.sensordata[0]["uptime"]
                                    })
                                    .catch((error) => {
                                        console.error(error)
                                    })
                            }
                            else {
                                createSensorLog(dataMQTT)
                            }
                        }
                    })
            }
        })
        .catch((error) => {
            console.error(error)
        })
})

wss.on('error', (error) => {
    console.log(error.message);
})

function ConvertToJson(splitTopic, message){
    const jsontemplate = '{"sensordata":[{"Floor" : ' + splitTopic[2] + ',"x-coord": ' + splitTopic[3] + ',"y-coord": ' + splitTopic[4] + ',"' + splitTopic[5] + '": ' + message + '}]}';

    return JSON.parse(jsontemplate);
}



