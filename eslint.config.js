import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "docs/**", "demo/**"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // Use recommended-latest for React Compiler rules (includes compiler-specific linting)
      ...reactHooks.configs.recommended.rules,
      ...reactHooks.configs["recommended-latest"].rules,
      "react-refresh/only-export-components": "off", // Library code - fast refresh warnings not applicable
      // Additional strict rules for production code
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      // Allow any for optionValue pattern (used throughout avatar components)
      // This is necessary for the component optionValue pattern
      "@typescript-eslint/no-explicit-any": [
        "warn",
        {
          ignoreRestArgs: false,
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  }
);
