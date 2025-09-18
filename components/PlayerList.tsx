import React from 'react';
import { Player, TicTacToeGameState } from '../types';

interface PlayerListProps {
  players: Player[];
  gameState: TicTacToeGameState;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, gameState }) => {
  const { turn, xPlayer, oPlayer } = gameState;
  
  return (
    <div>
      <h2 className="text-xl font-display font-bold mb-3 text-gray-800 border-b border-gray-200 pb-2">Pemain ({players.length})</h2>
      <ul className="space-y-2">
        {players.map((player) => {
          const isTurn = player.id === turn;
          const symbol = player.id === xPlayer ? 'X' : (player.id === oPlayer ? 'O' : null);

          return (
            <li
              key={player.id}
              className={`flex items-center justify-between p-2 rounded-lg transition-all ${isTurn ? 'bg-primary-100' : ''}`}
            >
              <span className="font-semibold text-gray-700">{player.username}</span>
              <div className="flex items-center space-x-2">
                {symbol && (
                  <span className={`font-bold text-lg ${symbol === 'X' ? 'text-primary-500' : 'text-secondary-500'}`}>
                    {symbol}
                  </span>
                )}
                {isTurn && (
                  <span className="text-xs text-primary-600 font-bold animate-pulse">TURN</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PlayerList;