import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000'; 

const socket = io(SOCKET_URL, {
  autoConnect: true,
});

socket.on('connect', () => {
  console.log('Connected to chat server:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected from chat server');
});

export default socket;
