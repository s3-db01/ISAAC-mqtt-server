const assert = require('assert')
const mqtt = require("mqtt");
require('dotenv').config();

describe('simple mqtt', () => {
    it('should return true', () => {
        var mqttMessage
        var options = {
            clientId: process.env.MQTT_CLIENT,
            username: process.env.MQTT_USER,
            password: process.env.MQTT_PASSWORD,
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
            clientId: process.env.MQTT_CLIENT,
            username: process.env.MQTT_USER,
            password: process.env.MQTT_PASSWORD,
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