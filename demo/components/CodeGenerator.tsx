import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type {
  AvatarCustomizationProps,
  AvatarSettings,
} from "../types/avatarTypes";

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

interface CodeGeneratorProps {
  props: AvatarCustomizationProps;
  settings: AvatarSettings;
}

/**
 * CodeGenerator component displays the React code needed to recreate the current avatar configuration.
 * Filters out conditional props (e.g., hatColor when not a hat, graphicType when not GraphicShirt).
 */
type CodeLanguage = "js" | "ts";

export default function CodeGenerator({ props, settings }: CodeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState<CodeLanguage>("ts");

  /**
   * Generates the React code string for the current avatar configuration.
   * Removes conditional props that aren't applicable to the current selection.
   * @param lang - The language to generate: 'js' for JavaScript or 'ts' for TypeScript
   */
  const generateCode = (lang: CodeLanguage = language) => {
    const lines: string[] = [];

    if (lang === "ts") {
      lines.push("import Avatar from 'avataaars';");
      lines.push("");
      lines.push("function MyAvatar(): JSX.Element {");
    } else {
      lines.push("import Avatar from 'avataaars';");
      lines.push("");
      lines.push("function MyAvatar() {");
    }

    lines.push("  return (");
    lines.push("    <Avatar");

    const propsToInclude = { ...props };

    /**
     * Remove expression props when idle animation is enabled,
     * as they would conflict with random animation.
     */
    if (settings.idleAnimationEnabled) {
      delete propsToInclude.eyeType;
      delete propsToInclude.eyebrowType;
      delete propsToInclude.mouthType;
    }

    /**
     * Remove hatColor if the selected topType is not a hat.
     */
    if (
      propsToInclude.topType &&
      !HAT_TYPES.includes(propsToInclude.topType as (typeof HAT_TYPES)[number])
    ) {
      delete propsToInclude.hatColor;
    }

    /**
     * Remove graphicType if the selected clotheType is not GraphicShirt.
     */
    if (propsToInclude.clotheType !== "GraphicShirt") {
      delete propsToInclude.graphicType;
    }

    /**
     * Add all non-conditional props to the code output.
     */
    Object.entries(propsToInclude).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const propName = key.charAt(0).toLowerCase() + key.slice(1);
        if (typeof value === "string") {
          lines.push(`      ${propName}="${value}"`);
        } else {
          lines.push(`      ${propName}={${value}}`);
        }
      }
    });

    /**
     * Add animation and display settings if enabled.
     */
    if (settings.backgroundColor) {
      lines.push(`      backgroundColor="${settings.backgroundColor}"`);
    }

    if (settings.hoverScaleEnabled) {
      lines.push(`      hoverScale={${settings.hoverScale}}`);
    }

    if (settings.hoverAnimationEnabled && settings.hoverSequence.length > 0) {
      lines.push("      hoverSequence={[");
      settings.hoverSequence.forEach((expr, index) => {
        const comma = index < settings.hoverSequence.length - 1 ? "," : "";
        lines.push(
          `        { mouth: "${expr.mouth}", eyes: "${expr.eyes}", eyebrow: "${expr.eyebrow}" }${comma}`
        );
      });
      lines.push("      ]}");
      lines.push(`      hoverAnimationSpeed={${settings.hoverAnimationSpeed}}`);
    }

    if (settings.idleAnimationEnabled) {
      lines.push(`      animationSpeed={${settings.animationSpeed}}`);
    }

    lines.push("    />");
    lines.push("  );");
    lines.push("}");
    lines.push("");
    lines.push("export default MyAvatar;");

    return lines.join("\n");
  };

  const code = generateCode(language);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: "white",
        padding: "clamp(15px, 3vw, 30px)",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        marginTop: "30px",
        boxSizing: "border-box",
        overflow: "hidden",
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
        <h2
          style={{
            margin: 0,
            color: "#333",
            fontSize: "clamp(20px, 3vw, 24px)",
            flex: "1 1 auto",
          }}
        >
          📋 React Code
        </h2>
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flex: "0 0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "#f0f0f0",
              borderRadius: "6px",
              padding: "2px",
              border: "1px solid #ddd",
            }}
          >
            <button
              onClick={() => setLanguage("ts")}
              style={{
                padding: "8px 12px",
                backgroundColor: language === "ts" ? "#3178C6" : "transparent",
                color: language === "ts" ? "white" : "#666",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "monospace",
                transition: "all 0.2s",
                minWidth: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="TypeScript"
            >
              TS
            </button>
            <button
              onClick={() => setLanguage("js")}
              style={{
                padding: "8px 12px",
                backgroundColor: language === "js" ? "#F7DF1E" : "transparent",
                color: language === "js" ? "#000" : "#666",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "monospace",
                transition: "all 0.2s",
                minWidth: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="JavaScript"
            >
              JS
            </button>
          </div>
          <button
            onClick={copyToClipboard}
            style={{
              padding: "10px 20px",
              backgroundColor: copied ? "#4CAF50" : "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {copied ? "✓ Copied!" : "Copy Code"}
          </button>
        </div>
      </div>
      <div
        style={{
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #333",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        <SyntaxHighlighter
          language={language === "ts" ? "tsx" : "jsx"}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "clamp(10px, 2vw, 20px)",
            fontSize: "clamp(11px, 2vw, 13px)",
            lineHeight: "1.6",
            maxHeight: "500px",
            fontFamily:
              "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
            overflowX: "auto",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
