import { useState, useEffect, useRef } from "react";
import { AvatarStyle } from "@vierweb/avataaars";
import type {
  AvatarCustomizationProps,
  AvatarSettings,
} from "./types/avatarTypes";
import { debounce } from "./utils/debounce";
import AvatarPreview from "./components/AvatarPreview";
import SettingsPanel from "./components/SettingsPanel";
import CustomizationPanel from "./components/CustomizationPanel";
import CodeGenerator from "./components/CodeGenerator";
import ExportDropdown from "./components/ExportDropdown";

const STORAGE_KEYS = {
  props: "avataaarsProps",
  settings: "avataaarsSettings",
} as const;

const defaultProps: AvatarCustomizationProps = {
  avatarStyle: AvatarStyle.Circle,
  topType: "LongHairMiaWallace",
  accessoriesType: "Prescription01",
  hairColor: "BrownDark",
  facialHairType: "MoustacheMagnum",
  facialHairColor: "BrownDark",
  clotheType: "ShirtCrewNeck",
  clotheColor: "PastelRed",
  eyeType: "Default",
  eyebrowType: "Default",
  mouthType: "Default",
  skinColor: "Pale",
};

const defaultSettings: AvatarSettings = {
  animationSpeed: 2000,
  hoverScale: 1.2,
  hoverAnimationSpeed: 300,
  backgroundColor: "#65C9FF",
  idleAnimationEnabled: true,
  hoverAnimationEnabled: true,
  hoverScaleEnabled: true,
  hoverSequence: [
    { mouthType: "Disbelief", eyeType: "Surprised", eyebrowType: "UpDown" },
    { mouthType: "ScreamOpen", eyeType: "Dizzy", eyebrowType: "Angry" },
    { mouthType: "Vomit", eyeType: "Close", eyebrowType: "SadConcerned" },
    { mouthType: "Grimace", eyeType: "EyeRoll", eyebrowType: "UnibrowNatural" },
  ],
  width: 300,
};

/**
 * Loads a value from localStorage, returning the default if not found or on error.
 * Errors are silently handled to prevent breaking the application.
 */
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch {
    // Silently fall back to default value on parse errors
  }
  return defaultValue;
}

/**
 * Saves a value to localStorage. Errors are silently handled to prevent breaking
 * the application if storage is unavailable (e.g., private browsing mode).
 */
function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently ignore storage errors (e.g., quota exceeded, private browsing)
  }
}

