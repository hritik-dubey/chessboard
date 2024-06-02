const socket = io();

socket.emit('clientConnect', () => {
  console.log('Connected to server');
});