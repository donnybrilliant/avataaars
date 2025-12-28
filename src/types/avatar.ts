/**
 * Avatar type definitions
 * 
 * This module contains all type definitions related to the Avatar component,
 * including props, styles, and animation configurations.
 * 
 * @module AvatarTypes
 */

import type { CSSProperties } from "react";

/**
 * Avatar rendering style options.
 * 
 * - Circle: Renders avatar within a circular mask with background
 * - Transparent: Renders avatar without background (used internally for animations)
 */
export enum AvatarStyle {
  Circle = "Circle",
  Transparent = "Transparent",
}

/**
 * Expression configuration for hover animations.
 * Defines a set of expressions (mouthType, eyeType, eyebrowType) to display during hover.
 * Uses the same prop names as AvatarProps for consistency.
 * 
 * @example
 * ```ts
 * const hoverSequence: HoverExpression[] = [
 *   { mouthType: "Smile", eyeType: "Happy", eyebrowType: "Default" },
 *   { mouthType: "Surprised", eyeType: "Wide", eyebrowType: "Raised" }
 * ];
 * ```
 */
export interface HoverExpression {
  readonly mouthType: string;
  readonly eyeType: string;
  readonly eyebrowType: string;
}

/**
 * Props for the main Avatar component.
 * 
 * Supports all avatar customization options plus optional animation features.
 * Animation features (idle animation, hover scale, hover animation) are
 * independent and can be combined as needed.
 * 
 * @example
 * ```tsx
 * <Avatar
 *   avatarStyle={AvatarStyle.Circle}
 *   topType="LongHairStraight"
 *   eyeType="Happy"
 *   animationSpeed={2000}
 *   hoverScale={1.2}
 * />
 * ```
 */
export interface AvatarProps {
  /** Avatar style (Circle or Transparent). Accepts enum or string for backward compatibility. */
  avatarStyle: AvatarStyle | string;
  /** Inline CSS styles to apply to the avatar container */
  style?: CSSProperties;
  
  // Avatar customization options
  /** Top/hair style (e.g., "LongHairStraight", "ShortHairDreads01") */
  topType?: string;
  /** Accessories type (e.g., "Blank", "Kurt", "Prescription01") */
  accessoriesType?: string;
  /** Hair color (e.g., "Auburn", "Black", "Blonde") */
  hairColor?: string;
  /** Hat color (e.g., "Black", "Blue01", "Red") */
  hatColor?: string;
  /** Facial hair type (e.g., "Blank", "BeardMedium", "MoustacheFancy") */
  facialHairType?: string;
  /** Facial hair color (e.g., "Auburn", "Black", "Blonde") */
  facialHairColor?: string;
  /** Clothing type (e.g., "BlazerShirt", "GraphicShirt", "Hoodie") */
  clotheType?: string;
  /** Clothing color (e.g., "Black", "Blue01", "PastelGreen") */
  clotheColor?: string;
  /** Graphic type for GraphicShirt (e.g., "Bat", "Cumbia", "Deer") */
  graphicType?: string;
  /** Eye type (e.g., "Default", "Happy", "Wink", "Surprised") */
  eyeType?: string;
  /** Eyebrow type (e.g., "Default", "Angry", "RaisedExcited") */
  eyebrowType?: string;
  /** Mouth type (e.g., "Default", "Smile", "Serious", "Tongue") */
  mouthType?: string;
  /** Skin color (e.g., "Tanned", "Yellow", "Pale", "Light", "Brown", "DarkBrown", "Black") */
  skinColor?: string;
  
  // Piece component props
  /** Piece type for Piece component */
  pieceType?: string;
  /** Piece size for Piece component */
  pieceSize?: string;
  /** ViewBox for Piece component */
  viewBox?: string;
  
  // Animation features (independent and can be combined)
  /** 
   * Speed for idle animation in milliseconds (500-3000ms).
   * Controls how often random expression changes occur when not hovering.
   * Lower values = faster/more frequent changes.
   */
  animationSpeed?: number;
  /** 
   * Scale multiplier on hover (1.05-1.32).
   * Visual scaling effect only, does not change expressions.
   */
  hoverScale?: number;
  /** 
   * Expression sequence for hover animation.
   * Array of HoverExpression objects to cycle through on hover.
   */
  hoverSequence?: HoverExpression[];
  /** 
   * Speed for hover sequence animation in milliseconds (100-2000ms).
   * Controls how fast the hover sequence cycles.
   */
  hoverAnimationSpeed?: number;
  /** Background color for circle style avatars (hex color string) */
  backgroundColor?: string;
  
  // Original prop values for hover-only mode restoration
  /** Original eye type before hover animation (used internally) */
  originalEyeType?: string;
  /** Original eyebrow type before hover animation (used internally) */
  originalEyebrowType?: string;
  /** Original mouth type before hover animation (used internally) */
  originalMouthType?: string;
}

/**
 * Props for the internal Avatar SVG component.
 * Used by the core Avatar rendering component.
 */
export interface AvatarSvgProps {
  avatarStyle: AvatarStyle;
  style?: CSSProperties;
}

