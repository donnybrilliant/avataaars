/**
 * Available option values for each avatar customization option.
 * These values correspond to the component optionValue properties in the source.
 * 
 * Note: These are kept as constants since they can't be easily extracted
 * dynamically from the package without running the components.
 */

export const TOP_TYPES = [
  "NoHair",
  "Eyepatch",
  "Hat",
  "Hijab",
  "Turban",
  "WinterHat1",
  "WinterHat2",
  "WinterHat3",
  "WinterHat4",
  "LongHairBigHair",
  "LongHairBob",
  "LongHairBun",
  "LongHairCurly",
  "LongHairCurvy",
  "LongHairDreads",
  "LongHairFrida",
  "LongHairFro",
  "LongHairFroBand",
  "LongHairMiaWallace",
  "LongHairNotTooLong",
  "LongHairShavedSides",
  "LongHairStraight",
  "LongHairStraight2",
  "LongHairStraightStrand",
  "ShortHairDreads01",
  "ShortHairDreads02",
  "ShortHairFrizzle",
  "ShortHairShaggy",
  "ShortHairShaggyMullet",
  "ShortHairShortCurly",
  "ShortHairShortFlat",
  "ShortHairShortRound",
  "ShortHairShortWaved",
  "ShortHairSides",
  "ShortHairTheCaesar",
  "ShortHairTheCaesarSidePart",
] as const;

export const ACCESSORIES_TYPES = [
  "Blank",
  "Kurt",
  "Prescription01",
  "Prescription02",
  "Round",
  "Sunglasses",
  "Wayfarers",
] as const;

export const HAIR_COLORS = [
  "Auburn",
  "Black",
  "Blonde",
  "BlondeGolden",
  "Brown",
  "BrownDark",
  "PastelPink",
  "Platinum",
  "Red",
  "SilverGray",
] as const;

export const HAT_COLORS = [
  "Black",
  "Blue01",
  "Blue02",
  "Blue03",
  "Gray01",
  "Gray02",
  "Heather",
  "PastelBlue",
  "PastelGreen",
  "PastelOrange",
  "PastelRed",
  "PastelYellow",
  "Pink",
  "Red",
  "White",
] as const;

export const FACIAL_HAIR_TYPES = [
  "Blank",
  "BeardLight",
  "BeardMajestic",
  "BeardMedium",
  "MoustacheFancy",
  "MoustacheMagnum",
] as const;

export const FACIAL_HAIR_COLORS = [
  "Auburn",
  "Black",
  "Blonde",
  "BlondeGolden",
  "Brown",
  "BrownDark",
  "Platinum",
  "Red",
  "SilverGray",
] as const;

export const CLOTHE_TYPES = [
  "BlazerShirt",
  "BlazerSweater",
  "CollarSweater",
  "GraphicShirt",
  "Hoodie",
  "Overall",
  "ShirtCrewNeck",
  "ShirtScoopNeck",
  "ShirtVNeck",
] as const;

export const CLOTHE_COLORS = [
  "Black",
  "Blue01",
  "Blue02",
  "Blue03",
  "Gray01",
  "Gray02",
  "Heather",
  "PastelBlue",
  "PastelGreen",
  "PastelOrange",
  "PastelRed",
  "PastelYellow",
  "Pink",
  "Red",
  "White",
] as const;

export const GRAPHIC_TYPES = [
  "Bat",
  "Cumbia",
  "Deer",
  "Diamond",
  "Hola",
  "Pizza",
  "Resist",
  "Selena",
  "Bear",
  "SkullOutline",
  "Skull",
] as const;

export const EYE_TYPES = [
  "Close",
  "Cry",
  "Default",
  "Dizzy",
  "EyeRoll",
  "Happy",
  "Hearts",
  "Side",
  "Squint",
  "Surprised",
  "Wink",
  "WinkWacky",
] as const;

export const EYEBROW_TYPES = [
  "Angry",
  "AngryNatural",
  "Default",
  "DefaultNatural",
  "FlatNatural",
  "FrownNatural",
  "RaisedExcited",
  "RaisedExcitedNatural",
  "SadConcerned",
  "SadConcernedNatural",
  "UnibrowNatural",
  "UpDown",
  "UpDownNatural",
] as const;

export const MOUTH_TYPES = [
  "Concerned",
  "Default",
  "Disbelief",
  "Eating",
  "Grimace",
  "Sad",
  "ScreamOpen",
  "Serious",
  "Smile",
  "Tongue",
  "Twinkle",
  "Vomit",
] as const;

export const SKIN_COLORS = [
  "Tanned",
  "Yellow",
  "Pale",
  "Light",
  "Brown",
  "DarkBrown",
  "Black",
] as const;

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

