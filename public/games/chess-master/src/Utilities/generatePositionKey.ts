import { Castle, Moves } from "../Data/interfaces";

export function generatePositionKey({
  position,
  turn,
  castle,
  enPassantSquares,
}: {
  position: string[][];
  turn: "w" | "b";
  castle: Castle;
  enPassantSquares: Moves;
}) {
  return JSON.stringify({ position, turn, castle, enPassantSquares });
}
