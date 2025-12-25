import type { ComponentType } from "react";

/**
 * Utility function to attach optionValue to a component in a type-safe way.
 * This avoids the need for `as any` type assertions throughout the codebase.
 *
 * @param component - The React component to attach optionValue to
 * @param value - The option value string
 * @returns The component with optionValue attached
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withOptionValue<T extends ComponentType<any>>(
  component: T,
  value: string
): T & { optionValue: string } {
  (component as T & { optionValue: string }).optionValue = value;
  return component as T & { optionValue: string };
}
