import { Dispatch, ReactNode } from "react";

interface State {
  positions: string[][][];
  turn: "w" | "b";
  counter: number;
  draw50: {
    counter50: number;
    turn: "w" | "b";
  };
  candidates: Moves;
  isPromotion: boolean;
  promotion: {
    x: number;
    y: number;
  };
  castle: Castle;
  isKingChecked: boolean;
  gameStatus: string;
  enPassantSquares: Moves;
  positionsHistory: {
    [key: string]: number;
  };
  drawClaimed: boolean;
  unclaimedRepetition: {
    [key: string]: number;
  };
  notation: string[][];
}
interface Action {
  type: string;
  payload: {
    newPositions?: string[][];
    candidates?: Moves;
    promotion?: {
      x: number;
      y: number;
    };
    castle?: Castle;
    isKingChecked?: boolean;
    gameStatus?: string;
    draw50?: {
      counter50: number;
      turn: "w" | "b";
    };
    enPassantSquares?: Moves;
    positionsHistory?: {
      [key: string]: number;
    };
    unclaimedRepetition?: {
      [key: string]: number;
    };
    notation?: string[][];
  };
}
interface GetMoves {
  piece: string;
  rank: number;
  file: number;
  positions: string[][][];
  turn: "w" | "b";
  castle: Castle;
  isKingChecked: boolean;
}
interface getEnPassantMovesParam {
  positions: string[][][];
  rank: number;
  file: number;
  turn: "w" | "b";
  piece: string;
}
interface AppContextProps {
  children: ReactNode;
}
interface AppProviderValue {
  appState: State;
  dispatch: Dispatch<Action>;
}
interface performMoveParam {
  data: string;
  x: number;
  y: number;
  positions: string[][][];
  candidates: Moves;
  turn: "w" | "b";
  castle: Castle;
  counter: number;
  enPassantSquares: Moves;
  positionsHistory: {
    [key: string]: number;
  };
  notation: string[][];
  dispatch: (arg0: Action) => void;
}
interface PromotionParam {
  x: number;
  y: number;
  piece: string;
  positions: string[][];
  turn: "w" | "b";
  counter: number;
  castle: Castle;
  positionsHistory: {
    [key: string]: number;
  };
  notation: string[][];
  dispatch: (arg0: Action) => void;
}
interface Castle {
  w: {
    king: boolean;
    queen: boolean;
  };
  b: {
    king: boolean;
    queen: boolean;
  };
}
interface Status {
  ongoing: "ongoing";
  whiteWin: "whiteWin";
  blackWin: "blackWin";
  stalemate: "stalemate";
  insufficientMaterial: "insufficientMaterial";
  threefoldRepetition: "threefoldRepetition";
  fiftyMoveRule: "fiftyMoveRule";
  draw75: "draw75";
}
interface GameStatusParams {
  isKingChecked: boolean;
  positions: string[][][];
  turn: "w" | "b";
  castle: Castle;
  draw50: {
    counter50: number;
    turn: "w" | "b";
  };
  counter: number;
  positionsHistory: {
    [key: string]: number;
  };
  unclaimedRepetition: {
    [key: string]: number;
  };
  dispatch: (arg0: Action) => void;
}
type Moves = [number, number][];

export type {
  GetMoves,
  AppContextProps,
  AppProviderValue,
  State,
  Action,
  performMoveParam,
  PromotionParam,
  Castle,
  Moves,
  Status,
  getEnPassantMovesParam,
  GameStatusParams,
};
