/**
 * Modern Eyes component using React.createContext() Selector
 */
import Selector from "../../../options/Selector";
import { EyesOption } from "../../../options";

import Close from "./Close";
import Cry from "./Cry";
import Default from "./Default";
import Dizzy from "./Dizzy";
import EyeRoll from "./EyeRoll";
import Happy from "./Happy";
import Hearts from "./Hearts";
import Side from "./Side";
import Squint from "./Squint";
import Surprised from "./Surprised";
import Wink from "./Wink";
import WinkWacky from "./WinkWacky";

export default function Eyes() {
  return (
    <Selector defaultOption={Default} option={EyesOption}>
      <Close />
      <Cry />
      <Default />
      <Dizzy />
      <EyeRoll />
      <Happy />
      <Hearts />
      <Side />
      <Squint />
      <Surprised />
      <Wink />
      <WinkWacky />
    </Selector>
  );
}
