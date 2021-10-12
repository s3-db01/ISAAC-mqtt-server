# MQTT
## Reasoning
We chose a websocket for the communication to the backend. This is because there will need to be
a constant update if we get a new message.  If we use a websocket for this it will be able to update
the message when there is a new message recieved. When we use a API the backend will need to constantly
check the API link if something has changed. In this case we can let them connect to the websocket and they 
can run a function when the websocket sends new information about the sensors.
