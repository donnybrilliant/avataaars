/**
 * Modern Clothes component using React.createContext() Selector
 */
import Selector from "../../options/Selector";
import { ClotheOption } from "../../options";

import BlazerShirt from "./BlazerShirt";
import BlazerSweater from "./BlazerSweater";
import CollarSweater from "./CollarSweater";
import GraphicShirt from "./GraphicShirt";
import Hoodie from "./Hoodie";
import Overall from "./Overall";
import ShirtCrewNeck from "./ShirtCrewNeck";
import ShirtScoopNeck from "./ShirtScoopNeck";
import ShirtVNeck from "./ShirtVNeck";

export default function Clothes() {
  return (
    <Selector option={ClotheOption} defaultOption={BlazerShirt}>
      <BlazerShirt />
      <BlazerSweater />
      <CollarSweater />
      <GraphicShirt />
      <Hoodie />
      <Overall />
      <ShirtCrewNeck />
      <ShirtScoopNeck />
      <ShirtVNeck />
    </Selector>
  );
}
