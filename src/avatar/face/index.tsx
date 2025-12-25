/**
 * Modern Face component using extracted Mouth, Eyes, Eyebrow with React.createContext()
 */
import Mouth from "./mouth";
import Eyes from "./eyes";
import Eyebrow from "./eyebrow";
import Nose from "./nose";

export default function Face() {
  return (
    <g id="Face" transform="translate(76.000000, 82.000000)" fill="#000000">
      <Mouth />
      <Nose />
      <Eyes />
      <Eyebrow />
    </g>
  );
}

