import { useState, useRef, useEffect } from "react";
import type {
  AvatarCustomizationProps,
  HoverExpression,
} from "../types/avatarTypes";
import { exportAnimatedSVG, exportGIF } from "../utils/exportUtils";

interface ExportDropdownProps {
  avatarProps: AvatarCustomizationProps;
  expressions: HoverExpression[];
  frameDelay?: number;
  backgroundColor?: string;
}

export default function ExportDropdown({
  avatarProps,
  expressions,
  frameDelay = 500,
  backgroundColor,
}: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Extracts base avatar props excluding expression-related properties.
   * Used for export operations where expressions are provided separately.
   */
  const getBaseProps = () => {
    const props: Record<string, unknown> = {
      avatarStyle: avatarProps.avatarStyle,
      topType: avatarProps.topType,
      accessoriesType: avatarProps.accessoriesType,
      hairColor: avatarProps.hairColor,
      hatColor: avatarProps.hatColor,
      facialHairType: avatarProps.facialHairType,
      facialHairColor: avatarProps.facialHairColor,
      clotheType: avatarProps.clotheType,
      clotheColor: avatarProps.clotheColor,
      graphicType: avatarProps.graphicType,
      skinColor: avatarProps.skinColor,
    };
    if (backgroundColor) {
      props.backgroundColor = backgroundColor;
    }
    return props;
  };

  /**
   * Closes the dropdown when clicking outside of it.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  /**
   * Handles export of animated SVG. Validates that expressions exist before proceeding.
   */
  const handleExportAnimatedSVG = async () => {
    if (!expressions.length) {
      alert(
        "No expressions to export. Please add expressions to the hover sequence."
      );
      setIsOpen(false);
      return;
    }

    setIsExporting(true);
    setIsOpen(false);

    try {
      await exportAnimatedSVG(
        getBaseProps(),
        expressions,
        frameDelay,
        backgroundColor
      );
    } catch {
      alert("Error exporting animated SVG. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Handles export of animated GIF. Validates that expressions exist before proceeding.
   */
  const handleExportGIF = async () => {
    if (!expressions.length) {
      alert(
        "No expressions to export. Please add expressions to the hover sequence."
      );
      setIsOpen(false);
      return;
    }

    setIsExporting(true);
    setIsOpen(false);

    try {
      await exportGIF(getBaseProps(), expressions, frameDelay, backgroundColor);
    } catch {
      alert("Error exporting GIF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        style={{
          padding: "8px 16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: isExporting ? "not-allowed" : "pointer",
          fontSize: "14px",
          fontWeight: 500,
          opacity: isExporting ? 0.6 : 1,
          transition: "opacity 0.2s",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
        title="Export avatar"
      >
        {isExporting ? (
          <>
            <span>⏳</span>
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <span>📥</span>
            <span>Export</span>
            <span style={{ fontSize: "12px" }}>▼</span>
          </>
        )}
      </button>

      {isOpen && !isExporting && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "4px",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
            minWidth: "180px",
            overflow: "hidden",
          }}
        >
          <button
            onClick={handleExportGIF}
            disabled={!expressions.length}
            style={{
              width: "100%",
              padding: "12px 16px",
              backgroundColor: "transparent",
              color: expressions.length ? "#333" : "#999",
              border: "none",
              textAlign: "left",
              cursor: expressions.length ? "pointer" : "not-allowed",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (expressions.length) {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            title={
              expressions.length
                ? "Export hover sequence as animated GIF"
                : "Add expressions to hover sequence first"
            }
          >
            <span>🎞️</span>
            <span>Export to GIF</span>
          </button>
          <button
            onClick={handleExportAnimatedSVG}
            disabled={!expressions.length}
            style={{
              width: "100%",
              padding: "12px 16px",
              backgroundColor: "transparent",
              color: expressions.length ? "#333" : "#999",
              border: "none",
              borderTop: "1px solid #eee",
              textAlign: "left",
              cursor: expressions.length ? "pointer" : "not-allowed",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (expressions.length) {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            title={
              expressions.length
                ? "Export hover sequence as animated SVG"
                : "Add expressions to hover sequence first"
            }
          >
            <span>🎬</span>
            <span>Export to SVG</span>
          </button>
        </div>
      )}
    </div>
  );
}
