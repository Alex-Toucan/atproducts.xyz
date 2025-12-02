import { Status as IStatus } from "./interfaces";

export const Status: IStatus = {
  ongoing: "ongoing",
  whiteWin: "whiteWin",
  blackWin: "blackWin",
  stalemate: "stalemate",
  insufficientMaterial: "insufficientMaterial",
  threefoldRepetition: "threefoldRepetition",
  fiftyMoveRule: "fiftyMoveRule",
  draw75: "draw75",
};
