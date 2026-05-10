import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getHealthCheck } from '../api/api';
import socket from '../socket';
import './ChatDashboardPage.css';

function ChatDashboardPage() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState('');
  const [inputMessage, setInputMessage] = useState('');

  const { data: healthData, isLoading, error, refetch } = useQuery({
    queryKey: ['healthCheck'],
    queryFn: getHealthCheck,
  });

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onChatMessage(value) {
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

  const sendMessage = (event) => {
    event.preventDefault();

    if (inputMessage.trim()) {
      socket.emit('message', inputMessage);
      setInputMessage('');
    }
  };

  return (
    <main className="chat-dashboard-page">
      <h1>Chat Dashboard</h1>

      <section className="card">
        <h2>
          Socket.io Status:
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </h2>

        <div className="chat-box">
          <p>
            <strong>Last Message:</strong> {lastMessage || 'No messages yet'}
          </p>

          <form onSubmit={sendMessage} className="chat-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(event) => setInputMessage(event.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </section>

      <section className="card health-section">
        <h3>Backend API Health</h3>
        {isLoading && <p>Loading...</p>}
        {error && <p className="error">Error: {error.message}</p>}
        {healthData && <pre>{JSON.stringify(healthData, null, 2)}</pre>}
        <button onClick={() => refetch()}>Check API Connection</button>
      </section>
    </main>
  );
}

export default ChatDashboardPage;
