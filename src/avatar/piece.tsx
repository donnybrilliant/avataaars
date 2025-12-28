import Clothe from "./clothes";
import Graphics from "./clothes/Graphics";
import Accessories from "./top/accessories";
import FacialHair from "./top/facialHair";
import Top from "./top";

import Eyes from "./face/eyes";
import Eyebrows from "./face/eyebrow";
import Mouth from "./face/mouth";
import Nose from "./face/nose";
import Skin from "./Skin";
import type { AvatarStyle } from "../types";

export { AvatarStyle } from "../types";

export interface Props {
  pieceSize?: string;
  pieceType?: string;
  avatarStyle: AvatarStyle;
  style?: React.CSSProperties;
  viewBox?: string;
}

export default function PieceComponent({
  pieceSize,
  pieceType,
  style,
  viewBox,
}: Props) {
  // Extract width and height from style prop if provided
  const svgWidth = style?.width ? (typeof style.width === "number" ? `${style.width}px` : style.width) : `${pieceSize}px`;
  const svgHeight = style?.height ? (typeof style.height === "number" ? `${style.height}px` : style.height) : `${pieceSize}px`;

  // Create isolated style object that prevents external CSS from affecting the SVG
  const isolatedStyle: React.CSSProperties = {
    // CSS isolation: reset all inherited styles
    all: "initial",
    // Restore essential SVG properties
    display: "block",
    // Apply width/height from style prop or pieceSize
    width: svgWidth,
    height: svgHeight,
    // Merge other style properties (excluding width/height to avoid duplication)
    ...(style ? Object.entries(style)
      .filter(([key]) => key !== "width" && key !== "height")
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, React.CSSProperties[keyof React.CSSProperties]>)
    : {}),
    // Ensure these critical properties are always set to prevent external CSS interference
    boxSizing: "border-box",
    margin: "0",
    padding: "0",
    border: "none",
    verticalAlign: "baseline",
    font: "initial",
    color: "initial",
    background: "transparent",
    // Explicitly block visual effects that external CSS might try to add
    boxShadow: "none",
    filter: "none",
    backdropFilter: "none",
    textShadow: "none",
    // Prevent external transforms and opacity changes
    transform: "none",
    opacity: "1",
  };

  return (
    <svg
      style={isolatedStyle}
      width={svgWidth}
      height={svgHeight}
      viewBox={viewBox || "0 0 264 280"}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      {pieceType === "top" && <Top />}
      {pieceType === "clothe" && <Clothe />}
      {pieceType === "graphics" && <Graphics maskID="1234" />}
      {(pieceType === "accessories" || pieceType === "accesories") && (
        <Accessories />
      )}
      {pieceType === "facialHair" && <FacialHair />}
      {pieceType === "eyes" && <Eyes />}
      {pieceType === "eyebrows" && <Eyebrows />}
      {pieceType === "mouth" && <Mouth />}
      {pieceType === "nose" && <Nose />}
      {pieceType === "skin" && <Skin maskID="5678" />}
    </svg>
  );
}
