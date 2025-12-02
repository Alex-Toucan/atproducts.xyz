import { useEffect, useRef, useState } from "react";
import { files, filesNumbers, ranks } from "../../Data/ranksAndFiles";
import Piece from "./Piece";
import { useAppContext } from "../context/AppContext";
import { performMove } from "../../arbiter/performMove";
import {
  changeStatus,
  getCandidates,
  isKingInCheck,
  updateNotation,
} from "../../Reducer/actions";
import { getIsKingInCheck } from "../../arbiter/kingSafety";
import { getGameStatus } from "../../arbiter/getGameStatus";
import { Status } from "../../Data/gameStatus";
import { getMoves } from "../../arbiter/getMoves";

const Pieces = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const { appState, dispatch } = useAppContext();
  const [selectedPiece, setSelectedPiece] = useState<{
    piece: string;
    fileNumber: number;
    rank: number;
  } | null>(null);
  const {
    candidates,
    turn,
    positions,
    gameStatus,
    castle,
    counter,
    draw50,
    enPassantSquares,
    positionsHistory,
    unclaimedRepetition,
    notation,
    drawClaimed,
  } = appState;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getCoordinates = (e: React.DragEvent) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const { width, left, top } = rect;
    return {
      x: Math.floor((e.clientX - left) / (width / 8)) + 1,
      y: 8 - Math.floor((e.clientY - top) / (width / 8)),
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const data = e.dataTransfer.getData("data");
    const { x, y } = getCoordinates(e);
    performMove({
      data,
      x,
      y,
      positions,
      candidates,
      turn,
      castle: appState.castle,
      dispatch,
      counter: appState.counter,
      enPassantSquares,
      positionsHistory,
      notation,
    });
  };

  const getClassName = (x: number, y: number) => {
    let className = "";
    if (
      candidates.find((candidate) => candidate[0] === x && candidate[1] === y)
    ) {
      if (positions[positions.length - 1][y - 1][x - 1] === "")
        className += " highlight";
      else className += " attack";
    }
    if (
      positions[positions.length - 1][y - 1][x - 1] === `${turn}k` &&
      appState.isKingChecked
    ) {
      className += " check";
    }
    return className;
  };

  const handleClick = (fileNumber: number, rank: number) => {
    const currentPosition = positions[positions.length - 1];
    const clickedPiece = currentPosition[rank - 1][fileNumber - 1];

    if (selectedPiece) {
      // If clicking on a candidate square, perform the move
      if (
        candidates.some(
          (candidate) => candidate[0] === fileNumber && candidate[1] === rank
        )
      ) {
        performMove({
          data: `${selectedPiece.piece},${selectedPiece.fileNumber},${selectedPiece.rank}`,
          x: fileNumber,
          y: rank,
          positions,
          candidates,
          turn,
          castle: appState.castle,
          dispatch,
          counter: appState.counter,
          enPassantSquares: appState.enPassantSquares,
          positionsHistory: appState.positionsHistory,
          notation: appState.notation,
        });
        setSelectedPiece(null); // Deselect after move
        return;
      }

      // Deselect if clicking on the same piece again
      if (
        selectedPiece.fileNumber === fileNumber &&
        selectedPiece.rank === rank
      ) {
        setSelectedPiece(null);
        dispatch(getCandidates({ candidates: [] })); // Clear candidates
        return;
      }
    }

    // Select the clicked piece if it matches the turn
    if (clickedPiece && clickedPiece[0] === turn) {
      setSelectedPiece({ piece: clickedPiece, fileNumber, rank });
      const moves = getMoves({
        piece: clickedPiece,
        file: fileNumber,
        rank,
        positions,
        turn,
        castle: appState.castle,
        isKingChecked: appState.isKingChecked,
      });
      dispatch(getCandidates({ candidates: moves })); // Show candidates
    }
  };

  useEffect(() => {
    if (drawClaimed) {
      notation.push(["1/2 - 1/2"]);
      dispatch(updateNotation({ notation }));
    }
  }, [drawClaimed]);

  useEffect(() => {
    const currentPosition = positions[positions.length - 1];
    const isKingChecked = getIsKingInCheck({
      currentPosition,
      turn,
    });

    if (isKingChecked !== appState.isKingChecked)
      dispatch(isKingInCheck({ isKingChecked }));

    const status = getGameStatus({
      isKingChecked,
      positions,
      turn,
      castle,
      draw50,
      counter,
      positionsHistory,
      unclaimedRepetition,
      dispatch,
    });

    // update notation
    if (isKingChecked || status !== gameStatus) {
      const notationSuffix =
        status === Status.blackWin || status === Status.whiteWin
          ? "#"
          : isKingChecked
          ? "+"
          : "";
      notation[notation.length - 1][notation[notation.length - 1].length - 1] +=
        notationSuffix;
      dispatch(updateNotation({ notation }));
    }

    if (status !== gameStatus) {
      if (status === Status.blackWin) {
        notation.push(["0 - 1"]);
        dispatch(updateNotation({ notation }));
      } else if (status === Status.whiteWin) {
        notation.push(["1 - 0"]);
        dispatch(updateNotation({ notation }));
      } else if (
        status === Status.draw75 ||
        status === Status.insufficientMaterial ||
        status === Status.stalemate
      ) {
        notation.push(["1/2 - 1/2"]);
        dispatch(updateNotation({ notation }));
      }
      dispatch(changeStatus({ gameStatus: status }));
    }
  }, [turn]);

  return (
    <div
      ref={boardRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="relative z-10 board"
    >
      {ranks.map((rank) => {
        return (
          <div key={rank} className="rank">
            {files.map((file, index) => {
              return (
                <div
                  onClick={() => handleClick(filesNumbers[index], rank)}
                  key={file + "" + rank}
                  className={`square ${getClassName(
                    filesNumbers[index],
                    rank
                  )}`}
                >
                  {positions[positions.length - 1][rank - 1][
                    filesNumbers[index] - 1
                  ] === "" ? (
                    ""
                  ) : (
                    <Piece
                      fileNumber={filesNumbers[index]}
                      rank={rank}
                      piece={
                        positions[positions.length - 1][rank - 1][
                          filesNumbers[index] - 1
                        ]
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Pieces;
