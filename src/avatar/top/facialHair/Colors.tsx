/**
 * Modern FacialHairColor component using React.createContext() Selector
 */
import Selector from "../../../options/Selector";
import { FacialHairColor as FacialHairColorOption } from "../../../options";
import { withOptionValue } from '../../../utils/optionValue';

export interface Props {
  maskID: string;
}

function makeColor(name: string, color: string) {
  function ColorComponent({ maskID }: Props) {
    return (
      <g id="Color/Hair/Brown" mask={`url(#${maskID})`} fill={color}>
        <g transform="translate(-32.000000, 0.000000)" id="Color">
          <rect x="0" y="0" width="264" height="244" />
        </g>
      </g>
    );
  }
  return withOptionValue(ColorComponent, name);
}

export const Auburn = makeColor("Auburn", "#A55728");
export const Black = makeColor("Black", "#2C1B18");
export const Blonde = makeColor("Blonde", "#B58143");
export const BlondeGolden = makeColor("BlondeGolden", "#D6B370");
export const Brown = makeColor("Brown", "#724133");
export const BrownDark = makeColor("BrownDark", "#4A312C");
export const Platinum = makeColor("Platinum", "#ECDCBF");
export const Red = makeColor("Red", "#C93305");
export const SilverGray = makeColor("SilverGray", "#E8E1E1");

export default function FacialHairColors({ maskID }: Props) {
  return (
    <Selector option={FacialHairColorOption} defaultOption={BrownDark}>
      <Auburn maskID={maskID} />
      <Black maskID={maskID} />
      <Blonde maskID={maskID} />
      <BlondeGolden maskID={maskID} />
      <Brown maskID={maskID} />
      <BrownDark maskID={maskID} />
      <Platinum maskID={maskID} />
      <Red maskID={maskID} />
      <SilverGray maskID={maskID} />
    </Selector>
  );
}
