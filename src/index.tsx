/**
 * Main Avatar component with animation features
 * 
 * This module provides the primary Avatar component for the avataaars library.
 * It supports optional animation features including:
 * - Idle animation: Random expression changes when not hovering
 * - Hover scale: Visual scaling effect on mouse hover
 * - Hover animation: Expression sequence animation on hover
 * 
 * All animation features are independent and can be combined as needed.
 * 
 * @module Avatar
 */

import {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
  useId,
} from "react";

import Avatar, { AvatarStyle } from "./avatar";
import {
  OptionContext,
  allOptions,
  OptionContextReact,
} from "./options";
import type {
  AvatarProps,
  HoverExpression,
  OptionKey,
} from "./types";

// Re-export types from centralized location
export type { AvatarProps as Props, HoverExpression, OptionKey } from "./types";
export { AvatarStyle } from "./types";

// Export option values
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
  type TopType,
  type AccessoriesType,
  type HairColor,
  type HatColor,
  type FacialHairType,
  type FacialHairColor,
  type ClotheType,
  type ClotheColor,
  type GraphicType,
  type EyeType,
  type EyebrowType,
  type MouthType,
  type SkinColor,
} from "./optionValues";

import { default as PieceComponent } from "./avatar/piece";

/**
 * All valid option keys in the avatar system.
 * Extracted as a constant to avoid duplication and ensure consistency.
 */
const ALL_OPTION_KEYS: readonly OptionKey[] = [
  "topType",
  "accessoriesType",
  "hairColor",
  "hatColor",
  "facialHairType",
  "facialHairColor",
  "clotheType",
  "clotheColor",
  "graphicType",
  "eyeType",
  "eyebrowType",
  "mouthType",
  "skinColor",
] as const;

/**
 * Type representing which expression feature is being restored
 */
type ExpressionType = "mouth" | "eyes" | "eyebrow";

/**
 * Interface for expression restoration during hover animation transitions
 */
interface ExpressionToRestore {
  readonly type: ExpressionType;
  readonly value: string;
}

/**
 * Main Avatar component with optional animation features.
 * 
 * This component renders an avatar with support for:
 * - Customizable appearance through props
 * - Optional idle animation (random expression changes)
 * - Optional hover scale effect
 * - Optional hover animation sequence
 * 
 * Animation features are independent and can be combined. The component
 * automatically manages state transitions and cleanup.
 * 
 * @param props - Avatar configuration and animation settings
 * @returns React component rendering the avatar
 * 
 * @example
 * ```tsx
 * <AvatarComponent
 *   avatarStyle={AvatarStyle.Circle}
 *   topType="LongHairStraight"
 *   eyeType="Happy"
 *   animationSpeed={2000}
 *   hoverScale={1.2}
 * />
 * ```
 */
