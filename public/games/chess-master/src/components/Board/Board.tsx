import { files, filesNumbers, ranks } from "../../Data/ranksAndFiles";

const Board = () => {
  return (
    <div className="board">
      <div>
        {ranks.map((rank) => {
          return (
            <div key={rank} className="rank">
              {files.map((file, index) => {
                return (
                  <div
                    key={file + rank}
                    className={`square ${
                      (filesNumbers[index] % 2 === 0 && rank % 2 === 0) ||
                      (filesNumbers[index] % 2 !== 0 && rank % 2 !== 0)
                        ? "bg-primary text-secondary"
                        : "bg-secondary text-primary"
                    }`}
                  >
                    {rank === 1 ? (
                      <span className="absolute sm:left-1 left-[1px] bottom-[1px] text-xs sm:bottom-1 sm:text-sm">
                        {file}
                      </span>
                    ) : (
                      ""
                    )}
                    {filesNumbers[index] === 8 ? (
                      <span className="absolute top-[1px] right-[1px] sm:right-1 sm:top-1 text-xs sm:text-sm">
                        {rank}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;
