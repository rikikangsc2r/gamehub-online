import React, { useState, useCallback } from 'react';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';

interface ConnectionInfo {
  roomId: string;
  username: string;
}

const App: React.FC = () => {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);

  const handleJoin = useCallback((roomId: string, username: string) => {
    setConnectionInfo({ roomId, username });
  }, []);

  const handleLeave = useCallback(() => {
    setConnectionInfo(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        {!connectionInfo ? (
          <Lobby onJoin={handleJoin} />
        ) : (
          <GameRoom
            roomId={connectionInfo.roomId}
            username={connectionInfo.username}
            onLeave={handleLeave}
          />
        )}
      </div>
       <footer className="w-full text-center p-4 mt-8 text-gray-500 text-sm">
          <p>Built by a world-class senior frontend React engineer with expertise in Gemini API and UI/UX design.</p>
          <p>WebSocket Server by nirkyy</p>
        </footer>
    </div>
  );
};

export default App;