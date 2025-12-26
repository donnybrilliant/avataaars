/**
 * Option Values - Available values for each avatar customization option
 *
 * This module extracts and exports all available option values from the component modules.
 * These values are extracted from the optionValue properties attached to each component.
 */

// Import individual components directly (not from index files which only export defaults)
// Note: Using .js extensions for ESM compatibility in dist
import Eyepatch from "./avatar/top/Eyepatch.js";
import Hat from "./avatar/top/Hat.js";
import Hijab from "./avatar/top/Hijab.js";
import LongHairBigHair from "./avatar/top/LongHairBigHair.js";
import LongHairBob from "./avatar/top/LongHairBob.js";
import LongHairBun from "./avatar/top/LongHairBun.js";
import LongHairCurly from "./avatar/top/LongHairCurly.js";
import LongHairCurvy from "./avatar/top/LongHairCurvy.js";
import LongHairDreads from "./avatar/top/LongHairDreads.js";
import LongHairFrida from "./avatar/top/LongHairFrida.js";
import LongHairFro from "./avatar/top/LongHairFro.js";
import LongHairFroBand from "./avatar/top/LongHairFroBand.js";
import LongHairMiaWallace from "./avatar/top/LongHairMiaWallace.js";
import LongHairNotTooLong from "./avatar/top/LongHairNotTooLong.js";
import LongHairShavedSides from "./avatar/top/LongHairShavedSides.js";
import LongHairStraight from "./avatar/top/LongHairStraight.js";
import LongHairStraight2 from "./avatar/top/LongHairStraight2.js";
import LongHairStraightStrand from "./avatar/top/LongHairStraightStrand.js";
import NoHair from "./avatar/top/NoHair.js";
import ShortHairDreads01 from "./avatar/top/ShortHairDreads01.js";
import ShortHairDreads02 from "./avatar/top/ShortHairDreads02.js";
import ShortHairFrizzle from "./avatar/top/ShortHairFrizzle.js";
import ShortHairShaggyMullet from "./avatar/top/ShortHairShaggyMullet.js";
import ShortHairShortCurly from "./avatar/top/ShortHairShortCurly.js";
import ShortHairShortFlat from "./avatar/top/ShortHairShortFlat.js";
import ShortHairShortRound from "./avatar/top/ShortHairShortRound.js";
import ShortHairShortWaved from "./avatar/top/ShortHairShortWaved.js";
import ShortHairSides from "./avatar/top/ShortHairSides.js";
import ShortHairTheCaesar from "./avatar/top/ShortHairTheCaesar.js";
import ShortHairTheCaesarSidePart from "./avatar/top/ShortHairTheCaesarSidePart.js";
import Turban from "./avatar/top/Turban.js";
import WinterHat1 from "./avatar/top/WinterHat1.js";
import WinterHat2 from "./avatar/top/WinterHat2.js";
import WinterHat3 from "./avatar/top/WinterHat3.js";
import WinterHat4 from "./avatar/top/WinterHat4.js";

import Blank from "./avatar/top/accessories/Blank.js";
import Kurt from "./avatar/top/accessories/Kurt.js";
import Prescription01 from "./avatar/top/accessories/Prescription01.js";
import Prescription02 from "./avatar/top/accessories/Prescription02.js";
import Round from "./avatar/top/accessories/Round.js";
import Sunglasses from "./avatar/top/accessories/Sunglasses.js";
import Wayfarers from "./avatar/top/accessories/Wayfarers.js";

import * as HairColorComponents from "./avatar/top/HairColor.js";
import * as HatColorComponents from "./avatar/top/HatColor.js";

import BlankFacialHair from "./avatar/top/facialHair/Blank.js";
import BeardLight from "./avatar/top/facialHair/BeardLight.js";
import BeardMajestic from "./avatar/top/facialHair/BeardMajestic.js";
import BeardMedium from "./avatar/top/facialHair/BeardMedium.js";
import MoustacheFancy from "./avatar/top/facialHair/MoustacheFancy.js";
import MoustacheMagnum from "./avatar/top/facialHair/MoustacheMagnum.js";

import * as FacialHairColorComponents from "./avatar/top/facialHair/Colors.js";

import BlazerShirt from "./avatar/clothes/BlazerShirt.js";
import BlazerSweater from "./avatar/clothes/BlazerSweater.js";
import CollarSweater from "./avatar/clothes/CollarSweater.js";
import GraphicShirt from "./avatar/clothes/GraphicShirt.js";
import Hoodie from "./avatar/clothes/Hoodie.js";
import Overall from "./avatar/clothes/Overall.js";
import ShirtCrewNeck from "./avatar/clothes/ShirtCrewNeck.js";
import ShirtScoopNeck from "./avatar/clothes/ShirtScoopNeck.js";
import ShirtVNeck from "./avatar/clothes/ShirtVNeck.js";

