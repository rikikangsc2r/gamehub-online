
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { GameState, Player, ChatMessage, ServerMessage, ClientMessage } from '../types';
import TicTacToe from './TicTacToe';
import Chat from './Chat';
import PlayerList from './PlayerList';

const WS_URL = "wss://nirkyy-gamestate.hf.space";

interface GameRoomProps {
  roomId: string;
  username: string;
  onLeave: () => void;
}

type GameAction =
  | { type: 'SET_CONNECTION_STATUS'; payload: 'connecting' | 'connected' | 'disconnected' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_INITIAL_STATE'; payload: GameState; playerId: string }
  | { type: 'PLAYER_JOINED'; payload: Player }
  | { type: 'PLAYER_LEFT'; payload: { id: string } }
  | { type: 'NEW_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'GAME_UPDATE'; payload: any };

interface State {
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  error: string | null;
  gameState: GameState | null;
  playerId: string | null;
}

const initialState: State = {
  connectionStatus: 'connecting',
  error: null,
  gameState: null,
  playerId: null,
};

function gameReducer(state: State, action: GameAction): State {
  switch (action.type) {
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, connectionStatus: 'disconnected' };
    case 'SET_INITIAL_STATE':
      return { ...state, gameState: action.payload, playerId: action.playerId };
    case 'PLAYER_JOINED':
      if (!state.gameState) return state;
      if (state.gameState.players.some(p => p.id === action.payload.id)) return state;
      return {
        ...state,
        gameState: {
          ...state.gameState,
          players: [...state.gameState.players, action.payload],
        },
      };
    case 'PLAYER_LEFT':
       if (!state.gameState) return state;
       return {
         ...state,
         gameState: {
           ...state.gameState,
           players: state.gameState.players.filter(p => p.id !== action.payload.id),
         },
       };
    case 'NEW_CHAT_MESSAGE':
       if (!state.gameState) return state;
       return {
         ...state,
         gameState: {
           ...state.gameState,
           chat: [...state.gameState.chat, action.payload],
         },
       };
    case 'GAME_UPDATE':
      if (!state.gameState) return state;
      return {
          ...state,
          gameState: {
              ...state.gameState,
              game: action.payload,
          },
      };
    default:
      return state;
  }
}

const LinkIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
);


const GameRoom: React.FC<GameRoomProps> = ({ roomId, username, onLeave }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [showCopied, setShowCopied] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);
    
    ws.current.onopen = () => {
      console.log('WebSocket Connected');
      dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'connected' });
      const joinMessage: ClientMessage = {
        type: 'JOIN_ROOM',
        payload: { roomId, username },
      };
      ws.current?.send(JSON.stringify(joinMessage));
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data) as ServerMessage;
      console.log('Received:', message);

      switch (message.type) {
        case 'ROOM_JOINED': {
          const gameState = message.payload as GameState;
          const me = gameState.players.find(p => p.username === username);
          if (me) {
            dispatch({ type: 'SET_INITIAL_STATE', payload: gameState, playerId: me.id });
          } else {
            dispatch({ type: 'SET_ERROR', payload: `Gagal menemukan pengguna "${username}" di dalam room.` });
          }
          break;
        }
        case 'PLAYER_JOINED':
          dispatch({ type: 'PLAYER_JOINED', payload: message.payload });
          break;
        case 'PLAYER_LEFT':
          dispatch({ type: 'PLAYER_LEFT', payload: message.payload });
          break;
        case 'NEW_CHAT_MESSAGE':
          dispatch({ type: 'NEW_CHAT_MESSAGE', payload: { ...message.payload, timestamp: new Date().toLocaleTimeString() } });
          break;
        case 'GAME_UPDATE':
           dispatch({ type: 'GAME_UPDATE', payload: message.payload.details });
          break;
        case 'ERROR':
          dispatch({ type: 'SET_ERROR', payload: message.payload.message });
          break;
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket Disconnected');
      if(state.connectionStatus !== 'disconnected') {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: 'disconnected' });
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Koneksi gagal. Silakan coba lagi.' });
    };

    return () => {
      ws.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, username]);
  
  const handleInvite = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  const sendMessage = (message: ClientMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };
  
  const handleMakeMove = (index: number) => {
    sendMessage({
      type: 'GAME_ACTION',
      payload: {
        action: 'MAKE_MOVE',
        details: { index },
      },
    });
  };

  const handleSendChat = (message: string) => {
    sendMessage({
      type: 'CHAT_MESSAGE',
      payload: { message },
    });
  };

  if (state.connectionStatus === 'connecting') {
    return <div className="text-center text-primary-500 text-2xl font-display">Menyambungkan ke Room...</div>;
  }

  if (state.error) {
    return (
      <div className="text-center">
        <h2 className="text-red-500 text-2xl font-display mb-4">Error</h2>
        <p className="mb-4">{state.error}</p>
        <button onClick={onLeave} className="py-2 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600">Kembali ke Lobby</button>
      </div>
    );
  }
  
  if (!state.gameState || !state.playerId) {
    return <div className="text-center text-gray-500">Menunggu data room...</div>;
  }

  return (
    <div className="w-full h-full animate-fade-in">
        <header className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-800">Tic-Tac-Toe</h1>
                <div className="flex items-center gap-2 mt-1 relative">
                    <p className="text-gray-600">Room ID: <span className="font-bold text-primary-500">{state.gameState.roomId}</span></p>
                    <button onClick={handleInvite} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 font-semibold transition-colors" title="Salin ID Room">
                        <LinkIcon className="w-4 h-4" />
                        Undang Teman
                    </button>
                    {showCopied && <span className="absolute left-0 -bottom-7 text-xs bg-gray-800 text-white px-2 py-1 rounded-md animate-fade-in">ID Disalin!</span>}
                </div>
            </div>
            <button onClick={onLeave} className="py-2 px-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors">
                Keluar
            </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-4 sm:p-6 bg-white border border-gray-200 rounded-2xl shadow-lg">
                <TicTacToe 
                    gameState={state.gameState.game}
                    playerId={state.playerId}
                    onMakeMove={handleMakeMove}
                />
            </div>
            <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-2xl shadow-lg">
                    <PlayerList players={state.gameState.players} gameState={state.gameState.game} />
                </div>
                 <div className="p-4 sm:p-6 bg-white border border-gray-200 rounded-2xl shadow-lg flex-1 min-h-[300px] sm:min-h-0">
                    <Chat messages={state.gameState.chat} onSendMessage={handleSendChat} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default GameRoom;