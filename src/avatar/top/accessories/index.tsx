/**
 * Modern Accessories component using React.createContext() Selector
 */
import Selector from "../../../options/Selector";
import { AccessoriesOption } from "../../../options";

import Blank from "./Blank";
import Kurt from "./Kurt";
import Prescription01 from "./Prescription01";
import Prescription02 from "./Prescription02";
import Round from "./Round";
import Sunglasses from "./Sunglasses";
import Wayfarers from "./Wayfarers";

export default function Accessories() {
  return (
    <Selector defaultOption={Blank} option={AccessoriesOption}>
      <Blank />
      <Kurt />
      <Prescription01 />
      <Prescription02 />
      <Round />
      <Sunglasses />
      <Wayfarers />
    </Selector>
  );
}
