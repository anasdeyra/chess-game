import { spawn } from "./usePiece";

export default function useFen(fen = defaultFen) {
  const [setup, activeColor, castling, enPassant, halfMove, fullMove] =
    fen.split(" ");

  function setupBoard(board = {}) {
    var currentRank = 8;
    var currentFile = "a";
    const ranks = setup.split("/");
    ranks.forEach((rank, i) => {
      [...rank].forEach((square) => {
        if (isNaN(square)) {
          board[currentFile + currentRank] = spawn(square);
          return (currentFile = String.fromCharCode(
            currentFile.charCodeAt(0) + 1
          ));
        }

        currentFile = String.fromCharCode(
          currentFile.charCodeAt(0) + Number(square)
        );
      });
      currentRank--;
      currentFile = "a";
    });
    return board;
  }

  function availableCastles() {
    var kingSide,
      queenSide,
      kingSideBlack,
      queenSideBlack = false;
    if (castling !== "-") {
      [...castling].forEach((p) => {
        const side = spawn(p);
        if (side.color === "black")
          switch (side.type) {
            case "queen":
              queenSideBlack = true;
              break;
            case "king":
              kingSideBlack = true;
              break;
          }
        if (side.color === "white")
          switch (side.type) {
            case "queen":
              queenSide = true;
              break;
            case "king":
              kingSide = true;
              break;
          }
      });
    }
    return { kingSide, queenSide, kingSideBlack, queenSideBlack };
  }

  return {
    setupBoard,
    halfMoves: Number(halfMove),
    fullMoves: Number(fullMove),
    enPassant: enPassant === "-" ? null : enPassant,
    activeColor: activeColor === "w" ? "white" : "black",
    availableCastles: availableCastles(),
  };
}

const defaultFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
