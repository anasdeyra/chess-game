import useBoard from "./hooks/useBoard";
import Board from "./components/Board";

function App() {
  const { board, activeColor, movePiece, flipBoard, isFlipped } = useBoard();

  return (
    <div style={{ color: "whitesmoke" }} id="app">
      <h1>Chess JS</h1>
      <h2>{activeColor[0]} to play</h2>
      <Board
        isFlipped={isFlipped}
        activeColor={activeColor[0]}
        board={board}
        movePiece={movePiece}
      />
      <button onClick={flipBoard}>flip the board</button>
    </div>
  );
}

export default App;
