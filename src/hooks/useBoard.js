import { useState } from "react";
import useFen from "./useFen";
import defaults from "./defaultMoves.json";
import isValidSquare from "./utilities/isValidSquare";
import calcPos from "./utilities/calcPos";

export default function useBoard(fen) {
  const { setupBoard, ...f } = useFen(fen);
  const board = useState(setupBoard());
  const fullmoves = useState(f.fullMoves);
  const halfMoves = useState(f.halfMoves);
  const activeColor = useState(f.activeColor);
  const enPassant = useState(f.enPassant);
  const availableCastles = useState(f.availableCastles);
  const [isFlipped, setIsFlipped] = useState(false);
  const check = useState(null);
  const mate = useState(null);
  const kingPos = useState({ white: "e1", black: "e8" });

  function flipBoard() {
    isFlipped ? setIsFlipped(false) : setIsFlipped(true);
  }

  function move(origin, destination) {
    let b = { ...board[0] };
    b[destination] = b[origin];
    delete b[origin];
    board[1](b);
  }

  function moveEnPassante(origin, destination, del) {
    let b = { ...board[0] };
    b[destination] = b[origin];
    delete b[origin];
    delete b[del];
    board[1](b);
  }

  function movePiece(origin, destination) {
    let b = { ...board[0] };
    let del = null;

    //check piece existance
    if (!b[origin]) return;

    //check piece color
    if (b[origin].color !== activeColor[0]) return;

    //check piece move if default
    if (!getDefaultMoves(b[origin], origin).has(destination)) return;

    //check piece if pinned
    let pinBoard = { ...b };
    pinBoard[destination] = pinBoard[origin];
    delete pinBoard[origin];
    if (isCheck)
      if (!b[destination] || b[destination].color !== b[origin].color) {
        //check destination availability
        //auto queen promotion
        if (
          b[origin].type === "pawn" &&
          ((b[origin].color === "white" && destination[1] === "8") ||
            (b[origin].color === "black" && destination[1] === "1"))
        )
          b[origin].type = "queen";

        //check if en passante happend && delete the pawn
        if (enPassant[0] && b[origin].type === "pawn") {
          let offset = b[origin].color === "white" ? -1 : 1;
          let pos = calcPos(destination, 0, offset);

          if (enPassant[0] === pos) {
            del = pos;
          }
        }
        //on captue
        if (b[destination]) {
          halfMoves[1](-1);
        } else {
          //on move
          let offset = b[origin].color === "black" ? -1 : 1;

          //set the enPassante square
          if (
            b[origin].type === "pawn" &&
            destination === calcPos(origin, 0, offset * 2)
          ) {
            enPassant[1](destination);
          } else enPassant[1](null);

          //set king position
          if (b[origin].type === "king") {
            if (b[origin].color === "white")
              kingPos[1]((kp) => ({ ...kp, white: destination }));
            else kingPos[1]((kp) => ({ ...kp, black: destination }));
          }
        }
        move(origin, destination);
        del && moveEnPassante(origin, destination, del);
        isCheck(b[origin], destination);
        //time incrementation
        activeColor[0] === "black" && halfMoves[1]((hm) => hm + 1);
        activeColor[0] === "black" && fullmoves[1]((fm) => fm + 1);

        //turn switch
        activeColor[1](activeColor[0] === "white" ? "black" : "white");
      }
  }

  function getDefaultMoves(piece, origin) {
    const defaultMoves = [];
    var dest;

    //check if the piece we are moving is a pawn or not
    if (piece.type !== "pawn") {
      //getting default moves for constant moves pieces (king/knight)
      if (defaults[piece.type].moves) {
        defaults[piece.type].moves.forEach((move) => {
          if (move[1] !== null && move[0] !== null) {
            dest = calcPos(origin, move[0], move[1]);
            isValidSquare(dest) && defaultMoves.push(dest);
          }
        });
      } else {
        //getting default moves for variable moves pieces (queen/bishop/rook)
        defaults[piece.type].offsets.forEach((offset) => {
          //squares counter in current direction
          var i = 1;
          //destination square
          var idest = calcPos(origin, offset[0] * i, offset[1] * i);
          //loop while destination square is a valid square and the piece does not colide with a piece
          try {
            while (
              isValidSquare(idest) &&
              board[0][idest]?.color !== piece.color
            ) {
              if (board[0][idest] && board[0][idest]?.color !== piece.color) {
                defaultMoves.push(idest);
                throw "a";
              }
              defaultMoves.push(idest);
              i++;
              idest = calcPos(origin, offset[0] * i, offset[1] * i);
            }
          } catch {}
        });
      }
    } else {
      //determens which direction the pawn advance
      var offset = 1;
      if (piece.color === "black") offset = -1;

      //check if the pawn can advance by 1/2 squares or at all
      if (!board[0][calcPos(origin, 0, offset * 1)]) {
        isValidSquare(calcPos(origin, 0, offset * 1)) &&
          defaultMoves.push(calcPos(origin, 0, offset * 1));
        if (
          ["2", "7"].includes(origin[1]) &&
          isValidSquare(calcPos(origin, 0, offset * 2))
        )
          defaultMoves.push(calcPos(origin, 0, offset * 2));
      }

      //check if en passante is available
      if (enPassant[0] === calcPos(origin, -1, offset * 0))
        defaultMoves.push(calcPos(origin, -1, offset * 1));
      if (enPassant[0] === calcPos(origin, 1, offset * 0))
        defaultMoves.push(calcPos(origin, 1, offset * 1));

      //check for normal capture
      if (board[0][calcPos(origin, 1, offset * 1)])
        defaultMoves.push(calcPos(origin, 1, offset * 1));
      if (board[0][calcPos(origin, -1, offset * 1)])
        defaultMoves.push(calcPos(origin, -1, offset * 1));
    }
    // console.log(piece.type);
    // console.log(origin);
    // console.log(new Set(defaultMoves));
    return new Set(defaultMoves);
  }

  function isCheck(piece, dest) {
    const color = piece.color !== "white" ? "white" : "black";
    getDefaultMoves(piece, dest).has(kingPos[0][color])
      ? check[1](color)
      : check[1](null);
  }

  return {
    board,
    fullmoves,
    halfMoves,
    activeColor,
    enPassant,
    availableCastles,
    movePiece,
    flipBoard,
    isFlipped,
    check,
    mate,
  };
}
