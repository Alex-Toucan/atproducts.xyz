import { useRef } from "react";
import { Status } from "../../Data/gameStatus";
import { useAppContext } from "../context/AppContext";
import { claimDraw } from "../../Reducer/actions";

const Control = () => {
  const {
    appState: { gameStatus, notation },
    dispatch,
  } = useAppContext();

  const notationDiv = useRef<HTMLDivElement>(null);
  notationDiv.current?.scrollTo({
    top: notationDiv.current.scrollHeight,
    behavior: "smooth",
  });

  const clickHandler = () => dispatch(claimDraw());

  const disabledHandler =
    gameStatus === Status.threefoldRepetition ||
    gameStatus === Status.fiftyMoveRule
      ? false
      : true;

  return (
    <div className="control">
      <div className="notation" ref={notationDiv}>
        {notation.map((turn, index) => (
          <div className="relative pl-2 move-row" key={index}>
            <span>
              {turn[0][0] === "1" || turn[0][0] === "0" ? "" : `${index + 1}. `}
              {turn[0]}
            </span>
            <span className="absolute -translate-y-1/2 black-move top-1/2 left-[6.5rem]">
              {turn[1] || ""}
            </span>
          </div>
        ))}
      </div>
      <div>
        <button onClick={clickHandler} disabled={disabledHandler}>
          Claim Draw
        </button>
      </div>
    </div>
  );
};

export default Control;
