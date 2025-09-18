import React, { useEffect, useReducer, useRef } from 'react';
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
      // FIX: Access playerId from action, not action.payload
      return { ...state, gameState: action.payload, playerId: action.playerId };
    case 'PLAYER_JOINED':
      if (!state.gameState) return state;
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

const GameRoom: React.FC<GameRoomProps> = ({ roomId, username, onLeave }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
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
        case 'ROOM_JOINED':
          dispatch({ type: 'SET_INITIAL_STATE', payload: message.payload.gameState, playerId: message.payload.playerId });
          break;
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
              <h1 className="text-4xl font-display font-bold text-gray-800">Tic-Tac-Toe</h1>
              <p className="text-gray-600">Room ID: <span className="font-bold text-primary-500">{state.gameState.roomId}</span></p>
            </div>
            <button onClick={onLeave} className="py-2 px-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors">
                Keluar
            </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 bg-white border border-gray-200 rounded-2xl shadow-lg">
                <TicTacToe 
                    gameState={state.gameState.game}
                    playerId={state.playerId}
                    onMakeMove={handleMakeMove}
                />
            </div>
            <div className="space-y-6">
                <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg">
                    <PlayerList players={state.gameState.players} gameState={state.gameState.game} />
                </div>
                 <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg h-96">
                    <Chat messages={state.gameState.chat} onSendMessage={handleSendChat} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default GameRoom;