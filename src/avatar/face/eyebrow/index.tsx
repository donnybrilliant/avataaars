/**
 * Modern Eyebrow component using React.createContext() Selector
 */
import Selector from "../../../options/Selector";
import { EyebrowOption } from "../../../options";

import Angry from "./Angry";
import AngryNatural from "./AngryNatural";
import Default from "./Default";
import DefaultNatural from "./DefaultNatural";
import FlatNatural from "./FlatNatural";
import RaisedExcited from "./RaisedExcited";
import RaisedExcitedNatural from "./RaisedExcitedNatural";
import SadConcerned from "./SadConcerned";
import SadConcernedNatural from "./SadConcernedNatural";
import UnibrowNatural from "./UnibrowNatural";
import UpDown from "./UpDown";
import UpDownNatural from "./UpDownNatural";

export default function Eyebrow() {
  return (
    <Selector defaultOption={Default} option={EyebrowOption}>
      <Angry />
      <AngryNatural />
      <Default />
      <DefaultNatural />
      <FlatNatural />
      <RaisedExcited />
      <RaisedExcitedNatural />
      <SadConcerned />
      <SadConcernedNatural />
      <UnibrowNatural />
      <UpDown />
      <UpDownNatural />
    </Selector>
  );
}
