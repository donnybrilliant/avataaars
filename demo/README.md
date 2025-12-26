# Avataaars Demo

A full-featured visual demo and playground for testing the Avataaars component.

🌐 **[Try the Live Demo](https://avataaars.vierweb.no)**

📚 **[View API Documentation](https://avataaars.vierweb.no/docs/)**

🔙 **[Back to Main README](../README.md)**

## Overview

This interactive demo showcases all features of the Avataaars React component, including:

- Complete avatar customization with all available options
- Animation settings and hover effects
- Export functionality (GIF, SVG)
- Code generation for easy copy-paste
- Settings persistence via localStorage

## Setup

1. Install demo dependencies:

   ```bash
   cd demo
   npm install
   ```

   The demo uses the `@vierweb/avataaars` npm package as a dependency, so it will be installed automatically.

## Running the Demo Locally

**From the root directory (recommended - includes docs):**

```bash
npm start
```

This will:

1. Build the package
2. Generate documentation
3. Start the demo server with docs available at `/docs`

**Or just the demo without docs:**

```bash
npm run demo
```

This will automatically build the package and start the demo server.

**Or manually:**

```bash
# Build the package first (demo uses dist/ folder, just like npm users)
npm run build

# Then run the demo
cd demo
npm run dev
```

**Preview production build:**

```bash
# Build everything and preview production build
npm run demo:preview
```

**Note:** The demo uses the `@vierweb/avataaars` npm package. The package will be installed automatically when you run `npm install` in the demo directory.

This will start a Vite dev server (usually at `http://localhost:5173`) where you can visually test the Avatar component with different props.

## Features

### Avatar Customization

- **Live Preview**: See changes in real-time as you adjust options
- **All Avatar Options**: Access to every customization option:
  - Top/Hair styles and colors
  - Accessories (glasses, etc.)
  - Facial hair and colors
  - Clothing types, colors, and graphics
  - Eye, eyebrow, and mouth expressions
  - Skin tones
  - Avatar style (Circle or Transparent)

### Animation Features

- **Idle Animation**: Random expression changes at configurable speed
- **Hover Animation**: Custom expression sequences on hover
- **Hover Scale**: Avatar scaling on hover (optional)
- **Background Color**: Customizable circle background
- **Animation Speed Controls**: Fine-tune all animation timings

### Export Functionality

- **Export to GIF**: Generate animated GIF files from hover sequences
- **Export to SVG**: Generate animated SVG files
- Export button in the top-right corner when animations are configured

### Developer Features

- **Code Generator**: Automatically generates React code for your current avatar
- **Settings Persistence**: All customization and settings saved to localStorage
- **Real-time Updates**: See code changes as you customize

## Deployment

The demo is automatically deployed to GitHub Pages on every push to `main` or `master` branch via GitHub Actions. See the [main README](../README.md) for CI/CD details.

## Technical Details

- Built with **Vite** for fast development and optimized builds
- Uses the `@vierweb/avataaars` npm package (same as published package)
- TypeScript for type safety
- Modern React patterns (hooks, context)
- Responsive design with CSS-in-JS
