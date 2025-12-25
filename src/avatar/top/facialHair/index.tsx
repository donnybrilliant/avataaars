/**
 * Modern FacialHair component using React.createContext() Selector
 */
import Selector from "../../../options/Selector";
import { FacialHairOption } from "../../../options";

import Blank from "./Blank";
import BeardMedium from "./BeardMedium";
import BeardLight from "./BeardLight";
import BeardMajestic from "./BeardMajestic";
import MoustacheFancy from "./MoustacheFancy";
import MoustacheMagnum from "./MoustacheMagnum";

export default function FacialHair() {
  return (
    <Selector defaultOption={Blank} option={FacialHairOption}>
      <Blank />
      <BeardMedium />
      <BeardLight />
      <BeardMajestic />
      <MoustacheFancy />
      <MoustacheMagnum />
    </Selector>
  );
}
