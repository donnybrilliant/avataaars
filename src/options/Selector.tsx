/**
 * Selector Component - Option-based component selection
 * 
 * This module provides the Selector component, which selects and renders
 * a child component based on the current option value in the OptionContext.
 * It uses React 19's createContext API for compatibility.
 * 
 * @module Selector
 */

import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  Children,
  isValidElement,
  type ComponentType,
  type ReactNode,
} from "react";

import type { SelectorProps } from "../types";
import OptionContext from "./OptionContext";

/**
 * React context for OptionContext.
 * Provides the option context to all child components.
 * Compatible with React 19.
 */
export const OptionContextReact = createContext<OptionContext | null>(null);

/**
 * Interface for components that have an optionValue property.
 * Avatar components use this to identify which option value they represent.
 */
interface ComponentWithOptionValue {
  readonly optionValue: string;
}

/**
 * Type guard for components with optionValue.
 */
type ComponentWithOption = ComponentType & ComponentWithOptionValue;

/**
 * Type guard to check if a component has an optionValue property.
 * 
 * @param component - Component to check
 * @returns True if component has optionValue property
 */
function hasOptionValue(
  component: ComponentType
): component is ComponentWithOption {
  return (
    typeof component === "function" &&
    "optionValue" in component &&
    typeof (component as ComponentWithOption).optionValue === "string"
  );
}

/**
 * Get the optionValue from a component.
 * Throws an error if the component doesn't have an optionValue.
 * 
 * @param component - Component to get optionValue from
 * @returns The optionValue string
 * @throws Error if component doesn't have optionValue
 */
function getComponentOptionValue(component: ComponentType): string {
  if (!hasOptionValue(component)) {
    throw new Error(
      `optionValue should be provided for component: ${component.name || String(component)}`
    );
  }
  return component.optionValue;
}

/**
 * Selector component for option-based rendering.
 * 
 * This component selects and renders a child component based on the current
 * option value in the OptionContext. It automatically registers available
 * options from its children and selects the matching one.
 * 
 * @param props - Selector configuration
 * @param props.option - The option definition to select based on
 * @param props.defaultOption - Default component or value to use
 * @param props.children - Child components, each representing an option value
 * @returns The selected child component or null
 * 
 * @example
 * ```tsx
 * <Selector option={TopOption} defaultOption={LongHairStraight}>
 *   <NoHair />
 *   <LongHairStraight />
 *   <LongHairCurly />
 * </Selector>
 * ```
 */
export default function Selector({
  option,
  defaultOption,
  children,
}: SelectorProps) {
  const optionContext = useContext(OptionContextReact);
  const [value, setValue] = useState<string | null>(null);
  const childrenRef = useRef(children);

  /**
   * Keep children ref synchronized with current children.
   * This allows us to access children in effects without including them in dependencies.
   */
  useEffect(() => {
    childrenRef.current = children;
  }, [children]);

  /**
   * Set up option context subscription and register available options.
   * This effect:
   * - Subscribes to option value changes
   * - Registers available options from children
   * - Sets the default value
   * - Updates the selected value
   */
  useEffect(() => {
    if (!optionContext) return;

    const defaultValue =
      typeof defaultOption === "string"
        ? defaultOption
        : getComponentOptionValue(defaultOption);

    /**
     * Handle option value changes from context.
     * Updates local state when the option value changes.
     */
    const handleUpdate = () => {
      const newValue = optionContext.getValue(option.key);
      setValue(newValue);
    };

    optionContext.addStateChangeListener(handleUpdate);
    optionContext.optionEnter(option.key);
    const optionState = optionContext.getOptionState(option.key);

    /**
     * Extract available option values from children.
     * Each child component should have an optionValue property.
     */
    const childrenArray = Children.toArray(childrenRef.current);
    const values = childrenArray
      .map((child) => {
        if (isValidElement(child) && child.type && typeof child.type !== "string") {
          return getComponentOptionValue(child.type as ComponentType);
        }
        return null;
      })
      .filter((v): v is string => v !== null);

    /**
     * Register available options if all values are unique.
     * Prevents duplicate option values which would cause ambiguity.
     */
    if (values.length > 0 && new Set(values).size === values.length) {
      optionContext.setOptions(option.key, values);
    }

    /**
     * Set default value if option state exists.
     */
    if (optionState) {
      optionContext.setDefaultValue(option.key, defaultValue);
    }

    // Initial value update
    handleUpdate();

    /**
     * Cleanup: Remove listeners and decrement availability counter.
     */
    return () => {
      optionContext.removeStateChangeListener(handleUpdate);
      optionContext.optionExit(option.key);
    };
  }, [optionContext, option.key, defaultOption]);

  // Don't render if context is missing or no value is set
  if (!optionContext || !value) return null;

  /**
   * Find and return the child component matching the current option value.
   * Use children directly instead of ref to avoid accessing refs during render.
   */
  let result: ReactNode | null = null;
  Children.forEach(children, (child) => {
    if (
      isValidElement(child) &&
      child.type &&
      typeof child.type !== "string"
    ) {
      const childType = child.type as ComponentType;
      if (getComponentOptionValue(childType) === value) {
        result = child;
      }
    }
  });

  return <>{result}</>;
}
