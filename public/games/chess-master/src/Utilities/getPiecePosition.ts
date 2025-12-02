export const getPiecePosition = (
  currentPositions: string[][],
  piece: string
) => {
  for (let rank = 1; rank <= 8; rank++) {
    for (let file = 1; file <= 8; file++) {
      if (currentPositions[rank - 1][file - 1] === piece) {
        return { rank, file };
      }
    }
  }
  return { rank: 0, file: 0 };
};
