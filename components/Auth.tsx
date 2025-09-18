import React, { useState } from 'react';

interface AuthProps {
  onLogin: (username: string) => void;
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

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    } else {
      setError('Nama pengguna tidak boleh kosong.');
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

        <div className="max-w-sm mx-auto p-8 bg-white border border-gray-200 rounded-3xl shadow-2xl animate-slide-in-up">
            <h2 className="text-3xl font-bold font-display mb-6 text-center text-gray-800">Buat Profil Anda</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan Nama Pengguna"
                className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300"
                aria-label="Username"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
                type="submit"
                className="w-full py-3 px-6 bg-primary-500 text-white font-bold rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
            >
                Simpan & Lanjutkan
            </button>
            </form>
            <p className="text-xs text-gray-500 mt-4 text-center">
                Nama pengguna Anda akan disimpan di perangkat ini.
            </p>
        </div>
    </div>
  );
};

export default Auth;
