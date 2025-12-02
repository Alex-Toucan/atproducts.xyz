import { Status } from "../Data/gameStatus";
import { GameStatusParams } from "../Data/interfaces";
import { editUnclaimedRepetition } from "../Reducer/actions";
import { getPiecePosition } from "../Utilities/getPiecePosition";
import { getMoves } from "./getMoves";

export const getGameStatus = ({
  isKingChecked,
  positions,
  turn,
  castle,
  draw50,
  counter,
  positionsHistory,
  unclaimedRepetition,
  dispatch,
}: GameStatusParams) => {
  const currentPosition = positions[positions.length - 1];
  const pieces: { piece: string; rank: number; file: number }[] = [];

  currentPosition.forEach((row, r) =>
    row.forEach((piece, f) =>
      piece && (piece.startsWith("b") || piece.startsWith("w"))
        ? pieces.push({ piece, rank: r + 1, file: f + 1 })
        : null
    )
  );

  // insufficient material
  if (
    pieces.length === 2 ||
    (pieces.length === 3 &&
      pieces.some((p) => p.piece.endsWith("n") || p.piece.endsWith("b")))
  ) {
    return Status.insufficientMaterial;
  }
  if (
    pieces.length === 4 &&
    pieces.some((p) => p.piece === "wb") &&
    pieces.some((p) => p.piece === "bb")
  ) {
    const { rank: wbRank, file: wbFile } = getPiecePosition(
      currentPosition,
      "wb"
    );
    const { rank: bbRank, file: bbFile } = getPiecePosition(
      currentPosition,
      "bb"
    );
    let wbColor = "light";
    let bbColor = "light";
    if (
      (wbRank % 2 === 0 && wbFile % 2 === 0) ||
      (wbRank % 2 !== 0 && wbFile % 2 !== 0)
    )
      wbColor = "dark";
    if (
      (bbRank % 2 === 0 && bbFile % 2 === 0) ||
      (bbRank % 2 !== 0 && bbFile % 2 !== 0)
    )
      bbColor = "dark";
    if (wbColor === bbColor) return Status.insufficientMaterial;
  }

  // stalemate and checkmate
  const ourPieces = pieces.filter((p) => p.piece[0] === turn);
  const moves = [];
  for (const p of ourPieces) {
    moves.push(
      ...getMoves({
        rank: p.rank,
        file: p.file,
        piece: p.piece,
        positions,
        turn,
        isKingChecked,
        castle,
      })
    );
    if (moves.length) break;
  }
  if (!moves.length) {
    if (isKingChecked) return turn === "w" ? Status.blackWin : Status.whiteWin;
    else return Status.stalemate;
  }

  // 50 move rule
  if (counter - draw50.counter50 === 50 && draw50.turn === turn)
    return Status.fiftyMoveRule;

  // 75 move rule
  if (counter - draw50.counter50 === 75 && draw50.turn === turn)
    return Status.draw75;

  // threefold repetition
  for (const key in positionsHistory) {
    const keyCounter = positionsHistory[key];
    if (keyCounter >= 3) {
      if (!unclaimedRepetition[key]) {
        unclaimedRepetition[key] = keyCounter;
        dispatch(editUnclaimedRepetition({ unclaimedRepetition }));
        return Status.threefoldRepetition;
      } else if (unclaimedRepetition[key] !== keyCounter) {
        unclaimedRepetition[key] = keyCounter;
        dispatch(editUnclaimedRepetition({ unclaimedRepetition }));
        return Status.threefoldRepetition;
      }
    }
  }

  return Status.ongoing;
};
