const assert = require('assert')
const mqtt = require("mqtt");

describe('simple mqtt', () => {
    it('should return true', () => {
        var mqttMessage
        var options = {
            clientId: "mqtt.fhict.nl",
            username: "i459821_isaac",
            password: "Gdu7grSJH06E5c",
            port: 8883,
            clean: true
        };

        let connected = false;

        var client = mqtt.connect('mqtts://mqtt.fhict.nl', options)

        client.on('connect', function () {
            connected = true
            assert.ok(connected)
        })
    });

    it('should return false', () => {
        var mqttMessage
        var options = {
            clientId: "mqtt.fhict.nl",
            username: "i459821_isaac",
            password: "Gdu7grSJH06E5cssssss",
            port: 8883,
            clean: true
        };

        let connected = false;

        var client = mqtt.connect('mqtts://mqtt.fhict.nl', options)

        client.on('connect', function () {
            connected = true
        })
        assert.ok(!connected)

    });
});