export default function calcPos(pos, file, rank) {
  return (
    String.fromCharCode(pos.charCodeAt(0) + file) +
    (Number(pos[1]) + Number(rank))
  );
}
