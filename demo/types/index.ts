/**
 * Centralized type exports for the demo application
 * 
 * This file serves as the single source of truth for all types used in the demo.
 * Import types from here for consistency and easier maintenance.
 */

// Re-export all types from the main avatar types file
export type {
  AvatarCustomizationProps,
  AvatarSettings,
  HoverExpression,
  AvatarProps,
} from "./avatarTypes";

// Re-export option value types and constants from dist
export type {
  TopType,
  AccessoriesType,
  HairColor,
  HatColor,
  FacialHairType,
  FacialHairColor,
  ClotheType,
  ClotheColor,
  GraphicType,
  EyeType,
  EyebrowType,
  MouthType,
  SkinColor,
} from "../../dist";

export {
  TOP_TYPES,
  ACCESSORIES_TYPES,
  HAIR_COLORS,
  HAT_COLORS,
  FACIAL_HAIR_TYPES,
  FACIAL_HAIR_COLORS,
  CLOTHE_TYPES,
  CLOTHE_COLORS,
  GRAPHIC_TYPES,
  EYE_TYPES,
  EYEBROW_TYPES,
  MOUTH_TYPES,
  SKIN_COLORS,
} from "../../dist";

