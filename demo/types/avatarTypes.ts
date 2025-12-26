import type { Props as AvatarProps, HoverExpression } from "@vierweb/avataaars";

/**
 * Avatar customization props (subset of AvatarProps with required fields)
 * These are the props that can be customized in the demo
 *
 * Uses Pick to select only the props we want to customize, ensuring type safety
 * and automatic updates when Props changes.
 */
export type AvatarCustomizationProps = Pick<
  AvatarProps,
  | "avatarStyle"
  | "topType"
  | "accessoriesType"
  | "hairColor"
  | "facialHairType"
  | "facialHairColor"
  | "clotheType"
  | "clotheColor"
  | "graphicType"
  | "eyeType"
  | "eyebrowType"
  | "mouthType"
  | "skinColor"
> & {
  // Note: hatColor is not included because it's not a direct prop on AvatarProps
  // It's handled through the options system but not exposed as a top-level prop
  hatColor?: string;
};

/**
 * Avatar animation and display settings
 * These are demo-specific settings that control how the avatar is displayed
 */
export interface AvatarSettings {
  animationSpeed: number;
  hoverScale: number;
  hoverAnimationSpeed: number;
  backgroundColor: string;
  idleAnimationEnabled: boolean;
  hoverAnimationEnabled: boolean;
  hoverScaleEnabled: boolean;
  hoverSequence: HoverExpression[];
}

/**
 * Re-export types from npm package for convenience
 */
export type { HoverExpression };
export type { Props as AvatarProps } from "@vierweb/avataaars";
