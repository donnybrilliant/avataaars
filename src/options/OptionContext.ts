/**
 * Option Context - State management for avatar options
 *
 * This module provides the OptionContext class, which manages the state
 * of all avatar customization options. It implements a publish-subscribe
 * pattern for reactive updates when option values change.
 *
 * @module OptionContext
 */

import type {
  Option,
  OptionKey,
  OptionState,
  OptionContextState,
} from "../types";

// Re-export for backward compatibility
export type { OptionState, OptionContextState };

/**
 * OptionContext manages the state of all avatar customization options.
 *
 * This class provides:
 * - Centralized state management for all avatar options
 * - Publish-subscribe pattern for reactive updates
 * - Default value handling
 * - Option availability tracking
 *
 * @example
 * ```ts
 * const context = new OptionContext(allOptions);
 * context.setValue("topType", "LongHairStraight");
 * context.getValue("topType"); // "LongHairStraight"
 * ```
 */
export default class OptionContext {
  /**
   * Listeners for state changes (any option state update)
   */
  private stateChangeListeners = new Set<() => void>();

  /**
   * Listeners for value changes (specific option value updates)
   */
  private valueChangeListeners = new Set<
    (key: OptionKey, value: string) => void
  >();

  /**
   * Current state of all options (metadata, defaults, availability)
   */
  private _state: OptionContextState = {} as OptionContextState;

  /**
   * Current values for all options
   */
  private _data: Partial<Record<OptionKey, string>> = {};

  /**
   * All available options (read-only)
   */
  private readonly _options: readonly Option[];

  /**
   * Get all available options
   */
  get options() {
    return this._options;
  }

  /**
   * Get current state of all options
   */
  get state() {
    return this._state;
  }

  /**
   * Create a new OptionContext instance.
   *
   * @param options - Array of all available options to manage
   */
  constructor(options: readonly Option[]) {
    this._options = options;
    const initialState: OptionContextState = {} as OptionContextState;
    for (const option of options) {
      initialState[option.key] = {
        key: option.key,
        available: 0,
        options: [],
      };
    }
    this._state = initialState;
  }

  /**
   * Add a listener for state changes.
   * Called whenever any option state is updated.
   *
   * @param listener - Callback function to invoke on state changes
   */
  addStateChangeListener(listener: () => void) {
    this.stateChangeListeners.add(listener);
  }

  /**
   * Remove a state change listener.
   *
   * @param listener - Callback function to remove
   */
  removeStateChangeListener(listener: () => void) {
    this.stateChangeListeners.delete(listener);
  }

  /**
   * Add a listener for value changes.
   * Called whenever a specific option value is updated.
   *
   * @param listener - Callback function receiving (key, value) on changes
   */
  addValueChangeListener(listener: (key: OptionKey, value: string) => void) {
    this.valueChangeListeners.add(listener);
  }

  /**
   * Remove a value change listener.
   *
   * @param listener - Callback function to remove
   */
  removeValueChangeListener(listener: (key: OptionKey, value: string) => void) {
    this.valueChangeListeners.delete(listener);
  }

  /**
   * Increment the availability counter for an option.
   * Used to track how many components are using this option.
   *
   * @param key - The option key to increment availability for
   */
  optionEnter(key: OptionKey) {
    const optionState = this.getOptionState(key);
    if (!optionState) return;
    this.setState({
      [key]: {
        ...optionState,
        available: optionState.available + 1,
      },
    });
  }

  /**
   * Decrement the availability counter for an option.
   * Used when a component stops using this option.
   *
   * @param key - The option key to decrement availability for
   */
  optionExit(key: OptionKey) {
    const optionState = this.getOptionState(key);
    if (!optionState) return;
    this.setState({
      [key]: {
        ...optionState,
        available: optionState.available - 1,
      },
    });
  }

  /**
   * Get the current state for a specific option.
   *
   * @param key - The option key to get state for
   * @returns OptionState or null if option doesn't exist
   */
  getOptionState(key: OptionKey): OptionState | null {
    return this.state[key] || null;
  }

  /**
   * Get the current value for a specific option.
   * Returns the set value, or the default value if no value is set.
   *
   * @param key - The option key to get value for
   * @returns Current value, default value, or null
   */
  getValue(key: OptionKey): string | null {
    const optionState = this.getOptionState(key);
    if (!optionState) {
      return null;
    }
    const value = this._data[key];
    if (value) {
      return value;
    }
    return optionState.defaultValue || null;
  }

  /**
   * Set the value for a specific option.
   * Triggers value change listeners and state change notification.
   *
   * @param key - The option key to set value for
   * @param value - The value to set
   */
  setValue(key: OptionKey, value: string) {
    this._data[key] = value;
    for (const listener of this.valueChangeListeners) {
      listener(key, value);
    }
    this.notifyListener();
  }

  /**
   * Set multiple option values at once.
   * Useful for bulk updates or initialization.
   *
   * @param data - Object mapping option keys to values
   */
  setData(data: Partial<Record<OptionKey, string>>) {
    this._data = data;
    this.notifyListener();
  }

  /**
   * Set the default value for an option.
   * Used when no explicit value is set.
   *
   * @param key - The option key to set default for
   * @param defaultValue - The default value to use
   */
  setDefaultValue(key: OptionKey, defaultValue: string) {
    const optionState = this.getOptionState(key);
    if (!optionState) return;
    this.setState({
      [key]: {
        ...optionState,
        defaultValue,
      },
    });
  }

  /**
   * Set the available option values for a specific option key.
   * Used by Selector components to register their available options.
   *
   * @param key - The option key to set available options for
   * @param options - Array of available option values
   */
  setOptions(key: OptionKey, options: readonly string[]) {
    const optionState = this.getOptionState(key);
    if (!optionState) return;
    this.setState({
      [key]: {
        ...optionState,
        key,
        options,
      },
    });
  }

  /**
   * Update the internal state and notify listeners.
   *
   * @param state - Partial state update to merge
   */
  private setState(state: Partial<OptionContextState>) {
    this._state = {
      ...this.state,
      ...state,
    };
    this.notifyListener();
  }

  /**
   * Notify all state change listeners.
   * Called whenever state is updated.
   */
  private notifyListener() {
    for (const listener of this.stateChangeListeners) {
      listener();
    }
  }
}
