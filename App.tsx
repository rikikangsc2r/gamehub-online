import React, { useState, useCallback, useEffect } from 'react';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';
import Auth from './components/Auth';

interface ConnectionInfo {
  roomId: string;
}

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('gamehub-username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = useCallback((newUsername: string) => {
    const trimmedUsername = newUsername.trim();
    if (trimmedUsername) {
      localStorage.setItem('gamehub-username', trimmedUsername);
      setUsername(trimmedUsername);
    }
  }, []);
  
  const handleChangeUsername = useCallback(() => {
    localStorage.removeItem('gamehub-username');
    setUsername(null);
    setConnectionInfo(null);
  }, []);

  const handleJoin = useCallback((roomId: string) => {
    setConnectionInfo({ roomId });
  }, []);

  const handleLeave = useCallback(() => {
    setConnectionInfo(null);
  }, []);

  const renderContent = () => {
    if (!username) {
      return <Auth onLogin={handleLogin} />;
    }
    if (!connectionInfo) {
      return <Lobby onJoin={handleJoin} username={username} onChangeUsername={handleChangeUsername} />;
    }
    return (
      <GameRoom
        roomId={connectionInfo.roomId}
        username={username}
        onLeave={handleLeave}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        {renderContent()}
      </div>
       <footer className="w-full text-center p-4 mt-8 text-gray-500 text-sm">
          <p>Built by a world-class senior frontend React engineer with expertise in Gemini API and UI/UX design.</p>
          <p>WebSocket Server by nirkyy</p>
        </footer>
    </div>
  );
};

export default App;
