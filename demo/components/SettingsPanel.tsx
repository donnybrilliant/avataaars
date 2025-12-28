import { useState } from "react";
import { AvatarStyle } from "@vierweb/avataaars";
import { EYE_TYPES, EYEBROW_TYPES, MOUTH_TYPES } from "../types";
import type {
  AvatarSettings,
  AvatarCustomizationProps,
  HoverExpression,
} from "../types/avatarTypes";

interface SettingsPanelProps {
  avatarStyle: AvatarCustomizationProps["avatarStyle"];
  settings: AvatarSettings;
  onAvatarStyleChange: (value: AvatarCustomizationProps["avatarStyle"]) => void;
  onSettingChange: <K extends keyof AvatarSettings>(
    key: K,
    value: AvatarSettings[K],
    isSliderChange?: boolean
  ) => void;
}

/**
 * SettingsPanel component provides controls for avatar animation and display settings.
 * Includes configuration for idle animation, hover effects, and expression sequences.
 */
export default function SettingsPanel({
  avatarStyle,
  settings,
  onAvatarStyleChange,
  onSettingChange,
}: SettingsPanelProps) {
  const [isHoverSequenceExpanded, setIsHoverSequenceExpanded] = useState(false);

  /**
   * Generic slider update handler that clamps values within specified bounds.
   * @param value - String value from the slider input
   * @param min - Minimum allowed value
   * @param max - Maximum allowed value
   * @param settingKey - Key of the setting to update
   * @param parseFn - Function to parse the string value (parseInt or parseFloat)
   */
  const handleSliderChange = <K extends keyof AvatarSettings>(
    value: string,
    min: number,
    max: number,
    settingKey: K,
    parseFn: (val: string) => number = parseInt
  ) => {
    const numValue = parseFn(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onSettingChange(settingKey, clampedValue as AvatarSettings[K], true);
    }
  };

  const updateHoverScale = (value: string) => {
    handleSliderChange(value, 1.05, 1.32, "hoverScale", parseFloat);
  };

  const updateAnimationSpeed = (value: string) => {
    handleSliderChange(value, 500, 3000, "animationSpeed", parseInt);
  };

  const updateHoverAnimationSpeed = (value: string) => {
    handleSliderChange(value, 100, 2000, "hoverAnimationSpeed", parseInt);
  };


  /**
   * Updates a specific field of an expression in the hover sequence.
   */
  const updateHoverSequence = (
    index: number,
    field: keyof HoverExpression,
    value: string
  ) => {
    const newSequence = [...settings.hoverSequence];
    newSequence[index] = { ...newSequence[index], [field]: value };
    onSettingChange("hoverSequence", newSequence);
  };

  /**
   * Adds a new default expression to the hover sequence.
   */
  const addHoverExpression = () => {
    const newSequence = [
      ...settings.hoverSequence,
      { mouthType: "Default", eyeType: "Default", eyebrowType: "Default" },
    ];
    onSettingChange("hoverSequence", newSequence);
  };

  /**
   * Removes an expression from the hover sequence at the specified index.
   */
  const removeHoverExpression = (index: number) => {
    const newSequence = settings.hoverSequence.filter((_, i) => i !== index);
    onSettingChange("hoverSequence", newSequence);
  };

  return (
    <div
      style={{
        background: "white",
        padding: "clamp(15px, 3vw, 30px)",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        marginBottom: "30px",
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
        ⚙️ Settings
      </h2>

      {/* Avatar Style and Background Color - same grid as animation features */}
      <div
        className="animation-sliders-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(160px, 1fr))",
          gap: "clamp(15px, 2vw, 25px)",
          marginBottom: "30px",
        }}
      >
        <div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              fontWeight: 500,
              color: "#555",
            }}
          >
            <span>🎨</span>
            <span>Avatar Style</span>
          </label>
          <select
            value={avatarStyle}
            onChange={(e) => onAvatarStyleChange(e.target.value)}
            style={{
              width: "100%",
              minWidth: 0,
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          >
            <option value={AvatarStyle.Circle}>Circle</option>
            <option value={AvatarStyle.Transparent}>Transparent</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              fontWeight: 500,
              color: "#555",
            }}
          >
            <span>🎨</span>
            <span>Background Color</span>
          </label>
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(e) => onSettingChange("backgroundColor", e.target.value)}
            style={{
              width: "100%",
              minWidth: 0,
              height: "40px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              cursor: "pointer",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      {/* Animation Features - 3 per row on tablet, stack on mobile */}
      <style>{`
        @media (max-width: 620px) {
          .animation-sliders-grid {
            grid-template-columns: 1fr !important;
          }
          .animation-sliders-grid input[type="range"] {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
      <div
        className="animation-sliders-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(160px, 1fr))",
          gap: "clamp(15px, 2vw, 25px)",
          marginBottom: "30px",
        }}
      >
        {/* Idle Animation */}
        <div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              fontWeight: 500,
              color: "#555",
              gap: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={settings.idleAnimationEnabled}
              onChange={(e) =>
                onSettingChange("idleAnimationEnabled", e.target.checked)
              }
              style={{ width: "18px", height: "18px" }}
            />
            <span>🎭</span>
            <span>Idle Animation</span>
          </label>
          {settings.idleAnimationEnabled && (
            <>
              <label
                style={{
                  display: "block",
                  marginTop: "12px",
                  marginBottom: "8px",
                  fontSize: "13px",
                  color: "#666",
                }}
              >
                ⚡ Speed: {settings.animationSpeed}ms
              </label>
              <input
                type="range"
                min="500"
                max="3000"
                step="50"
                value={settings.animationSpeed}
                onChange={(e) => updateAnimationSpeed(e.target.value)}
                style={{
                  width: "100%",
                  minWidth: 0,
                  boxSizing: "border-box",
                }}
              />
            </>
          )}
        </div>

        {/* Hover Scale */}
        <div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              fontWeight: 500,
              color: "#555",
              gap: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={settings.hoverScaleEnabled}
              onChange={(e) =>
                onSettingChange("hoverScaleEnabled", e.target.checked)
              }
              style={{ width: "18px", height: "18px" }}
            />
            <span>🔍</span>
            <span>Hover Scale</span>
          </label>
          {settings.hoverScaleEnabled && (
            <>
              <label
                style={{
                  display: "block",
                  marginTop: "12px",
                  marginBottom: "8px",
                  fontSize: "13px",
                  color: "#666",
                }}
              >
                📏 Scale: {settings.hoverScale.toFixed(2)}
              </label>
              <input
                type="range"
                min="1.05"
                max="1.32"
                step="0.01"
                value={settings.hoverScale}
                onChange={(e) => updateHoverScale(e.target.value)}
                style={{
                  width: "100%",
                  minWidth: 0,
                  boxSizing: "border-box",
                }}
              />
            </>
          )}
        </div>

        {/* Hover Animation */}
        <div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              fontWeight: 500,
              color: "#555",
              gap: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={settings.hoverAnimationEnabled}
              onChange={(e) =>
                onSettingChange("hoverAnimationEnabled", e.target.checked)
              }
              style={{ width: "18px", height: "18px" }}
            />
            <span>✨</span>
            <span>Hover Animation</span>
          </label>
          {settings.hoverAnimationEnabled && (
            <>
              <label
                style={{
                  display: "block",
                  marginTop: "12px",
                  marginBottom: "8px",
                  fontSize: "13px",
                  color: "#666",
                }}
              >
                ⚡ Speed: {settings.hoverAnimationSpeed}ms
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="25"
                value={settings.hoverAnimationSpeed}
                onChange={(e) => updateHoverAnimationSpeed(e.target.value)}
                style={{
                  width: "100%",
                  minWidth: 0,
                  boxSizing: "border-box",
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Hover Sequence Editor - Toggleable */}
      {settings.hoverAnimationEnabled && (
        <div
          style={{
            marginTop: "30px",
            paddingTop: "30px",
            borderTop: "1px solid #eee",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={() =>
                setIsHoverSequenceExpanded(!isHoverSequenceExpanded)
              }
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                fontSize: "clamp(14px, 2vw, 16px)",
                fontWeight: 500,
                color: "#333",
              }}
            >
              <span>🎬</span>
              <span>Hover Sequence</span>
              <span style={{ marginLeft: "8px", fontSize: "12px" }}>
                {isHoverSequenceExpanded ? "▼" : "▶"}
              </span>
            </button>
            {isHoverSequenceExpanded && (
              <button
                onClick={addHoverExpression}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                }}
              >
                + Add Expression
              </button>
            )}
          </div>
          {isHoverSequenceExpanded && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {settings.hoverSequence.map((expr, index) => (
                <div
                  key={index}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: "clamp(4px, 1.5vw, 10px)",
                    columnGap: "clamp(4px, 1.5vw, 10px)",
                    rowGap: "10px",
                    alignItems: "center",
                    padding: "12px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "6px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      👄 Mouth
                    </label>
                    <select
                      value={expr.mouthType}
                      onChange={(e) =>
                        updateHoverSequence(index, "mouthType", e.target.value)
                      }
                      style={{
                        width: "100%",
                        minWidth: 0,
                        padding: "6px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "13px",
                        boxSizing: "border-box",
                      }}
                    >
                      {MOUTH_TYPES.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      👁️ Eyes
                    </label>
                    <select
                      value={expr.eyeType}
                      onChange={(e) =>
                        updateHoverSequence(index, "eyeType", e.target.value)
                      }
                      style={{
                        width: "100%",
                        minWidth: 0,
                        padding: "6px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "13px",
                        boxSizing: "border-box",
                      }}
                    >
                      {EYE_TYPES.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "4px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      🤨 Eyebrow
                    </label>
                    <select
                      value={expr.eyebrowType}
                      onChange={(e) =>
                        updateHoverSequence(index, "eyebrowType", e.target.value)
                      }
                      style={{
                        width: "100%",
                        minWidth: 0,
                        padding: "6px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "13px",
                        boxSizing: "border-box",
                      }}
                    >
                      {EYEBROW_TYPES.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => removeHoverExpression(index)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffcdd2";
                      e.currentTarget.style.borderColor = "#ffcdd2";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.borderColor = "transparent";
                    }}
                    style={{
                      padding: "8px",
                      backgroundColor: "transparent",
                      color: "#666",
                      border: "2px solid transparent",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                      alignSelf: "flex-end",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "36px",
                      height: "36px",
                      transition: "all 0.2s ease",
                    }}
                    title="Remove expression"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
