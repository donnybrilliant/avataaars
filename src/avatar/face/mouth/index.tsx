/**
 * Modern Mouth component using React.createContext() Selector
 */
import Selector from "../../../options/Selector";
import { MouthOption } from "../../../options";

import Concerned from "./Concerned";
import Default from "./Default";
import Disbelief from "./Disbelief";
import Eating from "./Eating";
import Grimace from "./Grimace";
import Sad from "./Sad";
import ScreamOpen from "./ScreamOpen";
import Serious from "./Serious";
import Smile from "./Smile";
import Tongue from "./Tongue";
import Twinkle from "./Twinkle";
import Vomit from "./Vomit";

export default function Mouth() {
  return (
    <Selector defaultOption={Default} option={MouthOption}>
      <Concerned />
      <Default />
      <Disbelief />
      <Eating />
      <Grimace />
      <Sad />
      <ScreamOpen />
      <Serious />
      <Smile />
      <Tongue />
      <Twinkle />
      <Vomit />
    </Selector>
  );
}
