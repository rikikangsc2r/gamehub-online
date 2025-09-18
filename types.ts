
export interface Player {
  id: string;
  username: string;
}

export interface ChatMessage {
  from: string;
  message: string;
  timestamp: string;
}

export type TicTacToeBoard = (string | null)[];

export interface TicTacToeGameState {
  board: TicTacToeBoard;
  turn: string; // Player ID
  winner: string | null; // Player ID or 'draw'
  xPlayer: string | null; // Player ID
  oPlayer: string | null; // Player ID
}

export interface GameState {
  roomId: string;
  players: Player[];
  chat: ChatMessage[];
  game: TicTacToeGameState;
  hostId: string | null;
}

// Client to Server
export interface JoinRoomPayload {
  roomId: string;
  username: string;
}

export interface ChatMessagePayload {
  message: string;
}

export interface GameActionPayload {
  action: 'MAKE_MOVE';
  details: {
    index: number;
  };
}

export type ClientMessage =
  | { type: 'JOIN_ROOM'; payload: JoinRoomPayload }
  | { type: 'CHAT_MESSAGE'; payload: ChatMessagePayload }
  | { type: 'GAME_ACTION'; payload: GameActionPayload };

// Server to Client
export interface RoomJoinedPayload {
  roomId: string;
  players: Player[];
  gameState: GameState;
  // FIX: Add playerId to the payload
  playerId: string;
}

export interface PlayerJoinedPayload {
  id: string;
  username: string;
}

export interface PlayerLeftPayload {
  id: string;
  username: string;
}

export interface NewChatMessagePayload {
  from: string;
  message: string;
}

export interface GameUpdatePayload {
  from: string;
  action: string;
  details: any;
}

export interface ErrorPayload {
  message: string;
}

export type ServerMessage =
  | { type: 'ROOM_JOINED'; payload: RoomJoinedPayload }
  | { type: 'PLAYER_JOINED'; payload: PlayerJoinedPayload }
  | { type: 'PLAYER_LEFT'; payload: PlayerLeftPayload }
  | { type: 'NEW_CHAT_MESSAGE'; payload: NewChatMessagePayload }
  | { type: 'GAME_UPDATE'; payload: GameUpdatePayload }
  | { type: 'ERROR'; payload: ErrorPayload };