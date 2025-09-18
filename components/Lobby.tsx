import React, { useState } from 'react';

interface LobbyProps {
  username: string;
  onJoin: (roomId: string) => void;
  onChangeUsername: () => void;
}

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
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

const Lobby: React.FC<LobbyProps> = ({ username, onJoin, onChangeUsername }) => {
  const [roomId, setRoomId] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    let finalRoomId = roomId.trim();
    if (!finalRoomId) {
      finalRoomId = `game-${Math.random().toString(36).substring(2, 8)}`;
    }
    onJoin(finalRoomId);
  };

  return (
    <div className="animate-fade-in text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
            <h2 className="text-3xl font-display text-gray-700">
                Selamat Datang, <span className="font-bold text-primary-600">{username}</span>!
            </h2>
            <button onClick={onChangeUsername} title="Ubah Nama Pengguna" className="text-gray-500 hover:text-primary-600 transition-colors">
                <EditIcon className="w-6 h-6"/>
            </button>
        </div>
      <p className="text-gray-600 mb-12">Kumpulan game online. Tantang temanmu sekarang!</p>

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
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Masukkan ID Room (atau kosongkan untuk buat baru)"
            className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
          />
          <button
            type="submit"
            className="w-full py-3 px-6 bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
          >
            Masuk & Main
          </button>
        </form>
      </div>
    </div>
  );
};

export default Lobby;