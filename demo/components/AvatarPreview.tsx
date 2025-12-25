import Avatar from "../../dist/index";
import type {
  AvatarCustomizationProps,
  AvatarSettings,
} from "../types/avatarTypes";
import type { Props as AvatarProps } from "../../dist/index";

interface AvatarPreviewProps {
  props: AvatarCustomizationProps;
  settings: AvatarSettings;
}

/**
 * AvatarPreview component displays the avatar with all applied settings and animations.
 * It handles the complex logic of combining customization props with animation settings.
 */
export default function AvatarPreview({ props, settings }: AvatarPreviewProps) {
  const avatarProps: AvatarProps = {
    ...props,
  };

  /**
   * Apply background color. When no other animation features are enabled,
   * we set hoverScale to 1 to enable the wrapper structure needed for background rendering.
   */
  if (settings.backgroundColor) {
    avatarProps.backgroundColor = settings.backgroundColor;
    if (
      !settings.hoverScaleEnabled &&
      !settings.hoverAnimationEnabled &&
      !settings.idleAnimationEnabled
    ) {
      avatarProps.hoverScale = 1;
    }
  }

  if (settings.hoverScaleEnabled) {
    avatarProps.hoverScale = settings.hoverScale;
  }

  /**
   * Configure hover animation sequence. When hover-only mode is active (no idle animation),
   * we preserve the original expression values for restoration after hover ends.
   */
  if (settings.hoverAnimationEnabled) {
    if (settings.hoverSequence.length > 0) {
      avatarProps.hoverSequence = settings.hoverSequence;
      avatarProps.hoverAnimationSpeed = settings.hoverAnimationSpeed;
    }

    if (!settings.idleAnimationEnabled) {
      // Pass original values as props so Avatar can restore them after hover ends
      avatarProps.originalEyeType = props.eyeType;
      avatarProps.originalEyebrowType = props.eyebrowType;
      avatarProps.originalMouthType = props.mouthType;
    }

    /**
     * Clear expression props when idle animation is enabled to allow random animations.
     * In hover-only mode, keep them so the avatar displays the original expressions until hover.
     */
    if (settings.idleAnimationEnabled) {
      delete avatarProps.eyeType;
      delete avatarProps.eyebrowType;
      delete avatarProps.mouthType;
    }

    /**
     * Disable idle animation by setting a very high animationSpeed when only hover animation is active.
     * This prevents random expression changes while still allowing hover sequences to work.
     */
    if (!settings.idleAnimationEnabled) {
      avatarProps.animationSpeed = 100000;
    }
  }

  /**
   * Configure idle animation. Expression props are cleared to allow random expression changes.
   */
  if (settings.idleAnimationEnabled) {
    avatarProps.animationSpeed = settings.animationSpeed;
    delete avatarProps.eyeType;
    delete avatarProps.eyebrowType;
    delete avatarProps.mouthType;
  }

  return (
    <div
      style={{
        background: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
        marginBottom: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 style={{ marginBottom: "20px", color: "#333" }}>Preview</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "280px",
        }}
      >
        <Avatar {...avatarProps} />
      </div>
    </div>
  );
}
