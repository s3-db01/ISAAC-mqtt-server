const assert = require('assert')
const mqtt = require("mqtt");



describe('#connectedsuccessfull()', async function() {
    var mqttMessage
    var options = {
        clientId: "mqtt.fhict.nl",
        username: "i459821_isaac",
        password: "Gdu7grSJH06E5c",
        port: 8883,
        clean: true
    };

    let connected;

    var client = mqtt.connect('mqtts://mqtt.fhict.nl', options)

    await client.on('connect', function () {
        connected = true
    })

    assert.ok(connected)
});

describe('#failedtoconnect()', async function() {
    var mqttMessage
    var options = {
        clientId: "wrongurl",
        username: "i459821_isaac",
        password: "Gdu7grSJH06E5c",
        port: 8883,
        clean: true
    };

    let connected;

    var client = mqtt.connect('mqtts://mqtt.fhict.nl', options)

    await client.on('connect', function () {
        connected = true
    })

    assert.ok(!connected)
});