import * as ClotheColorComponents from "./avatar/clothes/Colors.js";
import * as GraphicComponents from "./avatar/clothes/Graphics.js";

import Close from "./avatar/face/eyes/Close.js";
import Cry from "./avatar/face/eyes/Cry.js";
import DefaultEyes from "./avatar/face/eyes/Default.js";
import Dizzy from "./avatar/face/eyes/Dizzy.js";
import EyeRoll from "./avatar/face/eyes/EyeRoll.js";
import Happy from "./avatar/face/eyes/Happy.js";
import Hearts from "./avatar/face/eyes/Hearts.js";
import Side from "./avatar/face/eyes/Side.js";
import Squint from "./avatar/face/eyes/Squint.js";
import Surprised from "./avatar/face/eyes/Surprised.js";
import Wink from "./avatar/face/eyes/Wink.js";
import WinkWacky from "./avatar/face/eyes/WinkWacky.js";

import Angry from "./avatar/face/eyebrow/Angry.js";
import AngryNatural from "./avatar/face/eyebrow/AngryNatural.js";
import DefaultEyebrow from "./avatar/face/eyebrow/Default.js";
import DefaultNatural from "./avatar/face/eyebrow/DefaultNatural.js";
import FlatNatural from "./avatar/face/eyebrow/FlatNatural.js";
import FrownNatural from "./avatar/face/eyebrow/FrownNatural.js";
import RaisedExcited from "./avatar/face/eyebrow/RaisedExcited.js";
import RaisedExcitedNatural from "./avatar/face/eyebrow/RaisedExcitedNatural.js";
import SadConcerned from "./avatar/face/eyebrow/SadConcerned.js";
import SadConcernedNatural from "./avatar/face/eyebrow/SadConcernedNatural.js";
import UnibrowNatural from "./avatar/face/eyebrow/UnibrowNatural.js";
import UpDown from "./avatar/face/eyebrow/UpDown.js";
import UpDownNatural from "./avatar/face/eyebrow/UpDownNatural.js";

import Concerned from "./avatar/face/mouth/Concerned.js";
import DefaultMouth from "./avatar/face/mouth/Default.js";
import Disbelief from "./avatar/face/mouth/Disbelief.js";
import Eating from "./avatar/face/mouth/Eating.js";
import Grimace from "./avatar/face/mouth/Grimace.js";
import Sad from "./avatar/face/mouth/Sad.js";
import ScreamOpen from "./avatar/face/mouth/ScreamOpen.js";
import Serious from "./avatar/face/mouth/Serious.js";
import Smile from "./avatar/face/mouth/Smile.js";
import Tongue from "./avatar/face/mouth/Tongue.js";
import Twinkle from "./avatar/face/mouth/Twinkle.js";
import Vomit from "./avatar/face/mouth/Vomit.js";

import * as SkinComponents from "./avatar/Skin.js";

/**
 * Type guard to check if a component has an optionValue property
 */
type ComponentWithOptionValue = {
  optionValue: string;
};

function hasOptionValue(
  component: unknown
): component is ComponentWithOptionValue {
  return (
    typeof component === "function" &&
    "optionValue" in component &&
    typeof (component as ComponentWithOptionValue).optionValue === "string"
  );
}

/**
 * Extract option values from an array of components
 */
function extractOptionValues(components: unknown[]): string[] {
  const values: string[] = [];
  for (const component of components) {
    if (hasOptionValue(component)) {
      values.push(component.optionValue);
    }
  }
  return values.sort();
}

/**
 * Extract option values from a module object
 */
function extractOptionValuesFromModule(
  module: Record<string, unknown>
): string[] {
  const values: string[] = [];
  for (const key in module) {
    // Skip default export and other non-component properties
    if (key === "default" || key === "__esModule") {
      continue;
    }
    const component = module[key];
    if (hasOptionValue(component)) {
      values.push(component.optionValue);
    }
  }
  return values.sort();
}

/**
 * Available top type values
 */
