import piecesDirections from "../Data/piecesDirections";
import { copyPositionsArray } from "../Utilities/copyPositionsArray";
import { getPiecePosition } from "../Utilities/getPiecePosition";

const getIsKingInCheck = ({
  turn,
  currentPosition,
}: {
  turn: string;
  currentPosition: string[][];
}) => {
  const king = `${turn}k`;
  const kingPosition = getPiecePosition(currentPosition, king);
  if (kingPosition.rank === 0 || kingPosition.file === 0) {
    throw new Error("King position not found");
  }
  const { rank, file } = kingPosition;
  // is queen or rook is threatening the king
  const rookDirections = piecesDirections.r;
  const rookstep = 8;
  const enemy = turn === "w" ? "b" : "w";
  for (const [x, y] of rookDirections) {
    for (let i = 1; i < rookstep; i++) {
      const newFile = file + i * x;
      const newRank = rank + i * y;
      if (
        newFile < 1 ||
        newFile > 8 ||
        newRank < 1 ||
        newRank > 8 ||
        currentPosition[newRank - 1]?.[newFile - 1]?.[0] === turn
      )
        break;
      if (
        currentPosition[newRank - 1]?.[newFile - 1] === `${enemy}r` ||
        currentPosition[newRank - 1]?.[newFile - 1] === `${enemy}q`
      )
        return true;
      else if (currentPosition[newRank - 1]?.[newFile - 1]?.[0] === enemy)
        break;
    }
  }
  // is queen or bishop is threatening the king
  const bishopDirections = piecesDirections.b;
  const bishopstep = 8;
  for (const [x, y] of bishopDirections) {
    for (let i = 1; i < bishopstep; i++) {
      const newFile = file + i * x;
      const newRank = rank + i * y;
      if (
        newFile < 1 ||
        newFile > 8 ||
        newRank < 1 ||
        newRank > 8 ||
        currentPosition[newRank - 1]?.[newFile - 1]?.[0] === turn
      ) {
        break;
      }
      if (
        currentPosition[newRank - 1]?.[newFile - 1] === `${enemy}b` ||
        currentPosition[newRank - 1]?.[newFile - 1] === `${enemy}q`
      )
        return true;
      else if (currentPosition[newRank - 1]?.[newFile - 1]?.[0] === enemy)
        break;
    }
  }
  // is knight threatening the king
  const knightDirections = piecesDirections.n;
  const knightstep = 2;
  for (const [x, y] of knightDirections) {
    for (let i = 1; i < knightstep; i++) {
      const newFile = file + i * x;
      const newRank = rank + i * y;
      if (
        newFile < 1 ||
        newFile > 8 ||
        newRank < 1 ||
        newRank > 8 ||
        currentPosition[newRank - 1]?.[newFile - 1]?.[0] === turn
      ) {
        break;
      }
      if (currentPosition[newRank - 1]?.[newFile - 1] === `${enemy}n`) {
        return true;
      }
    }
  }
  // is pawn threatening the king
  if (
    currentPosition[rank + (turn === "w" ? 1 : -1) - 1]?.[file + 1 - 1] ===
    `${enemy}p`
  ) {
    return true;
  }
  if (
    currentPosition[rank + (turn === "w" ? 1 : -1) - 1]?.[file - 1 - 1] ===
    `${enemy}p`
  ) {
    return true;
  }
  // is king threatening the king
  const kingDirections = piecesDirections.k;
  const kingstep = 2;
  for (const [x, y] of kingDirections) {
    for (let i = 1; i < kingstep; i++) {
      const newFile = file + i * x;
      const newRank = rank + i * y;
      if (
        newFile < 1 ||
        newFile > 8 ||
        newRank < 1 ||
        newRank > 8 ||
        currentPosition[newRank - 1]?.[newFile - 1]?.[0] === turn
      ) {
        break;
      }
      if (currentPosition[newRank - 1]?.[newFile - 1] === `${enemy}k`) {
        return true;
      }
    }
  }

  return false;
};

const isValidMoveWRTCheck = ({
  currentPosition,
  move,
  piece,
  rank,
  file,
}: {
  currentPosition: string[][];
  move: { newRank: number; newFile: number };
  piece: string;
  rank: number;
  file: number;
}) => {
  const { newRank, newFile } = move;
  const newPosition = copyPositionsArray(currentPosition);
  newPosition[newRank - 1][newFile - 1] = piece;
  newPosition[rank - 1][file - 1] = "";
  const isKingInCheck = getIsKingInCheck({
    turn: piece[0],
    currentPosition: newPosition,
  });
  return !isKingInCheck;
};

export { isValidMoveWRTCheck, getIsKingInCheck };
