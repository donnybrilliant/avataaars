/**
 * Options module - Avatar customization options
 * 
 * This module exports all avatar customization options and the option system.
 * Each option represents a customizable aspect of the avatar (top, eyes, mouth, etc.).
 * 
 * @module Options
 */

// Re-export types from centralized location
export type { Option, OptionKey } from "../types";
import type { Option } from "../types";

export {
  default as OptionContext,
  type OptionContextState,
} from "./OptionContext";
export { default as Selector, OptionContextReact } from "./Selector";

/**
 * All available avatar customization options.
 * Each option defines a key (used in props) and a label (for UI display).
 */

export const TopOption: Option = {
  key: "topType",
  label: "🎩 Top",
};

export const AccessoriesOption: Option = {
  key: "accessoriesType",
  label: "👓 Accessories",
};

export const HatColorOption: Option = {
  key: "hatColor",
  label: "🎨 HatColor",
};

export const HairColorOption: Option = {
  key: "hairColor",
  label: "💈 Hair Color",
};

export const FacialHairOption: Option = {
  key: "facialHairType",
  label: "🧔 Facial Hair",
};

export const FacialHairColor: Option = {
  key: "facialHairColor",
  label: "✂️ Facial Hair Color",
};

export const ClotheOption: Option = {
  key: "clotheType",
  label: "👔 Clothes",
};

export const ClotheColorOption: Option = {
  key: "clotheColor",
  label: "🌈 Color Fabric",
};

export const GraphicOption: Option = {
  key: "graphicType",
  label: "🖼️ Graphic",
};

export const EyesOption: Option = {
  key: "eyeType",
  label: "👁 Eyes",
};

export const EyebrowOption: Option = {
  key: "eyebrowType",
  label: "✏️ Eyebrow",
};

export const MouthOption: Option = {
  key: "mouthType",
  label: "👄 Mouth",
};

export const SkinOption: Option = {
  key: "skinColor",
  label: "🎨 Skin",
};

/**
 * Array of all available options.
 * Used to initialize the OptionContext.
 */
export const allOptions = [
  TopOption,
  AccessoriesOption,
  HatColorOption,
  HairColorOption,
  FacialHairOption,
  FacialHairColor,
  ClotheOption,
  ClotheColorOption,
  GraphicOption,
  EyesOption,
  EyebrowOption,
  MouthOption,
  SkinOption,
];
