import OptionSelector from "./OptionSelector";
import {
  TopOption,
  AccessoriesOption,
  HairColorOption,
  HatColorOption,
  FacialHairOption,
  FacialHairColor,
  ClotheOption,
  ClotheColorOption,
  GraphicOption,
  EyesOption,
  EyebrowOption,
  MouthOption,
  SkinOption,
} from "@vierweb/avataaars/options";
import type { AvatarCustomizationProps } from "../types/avatarTypes";
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
} from "@vierweb/avataaars";

/**
 * Top types that represent hats (used for conditional hatColor display)
 */
const HAT_TYPES = [
  "Hat",
  "WinterHat1",
  "WinterHat2",
  "WinterHat3",
  "WinterHat4",
] as const;

interface CustomizationPanelProps {
  props: AvatarCustomizationProps;
  onPropChange: <K extends keyof AvatarCustomizationProps>(
    key: K,
    value: AvatarCustomizationProps[K]
  ) => void;
  idleAnimationEnabled: boolean;
}

/**
 * CustomizationPanel component provides controls for all avatar customization options.
 * Conditionally enables/disables options based on other selections (e.g., hatColor only for hats).
 */
export default function CustomizationPanel({
  props,
  onPropChange,
  idleAnimationEnabled,
}: CustomizationPanelProps) {
  /**
   * Expression controls (eyes, eyebrows, mouth) are disabled when idle animation is enabled
   * to allow random expression changes. Hover animation doesn't disable these controls.
   */
  const disableAnimatedParts = idleAnimationEnabled;

  /**
   * Computed flags for conditional option enabling/disabling.
   */
  const isHatSelected =
    props.topType &&
    HAT_TYPES.includes(props.topType as (typeof HAT_TYPES)[number]);
  const isHairSelected =
    props.topType &&
    props.topType !== "NoHair" &&
    !HAT_TYPES.includes(props.topType as (typeof HAT_TYPES)[number]);
  const isGraphicShirtSelected = props.clotheType === "GraphicShirt";
  const isFacialHairSelected =
    props.facialHairType && props.facialHairType !== "Blank";

  return (
    <div
      style={{
        background: "white",
        padding: "clamp(15px, 3vw, 30px)",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          color: "#333",
          fontSize: "clamp(20px, 3vw, 24px)",
        }}
      >
        🎨 Customize Avatar
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
          gap: "clamp(10px, 2vw, 20px)",
        }}
      >
        <OptionSelector
          label={TopOption.label}
          value={props.topType}
          options={TOP_TYPES}
          onChange={(value) => onPropChange("topType", value)}
        />

        <OptionSelector
          label={AccessoriesOption.label}
          value={props.accessoriesType}
          options={ACCESSORIES_TYPES}
          onChange={(value) => onPropChange("accessoriesType", value)}
        />

        <OptionSelector
          label={HairColorOption.label}
          value={props.hairColor}
          options={HAIR_COLORS}
          onChange={(value) => onPropChange("hairColor", value)}
          disabled={!isHairSelected}
        />

        <OptionSelector
          label={HatColorOption.label}
          value={props.hatColor}
          options={HAT_COLORS}
          onChange={(value) => onPropChange("hatColor", value)}
          disabled={!isHatSelected}
        />

        <OptionSelector
          label={FacialHairOption.label}
          value={props.facialHairType}
          options={FACIAL_HAIR_TYPES}
          onChange={(value) => onPropChange("facialHairType", value)}
        />

        <OptionSelector
          label={FacialHairColor.label}
          value={props.facialHairColor}
          options={FACIAL_HAIR_COLORS}
          onChange={(value) => onPropChange("facialHairColor", value)}
          disabled={!isFacialHairSelected}
        />

        <OptionSelector
          label={ClotheOption.label}
          value={props.clotheType}
          options={CLOTHE_TYPES}
          onChange={(value) => onPropChange("clotheType", value)}
        />

        <OptionSelector
          label={ClotheColorOption.label}
          value={props.clotheColor}
          options={CLOTHE_COLORS}
          onChange={(value) => onPropChange("clotheColor", value)}
        />

        <OptionSelector
          label={GraphicOption.label}
          value={props.graphicType}
          options={GRAPHIC_TYPES}
          onChange={(value) => onPropChange("graphicType", value)}
          disabled={!isGraphicShirtSelected}
        />

        <OptionSelector
          label={EyesOption.label}
          value={props.eyeType}
          options={EYE_TYPES}
          onChange={(value) => onPropChange("eyeType", value)}
          disabled={disableAnimatedParts}
          disabledReason={
            disableAnimatedParts
              ? "disabled when idle animation is enabled"
              : undefined
          }
        />

        <OptionSelector
          label={EyebrowOption.label}
          value={props.eyebrowType}
          options={EYEBROW_TYPES}
          onChange={(value) => onPropChange("eyebrowType", value)}
          disabled={disableAnimatedParts}
          disabledReason={
            disableAnimatedParts
              ? "disabled when idle animation is enabled"
              : undefined
          }
        />

        <OptionSelector
          label={MouthOption.label}
          value={props.mouthType}
          options={MOUTH_TYPES}
          onChange={(value) => onPropChange("mouthType", value)}
          disabled={disableAnimatedParts}
          disabledReason={
            disableAnimatedParts
              ? "disabled when idle animation is enabled"
              : undefined
          }
        />

        <OptionSelector
          label={SkinOption.label}
          value={props.skinColor}
          options={SKIN_COLORS}
          onChange={(value) => onPropChange("skinColor", value)}
        />
      </div>
    </div>
  );
}
