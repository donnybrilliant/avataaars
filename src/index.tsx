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

import AvatarComponent, { AvatarStyle } from "./avatar";
import { OptionContext, allOptions, OptionContextReact } from "./options";
import type { AvatarProps, HoverExpression, OptionKey } from "./types";

// Re-export types from centralized location
export type { AvatarProps as Props, HoverExpression, OptionKey } from "./types";
export { AvatarStyle } from "./types";

// Import option values for validation and re-export
import {
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

// Re-export option values
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
};

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
 * <Avatar
 *   avatarStyle={AvatarStyle.Circle}
 *   topType="LongHairStraight"
 *   eyeType="Happy"
 *   animationSpeed={2000}
 *   hoverScale={1.2}
 * />
 * ```
 */
export default function Avatar(props: AvatarProps) {
  // Create option context instance (memoized to persist across renders)
  const optionContext = useMemo(() => new OptionContext(allOptions), []);

  // Track previous props to detect changes
  const prevPropsRef = useRef<AvatarProps>({} as AvatarProps);

  // Prevent duplicate initialization
  const isInitializedRef = useRef(false);

  // Unique mask ID for SVG masking (React 19 useId hook)
  const maskId = useId();

  // Ref to container div to get parent's background color
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentBackgroundColor, setParentBackgroundColor] =
    useState<string>("#ffffff");

  // Counter to force re-detection of background color when CSS variables change
  const [styleChangeCounter, setStyleChangeCounter] = useState(0);

  // Viewport-aware sizing: automatically calculate max width based on viewport
  // Always enabled to prevent overflow on smaller screens
  const [maxViewportConstrainedWidth, setMaxViewportConstrainedWidth] =
    useState(600);

  useEffect(() => {
    const calculateMaxWidth = () => {
      const viewportWidth = window.innerWidth;
      const padding = 160; // Account for container padding
      const maxWidth = 600; // Maximum preferred width
      const minWidth = 100; // Minimum width
      const calculatedMax = Math.min(
        maxWidth,
        Math.max(minWidth, viewportWidth - padding)
      );
      setMaxViewportConstrainedWidth(calculatedMax);
    };

    calculateMaxWidth();
    window.addEventListener("resize", calculateMaxWidth);
    return () => window.removeEventListener("resize", calculateMaxWidth);
  }, []);

  /**
   * Watch for CSS variable changes on document root and parent elements.
   * Uses MutationObserver to detect style attribute changes that may indicate
   * theme changes (e.g., via CSS variables being modified by a theme slider).
   * This allows the avatar's clip mask to dynamically respond to theme changes.
   */
  useEffect(() => {
    // Only observe if we need the animation container (which uses the background color for masking)
    if (!containerRef.current) return;

    // Debounce timer to batch rapid style changes
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const triggerUpdate = () => {
      // Clear any pending debounce
      if (debounceTimer !== null) {
        clearTimeout(debounceTimer);
      }
      // Use requestAnimationFrame to ensure computed styles are updated
      // before we re-detect the background color
      debounceTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          setStyleChangeCounter((c) => c + 1);
        });
      }, 16); // ~1 frame at 60fps
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          triggerUpdate();
          break;
        }
      }
    });

    // Observe document.documentElement (where CSS variables are typically set)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    // Also observe parent elements up the tree
    let current: HTMLElement | null = containerRef.current.parentElement;
    while (current && current !== document.documentElement) {
      observer.observe(current, {
        attributes: true,
        attributeFilter: ["style"],
      });
      current = current.parentElement;
    }

    return () => {
      observer.disconnect();
      if (debounceTimer !== null) {
        clearTimeout(debounceTimer);
      }
    };
  }, []);

  /**
   * Validation map for option values.
   * Maps option keys to their valid value arrays.
   */
  const OPTION_VALIDATION_MAP: Record<OptionKey, readonly string[]> = useMemo(
    () => ({
      topType: TOP_TYPES,
      accessoriesType: ACCESSORIES_TYPES,
      hairColor: HAIR_COLORS,
      hatColor: HAT_COLORS,
      facialHairType: FACIAL_HAIR_TYPES,
      facialHairColor: FACIAL_HAIR_COLORS,
      clotheType: CLOTHE_TYPES,
      clotheColor: CLOTHE_COLORS,
      graphicType: GRAPHIC_TYPES,
      eyeType: EYE_TYPES,
      eyebrowType: EYEBROW_TYPES,
      mouthType: MOUTH_TYPES,
      skinColor: SKIN_COLORS,
    }),
    []
  );

  /**
   * Validates an option value against its allowed values.
   * Returns the value if valid, undefined otherwise.
   */
  const validateOptionValue = useCallback(
    (key: OptionKey, value: string | undefined): string | undefined => {
      if (!value || typeof value !== "string") return undefined;
      const validValues = OPTION_VALIDATION_MAP[key];
      return validValues.includes(value) ? value : undefined;
    },
    [OPTION_VALIDATION_MAP]
  );

  /**
   * Initialize option context with props on first render.
   * This ensures all provided prop values are set in the option context
   * before the avatar renders.
   * Validates option values against allowed values.
   */
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    for (const key of ALL_OPTION_KEYS) {
      const value = props[key];
      if (value && typeof value === "string") {
        const validatedValue = validateOptionValue(key, value);
        if (validatedValue) {
          optionContext.setValue(key, validatedValue);
        }
      }
    }
    // Initialize prevPropsRef after setting values
    prevPropsRef.current = { ...props };
  }, [props, optionContext, validateOptionValue]);

  // Animation state management
  // These state values override props when animations are active
  const [mouth, setMouth] = useState<string | null>(null);
  const [eyes, setEyes] = useState<string | null>(null);
  const [eyebrow, setEyebrow] = useState<string | null>(null);

  // Hover state tracking
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseHovered, setIsMouseHovered] = useState(false);

  // Timer references for animation scheduling and cleanup
  const animationIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const hoverIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restoreTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoreSequenceTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  // State preservation for animation transitions
  const savedStateRef = useRef<HoverExpression | null>(null);

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
   * Get parent element's background color.
   * Re-runs when:
   * - backgroundColor prop changes
   * - CSS variables change (via styleChangeCounter from MutationObserver)
   *
   * This enables the clip mask to dynamically respond to theme changes,
   * such as when a theme slider modifies CSS variables on the document root.
   */
  useEffect(() => {
    if (containerRef.current?.parentElement) {
      const parent = containerRef.current.parentElement;
      const computedStyle = window.getComputedStyle(parent);
      let bgColor = computedStyle.backgroundColor;

      // If background is transparent, walk up the DOM tree to find a non-transparent background
      if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
        let current: HTMLElement | null = parent.parentElement;
        while (current) {
          const style = window.getComputedStyle(current);
          const currentBg = style.backgroundColor;
          if (currentBg !== "rgba(0, 0, 0, 0)" && currentBg !== "transparent") {
            bgColor = currentBg;
            break;
          }
          current = current.parentElement;
        }
        // If still transparent, fall back to backgroundColor prop or white
        if (bgColor === "rgba(0, 0, 0, 0)" || bgColor === "transparent") {
          bgColor = backgroundColor || "#ffffff";
        }
      }
      setParentBackgroundColor(bgColor);
    } else {
      // Fallback to backgroundColor prop or white if no parent
      setParentBackgroundColor(backgroundColor || "#ffffff");
    }
  }, [backgroundColor, styleChangeCounter]);

  /**
   * Validate and clamp animation parameters to safe ranges.
   * This prevents performance issues and ensures smooth animations.
   */
  // Idle animation speed: 500-3000ms (0.5s to 3s)
  const animationSpeed = rawAnimationSpeed
    ? Math.max(500, Math.min(3000, rawAnimationSpeed))
    : undefined;
  // Hover animation speed: 100-2000ms
  const hoverAnimationSpeed = Math.max(
    100,
    Math.min(2000, rawHoverAnimationSpeed)
  );
  // Hover scale: 1.05-1.32 (prevents excessive scaling)
  const hoverScale = rawHoverScale
    ? Math.max(1.05, Math.min(1.32, rawHoverScale))
    : undefined;

  /**
   * Update option context when props change.
   * This keeps the option context in sync with component props,
   * enabling child components to react to prop changes.
   * Validates option values against allowed values.
   */
  useEffect(() => {
    const prevProps = prevPropsRef.current;

    for (const key of ALL_OPTION_KEYS) {
      const value = props[key];
      // Update if value is a string and either it's different from previous or it's a new prop
      if (value && typeof value === "string") {
        if (value !== prevProps[key] || prevProps[key] === undefined) {
          const validatedValue = validateOptionValue(key, value);
          if (validatedValue) {
            optionContext.setValue(key, validatedValue);
          }
        }
      }
    }

    prevPropsRef.current = { ...props };
  }, [props, optionContext, validateOptionValue]);

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
      { mouthType: "Disbelief", eyeType: "Surprised", eyebrowType: "UpDown" },
      { mouthType: "ScreamOpen", eyeType: "Dizzy", eyebrowType: "Angry" },
      { mouthType: "Vomit", eyeType: "Close", eyebrowType: "SadConcerned" },
      {
        mouthType: "Grimace",
        eyeType: "EyeRoll",
        eyebrowType: "UnibrowNatural",
      },
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
      setMouth(s.mouthType);
      setEyes(s.eyeType);
      setEyebrow(s.eyebrowType);
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
          mouthType: mouth || "Default",
          eyeType: eyes || "Default",
          eyebrowType: eyebrow || "Default",
        };
        if (animationIntervalRef.current !== null) {
          clearTimeout(animationIntervalRef.current);
          animationIntervalRef.current = null;
        }
      } else {
        // No idle animation: save current state (from props or defaults)
        savedStateRef.current = {
          mouthType: propMouthType || mouth || "Default",
          eyeType: propEyeType || eyes || "Default",
          eyebrowType: propEyebrowType || eyebrow || "Default",
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
        mouthType: mouth || "Default",
        eyeType: eyes || "Default",
        eyebrowType: eyebrow || "Default",
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
            const targetMouth = savedStateRef.current.mouthType;
            const targetEyes = savedStateRef.current.eyeType;
            const targetEyebrow = savedStateRef.current.eyebrowType;

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
            const targetMouth = savedStateRef.current.mouthType;
            const targetEyes = savedStateRef.current.eyeType;
            const targetEyebrow = savedStateRef.current.eyebrowType;

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
      setMouth(savedStateRef.current.mouthType);
      setEyes(savedStateRef.current.eyeType);
      setEyebrow(savedStateRef.current.eyebrowType);
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
   * Circle geometry constants for mask calculations.
   * These define the circle position and size for the avatar.
   * Base dimensions are 264x280 (the SVG viewBox).
   */
  const baseWidth = 264;
  const baseHeight = 280;
  const r = 120; // Circle radius
  const cx = 132; // Circle center X
  const cy = 160; // Circle center Y

  /**
   * Extract width and height from style prop, or use defaults.
   * Calculate scale factors to maintain aspect ratio.
   * Validates that width and height are positive numbers.
   * Automatically clamp width to viewport constraints to prevent overflow.
   */
  let containerWidth = baseWidth;
  let containerHeight = baseHeight;
  let widthScale = 1;
  let heightScale = 1;
  let heightWasProvided = false; // Track if user explicitly provided height

  if (style) {
    if (style.width) {
      let parsedWidth: number | undefined;
      if (typeof style.width === "number") {
        parsedWidth = style.width;
      } else if (typeof style.width === "string") {
        parsedWidth = parseFloat(style.width);
      }
      // Validate: must be a valid number, positive, and not zero
      if (parsedWidth !== undefined && !isNaN(parsedWidth) && parsedWidth > 0) {
        containerWidth = parsedWidth;
      }
    }
    if (style.height) {
      let parsedHeight: number | undefined;
      if (typeof style.height === "number") {
        parsedHeight = style.height;
      } else if (typeof style.height === "string") {
        parsedHeight = parseFloat(style.height);
      }
      // Validate: must be a valid number, positive, and not zero
      if (
        parsedHeight !== undefined &&
        !isNaN(parsedHeight) &&
        parsedHeight > 0
      ) {
        containerHeight = parsedHeight;
        heightWasProvided = true;
      }
    }
  }

  // Automatically clamp width to viewport constraints to prevent overflow
  const originalWidth = containerWidth;
  containerWidth = Math.min(containerWidth, maxViewportConstrainedWidth);

  // Only recalculate height if width was actually clamped
  // This preserves user-provided height values when width isn't constrained
  if (containerWidth < originalWidth) {
    // Width was clamped - scale height proportionally to maintain aspect ratio
    if (heightWasProvided) {
      // User provided both width and height - preserve their custom aspect ratio
      const userAspectRatio = containerHeight / originalWidth;
      containerHeight = containerWidth * userAspectRatio;
    } else {
      // User only provided width - use default aspect ratio
      const defaultAspectRatio = baseHeight / baseWidth;
      containerHeight = containerWidth * defaultAspectRatio;
    }
  }

  // Calculate scale factors
  widthScale = containerWidth / baseWidth;
  heightScale = containerHeight / baseHeight;

  /**
   * Prepare avatar props.
   * When animation container is needed with circle style, use Transparent
   * so the circle background can be rendered separately in the container.
   *
   * All styling is handled internally via inline styles.
   * className prop is not supported to prevent external CSS from affecting the component.
   *
   * Create style prop with clamped dimensions for the inner SVG component.
   * This ensures the SVG receives the actual displayed dimensions (after viewport clamping),
   * not the original prop values which may be larger than the viewport allows.
   */
  const clampedStyle = style
    ? {
        ...style,
        width: containerWidth,
        height: containerHeight,
      }
    : {
        width: containerWidth,
        height: containerHeight,
      };

  const avatarProps = {
    avatarStyle: (needsAnimationContainer && isCircle
      ? AvatarStyle.Transparent
      : avatarStyle) as AvatarStyle,
    style: clampedStyle,
    eyeType: finalEyeType,
    eyebrowType: finalEyebrowType,
    mouthType: finalMouthType,
    ...restProps,
  };

  /**
   * Core avatar element wrapped in option context provider.
   * This provides the option context to all child components.
   */
  const avatarElement = (
    <OptionContextReact.Provider value={optionContext}>
      <AvatarComponent {...avatarProps} />
    </OptionContextReact.Provider>
  );

  /**
   * Render with animation container if any animation features are enabled.
   * The container handles:
   * - Circle background rendering
   * - Hover scale transformations
   * - Overflow masking for circle style
   * - Hover event handlers (if needed)
   * - CSS isolation to prevent external styles from affecting the component
   */
  if (needsAnimationContainer) {
    // Scale circle and mask coordinates based on container size
    // Use min scale to keep circle circular (maintain aspect ratio)
    const scale = Math.min(widthScale, heightScale);
    const scaledR = r * scale;
    const scaledCx = cx * widthScale;
    const scaledCy = cy * heightScale;

      // Clip mask extends 2px beyond the viewBox in all directions (x="-2", width+4, etc.)
      // Add matching padding to container to exactly match clip mask bounds
      // With border-box, we add padding to total size to maintain content area dimensions
      const clipMaskPadding = 2;
      const containerTotalWidth = containerWidth + clipMaskPadding * 2;
      const containerTotalHeight = containerHeight + clipMaskPadding * 2;
      
      return (
        <div
          ref={containerRef}
          style={{
            // CSS isolation: reset all inherited styles
            all: "initial",
            // Restore essential display properties
            position: "relative",
            display: "inline-block",
            cursor: "default",
            width: containerTotalWidth,
            height: containerTotalHeight,
            overflow: "visible",
            // Prevent external CSS from affecting this component
            boxSizing: "border-box",
            margin: "0",
            padding: `${clipMaskPadding}px`,
            border: "none",
          verticalAlign: "baseline",
          font: "initial",
          color: "initial",
          background: "transparent",
          // Explicitly block visual effects that external CSS might try to add
          boxShadow: "none",
          filter: "none",
          backdropFilter: "none",
          textShadow: "none",
          // Prevent external opacity changes
          opacity: "1",
        }}
        onMouseEnter={needsHoverHandlers ? handleMouseEnter : undefined}
        onMouseLeave={needsHoverHandlers ? handleMouseLeave : undefined}
      >
        {isCircle && (
          <div
            style={{
              // CSS isolation: reset inherited styles
              all: "initial",
              // Restore essential properties
              position: "absolute",
              // Position accounting for container padding (clipMaskPadding)
              // Circle position is calculated relative to avatar content area
              left: scaledCx - scaledR + clipMaskPadding,
              top: scaledCy - scaledR + clipMaskPadding,
              width: scaledR * 2,
              height: scaledR * 2,
              borderRadius: "50%",
              backgroundColor,
              zIndex: 0,
              boxSizing: "border-box",
              margin: "0",
              padding: "0",
              border: "none",
              // Explicitly block visual effects
              boxShadow: "none",
              filter: "none",
              backdropFilter: "none",
              textShadow: "none",
              opacity: "1",
            }}
          />
        )}
        <div
          style={{
            // CSS isolation: reset inherited styles
            all: "initial",
            // Restore essential properties
            position: "absolute",
            // Position accounting for container padding (clipMaskPadding)
            top: `${clipMaskPadding}px`,
            left: `${clipMaskPadding}px`,
            width: containerWidth,
            height: containerHeight,
            zIndex: 1,
            transition: "transform 0.3s ease-in-out",
            transform:
              isMouseHovered && hasHoverScale
                ? `scale(${hoverScale ?? 1.2})`
                : "scale(1)",
            transformOrigin: "bottom center",
            boxSizing: "border-box",
            margin: "0",
            padding: "0",
            border: "none",
            // Explicitly block visual effects (transform is controlled internally for hover scale)
            boxShadow: "none",
            filter: "none",
            backdropFilter: "none",
            textShadow: "none",
            opacity: "1",
            // Note: transform is intentionally not blocked here as it's used for hover scale animation
          }}
        >
          {avatarElement}
        </div>
        {isCircle && hasHoverScale && (
          <svg
            width={containerWidth}
            height={containerHeight}
            viewBox={`0 0 ${baseWidth} ${baseHeight}`}
            style={{
              // CSS isolation: reset inherited styles
              all: "initial",
              // Restore essential SVG properties
              position: "absolute",
              // Position to align with avatar wrapper (accounting for container padding)
              // The rect inside extends -2px from viewBox origin, which goes into padding area
              top: `${clipMaskPadding}px`,
              left: `${clipMaskPadding}px`,
              zIndex: 2,
              pointerEvents: "none",
              overflow: "visible",
              display: "block",
              boxSizing: "border-box",
              margin: "0",
              padding: "0",
              border: "none",
              // Explicitly block visual effects
              boxShadow: "none",
              filter: "none",
              backdropFilter: "none",
              textShadow: "none",
              opacity: "1",
            }}
          >
            <defs>
              <mask id={maskId}>
                {/**
                 * SVG Mask for circle overflow clipping.
                 * Mask logic: White = opaque (hides), Black = transparent (shows through)
                 * Start with everything black (transparent) to show through,
                 * then add white (opaque) areas to hide overflow outside the circle.
                 * Coordinates are in viewBox space (0 0 264 280), so they scale automatically.
                 */}
                <rect width="100%" height="100%" fill="black" />
                {/* Left side overflow (bottom half only) - same width as bottom rect, no hover scaling */}
                <rect
                  x="-2"
                  y={cy + (baseHeight - cy) / 2}
                  width={cx - r + 12}
                  height={(baseHeight - cy) / 2}
                  fill="white"
                />
                {/* Right side overflow (bottom half only) - same width as bottom rect, no hover scaling */}
                <rect
                  x={cx + r - 12}
                  y={cy + (baseHeight - cy) / 2}
                  width={baseWidth + 2 - (cx + r - 12)}
                  height={(baseHeight - cy) / 2}
                  fill="white"
                />
                {/* Bottom overflow (below circle bottom only) - grows downward on hover, starts at circle bottom, extends to bottom edge */}
                <rect
                  x="-2"
                  y={cy + r}
                  width={baseWidth + 4}
                  height={
                    Math.max(1, baseHeight - (cy + r)) +
                    2 +
                    (isMouseHovered && hasHoverScale
                      ? ((hoverScale ?? 1.2) - 1) * (baseHeight - (cy + r)) + 1
                      : 0)
                  }
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
             * Rect with mask applied, using the auto-detected parent background color.
             * Covers overflow outside circle (opaque), transparent inside circle.
             * This creates the circular clipping effect that blends with the parent background.
             * Automatically updates when CSS variables change on the document root or parent elements.
             */}
            <rect
              x="-2"
              y="-2"
              width={baseWidth + 4}
              height={baseHeight + 4}
              fill={parentBackgroundColor}
              mask={`url(#${maskId})`}
            />
          </svg>
        )}
      </div>
    );
  }

  /**
   * No animation features enabled: wrap in isolated container to prevent external CSS.
   * The wrapper ensures CSS isolation even when no animation features are used.
   */
  return (
    <div
      style={{
        // CSS isolation: reset all inherited styles
        all: "initial",
        // Restore essential display properties
        display: "inline-block",
        width: containerWidth,
        height: containerHeight,
        // Prevent external CSS from affecting this component
        boxSizing: "border-box",
        margin: "0",
        padding: "0",
        border: "none",
        verticalAlign: "baseline",
        font: "initial",
        color: "initial",
        background: "transparent",
        lineHeight: "normal",
        // Explicitly block visual effects that external CSS might try to add
        boxShadow: "none",
        filter: "none",
        backdropFilter: "none",
        textShadow: "none",
        // Prevent external transforms and opacity changes
        transform: "none",
        opacity: "1",
      }}
    >
      {avatarElement}
    </div>
  );
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
