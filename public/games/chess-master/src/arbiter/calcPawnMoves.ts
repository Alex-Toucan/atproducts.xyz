import { getEnPassantMovesParam, GetMoves, Moves } from "../Data/interfaces";
import { isValidMoveWRTCheck } from "./kingSafety";

const calcPawnMoves = (
  { rank, file, positions, turn, piece }: GetMoves,
  directions: number[][]
) => {
  const moves: Moves = [];
  const enemy = turn === "w" ? "b" : "w";
  const step = rank === (turn === "w" ? 2 : 7) ? 3 : 2;
  const currentPosition = positions[positions.length - 1];
  for (const [x, y] of directions) {
    for (let i = 1; i < step; i++) {
      const newFile = file + i * x;
      const newRank = rank + i * y;

      if (
        currentPosition[newRank - 1]?.[newFile - 1] === "" &&
        isValidMoveWRTCheck({
          currentPosition,
          move: { newRank, newFile },
          piece,
          rank,
          file,
        })
      )
        moves.push([newFile, newRank]);
    }
  }

  // Attack moves
  if (
    currentPosition[rank + (turn === "w" ? 1 : -1) - 1]?.[file + 1 - 1]?.[0] ===
      enemy &&
    isValidMoveWRTCheck({
      currentPosition,
      move: { newRank: rank + (turn === "w" ? 1 : -1), newFile: file + 1 },
      piece,
      rank,
      file,
    })
  )
    moves.push([file + 1, rank + (turn === "w" ? 1 : -1)]);

  if (
    currentPosition[rank + (turn === "w" ? 1 : -1) - 1]?.[file - 1 - 1]?.[0] ===
      enemy &&
    isValidMoveWRTCheck({
      currentPosition,
      move: { newRank: rank + (turn === "w" ? 1 : -1), newFile: file - 1 },
      piece,
      rank,
      file,
    })
  )
    moves.push([file - 1, rank + (turn === "w" ? 1 : -1)]);

  const enPassantMoves = getEnPassantMoves({
    positions,
    rank,
    file,
    turn,
    piece,
  });

  return [...moves, ...enPassantMoves];
};

const getEnPassantMoves = ({
  positions,
  rank,
  file,
  turn,
  piece,
}: getEnPassantMovesParam) => {
  const moves: Moves = [];
  const enemy = turn === "w" ? "b" : "w";
  const currentPosition = positions[positions.length - 1];
  const lastPositions = positions[positions.length - 2];

  if (
    currentPosition[rank - 1]?.[file - 1 - 1] === `${enemy}p` &&
    lastPositions[rank - 1]?.[file - 1 - 1] === "" &&
    lastPositions[rank + (turn === "w" ? 1 : -1) - 1]?.[file - 1 - 1] === "" &&
    isValidMoveWRTCheck({
      currentPosition,
      move: { newRank: rank + (turn === "w" ? 1 : -1), newFile: file - 1 },
      piece,
      rank,
      file,
    })
  )
    moves.push([file - 1, rank + (turn === "w" ? 1 : -1)]);

  if (
    currentPosition[rank - 1]?.[file - 1 + 1] === `${enemy}p` &&
    lastPositions[rank - 1]?.[file - 1 + 1] === "" &&
    lastPositions[rank + (turn === "w" ? 1 : -1) - 1]?.[file - 1 + 1] === "" &&
    isValidMoveWRTCheck({
      currentPosition,
      move: { newRank: rank + (turn === "w" ? 1 : -1), newFile: file + 1 },
      piece,
      rank,
      file,
    })
  )
    moves.push([file + 1, rank + (turn === "w" ? 1 : -1)]);

  return moves;
};

export { calcPawnMoves, getEnPassantMoves };
