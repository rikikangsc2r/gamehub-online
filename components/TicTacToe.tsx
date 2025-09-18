import React from 'react';
import { TicTacToeGameState } from '../types';

interface TicTacToeProps {
  gameState: TicTacToeGameState;
  playerId: string;
  onMakeMove: (index: number) => void;
}

const XIcon = () => (
  <svg className="w-16 h-16 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const OIcon = () => (
  <svg className="w-16 h-16 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TicTacToe: React.FC<TicTacToeProps> = ({ gameState, playerId, onMakeMove }) => {
  const { board, turn, winner, xPlayer, oPlayer } = gameState;
  const isMyTurn = turn === playerId;
  const mySymbol = playerId === xPlayer ? 'X' : (playerId === oPlayer ? 'O' : null);

  const getStatusMessage = () => {
    if (winner) {
      if (winner === 'draw') return 'Permainan Seri!';
      if (winner === playerId) return 'Kamu Menang!';
      return 'Kamu Kalah!';
    }
    if(xPlayer && oPlayer) {
        return isMyTurn ? 'Giliranmu!' : 'Menunggu lawan...';
    }
    return 'Menunggu pemain lain...';
  };
  
  const statusColor = winner ? (winner === playerId ? 'text-green-500' : winner === 'draw' ? 'text-yellow-600' : 'text-red-500') : (isMyTurn ? 'text-primary-500' : 'text-gray-500');

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className={`mb-4 text-2xl font-bold font-display ${statusColor}`}>
        {getStatusMessage()}
      </div>
       {mySymbol && <p className="mb-4 text-gray-600">Kamu bermain sebagai <span className={`font-bold ${mySymbol === 'X' ? 'text-primary-500' : 'text-secondary-500'}`}>{mySymbol}</span></p>}
      <div className="grid grid-cols-3 gap-3 p-3 bg-gray-200 rounded-2xl">
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => isMyTurn && !cell && !winner && onMakeMove(index)}
            className={`w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-xl bg-white shadow-md transition-all duration-200
            ${isMyTurn && !cell && !winner ? 'cursor-pointer hover:bg-gray-100' : 'cursor-not-allowed'}`}
          >
            {cell === 'X' ? <XIcon /> : cell === 'O' ? <OIcon /> : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicTacToe;