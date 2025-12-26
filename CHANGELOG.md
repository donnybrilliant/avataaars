# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Future features and improvements will be documented here.

## [3.0.1] - 2025-12-26

### Added

- **Options Module Export**: Added `./options` export path to package.json
  - Users can now import options from `@vierweb/avataaars/options`
  - Enables importing individual option objects (TopOption, EyesOption, etc.) and option constants
  - Example: `import { TopOption, EyesOption } from '@vierweb/avataaars/options'`

### Changed

- **Demo Updates**: Demo now uses the published npm package instead of local dist folder
  - Demo package.json updated to use `@vierweb/avataaars` as a dependency
  - All imports updated from local paths to npm package imports
  - Added installation instructions code block in CodeGenerator component

## [3.0.0] - 2024-12-26

### Added

- **React 19 Compatibility**: Full support for React 18 and React 19
- **Animation Features**: Optional animation props for interactive avatars
  - `animationSpeed`: Control random expression animation speed
  - `hoverScale`: Avatar scales up on hover
  - `hoverSequence`: Custom expression sequences on hover
  - `backgroundColor`: Customizable circle background color
  - `pageBackgroundColor`: Mask overflow color customization
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

### Fixed

- React 19 compatibility issues with legacy context APIs
- All deprecation warnings related to `UNSAFE_componentWillMount` and similar lifecycle methods
- TypeDoc warnings for missing syntax highlighting languages
- Image path issues in generated documentation

### Technical Details

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
   npm install @vierweb/avataaars@^3.0.0
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
- **Internal API**: Internal implementation changed, but public API remains the same

---

For more details, see the [README.md](./README.md).
