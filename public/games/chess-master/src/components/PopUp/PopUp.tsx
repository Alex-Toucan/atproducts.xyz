import wk from "../../assets/wk.webp";
import { Status } from "../../Data/gameStatus";
import { useAppContext } from "../context/AppContext";
import bk from "../../assets/bk.webp";
import { resetTheGame } from "../../Reducer/actions";

const PopUp = () => {
  const {
    appState: { gameStatus, drawClaimed },
    dispatch,
  } = useAppContext();

  const clickHandler = () => {
    dispatch(resetTheGame());
  };

  return (
    <div
      className={` duration-200 absolute top-0 left-0 z-50 items-center justify-center w-full h-full text-primary ${
        gameStatus === Status.ongoing ||
        ((gameStatus === Status.fiftyMoveRule ||
          gameStatus === Status.threefoldRepetition) &&
          !drawClaimed)
          ? "hidden"
          : "flex"
      }`}
    >
      <div className="p-8 bg-secondary border-4 border-primary rounded shadow-lg min-w-[40%] flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold">Game Over</h2>
        <p
          className={`text-lg font-semibold ${
            gameStatus === Status.whiteWin
              ? "text-white"
              : gameStatus === Status.blackWin
              ? "text-black"
              : ""
          }`}
        >
          {gameStatus === Status.stalemate
            ? "Stalemate"
            : gameStatus === Status.insufficientMaterial
            ? "Insufficient Material"
            : gameStatus === Status.draw75
            ? "Draw by 75 Move Rule"
            : gameStatus === Status.blackWin
            ? "Black Win"
            : gameStatus === Status.whiteWin
            ? "White Win"
            : gameStatus === Status.threefoldRepetition && drawClaimed
            ? "Draw by Threefold Repetition"
            : gameStatus === Status.fiftyMoveRule && drawClaimed
            ? "Draw by Fifty Move Rule"
            : ""}
        </p>
        <div>
          {gameStatus === Status.stalemate ||
          gameStatus === Status.insufficientMaterial ||
          gameStatus === Status.draw75 ||
          ((gameStatus === Status.fiftyMoveRule ||
            gameStatus === Status.threefoldRepetition) &&
            drawClaimed) ? (
            <div className="flex items-center justify-center">
              <img src={wk} alt="wk" className="w-16 h-16" />
              <img src={bk} alt="bk" className="w-16 h-16" />
            </div>
          ) : gameStatus === Status.blackWin ? (
            <div className="flex items-center justify-center">
              <img src={bk} alt="bk" className="w-16 h-16" />
            </div>
          ) : gameStatus === Status.whiteWin ? (
            <div className="flex items-center justify-center">
              <img src={wk} alt="wk" className="w-16 h-16" />
            </div>
          ) : (
            ""
          )}
        </div>
        <button className="mt-4" onClick={clickHandler}>
          New Game
        </button>
      </div>
    </div>
  );
};

export default PopUp;
