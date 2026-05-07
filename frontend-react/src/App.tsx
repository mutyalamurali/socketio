import { useQuery } from '@tanstack/react-query';
import { getHealthCheck } from './api/api';
import './App.css';

function App() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['healthCheck'],
    queryFn: getHealthCheck,
  });

  return (
    <div className="App">
      <h1>Chat App Frontend</h1>
      <div className="card">
        <h2>Backend Status:</h2>
        {isLoading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error connecting to backend: {(error as any).message}</p>}
        {data && (
          <pre style={{ textAlign: 'left', background: '#f4f4f4', padding: '1rem', color: '#333' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        <button onClick={() => refetch()}>
          Check Connection
        </button>
      </div>
      <p className="read-the-docs">
        API URL: http://localhost:4000
      </p>
    </div>
  );
}

export default App;