function App() {
  const [props, setProps] = useState<AvatarCustomizationProps>(() =>
    loadFromStorage(STORAGE_KEYS.props, defaultProps)
  );

  const [settings, setSettings] = useState<AvatarSettings>(() =>
    loadFromStorage(STORAGE_KEYS.settings, defaultSettings)
  );

  const [maxWidth, setMaxWidth] = useState(600);

  // Calculate responsive max width based on viewport
  useEffect(() => {
    const calculateMaxWidth = () => {
      const viewportWidth = window.innerWidth;
      const padding = 200; // Account for container padding and controls
      const calculatedMax = Math.min(
        600,
        Math.max(100, viewportWidth - padding)
      );
      setMaxWidth(calculatedMax);
    };

    calculateMaxWidth();
    window.addEventListener("resize", calculateMaxWidth);
    return () => window.removeEventListener("resize", calculateMaxWidth);
  }, []);

  // Note: We don't clamp the stored width value - it can be up to 800px for exports.
  // The preview width is calculated as Math.min(settings.width, maxWidth) to show
  // the actual displayed size, while preserving the export width.

  /**
   * Debounced save function for settings that are controlled by sliders.
   * This prevents excessive localStorage writes during slider drag operations.
   */
  const debouncedSaveSettingsRef = useRef(
    debounce((value: AvatarSettings) => {
      saveToStorage(STORAGE_KEYS.settings, value);
    }, 300)
  );

  /**
   * Tracks whether the last settings change originated from a slider control.
   * Used to determine whether to debounce or immediately save to localStorage.
   */
  const lastSettingsChangeWasSliderRef = useRef(false);

  /**
   * Persist avatar customization props to localStorage immediately on change.
   * These changes come from dropdowns where the user has already committed their selection.
   */
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.props, props);
  }, [props]);

  /**
   * Persist settings to localStorage with debouncing for slider changes.
   * Slider changes are debounced to reduce write frequency, while other changes
   * (checkboxes, dropdowns) are saved immediately.
   */
  useEffect(() => {
    if (lastSettingsChangeWasSliderRef.current) {
      debouncedSaveSettingsRef.current(settings);
      lastSettingsChangeWasSliderRef.current = false;
    } else {
      saveToStorage(STORAGE_KEYS.settings, settings);
    }
  }, [settings]);

  const updateProp = <K extends keyof AvatarCustomizationProps>(
    key: K,
    value: AvatarCustomizationProps[K]
  ) => {
    setProps((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Updates a setting value and marks it for debounced saving if it's a slider change.
   */
  const updateSetting = <K extends keyof AvatarSettings>(
    key: K,
    value: AvatarSettings[K],
    isSliderChange = false
  ) => {
    if (
      isSliderChange &&
      (key === "animationSpeed" ||
        key === "hoverScale" ||
        key === "hoverAnimationSpeed")
    ) {
      lastSettingsChangeWasSliderRef.current = true;
    } else {
      lastSettingsChangeWasSliderRef.current = false;
    }
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      style={{
        padding: "clamp(10px, 2vw, 20px)",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "system-ui, -apple-system, sans-serif",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          gap: "15px",
          marginBottom: "10px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ alignSelf: "flex-end", marginLeft: "auto" }}>
          <ExportDropdown
            avatarProps={props}
            expressions={settings.hoverSequence}
            frameDelay={settings.hoverAnimationSpeed}
            backgroundColor={settings.backgroundColor}
            idleAnimationEnabled={settings.idleAnimationEnabled}
            width={settings.width}
          />
        </div>
        <h1
          style={{
            margin: 0,
            color: "#1a1a1a",
            fontSize: "clamp(20px, 4vw + 12px, 32px)",
            flex: "1 1 auto",
            minWidth: "200px",
          }}
        >
          🎨 Avataaars Demo
        </h1>
      </div>
      <p
        style={{
          color: "#666",
          marginBottom: "15px",
          fontSize: "clamp(12px, 2vw + 8px, 16px)",
        }}
      >
        Customize your avatar with all available options
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "10px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <label
          style={{
            fontSize: "clamp(12px, 2vw + 6px, 14px)",
            fontWeight: 500,
            color: "#555",
            whiteSpace: "nowrap",
          }}
        >
          📏 Width:
        </label>
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flex: "1 1 auto",
            minWidth: "200px",
          }}
        >
          {(() => {
            // Calculate preview width (clamped to maxWidth for display)
            // This is what the avatar actually displays, while settings.width can be up to 800px for exports
            const previewWidth = Math.min(Math.max(100, settings.width), Math.max(100, maxWidth));
            // Input always shows the stored width value (can be up to 800px for exports)
            // The preview will be clamped automatically by the Avatar component
            const inputValue = Math.max(100, Math.min(800, settings.width || 300));
            const isClamped = settings.width > maxWidth;
            
            return (
              <>
                <input
                  type="range"
                  min="100"
                  max={Math.max(100, maxWidth)}
                  step="10"
                  value={previewWidth}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (!isNaN(value) && value >= 100) {
                      // Slider sets the preview width (clamped to maxWidth)
                      const clampedValue = Math.max(100, Math.min(maxWidth, value));
                      updateSetting("width", clampedValue, true);
                    }
                  }}
                  style={{
                    flex: "1 1 auto",
                    minWidth: "100px",
                    maxWidth: "300px",
                    boxSizing: "border-box",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                >
                  <input
                    type="number"
                    min="100"
                    max="800"
                    step="10"
                    value={inputValue}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (!isNaN(value) && value >= 100 && value <= 800) {
                        // Input allows up to 800px for exports
                        // If value > maxWidth, we store it for export but preview will show maxWidth
                        updateSetting("width", value, false);
                      }
                    }}
                    onBlur={(e) => {
                      // Ensure value is valid on blur
                      const value = parseInt(e.target.value, 10);
                      if (isNaN(value) || value < 100) {
                        updateSetting("width", 100, false);
                      } else if (value > 800) {
                        updateSetting("width", 800, false);
                      }
                    }}
                    style={{
                      width: "clamp(80px, 10vw, 100px)",
                      padding: "6px 24px 6px 8px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "clamp(12px, 2vw + 4px, 14px)",
                      boxSizing: "border-box",
                      color: isClamped ? "#999" : "inherit",
                    }}
                    title={
                      isClamped
                        ? `Preview: ${previewWidth}px (responsive). Export: ${settings.width}px. Type a value to change.`
                        : `Preview width (responsive, max ${maxWidth}px). Export width up to 800px for high-res exports.`
                    }
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "clamp(11px, 2vw + 3px, 14px)",
                      color: "#666",
                      pointerEvents: "none",
                    }}
                  >
                    px
                  </span>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      <AvatarPreview props={props} settings={settings} />

      <SettingsPanel
        avatarStyle={props.avatarStyle}
        settings={settings}
        onAvatarStyleChange={(value) => updateProp("avatarStyle", value)}
        onSettingChange={(key, value, isSliderChange) =>
          updateSetting(key, value, isSliderChange)
        }
      />

      <CustomizationPanel
        props={props}
        onPropChange={updateProp}
        idleAnimationEnabled={settings.idleAnimationEnabled}
      />

      <CodeGenerator props={props} settings={settings} />

      {/* Footer with links */}
      <footer
        style={{
          marginTop: "60px",
          paddingTop: "30px",
          borderTop: "1px solid #e0e0e0",
          textAlign: "center",
          color: "#666",
          fontSize: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "clamp(15px, 3vw, 30px)",
            marginBottom: "15px",
          }}
        >
          <a
            href="https://github.com/donnybrilliant/avataaars"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#4CAF50",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            <span>📖</span>
            <span>Main README</span>
          </a>
          <a
            href="https://github.com/donnybrilliant/avataaars/tree/main/demo"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#4CAF50",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            <span>🎨</span>
            <span>Demo README</span>
          </a>
          <a
            href="https://avataaars.vierweb.no/docs/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#4CAF50",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            <span>📚</span>
            <span>API Documentation</span>
          </a>
          <a
            href="https://www.npmjs.com/package/@vierweb/avataaars"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#4CAF50",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            <span>📦</span>
            <span>NPM Package</span>
          </a>
        </div>
        <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>
          Made with ❤️ by{" "}
          <a
            href="https://vierweb.no"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#4CAF50", textDecoration: "none" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            Vierweb
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
