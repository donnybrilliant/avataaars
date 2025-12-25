/**
 * Modern Skin component using React.createContext() Selector
 */
import Selector from "../options/Selector";
import { SkinOption } from "../options";
import { withOptionValue } from '../utils/optionValue';

export interface Props {
  maskID: string;
}

function makeColor(name: string, color: string) {
  function ColorComponent({ maskID }: Props) {
    return (
      <g id={`Skin/${name}`} mask={`url(#${maskID})`} fill={color}>
        <g transform="translate(0.000000, 0.000000)" id="Color">
          <rect x="0" y="0" width="264" height="280" />
        </g>
      </g>
    );
  }
  return withOptionValue(ColorComponent, name);
}

const Tanned = makeColor("Tanned", "#FD9841");
const Yellow = makeColor("Yellow", "#F8D25C");
const Pale = makeColor("Pale", "#FFDBB4");
const Light = makeColor("Light", "#EDB98A");
const Brown = makeColor("Brown", "#D08B5B");
const DarkBrown = makeColor("DarkBrown", "#AE5D29");
const Black = makeColor("Black", "#614335");

export default function Skin({ maskID }: Props) {
  return (
    <Selector option={SkinOption} defaultOption={Light}>
      <Tanned maskID={maskID} />
      <Yellow maskID={maskID} />
      <Pale maskID={maskID} />
      <Light maskID={maskID} />
      <Brown maskID={maskID} />
      <DarkBrown maskID={maskID} />
      <Black maskID={maskID} />
    </Selector>
  );
}
