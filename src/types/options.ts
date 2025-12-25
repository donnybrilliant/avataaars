/**
 * Option system type definitions
 * 
 * This module contains all type definitions for the avatar option system,
 * including option keys, option definitions, and option state management.
 * 
 * @module OptionTypes
 */

/**
 * All valid option keys in the avatar system.
 * These keys correspond to props that can be customized on the Avatar component.
 */
export type OptionKey =
  | "topType"
  | "accessoriesType"
  | "hairColor"
  | "hatColor"
  | "facialHairType"
  | "facialHairColor"
  | "clotheType"
  | "clotheColor"
  | "graphicType"
  | "eyeType"
  | "eyebrowType"
  | "mouthType"
  | "skinColor";

/**
 * Option definition interface.
 * Represents a customizable aspect of the avatar (e.g., top type, eye type).
 * 
 * @property key - Unique identifier for the option (matches prop name)
 * @property label - Human-readable label for UI display
 */
export interface Option {
  readonly key: OptionKey;
  readonly label: string;
}

/**
 * State for a single option in the OptionContext.
 * Tracks available values, default value, and usage count.
 * 
 * @property key - The option key
 * @property options - Array of available option values
 * @property defaultValue - Default value to use if none is set
 * @property available - Number of components currently using this option
 */
export interface OptionState {
  readonly key: OptionKey;
  readonly options: readonly string[];
  readonly defaultValue?: string;
  readonly available: number;
}

/**
 * Complete state of all options in the OptionContext.
 * Maps each OptionKey to its OptionState.
 */
export type OptionContextState = Record<OptionKey, OptionState>;

import type { ComponentType, ReactNode } from "react";

/**
 * Props for the Selector component.
 * 
 * @property option - The option definition to select based on
 * @property defaultOption - Default component or value to use
 * @property children - Child components, each representing an option value
 */
export interface SelectorProps {
  readonly option: Option;
  readonly defaultOption: ComponentType | string;
  readonly children?: ReactNode;
}

