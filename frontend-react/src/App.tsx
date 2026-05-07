import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHealthCheck } from './api/api';
import socket from './socket';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState('');
  const [inputMessage, setInputMessage] = useState('');

  // Existing health check query
  const { data: healthData, isLoading, error, refetch } = useQuery({
    queryKey: ['healthCheck'],
    queryFn: getHealthCheck,
  });

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log('Socket connected');
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('Socket disconnected');
    }

    function onChatMessage(value: string) {
      setLastMessage(value);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onChatMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message', onChatMessage);
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      socket.emit('message', inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="App">
      <h1>Chat App</h1>

      <div className="card">
        <h2>Socket.io Status: 
          <span style={{ color: isConnected ? '#4caf50' : '#f44336', marginLeft: '10px' }}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </h2>
        
        <div className="chat-box">
          <p><strong>Last Message:</strong> {lastMessage || 'No messages yet'}</p>
          
          <form onSubmit={sendMessage}>
            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              style={{ padding: '8px', width: '200px' }}
            />
            <button type="submit" style={{ marginLeft: '10px' }}>
              Send
            </button>
          </form>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
        <h3>Backend API Health:</h3>
        {isLoading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {(error as any).message}</p>}
        {healthData && (
          <pre style={{ textAlign: 'left', background: '#f4f4f4', padding: '1rem', color: '#333', fontSize: '0.8rem' }}>
            {JSON.stringify(healthData, null, 2)}
          </pre>
        )}
        <button onClick={() => refetch()}>
          Check API Connection
        </button>
      </div>
    </div>
  );
}

export default App;
