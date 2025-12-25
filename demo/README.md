# Avataaars Demo

A simple visual demo/playground for testing the Avataaars component.

## Setup

1. Install demo dependencies:
   ```bash
   cd demo
   npm install
   ```

## Running the Demo

**From the root directory:**
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

**Note:** The demo uses the compiled `dist/` folder (same as npm package), so you must build first!

This will start a Vite dev server (usually at `http://localhost:5173`) where you can visually test the Avatar component with different props.

## Features

The demo includes:
- Live preview of Circle and Transparent avatar styles
- Example of animated avatar
- Interactive controls to customize avatar properties
- Real-time updates as you change options

This demo is only for development/testing and is **not included** in the npm package.

