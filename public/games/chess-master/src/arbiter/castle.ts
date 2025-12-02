import { GetMoves, Moves } from "../Data/interfaces";
import { isValidMoveWRTCheck } from "./kingSafety";

export const checkCastle = (params: GetMoves): Moves => {
  const { turn, positions, isKingChecked } = params;
  const castleMoves: Moves = [];
  const currentPosition = positions[params.positions.length - 1];
  const rank = turn === "w" ? 1 : 8;

  if (!isKingChecked) {
    if (params.castle[turn as "w" | "b"].king) {
      if (
        currentPosition[rank - 1][5] === "" &&
        currentPosition[rank - 1][6] === "" &&
        isValidMoveWRTCheck({
          currentPosition,
          move: { newRank: rank, newFile: 6 },
          piece: `${turn}k`,
          rank,
          file: 5,
        }) &&
        isValidMoveWRTCheck({
          currentPosition,
          move: { newRank: rank, newFile: 7 },
          piece: `${turn}k`,
          rank,
          file: 5,
        })
      )
        castleMoves.push([7, rank]);
    }

    if (params.castle[turn as "w" | "b"].queen) {
      if (
        currentPosition[rank - 1][1] === "" &&
        currentPosition[rank - 1][2] === "" &&
        currentPosition[rank - 1][3] === "" &&
        isValidMoveWRTCheck({
          currentPosition,
          move: { newRank: rank, newFile: 4 },
          piece: `${turn}k`,
          rank,
          file: 5,
        }) &&
        isValidMoveWRTCheck({
          currentPosition,
          move: { newRank: rank, newFile: 3 },
          piece: `${turn}k`,
          rank,
          file: 5,
        })
      )
        castleMoves.push([3, rank]);
    }
  }

  return castleMoves;
};
