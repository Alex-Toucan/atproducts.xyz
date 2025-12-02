import { GetMoves, Moves } from "../Data/interfaces";
import { isValidMoveWRTCheck } from "./kingSafety";

export const calcMoves = (
  { rank, file, positions, turn, piece }: GetMoves,
  directions: number[][],
  range: "step" | "board"
) => {
  const moves: Moves = [];
  const enemy = turn === "w" ? "b" : "w";
  const step = range === "step" ? 2 : 8;
  const currentPosition = positions[positions.length - 1];
  for (const [x, y] of directions) {
    for (let i = 1; i < step; i++) {
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
        isValidMoveWRTCheck({
          currentPosition,
          move: { newRank, newFile },
          piece,
          rank,
          file,
        })
      ) {
        if (currentPosition[newRank - 1]?.[newFile - 1] === "")
          moves.push([newFile, newRank]);
        else if (currentPosition[newRank - 1]?.[newFile - 1]?.[0] === enemy) {
          moves.push([newFile, newRank]);
          break;
        }
      }
    }
  }

  return moves;
};
