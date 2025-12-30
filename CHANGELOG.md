# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [3.1.0] - 2025-12-29

### Added

- **React 19 Compatibility**: Full support for React 18 and React 19
- **Animation Features**: Optional animation props for interactive avatars
  - `animationSpeed`: Control random expression animation speed
  - `hoverScale`: Avatar scales up on hover
  - `hoverSequence`: Custom expression sequences on hover
  - `backgroundColor`: Customizable circle background color
  - `pageBackgroundColor`: Mask overflow color customization
- **`maskBackgroundColor` Prop**: New optional prop for instant clip mask color synchronization
  - Bypasses auto-detection entirely when provided, eliminating the ~16ms MutationObserver polling delay
  - Ideal for dynamic themes where the parent background changes frequently (e.g., theme sliders)
  - Fully backward-compatible: existing auto-detection behavior unchanged when prop is not provided
  - Example: `<Avatar maskBackgroundColor={themeColor} ... />`
- **Dynamic CSS Variable Detection**: Clip mask now automatically responds to CSS variable changes
  - Uses MutationObserver to watch for style changes on document root and parent elements
  - Automatically re-detects parent background color when CSS variables change (e.g., via a theme slider)
  - No configuration needed - works seamlessly with dynamic theming systems
  - Debounced updates with requestAnimationFrame for optimal performance
- **Automatic Viewport-Aware Responsive Sizing**: Avatar component now automatically scales down to fit the viewport on smaller screens
  - Fully automatic - no configuration or props needed
  - Prevents overflow on mobile and smaller viewports
  - Automatically calculates maximum width based on viewport size (160px padding, 600px max, 100px min)
  - Maintains aspect ratio when scaling down
  - Responds to window resize events in real-time
  - Works seamlessly with existing `maxWidth: 100%` CSS for additional responsive behavior
  - Core SVG component (`src/avatar/index.tsx`) now includes `maxWidth: 100%` and `height: auto` for responsive scaling
- **Complete CSS Isolation**: Avatar component is now fully isolated from external CSS
  - All wrapper containers use `all: initial` to reset inherited styles
  - Explicit protection against external shadows (`boxShadow: none`)
  - Explicit protection against external filters (`filter: none`, `backdropFilter: none`)
  - Explicit protection against external opacity and transform changes
  - SVG elements and internal divs are protected from external CSS interference
  - Component maintains consistent appearance regardless of parent page styles
- **Palestinian Flag Graphic**: Added Palestinian flag option for GraphicShirt
  - Available as `graphicType="Palestine"` when `clotheType="GraphicShirt"`
  - Automatically included in `GRAPHIC_TYPES` and `GraphicType` types
  - Features traditional Palestinian flag design with red triangle and black, white, and green stripes
- **Input Validation**: Added runtime validation for avatar props
  - `style.width` and `style.height` now validate for positive, non-zero values
  - Option props (`topType`, `eyeType`, `mouthType`, etc.) now validate against available option values
  - Invalid values are silently ignored and fall back to defaults
- **Automatic Background Color Detection**: Mask now automatically detects and uses parent container's background color
  - No manual configuration needed - seamlessly blends with any background
  - Falls back to `backgroundColor` prop or white if parent background is transparent
- **Options Module Export**: Added `./options` export path to package.json
  - Users can now import options from `@vierweb/avataaars/options`
  - Enables importing individual option objects (TopOption, EyesOption, etc.) and option constants
  - Example: `import { TopOption, EyesOption } from '@vierweb/avataaars/options'`
