export default function Piece({ color, type, isFlipped }) {
  return (
    <div style={{ transform: isFlipped && "rotate(180deg)" }} id="piece">
      <img
        src={`${process.env.PUBLIC_URL}/assets/pieces/${color}/${type}.png`}
      />
    </div>
  );
}
