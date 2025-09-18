import React, { useState } from 'react';

interface LobbyProps {
  onJoin: (roomId: string, username: string) => void;
}

const GameHubIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        className={className}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Zm-18 0h18" />
    </svg>
);

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const GameCard: React.FC<{ title: string; description: string; available: boolean }> = ({ title, description, available }) => {
  const baseClasses = "relative p-6 rounded-2xl border-2 transition-all duration-300 text-left";
  const availableClasses = "border-gray-200 bg-white hover:border-primary-400 hover:shadow-lg hover:-translate-y-1 cursor-pointer";
  const unavailableClasses = "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed";
  
  return (
    <div className={`${baseClasses} ${available ? availableClasses : unavailableClasses}`}>
      <h3 className={`text-xl font-display font-bold ${available ? 'text-gray-800' : 'text-gray-500'}`}>{title}</h3>
      <p className={`mt-2 text-sm ${available ? 'text-gray-600' : 'text-gray-400'}`}>{description}</p>
      {!available && (
        <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-md">
          SEGERA HADIR
        </div>
      )}
    </div>
  );
};

const Lobby: React.FC<LobbyProps> = ({ onJoin }) => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && roomId.trim()) {
      onJoin(roomId.trim(), username.trim());
    } else {
      setError('Nama Pengguna dan ID Room tidak boleh kosong.');
    }
  };

  return (
    <div className="animate-fade-in text-center">
      <div className="flex items-center justify-center gap-4">
        <GameHubIcon className="w-16 h-16 text-primary-600"/>
        <h1 className="text-5xl sm:text-6xl font-display font-bold text-primary-600">
          GameHub Online
        </h1>
      </div>
      <p className="text-gray-600 mt-4 mb-12">Kumpulan game online. Tantang temanmu sekarang!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
        <GameCard title="Tic-Tac-Toe" description="Game klasik X dan O. Sederhana tapi strategis." available={true} />
        <GameCard title="Teka-Teki Kata" description="Uji kosakatamu dan temukan kata tersembunyi." available={false} />
        <GameCard title="Catur Cepat" description="Pertarungan strategi kilat di papan catur." available={false} />
      </div>

      <div className="max-w-md mx-auto p-8 bg-white border border-gray-200 rounded-3xl shadow-2xl animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="text-3xl font-bold font-display mb-6 text-center text-gray-800">Gabung Room</h2>
        <form onSubmit={handleJoin} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Masukkan Nama Pengguna"
            className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
          />
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Masukkan ID Room"
            className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
          />
          {error && <p className="text-red-500 text-sm flex items-center justify-center"><InfoIcon /> {error}</p>}
          <button
            type="submit"
            className="w-full py-3 px-6 bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            Masuk & Main
          </button>
        </form>
         <p className="text-xs text-gray-500 mt-4 text-center">
             Buat room baru atau gabung dengan ID room yang ada.
        </p>
      </div>
    </div>
  );
};

export default Lobby;