import { Chessboard } from "react-chessboard";

type Props = {
  fen: string;
  onPieceDrop: (sourceSquare: string, targetSquare: string) => boolean;
  orientation?: "white" | "black";
};

export default function Board({ fen, onPieceDrop, orientation = "white" }: Props) {
  return (
    <div className="aspect-square w-full max-w-[560px] mx-auto rounded-md shadow-lg ring-1 ring-walnut-700/10 overflow-hidden">
      <Chessboard
        position={fen}
        onPieceDrop={onPieceDrop}
        boardOrientation={orientation}
        customBoardStyle={{
          borderRadius: 4,
        }}
        customDarkSquareStyle={{ backgroundColor: "#8a6d3b" }}
        customLightSquareStyle={{ backgroundColor: "#f7f1e3" }}
        animationDuration={200}
      />
    </div>
  );
}
