interface OptionSelectorProps {
  label: string;
  value: string | undefined;
  options: readonly string[];
  onChange: (value: string) => void;
  disabled?: boolean;
  disabledReason?: string; // Optional reason message for why it's disabled
}

// Helper function to format option names for display
function formatOptionName(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export default function OptionSelector({
  label,
  value,
  options,
  onChange,
  disabled = false,
  disabledReason,
}: OptionSelectorProps) {
  // For React controlled select, use the value directly
  // React will show blank if value doesn't match any option, but that's acceptable
  // Convert undefined/null to empty string for React
  const selectValue = value ?? "";

  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: 500,
          color: disabled ? "#999" : "#555",
        }}
      >
        {label}
        {disabled && disabledReason && (
          <span style={{ fontSize: "12px", marginLeft: "8px", color: "#999" }}>
            ({disabledReason})
          </span>
        )}
      </label>
      <select
        value={selectValue}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: "100%",
          minWidth: 0,
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          fontSize: "14px",
          backgroundColor: disabled ? "#f5f5f5" : "white",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          boxSizing: "border-box",
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {formatOptionName(option)}
          </option>
        ))}
      </select>
    </div>
  );
}
