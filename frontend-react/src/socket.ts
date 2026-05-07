import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000'; // Adjust this for production

const socket: Socket = io(SOCKET_URL, {
  autoConnect: true, // We will connect manually
});

export default socket;