export default function AvatarComponent(props: AvatarProps) {
  // Create option context instance (memoized to persist across renders)
  const optionContext = useMemo(() => new OptionContext(allOptions), []);
  
  // Track previous props to detect changes
  const prevPropsRef = useRef<AvatarProps>({} as AvatarProps);
  
  // Prevent duplicate initialization
  const isInitializedRef = useRef(false);
  
  // Unique mask ID for SVG masking (React 19 useId hook)
  const maskId = useId();

  /**
   * Initialize option context with props on first render.
   * This ensures all provided prop values are set in the option context
   * before the avatar renders.
   */
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    for (const key of ALL_OPTION_KEYS) {
      const value = props[key];
      if (value && typeof value === "string") {
        optionContext.setValue(key, value);
      }
    }
    // Initialize prevPropsRef after setting values
    prevPropsRef.current = { ...props };
  }, [props, optionContext]);

  // Animation state management
  // These state values override props when animations are active
  const [mouth, setMouth] = useState<string | null>(null);
  const [eyes, setEyes] = useState<string | null>(null);
  const [eyebrow, setEyebrow] = useState<string | null>(null);
  
  // Hover state tracking
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseHovered, setIsMouseHovered] = useState(false);
  
  // Timer references for animation scheduling and cleanup
  const animationIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restoreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoreSequenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // State preservation for animation transitions
  const savedStateRef = useRef<{
    mouth: string;
    eyes: string;
    eyebrow: string;
  } | null>(null);
  
  // Original prop values for restoration after hover animations
  const originalPropsRef = useRef<{
    eyeType?: string;
    eyebrowType?: string;
    mouthType?: string;
  } | null>(null);
  
  // Prevent duplicate animation scheduling
  const isSchedulingRef = useRef(false);

  /**
   * Ref to store latest state values for use in callbacks.
   * This avoids stale closure issues in timer callbacks.
   */
  const stateRef = useRef({
    isHovered,
    mouth,
    eyes,
    eyebrow,
  });

  /**
   * Keep stateRef synchronized with actual state values.
   * This ensures callbacks always have access to the latest state.
   */
  useEffect(() => {
    stateRef.current = {
      isHovered,
      mouth,
      eyes,
      eyebrow,
    };
  }, [isHovered, mouth, eyes, eyebrow]);

  const {
    avatarStyle,
    style,
    className,
    animationSpeed: rawAnimationSpeed,
    hoverScale: rawHoverScale,
    backgroundColor = "#65C9FF",
    hoverSequence,
    hoverAnimationSpeed: rawHoverAnimationSpeed = 300, // Default hover animation speed
    eyeType: propEyeType,
    eyebrowType: propEyebrowType,
    mouthType: propMouthType,
    originalEyeType,
    originalEyebrowType,
    originalMouthType,
    ...restProps
  } = props;

  /**
   * Validate and clamp animation parameters to safe ranges.
   * This prevents performance issues and ensures smooth animations.
   */
  // Idle animation speed: 500-3000ms (0.5s to 3s)
  const animationSpeed = rawAnimationSpeed
    ? Math.max(500, Math.min(3000, rawAnimationSpeed))
    : undefined;
  // Hover animation speed: 100-2000ms
  const hoverAnimationSpeed = Math.max(100, Math.min(2000, rawHoverAnimationSpeed));
  // Hover scale: 1.05-1.32 (prevents excessive scaling)
  const hoverScale = rawHoverScale
    ? Math.max(1.05, Math.min(1.32, rawHoverScale))
    : undefined;

  /**
   * Update option context when props change.
   * This keeps the option context in sync with component props,
   * enabling child components to react to prop changes.
   */
  useEffect(() => {
    const prevProps = prevPropsRef.current;

    for (const key of ALL_OPTION_KEYS) {
      const value = props[key];
      // Update if value is a string and either it's different from previous or it's a new prop
      if (value && typeof value === "string") {
        if (value !== prevProps[key] || prevProps[key] === undefined) {
          optionContext.setValue(key, value);
        }
      }
    }

    prevPropsRef.current = { ...props };
  }, [props, optionContext]);

  /**
   * Feature detection flags.
   * All animation features are independent and can be combined:
   * - hoverScale: Visual scaling on hover (CSS transform only)
   * - hoverAnimation: Expression sequence on hover
   * - idleAnimation: Random expression changes when not hovering
   */
  const hasHoverScale = hoverScale !== undefined && hoverScale > 1;
  const hasHoverAnimation =
    hoverSequence !== undefined && hoverSequence.length > 0;
  const hasIdleAnimation =
    animationSpeed !== undefined && animationSpeed < 50000;

  /**
   * Determine if animation container wrapper is needed.
   * Required for any animation feature or custom background color.
   */
  const needsAnimationContainer =
    hasHoverScale ||
    hasHoverAnimation ||
    hasIdleAnimation ||
    backgroundColor !== undefined;

  /**
   * Determine if hover event handlers are needed.
   * Only required when hover scale or hover animation is enabled.
   */
  const needsHoverHandlers = hasHoverScale || hasHoverAnimation;

  /**
   * Check if expressions can be animated.
   * Expressions can only be animated if they're not explicitly set via props.
   * This prevents conflicts between user-defined expressions and animations.
   */
  const canAnimateExpressions =
    propEyeType === undefined &&
    propEyebrowType === undefined &&
    propMouthType === undefined;

  /**
   * Determine if idle animation should be active.
   * Requires both idle animation enabled and no explicit expression props.
   */
  const isIdleAnimating = hasIdleAnimation && canAnimateExpressions;

  /**
   * Get available expression options for animation.
   * Returns the list of valid values for each expression type.
   * 
   * @param key - The expression type to get options for
   * @returns Array of valid expression values
   */
  const getFallbackOptions = useCallback(
    (key: "mouth" | "eyes" | "eyebrow"): string[] => {
      const options = {
        mouth: [
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
        ],
        eyes: [
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
        ],
        eyebrow: [
          "Angry",
          "AngryNatural",
          "Default",
          "DefaultNatural",
          "FlatNatural",
          "RaisedExcited",
          "RaisedExcitedNatural",
          "SadConcerned",
          "SadConcernedNatural",
          "UnibrowNatural",
          "UpDown",
          "UpDownNatural",
        ],
      } satisfies Record<"mouth" | "eyes" | "eyebrow", string[]>;
      return options[key];
    },
    []
  );

  /**
   * Initialize random expressions when idle animation is enabled.
   * Sets initial random values for mouth, eyes, and eyebrow if not already set.
   */
  useEffect(() => {
    if (!isIdleAnimating) return;
    const mouthOpts = getFallbackOptions("mouth");
    const eyesOpts = getFallbackOptions("eyes");
    const eyebrowOpts = getFallbackOptions("eyebrow");
    if (!mouth)
      setMouth(mouthOpts[Math.floor(Math.random() * mouthOpts.length)]);
    if (!eyes) setEyes(eyesOpts[Math.floor(Math.random() * eyesOpts.length)]);
    if (!eyebrow)
      setEyebrow(eyebrowOpts[Math.floor(Math.random() * eyebrowOpts.length)]);
  }, [isIdleAnimating, getFallbackOptions, mouth, eyes, eyebrow]);

  /**
   * Change a random expression feature for idle animation.
   * Randomly selects mouth, eyes, or eyebrow and changes it to a different value.
   * This creates natural-looking idle animations.
   */
  const changeRandomFeature = useCallback(() => {
    const state = stateRef.current;
    if (state.isHovered || !state.mouth) return;

    const feature = Math.floor(Math.random() * 3);
    const mouthOpts = getFallbackOptions("mouth");
    const eyesOpts = getFallbackOptions("eyes");
    const eyebrowOpts = getFallbackOptions("eyebrow");

    if (feature === 0) {
      const opts = mouthOpts.filter((m) => m !== state.mouth);
      if (opts.length > 0) {
        setMouth(opts[Math.floor(Math.random() * opts.length)]);
      }
    } else if (feature === 1) {
      const opts = eyesOpts.filter((e) => e !== state.eyes);
      if (opts.length > 0) {
        setEyes(opts[Math.floor(Math.random() * opts.length)]);
      }
    } else {
      const opts = eyebrowOpts.filter((e) => e !== state.eyebrow);
      if (opts.length > 0) {
        setEyebrow(opts[Math.floor(Math.random() * opts.length)]);
      }
    }
  }, [getFallbackOptions]);

  /**
   * Schedule the next idle animation change.
   * Uses a randomized delay based on animationSpeed to create natural timing.
   * The delay is calculated as: baseDelay (1000-2000ms) * (speed / 2000)
   * 
   * Examples:
   * - animationSpeed=2000: base delay (1000-2000ms) - natural idle animation
   * - animationSpeed=4000: 2x delay (2000-4000ms) - slower, more subtle
   * - animationSpeed=1000: 0.5x delay (500-1000ms) - faster, more active
   */
  const scheduleNextChange = useCallback(() => {
    // Prevent multiple timers from running simultaneously
    if (animationIntervalRef.current !== null) {
      clearTimeout(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }

    // Don't schedule if hovered or expressions not initialized
    const state = stateRef.current;
    if (state.isHovered || !state.mouth) return;

    // Calculate randomized delay based on animation speed
    const speed = animationSpeed ?? 2000;
    const baseDelay = Math.floor(Math.random() * 1000) + 1000; // 1000-2000ms range
    const delay = Math.max(500, Math.floor((baseDelay * speed) / 2000)); // Min 500ms

    animationIntervalRef.current = window.setTimeout(() => {
      animationIntervalRef.current = null; // Clear ref before calling
      changeRandomFeature();
      scheduleNextChange();
    }, delay);
  }, [animationSpeed, changeRandomFeature]);

  /**
   * Start idle animation scheduling when conditions are met.
   * Only starts if idle animation is enabled, expressions are initialized,
   * and no scheduling is already in progress.
   */
  useEffect(() => {
    if (!isIdleAnimating) {
      isSchedulingRef.current = false;
      return;
    }
    if (!mouth || isSchedulingRef.current) return;
    isSchedulingRef.current = true;
    scheduleNextChange();
  }, [isIdleAnimating, mouth, scheduleNextChange]);

  /**
   * Get the default hover animation sequence.
   * Returns a predefined sequence of expressions for hover animations.
   * Can be overridden by providing a custom hoverSequence prop.
   * 
   * @returns Default sequence of hover expressions
   */
  const getDefaultHoverSequence = useCallback(
    (): HoverExpression[] => [
      { mouth: "Disbelief", eyes: "Surprised", eyebrow: "UpDown" },
      { mouth: "ScreamOpen", eyes: "Dizzy", eyebrow: "Angry" },
      { mouth: "Vomit", eyes: "Close", eyebrow: "SadConcerned" },
      { mouth: "Grimace", eyes: "EyeRoll", eyebrow: "UnibrowNatural" },
    ],
    []
  );

  /**
   * Start the hover animation sequence.
   * Cycles through the provided or default hover sequence at the specified interval.
   */
  const startHoverSequence = useCallback(() => {
    if (!hasHoverAnimation) return;
    const seq = hoverSequence || getDefaultHoverSequence();
    let i = 0;
    hoverIntervalRef.current = window.setInterval(() => {
      const s = seq[i % seq.length];
      setMouth(s.mouth);
      setEyes(s.eyes);
      setEyebrow(s.eyebrow);
      i++;
    }, hoverAnimationSpeed);
  }, [
    hasHoverAnimation,
    hoverSequence,
    hoverAnimationSpeed,
    getDefaultHoverSequence,
  ]);

  /**
   * Handle mouse enter event for hover animations.
   * Manages state transitions when hover begins:
   * - Pauses idle animation if active
   * - Saves current state for restoration
   * - Starts hover animation sequence if enabled
   * - Applies hover scale if enabled
   */
  const handleMouseEnter = useCallback(() => {
    if (!needsHoverHandlers) return;

    // Clear any pending restore timeout if user hovers again
    if (restoreTimeoutRef.current !== null) {
      clearTimeout(restoreTimeoutRef.current);
      restoreTimeoutRef.current = null;
    }

    setIsHovered(true);
    setIsMouseHovered(true);

    /**
     * Save original prop values for restoration when hover ends.
     * Priority: originalEyeType/originalEyebrowType/originalMouthType (from AvatarPreview)
     *          > current prop values
     * This ensures proper restoration after hover animations complete.
     */
    if (
      originalEyeType !== undefined ||
      originalEyebrowType !== undefined ||
      originalMouthType !== undefined
    ) {
      originalPropsRef.current = {
        eyeType: originalEyeType,
        eyebrowType: originalEyebrowType,
        mouthType: originalMouthType,
      };
    } else if (
      propEyeType !== undefined ||
      propEyebrowType !== undefined ||
      propMouthType !== undefined
    ) {
      originalPropsRef.current = {
        eyeType: propEyeType,
        eyebrowType: propEyebrowType,
        mouthType: propMouthType,
      };
    }

    // Handle hover animation if enabled
    if (hasHoverAnimation) {
      if (isIdleAnimating) {
        // Idle animation is running: pause it and save current state
        savedStateRef.current = {
          mouth: mouth || "Default",
          eyes: eyes || "Default",
          eyebrow: eyebrow || "Default",
        };
        if (animationIntervalRef.current !== null) {
          clearTimeout(animationIntervalRef.current);
          animationIntervalRef.current = null;
        }
      } else {
        // No idle animation: save current state (from props or defaults)
        savedStateRef.current = {
          mouth: propMouthType || mouth || "Default",
          eyes: propEyeType || eyes || "Default",
          eyebrow: propEyebrowType || eyebrow || "Default",
        };
        // Set initial state to current values so hover sequence can override them
        if (canAnimateExpressions) {
          if (propMouthType && !mouth) setMouth(propMouthType);
          if (propEyeType && !eyes) setEyes(propEyeType);
          if (propEyebrowType && !eyebrow) setEyebrow(propEyebrowType);
        }
      }
      startHoverSequence();
    } else if (isIdleAnimating) {
      // Only hover scale, no hover animation: pause idle animation
      savedStateRef.current = {
        mouth: mouth || "Default",
        eyes: eyes || "Default",
        eyebrow: eyebrow || "Default",
      };
      if (animationIntervalRef.current !== null) {
        clearTimeout(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
    }
  }, [
    needsHoverHandlers,
    hasHoverAnimation,
    isIdleAnimating,
    canAnimateExpressions,
    mouth,
    eyes,
    eyebrow,
    startHoverSequence,
    propEyeType,
    propEyebrowType,
    propMouthType,
    originalEyeType,
    originalEyebrowType,
    originalMouthType,
  ]);

  /**
   * Handle mouse leave event for hover animations.
   * Manages state restoration when hover ends:
   * - Stops hover animation sequence immediately
   * - Restores expressions sequentially for smooth transition
   * - Resumes idle animation if it was active
   * - Restores original prop values if no idle animation
   */
  const handleMouseLeave = useCallback(() => {
    if (!needsHoverHandlers) return;

    // Clear any pending restore timeout
    if (restoreTimeoutRef.current !== null) {
      clearTimeout(restoreTimeoutRef.current);
      restoreTimeoutRef.current = null;
    }

    // Stop the hover animation sequence immediately
    if (hoverIntervalRef.current !== null) {
      clearInterval(hoverIntervalRef.current);
      hoverIntervalRef.current = null;
    }

    // Always set mouse hover to false immediately (for hover scale)
    setIsMouseHovered(false);

    if (hasHoverAnimation && savedStateRef.current) {
      /**
       * Restore state after hover animation.
       * If idle animation is enabled, restore to saved state and resume idle animation.
       * Otherwise, restore to original prop values.
       * 
       * Keep isHovered true during restore so state values are used,
       * then set to false at the end to allow props to take precedence.
       */
      if (isIdleAnimating) {
        // Idle animation is enabled: restore to saved state and resume
        // Pause briefly to show current expression before starting restore
        restoreTimeoutRef.current = window.setTimeout(() => {
          // Use saved state (which contains the idle animation state before hover)
          if (savedStateRef.current) {
            const targetMouth = savedStateRef.current.mouth;
            const targetEyes = savedStateRef.current.eyes;
            const targetEyebrow = savedStateRef.current.eyebrow;

            // Restore expressions one by one with delays (in order: mouth, eyes, eyebrow)
            const expressionsToRestore: readonly ExpressionToRestore[] = [
              { type: "mouth", value: targetMouth },
              { type: "eyes", value: targetEyes },
              { type: "eyebrow", value: targetEyebrow },
            ] as const;

            const changeDelay = 800; // 800ms between each expression change for visible transition
            let changeIndex = 0;

            const restoreNext = () => {
              if (changeIndex >= expressionsToRestore.length) {
                /**
                 * All expressions restored.
                 * Set isHovered to false and restart idle animation.
                 * Manually update stateRef before calling scheduleNextChange
                 * since stateRef updates in useEffect are async.
                 */
                setIsHovered(false);
                stateRef.current.isHovered = false;
                savedStateRef.current = null;
                isSchedulingRef.current = false;
                scheduleNextChange();
                restoreSequenceTimeoutRef.current = null;
                restoreTimeoutRef.current = null;
                return;
              }

              const change = expressionsToRestore[changeIndex];
              switch (change.type) {
                case "mouth":
                  setMouth(change.value);
                  break;
                case "eyes":
                  setEyes(change.value);
                  break;
                case "eyebrow":
                  setEyebrow(change.value);
                  break;
              }

              changeIndex++;
              if (changeIndex < expressionsToRestore.length) {
                restoreSequenceTimeoutRef.current = window.setTimeout(
                  restoreNext,
                  changeDelay
                );
              } else {
                /**
                 * Last expression restored.
                 * Small delay to show the last expression before restarting idle animation.
                 */
                restoreSequenceTimeoutRef.current = window.setTimeout(() => {
                  setIsHovered(false);
                  stateRef.current.isHovered = false;
                  savedStateRef.current = null;
                  isSchedulingRef.current = false;
                  scheduleNextChange();
                  restoreSequenceTimeoutRef.current = null;
                  restoreTimeoutRef.current = null;
                }, 100);
              }
            };

            // Start the sequential restore
            restoreNext();
          } else {
            // No saved state, just set isHovered to false and restart idle animation
            setIsHovered(false);
            // Manually update stateRef before calling scheduleNextChange
            // (since stateRef updates in useEffect, which is async)
            stateRef.current.isHovered = false;
            isSchedulingRef.current = false;
            scheduleNextChange();
            restoreTimeoutRef.current = null;
          }
        }, 600); // Initial pause before starting sequential restore
      } else {
        /**
         * No idle animation: restore to original prop values.
         * Restore expressions sequentially for natural transition.
         * Keep isHovered true during restore so state values are used,
         * then set to false at the end to allow props to take precedence.
         */
        restoreTimeoutRef.current = window.setTimeout(() => {
          // Use saved state (which contains the original values before hover)
          if (savedStateRef.current) {
            const targetMouth = savedStateRef.current.mouth;
            const targetEyes = savedStateRef.current.eyes;
            const targetEyebrow = savedStateRef.current.eyebrow;

            // Restore expressions one by one with delays (in order: mouth, eyes, eyebrow)
            const expressionsToRestore: readonly ExpressionToRestore[] = [
              { type: "mouth", value: targetMouth },
              { type: "eyes", value: targetEyes },
              { type: "eyebrow", value: targetEyebrow },
            ] as const;

            const changeDelay = 800; // 800ms between each expression change for visible transition
            let changeIndex = 0;

            const restoreNext = () => {
              if (changeIndex >= expressionsToRestore.length) {
                /**
                 * All expressions restored.
                 * Clear state so props take precedence and cleanup refs.
                 */
                setIsHovered(false);
                setMouth(originalPropsRef.current?.mouthType || null);
                setEyes(originalPropsRef.current?.eyeType || null);
                setEyebrow(originalPropsRef.current?.eyebrowType || null);
                originalPropsRef.current = null;
                savedStateRef.current = null;
                restoreSequenceTimeoutRef.current = null;
                restoreTimeoutRef.current = null;
                return;
              }

              const change = expressionsToRestore[changeIndex];
              switch (change.type) {
                case "mouth":
                  setMouth(change.value);
                  break;
                case "eyes":
                  setEyes(change.value);
                  break;
                case "eyebrow":
                  setEyebrow(change.value);
                  break;
              }

              changeIndex++;
              if (changeIndex < expressionsToRestore.length) {
                restoreSequenceTimeoutRef.current = window.setTimeout(
                  restoreNext,
                  changeDelay
                );
              } else {
                /**
                 * Last expression restored.
                 * Small delay to show the last expression before clearing state.
                 */
                restoreSequenceTimeoutRef.current = window.setTimeout(() => {
                  setIsHovered(false);
                  setMouth(originalPropsRef.current?.mouthType || null);
                  setEyes(originalPropsRef.current?.eyeType || null);
                  setEyebrow(originalPropsRef.current?.eyebrowType || null);
                  originalPropsRef.current = null;
                  savedStateRef.current = null;
                  restoreSequenceTimeoutRef.current = null;
                  restoreTimeoutRef.current = null;
                }, 100);
              }
            };

            // Start the sequential restore
            restoreNext();
          } else {
            // No saved state, just set isHovered to false and clear to use props
            setIsHovered(false);
            setMouth(originalPropsRef.current?.mouthType || null);
            setEyes(originalPropsRef.current?.eyeType || null);
            setEyebrow(originalPropsRef.current?.eyebrowType || null);
            originalPropsRef.current = null;
            restoreTimeoutRef.current = null;
          }
        }, 600); // Initial pause before starting sequential restore
      }
    } else if (isIdleAnimating && savedStateRef.current) {
      /**
       * Only hover scale was active, idle animation was paused.
       * Restore saved state and resume idle animation.
       */
      setMouth(savedStateRef.current.mouth);
      setEyes(savedStateRef.current.eyes);
      setEyebrow(savedStateRef.current.eyebrow);
      savedStateRef.current = null;
      // Ensure stateRef is updated (isHovered should already be false here)
      stateRef.current.isHovered = false;
      isSchedulingRef.current = false;
      scheduleNextChange();
    }
  }, [
    needsHoverHandlers,
    hasHoverAnimation,
    isIdleAnimating,
    scheduleNextChange,
  ]);

  /**
   * Cleanup effect: Clear all timers on unmount.
   * Prevents memory leaks and ensures no timers continue after component unmounts.
   */
  useEffect(() => {
    return () => {
      if (animationIntervalRef.current !== null) {
        clearTimeout(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
      if (hoverIntervalRef.current !== null) {
        clearInterval(hoverIntervalRef.current);
        hoverIntervalRef.current = null;
      }
      if (restoreTimeoutRef.current !== null) {
        clearTimeout(restoreTimeoutRef.current);
        restoreTimeoutRef.current = null;
      }
      if (restoreSequenceTimeoutRef.current !== null) {
        clearTimeout(restoreSequenceTimeoutRef.current);
        restoreSequenceTimeoutRef.current = null;
      }
      isSchedulingRef.current = false;
    };
  }, []);

  /**
   * Determine final expression values to use.
   * Priority logic:
   * - When hovering with hover animation and props are set: prioritize state over props
   * - Otherwise: props take precedence over state
   * - Fallback to "Default" if neither is available
   */
  const isHoverAnimatingWithProps =
    isHovered &&
    hasHoverAnimation &&
    !isIdleAnimating &&
    (propEyeType !== undefined ||
      propEyebrowType !== undefined ||
      propMouthType !== undefined);

  const finalEyeType = isHoverAnimatingWithProps
    ? eyes || propEyeType || "Default"
    : propEyeType || eyes || "Default";
  const finalEyebrowType = isHoverAnimatingWithProps
    ? eyebrow || propEyebrowType || "Default"
    : propEyebrowType || eyebrow || "Default";
  const finalMouthType = isHoverAnimatingWithProps
    ? mouth || propMouthType || "Default"
    : propMouthType || mouth || "Default";

  /**
   * Update option context with final expression values.
   * This ensures child components receive the correct values.
   */
  useEffect(() => {
    if (finalEyeType) optionContext.setValue("eyeType", finalEyeType);
    if (finalEyebrowType)
      optionContext.setValue("eyebrowType", finalEyebrowType);
    if (finalMouthType) optionContext.setValue("mouthType", finalMouthType);
  }, [finalEyeType, finalEyebrowType, finalMouthType, optionContext]);

  /**
   * Determine if circle style is being used.
   * Supports both enum and string values for backward compatibility.
   */
  const isCircle =
    avatarStyle === AvatarStyle.Circle || avatarStyle === "Circle";

  /**
   * Prepare avatar props.
   * When animation container is needed with circle style, use Transparent
   * so the circle background can be rendered separately in the container.
   */
  const avatarProps = {
    avatarStyle: (needsAnimationContainer && isCircle
      ? AvatarStyle.Transparent
      : avatarStyle) as AvatarStyle,
    style,
    className,
    eyeType: finalEyeType,
    eyebrowType: finalEyebrowType,
    mouthType: finalMouthType,
    ...restProps,
  };

  /**
   * Circle geometry constants for mask calculations.
   * These define the circle position and size for the avatar.
   */
  const r = 120; // Circle radius
  const cx = 132; // Circle center X
  const cy = 160; // Circle center Y

  /**
   * Core avatar element wrapped in option context provider.
   * This provides the option context to all child components.
   */
  const avatarElement = (
    <OptionContextReact.Provider value={optionContext}>
      <Avatar {...avatarProps} />
    </OptionContextReact.Provider>
  );

  /**
   * Render with animation container if any animation features are enabled.
   * The container handles:
   * - Circle background rendering
   * - Hover scale transformations
   * - Overflow masking for circle style
   * - Hover event handlers (if needed)
   */
  if (needsAnimationContainer) {
    return (
      <div
        style={{
          position: "relative",
          display: "inline-block",
          cursor: "default",
          width: 264,
          height: 280,
          overflow: "visible",
        }}
        onMouseEnter={needsHoverHandlers ? handleMouseEnter : undefined}
        onMouseLeave={needsHoverHandlers ? handleMouseLeave : undefined}
      >
        {isCircle && (
          <div
            style={{
              position: "absolute",
              left: cx - r,
              top: cy - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              backgroundColor,
              zIndex: 0,
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 264,
            height: 280,
            zIndex: 1,
            transition: "transform 0.3s ease-in-out",
            transform:
              isMouseHovered && hasHoverScale
                ? `scale(${hoverScale ?? 1.2})`
                : "scale(1)",
            transformOrigin: "bottom center",
          }}
        >
          {avatarElement}
        </div>
        {isCircle && (
          <svg
            width="264"
            height="280"
            viewBox="0 0 264 280"
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <defs>
              <mask id={maskId}>
                {/**
                  * SVG Mask for circle overflow clipping.
                  * Mask logic: White = opaque (hides), Black = transparent (shows through)
                  * Start with everything black (transparent) to show through,
                  * then add white (opaque) areas to hide overflow outside the circle.
                  */}
                <rect width="100%" height="100%" fill="black" />
                {/* Left side overflow (bottom half only) */}
                <rect
                  x="0"
                  y={cy}
                  width={cx - r}
                  height={280 - cy}
                  fill="white"
                />
                {/* Right side overflow (bottom half only) */}
                <rect
                  x={cx + r}
                  y={cy}
                  width={264 - (cx + r)}
                  height={280 - cy}
                  fill="white"
                />
                {/* Bottom overflow (below circle bottom) */}
                <rect
                  x={cx - r}
                  y={cy + r}
                  width={r * 2}
                  height={280 - (cy + r)}
                  fill="white"
                />
                {/* Bottom half circle overflow - left crescent */}
                <path
                  d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx} ${cy + r} L ${
                    cx - r
                  } ${cy + r} Z`}
                  fill="white"
                />
                {/* Bottom half circle overflow - right crescent */}
                <path
                  d={`M ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx} ${cy + r} L ${
                    cx + r
                  } ${cy + r} Z`}
                  fill="white"
                />
              </mask>
            </defs>
            {/**
              * White rect with mask applied.
              * Covers overflow outside circle (opaque), transparent inside circle.
              * This creates the circular clipping effect.
              */}
            <rect
              width="100%"
              height="100%"
              fill="white"
              mask={`url(#${maskId})`}
            />
          </svg>
        )}
      </div>
    );
  }

  /**
   * No animation features enabled: return avatar directly.
   * No wrapper container needed, just the avatar element.
   */
  return avatarElement;
}

/**
 * Piece component for rendering individual avatar pieces.
 * 
 * This component is used for rendering specific parts of the avatar
 * (e.g., for avatar builders or piece-by-piece rendering).
 * 
 * @param props - Avatar configuration props
 * @returns React component rendering the specified avatar piece
 * 
 * @example
 * ```tsx
 * <Piece
 *   avatarStyle={AvatarStyle.Circle}
 *   pieceType="topType"
 *   pieceSize="100"
 * />
 * ```
 */
export function Piece(props: AvatarProps) {
  const optionContext = useMemo(() => new OptionContext(allOptions), []);
  const prevPropsRef = useRef<AvatarProps>(props);

  /**
   * Update option context when props change.
   * Only updates values that have actually changed to minimize re-renders.
   */
  useEffect(() => {
    const prevProps = prevPropsRef.current;

    for (const key of ALL_OPTION_KEYS) {
      const value = props[key];
      if (value && typeof value === "string" && value !== prevProps[key]) {
        optionContext.setValue(key, value);
      }
    }

    prevPropsRef.current = props;
  }, [props, optionContext]);

  const { avatarStyle, style, pieceType, pieceSize, viewBox } = props;

  return (
    <OptionContextReact.Provider value={optionContext}>
      <PieceComponent
        avatarStyle={avatarStyle as AvatarStyle}
        style={style}
        pieceType={pieceType}
        pieceSize={pieceSize}
        viewBox={viewBox}
      />
    </OptionContextReact.Provider>
  );
}
