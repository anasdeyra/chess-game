import { useEffect, useState } from "react";
import Piece from "./Piece";

export default function Board({ board, movePiece, activeColor, isFlipped }) {
  const [activePos, setActivePos] = useState(null);
  const [ranksIndex, setRanksIndex] = useState([]);
  const [filesIndex, setfilesIndex] = useState([]);
  useEffect(() => {
    drawIndex();
  }, [isFlipped]);

  var rank = 8;
  var file = "a";
  var graphicalBoard = [];

  function moveIt(pos) {
    if (
      activePos === null &&
      board[0][pos] &&
      board[0][pos].color === activeColor
    )
      return setActivePos(pos);

    if (
      activePos &&
      board[0][pos] &&
      board[0][activePos].color === board[0][pos].color
    )
      return setActivePos(pos);

    if (activePos !== pos) movePiece(activePos, pos);
    setActivePos(null);
  }

  //fill board
  for (let i = 1; i < 9; i++) {
    for (let j = 1; j < 9; j++) {
      board[0][file + rank]
        ? graphicalBoard.push({ ...board[0][file + rank], pos: file + rank })
        : graphicalBoard.push({ pos: file + rank });

      file = String.fromCharCode(file.charCodeAt(0) + 1);
    }
    file = "a";
    rank--;
  }

  const light = "#F3CEA4";
  const dark = "#BD6634";
  var backgroundColor = light;

  //color the board
  const wlhLastBoard = (
    <div style={{ transform: isFlipped && "rotate(180deg)" }} className="board">
      {graphicalBoard.map((square, i) => {
        backgroundColor = backgroundColor === light ? dark : light;
        if (i % 8 === 0)
          backgroundColor = backgroundColor === light ? dark : light;
        if (square.type)
          return (
            <Square
              moveIt={moveIt}
              pos={square.pos}
              backgroundColor={backgroundColor}
              key={i}
              activePos={activePos}
            >
              <Piece isFlipped={isFlipped} {...square} />
            </Square>
          );
        return (
          <Square
            moveIt={moveIt}
            pos={square.pos}
            backgroundColor={backgroundColor}
            key={i}
            activePos={activePos}
          />
        );
      })}
    </div>
  );

  //ranks and files indexes
  function drawIndex() {
    let ri = [];
    let fi = [];
    for (let i = 8; i > 0; i--) {
      !isFlipped
        ? ri.push(<span key={i}>{i}</span>)
        : fi.push(<span key={i}>{String.fromCharCode(96 + i)}</span>);
    }
    for (let i = 0; i < 8; i++) {
      isFlipped
        ? ri.push(<span key={i}>{i + 1}</span>)
        : fi.push(<span key={i}>{String.fromCharCode(97 + i)}</span>);
    }
    setRanksIndex(ri);
    setfilesIndex(fi);
  }

  return (
    <div className="boardContainer">
      <div className="ranks">{ranksIndex}</div>
      <div className="boardWrapper">
        {wlhLastBoard}
        <div className="files">{filesIndex}</div>
      </div>
    </div>
  );
}

function Square({ pos, children, backgroundColor, moveIt, activePos }) {
  const bg = pos === activePos ? "red" : backgroundColor;
  return (
    <div
      onClick={() => {
        moveIt(pos);
      }}
      id="square"
      style={{ backgroundColor: bg }}
    >
      {children}
    </div>
  );
}
