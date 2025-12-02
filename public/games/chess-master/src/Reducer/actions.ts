import { actionTypes } from "../Data/actionTypes";
import { Action, Castle, Moves } from "../Data/interfaces";

const makeNewMove = ({
  newPositions,
}: {
  newPositions: string[][];
}): Action => {
  return {
    type: actionTypes.NEW_MOVE,
    payload: { newPositions },
  };
};

const getCandidates = ({ candidates }: { candidates: Moves }): Action => {
  return {
    type: actionTypes.GET_CANDIDATES,
    payload: { candidates },
  };
};

const promote = ({
  x,
  y,
  piece,
  newPositions,
}: {
  x: number;
  y: number;
  piece: string;
  newPositions: string[][];
}): Action => {
  const promotion = { x, y, piece };
  return {
    type: actionTypes.PROMOTE,
    payload: { promotion, newPositions },
  };
};

const promotionDone = ({
  newPositions,
}: {
  newPositions: string[][];
}): Action => {
  return {
    type: actionTypes.PROMOTION_DONE,
    payload: { newPositions },
  };
};

const updateCastle = ({ castle }: { castle: Castle }) => {
  return {
    type: actionTypes.UPDATE_CASTLE,
    payload: { castle },
  };
};

const isKingInCheck = ({ isKingChecked }: { isKingChecked: boolean }) => {
  return {
    type: actionTypes.IS_KING_CHECKED,
    payload: { isKingChecked },
  };
};

const changeStatus = ({ gameStatus }: { gameStatus: string }) => {
  return {
    type: actionTypes.CHANGE_STATUS,
    payload: { gameStatus },
  };
};

const updateDraw50 = (draw50: { counter50: number; turn: "w" | "b" }) => {
  return {
    type: actionTypes.UPDATE_DRAW50,
    payload: { draw50 },
  };
};

const enPassant = ({ enPassantSquares }: { enPassantSquares: Moves }) => {
  return {
    type: actionTypes.EN_PASSANT,
    payload: { enPassantSquares },
  };
};

const updatePositionsHistory = ({
  positionsHistory,
}: {
  positionsHistory: { [key: string]: number };
}) => {
  return {
    type: actionTypes.UPDATE_POSITIONS_HISTORY,
    payload: { positionsHistory },
  };
};

const resetTheGame = () => {
  return {
    type: actionTypes.RESET_GAME,
    payload: {},
  };
};

const claimDraw = () => {
  return {
    type: actionTypes.CLAIM_DRAW,
    payload: {},
  };
};

const editUnclaimedRepetition = ({
  unclaimedRepetition,
}: {
  unclaimedRepetition: { [key: string]: number };
}) => {
  return {
    type: actionTypes.EDIT_UNCLAIMED_REPETITION,
    payload: { unclaimedRepetition },
  };
};

const updateNotation = ({ notation }: { notation: string[][] }) => {
  return {
    type: actionTypes.UPDATE_NOTATION,
    payload: { notation },
  };
};

export {
  makeNewMove,
  getCandidates,
  promote,
  promotionDone,
  updateCastle,
  isKingInCheck,
  changeStatus,
  updateDraw50,
  enPassant,
  updatePositionsHistory,
  resetTheGame,
  claimDraw,
  editUnclaimedRepetition,
  updateNotation,
};