- **Modern React Patterns**: All components now use modern React hooks and context APIs
- **GitHub Actions CI/CD**: Automated npm publishing on releases
- **GitHub Pages Deployment**: Automatic deployment of demo and documentation
  - Demo available at [avataaars.vierweb.no](https://avataaars.vierweb.no)
  - API documentation at [avataaars.vierweb.no/docs/](https://avataaars.vierweb.no/docs/)
- **Documentation Generation**: TypeDoc integration for API documentation with syntax highlighting for JSX/TSX
- **Development Scripts**: Added `npm start` command to build package, generate docs, and start demo server
- **Export Features** (in demo):
  - Export avatars as animated GIF
  - Export avatars as animated SVG
  - Interactive export dropdown with preview

### Changed

- **Breaking**: Requires React 18 or 19 (minimum React version increased from 17)
- **Package Name**: Changed from `avataaars` to `@vierweb/avataaars` (scoped package)
- **Default Export Name**: Changed from `AvatarComponent` to `Avatar` to match original fork
  - Maintains API compatibility with original `avataaars` package
  - All references updated throughout codebase
- **TypeScript Import Syntax**: Updated to modern TypeScript import pattern
  - Uses inline `type` keyword: `import Avatar, { type Props, type HoverExpression } from "@vierweb/avataaars"`
  - Code generator now includes proper type imports in TypeScript examples
  - README updated with modern TypeScript examples
- **Code Generator**: Enhanced TypeScript code generation
  - Automatically includes `type Props` import when needed
  - Includes `type HoverExpression` import when hover sequences are used
  - Generates typed `hoverSequence` variable for better type safety
  - JavaScript examples remain clean without type annotations
- **Breaking: HoverExpression Property Names**: Updated `HoverExpression` interface to use consistent naming with `Props` (Avatar component props)
  - Changed `mouth` → `mouthType`
  - Changed `eyes` → `eyeType`
  - Changed `eyebrow` → `eyebrowType`
  - Now matches the property names used in `Props` for consistency
  - All examples and documentation updated
- **Responsive Behavior**: Avatar component now automatically handles viewport constraints with no configuration needed
  - Viewport-aware sizing is always enabled (no props to configure)
  - Uses fixed defaults: 160px padding, 600px maximum width, 100px minimum width
- **Mask Improvements**: Enhanced circle mask for better overflow handling
  - Mask now properly scales with avatar size
  - Improved gap handling at different sizes
  - Mask dynamically adjusts on hover when `hoverScale` is enabled
- **Width/Height Scaling**: Avatar now properly scales circle background and mask based on `style.width` and `style.height` props
  - Maintains aspect ratio automatically
  - Circle and mask scale proportionally with avatar size
- Modernized all components to use `React.createContext()` instead of legacy context APIs
- Replaced `childContextTypes` with modern context providers
- Removed dependency on `prop-types` (no longer needed with modern React)
- Updated `Selector` component from class component to function component
- Converted `Avatar` component to use `React.useId()` instead of `lodash.uniqueId`
- Updated TypeScript configuration to use `react-jsx` JSX transform
- Demo now supports GitHub Pages deployment with proper base path configuration for custom domain
- Improved demo with localStorage persistence for avatar customization
- Enhanced demo UI with export functionality and code generation
- Updated README with React 19 functional component examples and modern syntax
- Improved TypeDoc configuration with proper syntax highlighting for all code languages
- Demo now uses the published npm package instead of local dist folder
  - Demo package.json updated to use `@vierweb/avataaars` as a dependency
  - All imports updated from local paths to npm package imports
  - Added installation instructions code block in CodeGenerator component

### Removed

- **Breaking**: Removed `className` prop entirely
  - Component no longer accepts `className` prop to enforce CSS isolation
  - Prevents external CSS classes from affecting the component
  - Use `style` prop for any custom styling needs
  - TypeScript will error if `className` is passed (intentional)

### Fixed

- **Clip Mask Alignment**: Container padding now exactly matches clip mask extension bounds
  - Added 2px padding to animation container to accommodate clip mask's 2px extension beyond viewBox
  - Container dimensions now precisely match clip mask bounds, eliminating unnecessary space
  - All elements (avatar, circle background, clip mask SVG) are properly aligned with padding offset
  - Prevents clip mask from being clipped while maintaining pixel-perfect alignment
- Fixed linting errors for unused `className` parameter
- Improved CSS isolation for Piece component
- Enhanced protection for animation container elements
- Fixed mask gaps that appeared at certain sizes
- Fixed mask not following circle edge properly
- Fixed validation warnings for React hooks dependencies
- Fixed missing dropdown options for Hair Color, Facial Hair Color, Skin Color, and Clothe Color in demo applications
- Exported individual color components from color modules to enable proper option value extraction
- Updated `extractOptionValuesFromModule` function to properly filter module exports
- React 19 compatibility issues with legacy context APIs
- All deprecation warnings related to `UNSAFE_componentWillMount` and similar lifecycle methods
- TypeDoc warnings for missing syntax highlighting languages
- Image path issues in generated documentation

### Technical Details

- All wrapper divs and SVG elements now use `all: initial` for CSS reset
- Explicit style properties set after reset to ensure correct display
- Internal transforms (for hover scale) are preserved while blocking external transforms
- Mask SVG in animation container is now fully isolated
- All Selector components now use `OptionContextReact` (created with `React.createContext()`)
- Context provider pattern updated throughout the codebase
- Removed all usage of deprecated React lifecycle methods
- Improved TypeScript types for better developer experience

---

## Migration Guide

### Upgrading from the original `avataaars` package

1. **Update React**: Ensure you're using React 18 or 19

   ```bash
   npm install react@^18.0.0 react-dom@^18.0.0
   # or
   npm install react@^19.0.0 react-dom@^19.0.0
   ```

2. **Install the New Package**:

   ```bash
   npm install @vierweb/avataaars@^3.1.0
   ```

3. **Update Imports**: The package name has changed from `avataaars` to `@vierweb/avataaars`

   ```jsx
   // Old
   import Avatar from "avataaars";

   // New
   import Avatar from "@vierweb/avataaars";
   ```

4. **No Code Changes Required**: All existing props and API remain the same. The component is fully backward compatible at the API level.

5. **Optional: Use New Animation Features**:
   ```jsx
   // Add animation features to your existing avatars
   <Avatar
     avatarStyle="Circle"
     topType="LongHairMiaWallace"
     // ... other props
     animationSpeed={2000}
     hoverScale={1.3}
   />
   ```

### Breaking Changes

- **Minimum React Version**: React 18+ is now required (React 17 is no longer supported)
- **Package Name**: Changed from `avataaars` to `@vierweb/avataaars` (scoped package)
- **Removed `className` Prop**: Component no longer accepts `className` prop to enforce CSS isolation
- **HoverExpression Property Names**: Updated to use consistent naming (`mouth` → `mouthType`, `eyes` → `eyeType`, `eyebrow` → `eyebrowType`)
- **Internal API**: Internal implementation changed, but public API remains the same

---

For more details, see the [README.md](./README.md).
