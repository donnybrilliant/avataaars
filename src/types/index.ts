/**
 * Centralized type exports for the avataaars library
 * 
 * This file serves as the single source of truth for all public types.
 * Import types from here for consistency and easier maintenance.
 * 
 * All types are organized into logical modules:
 * - Avatar types: Component props, styles, and animation configurations
 * - Option types: Option system types for avatar customization
 * 
 * @module Types
 */

// Avatar-related types
export type {
  AvatarProps,
  AvatarSvgProps,
  HoverExpression,
} from "./avatar";

// Export AvatarStyle as both type and value (enum)
export { AvatarStyle } from "./avatar";
export type { AvatarStyle as AvatarStyleType } from "./avatar";

// Option system types
export type {
  Option,
  OptionKey,
  OptionState,
  OptionContextState,
  SelectorProps,
} from "./options";

