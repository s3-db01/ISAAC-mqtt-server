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

                console.log("SENSOR ZELF AANGEMAAKT!!!!!")
            }
            else{
                axios
                    .get('http://localhost:3002/api/sensorlogs/'+dataMQTT.sensordata[0]["x-coord"]+"-"+dataMQTT.sensordata[0]["y-coord"])
                    .then(res => {
                        const latestSensorLog = res.data

                        if (latestSensorLog.length === 0) {
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

                            console.log("SENSOR LOG AANGEMAAKT!!!!!")
                        }
                        else if (dataMQTT.sensordata[0]["humidity"] != null) {
                            if (latestSensorLog["humidity"] == null) {
                                axios
                                    .put('http://localhost:3002/api/sensorlogs/'+dataMQTT.sensordata[0]["x-coord"]+"-"+dataMQTT.sensordata[0]["y-coord"], {
                                        "sensor_id": latestSensorLog["sensor_id:"],
                                        "humidity": dataMQTT.sensordata[0]["humidity"],
                                        "temperature": latestSensorLog["temperature"],
                                        "up_time": latestSensorLog["uptime"],
                                    })
                                    .catch((error) => {
                                        console.error(error)
                                    })
                            }
                            else {
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
                        }
                        else if (dataMQTT.sensordata[0]["temperature"] != null) {
                            if (latestSensorLog["temperature"] == null) {
                                axios
                                    .put('http://localhost:3002/api/sensorlogs/'+dataMQTT.sensordata[0]["x-coord"]+"-"+dataMQTT.sensordata[0]["y-coord"], {
                                        "id": latestSensorLog["id"],
                                        "sensor_id": latestSensorLog["sensor_id:"],
                                        "humidity": latestSensorLog["humidity:"],
                                        "temperature": dataMQTT.sensordata[0]["temperature"],
                                        "up_time": latestSensorLog["uptime"],
                                    })
                                    .catch((error) => {
                                        console.error(error)
                                    })
                            }
                            else {
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
                        }
                        else if (dataMQTT.sensordata[0]["uptime"] != null) {
                            if (latestSensorLog["uptime"] == null) {
                                axios
                                    .put('http://localhost:3002/api/sensorlogs/'+dataMQTT.sensordata[0]["x-coord"]+"-"+dataMQTT.sensordata[0]["y-coord"], {
                                        "id": latestSensorLog["id"],
                                        "sensor_id": latestSensorLog["sensor_id:"],
                                        "humidity": latestSensorLog["humidity:"],
                                        "temperature": latestSensorLog["temperature"],
                                        "up_time": dataMQTT.sensordata[0]["uptime"]
                                    })
                                    .catch((error) => {
                                        console.error(error)
                                    })
                            }
                            else {
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
                        }
                    })
            }
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



