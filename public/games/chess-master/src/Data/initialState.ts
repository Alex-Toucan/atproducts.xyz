import { generatePositionKey } from "../Utilities/generatePositionKey";
import { Status } from "./gameStatus";
import { State } from "./interfaces";

const startingPositions = new Array(8)
  .fill("")
  .map(() => new Array(8).fill(""));

startingPositions[0] = ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"];
startingPositions[1] = ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"];
startingPositions[6] = ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"];
startingPositions[7] = ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"];

const initialState: State = {
  positions: [startingPositions],
  turn: "w",
  counter: 1,
  draw50: {
    counter50: 1,
    turn: "w",
  },
  candidates: [],
  isPromotion: false,
  promotion: {
    x: 0,
    y: 0,
  },
  castle: {
    w: {
      king: true,
      queen: true,
    },
    b: {
      king: true,
      queen: true,
    },
  },
  isKingChecked: false,
  gameStatus: Status.ongoing,
  enPassantSquares: [],
  positionsHistory: {},
  drawClaimed: false,
  unclaimedRepetition: {},
  notation: [],
};
const startingKey = generatePositionKey({
  position: startingPositions,
  turn: "w",
  castle: initialState.castle,
  enPassantSquares: initialState.enPassantSquares,
});
initialState.positionsHistory[startingKey] = 1;

export default initialState;
export { startingPositions };
