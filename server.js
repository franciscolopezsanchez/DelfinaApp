const WebSocket = require('ws');

// Create a WebSocket server
const server = new WebSocket.Server({ port: 3000 });

// Event handler for new WebSocket connections
server.on('connection', (socket) => {
  console.log('New connection established');

  // Event handler for incoming messages from clients
  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // Send a response back to the client
    socket.send(`Server received your message: ${message}`);
  });

  // Event handler for WebSocket connection close
  socket.on('close', () => {
    console.log('Connection closed');
  });
});

console.log('WebSocket server listening on port 3000');

