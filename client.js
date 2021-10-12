const WebSocket = require('ws')
const url = 'ws://localhost:8080'
const connection = new WebSocket(url)

connection.onopen = () => {
    connection.send('Message From Client')
}

connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`)
}

connection.onmessage = (e) => {
    connection.send('Message From Client')
    console.log(e.data)
}