export const TOP_TYPES = extractOptionValues([
  NoHair,
  Eyepatch,
  Hat,
  Hijab,
  Turban,
  WinterHat1,
  WinterHat2,
  WinterHat3,
  WinterHat4,
  LongHairBigHair,
  LongHairBob,
  LongHairBun,
  LongHairCurly,
  LongHairCurvy,
  LongHairDreads,
  LongHairFrida,
  LongHairFro,
  LongHairFroBand,
  LongHairMiaWallace,
  LongHairNotTooLong,
  LongHairShavedSides,
  LongHairStraight,
  LongHairStraight2,
  LongHairStraightStrand,
  ShortHairDreads01,
  ShortHairDreads02,
  ShortHairFrizzle,
  ShortHairShaggyMullet,
  ShortHairShortCurly,
  ShortHairShortFlat,
  ShortHairShortRound,
  ShortHairShortWaved,
  ShortHairSides,
  ShortHairTheCaesar,
  ShortHairTheCaesarSidePart,
]) as readonly string[];

/**
 * Available accessories type values
 */
export const ACCESSORIES_TYPES = extractOptionValues([
  Blank,
  Kurt,
  Prescription01,
  Prescription02,
  Round,
  Sunglasses,
  Wayfarers,
]) as readonly string[];

/**
 * Available hair color values
 */
export const HAIR_COLORS = extractOptionValuesFromModule(
  HairColorComponents
) as readonly string[];

/**
 * Available hat color values
 */
export const HAT_COLORS = extractOptionValuesFromModule(
  HatColorComponents
) as readonly string[];

/**
 * Available facial hair type values
 */
export const FACIAL_HAIR_TYPES = extractOptionValues([
  BlankFacialHair,
  BeardLight,
  BeardMajestic,
  BeardMedium,
  MoustacheFancy,
  MoustacheMagnum,
]) as readonly string[];

/**
 * Available facial hair color values
 */
export const FACIAL_HAIR_COLORS = extractOptionValuesFromModule(
  FacialHairColorComponents
) as readonly string[];

/**
 * Available clothe type values
 */
export const CLOTHE_TYPES = extractOptionValues([
  BlazerShirt,
  BlazerSweater,
  CollarSweater,
  GraphicShirt,
  Hoodie,
  Overall,
  ShirtCrewNeck,
  ShirtScoopNeck,
  ShirtVNeck,
]) as readonly string[];

/**
 * Available clothe color values
 */
export const CLOTHE_COLORS = extractOptionValuesFromModule(
  ClotheColorComponents
) as readonly string[];

/**
 * Available graphic type values
 */
export const GRAPHIC_TYPES = extractOptionValuesFromModule(
  GraphicComponents
) as readonly string[];

/**
 * Available eye type values
 */
export const EYE_TYPES = extractOptionValues([
  Close,
  Cry,
  DefaultEyes,
  Dizzy,
  EyeRoll,
  Happy,
  Hearts,
  Side,
  Squint,
  Surprised,
  Wink,
  WinkWacky,
]) as readonly string[];

/**
 * Available eyebrow type values
 */
export const EYEBROW_TYPES = extractOptionValues([
  Angry,
  AngryNatural,
  DefaultEyebrow,
  DefaultNatural,
  FlatNatural,
  FrownNatural,
  RaisedExcited,
  RaisedExcitedNatural,
  SadConcerned,
  SadConcernedNatural,
  UnibrowNatural,
  UpDown,
  UpDownNatural,
]) as readonly string[];

/**
 * Available mouth type values
 */
export const MOUTH_TYPES = extractOptionValues([
  Concerned,
  DefaultMouth,
  Disbelief,
  Eating,
  Grimace,
  Sad,
  ScreamOpen,
  Serious,
  Smile,
  Tongue,
  Twinkle,
  Vomit,
]) as readonly string[];

/**
 * Available skin color values
 */
export const SKIN_COLORS = extractOptionValuesFromModule(
  SkinComponents
) as readonly string[];

/**
 * Type helpers for option values
 */
export type TopType = (typeof TOP_TYPES)[number];
export type AccessoriesType = (typeof ACCESSORIES_TYPES)[number];
export type HairColor = (typeof HAIR_COLORS)[number];
export type HatColor = (typeof HAT_COLORS)[number];
export type FacialHairType = (typeof FACIAL_HAIR_TYPES)[number];
export type FacialHairColor = (typeof FACIAL_HAIR_COLORS)[number];
export type ClotheType = (typeof CLOTHE_TYPES)[number];
export type ClotheColor = (typeof CLOTHE_COLORS)[number];
export type GraphicType = (typeof GRAPHIC_TYPES)[number];
export type EyeType = (typeof EYE_TYPES)[number];
export type EyebrowType = (typeof EYEBROW_TYPES)[number];
export type MouthType = (typeof MOUTH_TYPES)[number];
export type SkinColor = (typeof SKIN_COLORS)[number];
