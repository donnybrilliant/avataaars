# React component for Avataaars

[![Publish to NPM](https://github.com/donnybrilliant/avataaars/actions/workflows/publish.yml/badge.svg)](https://github.com/donnybrilliant/avataaars/actions/workflows/publish.yml)
[![Deploy to GitHub Pages](https://github.com/donnybrilliant/avataaars/actions/workflows/deploy.yml/badge.svg)](https://github.com/donnybrilliant/avataaars/actions/workflows/deploy.yml)

The core React component for [Avataaars Generator](https://getavataaars.com/) developed by [Fang-Pen Lin](https://twitter.com/fangpenlin), based on the Sketch library [Avataaars](https://avataaars.com/) designed by [Pablo Stanley](https://twitter.com/pablostanley).

<p align="center"><img src='avatar.svg' style='width: 300px; height: 300px;' /></p>

## Quick Links

- 🎨 **[Live Demo](https://avataaars.vierweb.no)** - Interactive playground to test all features
- 📚 **[API Documentation](https://avataaars.vierweb.no/docs/)** - Complete TypeDoc API reference
- 📦 **[npm Package](https://www.npmjs.com/package/@vierweb/avataaars)** - Install via npm
- 💻 **[Demo Source Code](./demo/README.md)** - Learn how to build your own editor

## Features

- **React 19 compatible** - Full support for React 18 and 19
- **Animation features** - Optional hover animations and expression sequences
- **Export support** - Export avatars as static SVG, animated SVG, or GIF
- SVG based
- Light weight
- Scalable
- Easy to use
- Easy to integrate with custom editor
- Comes with [editor](https://avataaars.vierweb.no)

## Installation

```bash
npm install @vierweb/avataaars
```

## Usage

### Basic Avatar

```jsx
import Avatar from "@vierweb/avataaars";

function MyAvatar() {
  return (
    <Avatar
      style={{ width: "300px", height: "300px" }}
      avatarStyle="Circle"
      topType="LongHairMiaWallace"
      accessoriesType="Prescription02"
      hairColor="BrownDark"
      facialHairType="Blank"
      clotheType="Hoodie"
      clotheColor="PastelBlue"
      eyeType="Happy"
      eyebrowType="Default"
      mouthType="Smile"
      skinColor="Light"
    />
  );
}
```

### With Animation Features

```jsx
import Avatar from "@vierweb/avataaars";

function AnimatedAvatar() {
  return (
    <Avatar
      avatarStyle="Circle"
      topType="LongHairStraight"
      eyeType="Happy"
      mouthType="Smile"
      skinColor="Light"
      // Idle animation: random expression changes every 2 seconds
      animationSpeed={2000}
      // Hover scale: avatar scales up on hover
      hoverScale={1.2}
      // Hover animation: cycle through expressions on hover
      hoverSequence={[
        { mouthType: "Disbelief", eyeType: "Surprised", eyebrowType: "UpDown" },
        { mouthType: "ScreamOpen", eyeType: "Dizzy", eyebrowType: "Angry" },
        { mouthType: "Smile", eyeType: "Happy", eyebrowType: "Default" },
      ]}
      hoverAnimationSpeed={300}
      backgroundColor="#65C9FF"
    />
  );
}
```

### Individual Avatar Pieces

To showcase individual pieces of the avatar, use the `Piece` component:

```jsx
import { Piece } from "@vierweb/avataaars";

function AvatarPieces() {
  return (
    <>
      <Piece pieceType="mouth" pieceSize="100" mouthType="Eating" />
      <Piece pieceType="eyes" pieceSize="100" eyeType="Dizzy" />
      <Piece pieceType="eyebrows" pieceSize="100" eyebrowType="RaisedExcited" />
      <Piece pieceType="accessories" pieceSize="100" accessoriesType="Round" />
      <Piece
        pieceType="top"
        pieceSize="100"
        topType="LongHairFro"
        hairColor="Red"
      />
      <Piece
        pieceType="facialHair"
        pieceSize="100"
        facialHairType="BeardMajestic"
      />
      <Piece
        pieceType="clothe"
        pieceSize="100"
        clotheType="Hoodie"
        clotheColor="Red"
      />
      <Piece pieceType="graphics" pieceSize="100" graphicType="Skull" />
      <Piece pieceType="skin" pieceSize="100" skinColor="Brown" />
    </>
  );
}
```

### TypeScript Support

The package includes full TypeScript support with exported types for type safety:

```tsx
import Avatar, {
  type Props,
  type HoverExpression,
  AvatarStyle,
} from "@vierweb/avataaars";

// Type your component props
interface MyComponentProps {
  avatarProps: Props;
}

function MyAvatar({ avatarProps }: MyComponentProps) {
  // Type-safe hover sequence
  const hoverSequence: HoverExpression[] = [
    { mouthType: "Disbelief", eyeType: "Surprised", eyebrowType: "UpDown" },
    { mouthType: "Smile", eyeType: "Happy", eyebrowType: "Default" },
  ];

  return (
    <Avatar
      {...avatarProps}
      avatarStyle={AvatarStyle.Circle}
      hoverSequence={hoverSequence}
    />
  );
}
```

**Available Types:**

- `Props` (alias for `AvatarProps`) - Component props interface
- `HoverExpression` - Type for hover animation sequences
- `AvatarStyle` - Enum for avatar styles (Circle, Transparent)
- `OptionKey` - Type for avatar option keys

### Animation Props

The Avatar component supports several optional animation features that can be used independently or combined:

- **`animationSpeed`** (number, 500-3000ms): Controls random expression changes when not hovering. Lower values = faster changes.
- **`hoverScale`** (number, 1.05-1.32): Scales the avatar on hover. Visual effect only.
- **`hoverSequence`** (HoverExpression[]): Array of expressions to cycle through on hover.
- **`hoverAnimationSpeed`** (number, 100-2000ms): Speed of hover sequence animation.
- **`backgroundColor`** (string): Background color for circle style avatars (hex color).

```jsx
interface HoverExpression {
  mouthType: string;
  eyeType: string;
  eyebrowType: string;
}
```

To explore all avatar options and generate React code, check out our [interactive demo](https://avataaars.vierweb.no).

## Development

```bash
# Install dependencies
npm install

# Start development (builds package, generates docs, and starts demo server)
npm start

# Build the package
npm run build

# Run linter
npm run lint

# Generate documentation
npm run docs

# Run demo only (builds package and starts dev server)
npm run demo
```

For more information on running the interactive demo locally, see the [demo README](./demo/README.md).

## Building Your Own Editor

To build a custom avatar editor, you can use the `Avatar` component along with `OptionContext` to collect and manage available options. For complete examples, see:

- Our [demo source code](./demo/README.md) - Full-featured editor implementation
- [API Documentation](https://avataaars.vierweb.no/docs/) - Complete TypeDoc reference with all types and interfaces
