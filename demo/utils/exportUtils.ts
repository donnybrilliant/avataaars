import { GIFEncoder, quantize, applyPalette } from "gifenc";
import { createRoot } from "react-dom/client";
import React, { type CSSProperties } from "react";
import AvatarComponent, { AvatarStyle } from "@vierweb/avataaars";
import { HoverExpression } from "@vierweb/avataaars";

/**
 * Exports an animated SVG file containing multiple expression frames.
 * Renders each expression frame using React, extracts the SVG content,
 * and combines them into a single animated SVG with CSS keyframe animations.
 *
 * @param baseProps - Base avatar customization properties (excluding expressions)
 * @param expressions - Array of expressions to animate through
 * @param frameDelay - Delay between frames in milliseconds (default: 500)
 * @param backgroundColor - Optional background color for Circle style avatars
 */
export async function exportAnimatedSVG(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseProps: Record<string, any>,
  expressions: HoverExpression[],
  frameDelay: number = 500,
  backgroundColor?: string
): Promise<void> {
  const frames: string[] = [];
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  document.body.appendChild(container);

  const isCircle =
    baseProps.avatarStyle === "Circle" ||
    baseProps.avatarStyle === AvatarStyle.Circle;
  /**
   * Background color is only applied for Circle style avatars.
   * Transparent style avatars ignore background color.
   */
  const effectiveBackgroundColor = isCircle
    ? backgroundColor || baseProps.backgroundColor
    : undefined;

  try {
    for (const expr of expressions) {
      /**
       * Construct props for this frame with the expression values.
       * Disable animations for export, but enable wrapper structure when background color is set.
       */
      const props = {
        ...baseProps,
        eyeType: expr.eyes,
        eyebrowType: expr.eyebrow,
        mouthType: expr.mouth,
        animationSpeed: undefined,
        hoverScale: effectiveBackgroundColor ? 1 : undefined,
        hoverSequence: undefined,
        avatarStyle: baseProps.avatarStyle || "Circle",
        backgroundColor: effectiveBackgroundColor,
      };

      /**
       * Render the avatar component in an off-screen container.
       * The container is positioned off-screen to avoid visual flicker during rendering.
       */
      const root = createRoot(container);
      root.render(React.createElement(AvatarComponent, props));

      /**
       * Wait for React to complete rendering and DOM updates.
       * Double wait ensures all CSS transitions and layout calculations are complete.
       */
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => setTimeout(resolve, 100));

      /**
       * Extract the inner SVG element. AvatarComponent wraps content in divs
       * when backgroundColor or hoverScale is set, so we need to traverse the DOM structure.
       */
      const wrapperDiv = container.querySelector("div");
      const innerSvg =
        wrapperDiv?.querySelector("div > svg") ||
        container.querySelector("svg");

      if (innerSvg) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(innerSvg);
        frames.push(extractSVGContent(svgString));
      }

      root.unmount();
    }
  } finally {
    document.body.removeChild(container);
  }

  const animatedSVG = buildAnimatedSVG(
    frames,
    frameDelay,
    effectiveBackgroundColor,
    isCircle
  );
  downloadBlob(
    new Blob([animatedSVG], { type: "image/svg+xml" }),
    "avatar.svg"
  );
}

/**
 * Extracts output dimensions from CSS properties or returns default avatar dimensions.
 * Parses numeric values from string formats like "100px" or uses numeric values directly.
 *
 * @param style - Optional CSS properties containing width/height
 * @returns Object with width and height in pixels
 */
function getOutputSize(style?: CSSProperties): {
  width: number;
  height: number;
} {
  const defaultWidth = 264;
  const defaultHeight = 280;

  if (!style) {
    return { width: defaultWidth, height: defaultHeight };
  }

  // Parse width
  let width = defaultWidth;
  if (style.width) {
    if (typeof style.width === "number") {
      width = style.width;
    } else if (typeof style.width === "string") {
      const parsed = parseInt(style.width, 10);
      if (!isNaN(parsed)) width = parsed;
    }
  }

  // Parse height
  let height = defaultHeight;
  if (style.height) {
    if (typeof style.height === "number") {
      height = style.height;
    } else if (typeof style.height === "string") {
      const parsed = parseInt(style.height, 10);
      if (!isNaN(parsed)) height = parsed;
    }
  }

  return { width, height };
}

/**
 * Exports an animated GIF file containing multiple expression frames.
 * Renders each expression frame to canvas, captures ImageData, and encodes
 * using the gifenc library with color quantization and transparency support.
 *
 * @param baseProps - Base avatar customization properties (excluding expressions)
 * @param expressions - Array of expressions to animate through
 * @param frameDelay - Delay between frames in milliseconds (default: 500)
 * @param backgroundColor - Optional background color for Circle style avatars
 */
export async function exportGIF(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseProps: Record<string, any>,
  expressions: HoverExpression[],
  frameDelay: number = 500,
  backgroundColor?: string
): Promise<void> {
  const frames: ImageData[] = [];
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  document.body.appendChild(container);

  const isCircleGIF =
    baseProps.avatarStyle === "Circle" ||
    baseProps.avatarStyle === AvatarStyle.Circle;

  // Only use backgroundColor if avatarStyle is Circle
  const effectiveBackgroundColor = isCircleGIF
    ? backgroundColor || baseProps.backgroundColor
    : undefined;

  // Get output size from style prop or use default (264x280)
  const outputSize = getOutputSize(baseProps.style);
  const outputWidth = outputSize.width;
  const outputHeight = outputSize.height;

  try {
    for (const expr of expressions) {
      const props = {
        ...baseProps,
        eyeType: expr.eyes,
        eyebrowType: expr.eyebrow,
        mouthType: expr.mouth,
        // Disable animations for export
        animationSpeed: undefined,
        hoverScale: undefined,
        hoverSequence: undefined,
        // Ensure avatarStyle is included
        avatarStyle: baseProps.avatarStyle || "Circle",
        // Only pass backgroundColor if Circle style
        backgroundColor: effectiveBackgroundColor,
      };

      // For GIF, use AvatarComponent wrapper to handle background and cropping properly
      const root = createRoot(container);
      root.render(React.createElement(AvatarComponent, props));

      // Wait for React to render
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => setTimeout(resolve, 100));

      // AvatarComponent wraps content in divs when backgroundColor is set
      // Extract the inner SVG element (it's inside: div > div > svg)
      const wrapperDiv = container.querySelector("div");
      const innerSvg =
        wrapperDiv?.querySelector("div > svg") ||
        container.querySelector("svg");

      if (innerSvg) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(innerSvg);
        const imageData = await svgToImageData(
          svgString,
          effectiveBackgroundColor,
          isCircleGIF,
          outputWidth,
          outputHeight
        );
        frames.push(imageData);
      }

      root.unmount();
    }
  } finally {
    document.body.removeChild(container);
  }

  if (frames.length === 0) {
    throw new Error("No frames captured");
  }

  // Encode GIF using GIFEncoder
  const encoder = new GIFEncoder();

  // ImageData.data is already a Uint8ClampedArray (RGBA), perfect for quantize
  // Use rgba4444 format to preserve alpha channel for transparency
  // useSqrt: true improves color matching accuracy for better quality
  // oneBitAlpha: false allows for smooth alpha transitions
  const palette = quantize(frames[0].data, 256, {
    format: "rgba4444",
    useSqrt: true,
    oneBitAlpha: false, // Allow smooth alpha transitions for better quality
  });

  // Apply palette to all frames to get indexed data (use rgba4444 format)
  const indexedFrames = frames.map((frame) =>
    applyPalette(frame.data, palette, "rgba4444")
  );

  // Find transparent color index in palette (alpha = 0)
  const transparentIndex = palette.findIndex(
    (c: number[]) => c.length >= 4 && c[3] === 0
  );
  // Use transparent flag and transparentIndex if we found a transparent color
  const hasTransparent = transparentIndex >= 0;

  // Get dimensions from first frame (should be 3x scale: 792x840)
  const width = frames[0].width;
  const height = frames[0].height;

  // Write first frame with palette
  encoder.writeFrame(indexedFrames[0], width, height, {
    palette,
    delay: frameDelay,
    transparent: hasTransparent,
    transparentIndex: hasTransparent ? transparentIndex : undefined,
    repeat: 0, // Loop forever
  });

  // Write remaining frames with the same palette
  for (let i = 1; i < indexedFrames.length; i++) {
    encoder.writeFrame(indexedFrames[i], width, height, {
      delay: frameDelay,
      transparent: hasTransparent,
      transparentIndex: hasTransparent ? transparentIndex : undefined,
    });
  }

  encoder.finish();
  const gifBytes = encoder.bytes();

  downloadBlob(
    new Blob([new Uint8Array(gifBytes)], { type: "image/gif" }),
    "avatar.gif"
  );
}

/**
 * Exports a static PNG file of the avatar.
 * Renders the avatar at high resolution and exports as PNG with high quality.
 *
 * @param baseProps - Avatar customization properties
 * @param backgroundColor - Optional background color for Circle style avatars
 */
export async function exportPNG(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseProps: Record<string, any>,
  backgroundColor?: string
): Promise<void> {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  document.body.appendChild(container);

  const isCircle =
    baseProps.avatarStyle === "Circle" ||
    baseProps.avatarStyle === AvatarStyle.Circle;

  // Only use backgroundColor if avatarStyle is Circle
  const effectiveBackgroundColor = isCircle
    ? backgroundColor || baseProps.backgroundColor
    : undefined;

  // Get output size from style prop or use default (264x280)
  const outputSize = getOutputSize(baseProps.style);
  const outputWidth = outputSize.width;
  const outputHeight = outputSize.height;

  try {
    const props = {
      ...baseProps,
      // Disable animations for export
      animationSpeed: undefined,
      hoverScale: undefined,
      hoverSequence: undefined,
      // Ensure avatarStyle is included
      avatarStyle: baseProps.avatarStyle || "Circle",
      // Only pass backgroundColor if Circle style
      backgroundColor: effectiveBackgroundColor,
    };

    // Render the avatar component
    const root = createRoot(container);
    root.render(React.createElement(AvatarComponent, props));

    // Wait for React to render
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Extract the inner SVG element
    const wrapperDiv = container.querySelector("div");
    const innerSvg =
      wrapperDiv?.querySelector("div > svg") ||
      container.querySelector("svg");

    if (innerSvg) {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(innerSvg);
      const pngBlob = await svgToPNG(
        svgString,
        effectiveBackgroundColor,
        isCircle,
        outputWidth,
        outputHeight
      );
      downloadBlob(pngBlob, "avatar.png");
    }

    root.unmount();
  } finally {
    document.body.removeChild(container);
  }
}

// Helper: Convert SVG string to PNG Blob with optional background and circle cropping
async function svgToPNG(
  svgString: string,
  backgroundColor?: string,
  isCircle?: boolean,
  outputWidth: number = 264,
  outputHeight: number = 280
): Promise<Blob> {
  // Use 3x resolution and export directly without downscaling
  // This matches the reference implementation which exports at high resolution (typically 2x-3x)
  // Downscaling causes graininess, so we export the high-res version directly
  // 3x gives us 792x840 which is a good high-resolution export size
  const scale = 3;
  const renderWidth = outputWidth * scale;
  const renderHeight = outputHeight * scale;

  // SVG viewBox is always 264x280
  const svgViewBoxWidth = 264;
  const svgViewBoxHeight = 280;

  const canvas = document.createElement("canvas");
  canvas.width = renderWidth;
  canvas.height = renderHeight;
  const ctx = canvas.getContext("2d", {
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "high",
  }) as CanvasRenderingContext2D;

  // Calculate circle parameters in render coordinates
  const svgCx = 132;
  const svgCy = 160;
  const svgR = 120;

  // Scale to render coordinates
  const widthRatio = renderWidth / svgViewBoxWidth;
  const heightRatio = renderHeight / svgViewBoxHeight;
  const renderCx = svgCx * widthRatio;
  const renderCy = svgCy * heightRatio;
  const renderR = svgR * Math.min(widthRatio, heightRatio);

  // Fill background if provided
  if (backgroundColor && isCircle) {
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.arc(renderCx, renderCy, renderR, 0, Math.PI * 2);
    ctx.fill();
  } else if (backgroundColor && !isCircle) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const img = new Image();
  const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Draw SVG at high resolution
      ctx.drawImage(img, 0, 0, renderWidth, renderHeight);

      // Apply circle mask for Circle style avatars
      if (isCircle) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Smooth edge transition for better quality
        const edgeFeather = 3; // More feathering for higher resolution
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const dx = x - renderCx;
            const dy = y - renderCy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Only hide if outside circle AND in bottom overflow area
            if (dist > renderR && y >= renderCy) {
              const idx = (y * canvas.width + x) * 4;
              const distFromEdge = dist - renderR;
              if (distFromEdge < edgeFeather) {
                const originalAlpha = data[idx + 3];
                const featherFactor = 1 - distFromEdge / edgeFeather;
                data[idx + 3] = Math.max(
                  0,
                  Math.min(255, originalAlpha * featherFactor)
                );
              } else {
                data[idx + 3] = 0;
              }
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }

      // Export at high resolution directly - no downscaling to avoid graininess
      // This matches the reference implementation approach
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create PNG blob"));
          }
        },
        "image/png",
        1.0 // Maximum quality for PNG
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Helper: Convert SVG string to ImageData with optional background and circle cropping
async function svgToImageData(
  svgString: string,
  backgroundColor?: string,
  isCircle?: boolean,
  outputWidth: number = 264,
  outputHeight: number = 280
): Promise<ImageData> {
  // Use 6x resolution for GIF to improve quality while keeping file size reasonable
  // Higher scale = smoother edges, especially for circles
  // We still downscale for GIF to keep file size manageable, but use higher initial scale
  const scale = 6;
  const renderWidth = outputWidth * scale;
  const renderHeight = outputHeight * scale;

  // SVG viewBox is always 264x280, so we need to calculate the scale factor for rendering
  const svgViewBoxWidth = 264;
  const svgViewBoxHeight = 280;

  const canvas = document.createElement("canvas");
  canvas.width = renderWidth;
  canvas.height = renderHeight;
  // Use willReadFrequently to optimize for multiple getImageData calls
  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "high",
  }) as CanvasRenderingContext2D;

  // Calculate circle parameters in render coordinates
  // Circle center and radius in SVG viewBox coordinates
  const svgCx = 132;
  const svgCy = 160;
  const svgR = 120;

  // Scale to render coordinates (maintain aspect ratio)
  const widthRatio = renderWidth / svgViewBoxWidth;
  const heightRatio = renderHeight / svgViewBoxHeight;
  const renderCx = svgCx * widthRatio;
  const renderCy = svgCy * heightRatio;
  const renderR = svgR * Math.min(widthRatio, heightRatio); // Use min to keep circle circular

  // For GIF, we want transparent background outside the circle
  // Only fill the circle area if backgroundColor is provided
  if (backgroundColor && isCircle) {
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.arc(renderCx, renderCy, renderR, 0, Math.PI * 2);
    ctx.fill();
  } else if (backgroundColor && !isCircle) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // If no backgroundColor or isCircle without backgroundColor, leave transparent

  const img = new Image();
  const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      // Draw SVG at high resolution, scaling from viewBox to render size
      ctx.drawImage(img, 0, 0, renderWidth, renderHeight);

      // Apply mask-style clipping: only hide overflow areas outside circle (bottom areas)
      // Don't crop the head - only hide pixels below the circle
      if (isCircle) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Only hide pixels that are outside the circle AND in the bottom overflow area
        // This preserves the head while hiding bottom overflow
        // Use a smooth edge transition for better quality (feather the edge)
        const edgeFeather = 1.5; // Pixels to feather at the edge
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const dx = x - renderCx;
            const dy = y - renderCy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Only hide if outside circle AND in bottom overflow area (y >= renderCy)
            if (dist > renderR && y >= renderCy) {
              const idx = (y * canvas.width + x) * 4;
              // Smooth edge transition for better quality
              const distFromEdge = dist - renderR;
              if (distFromEdge < edgeFeather) {
                // Feather the edge: blend from original alpha (at edge) to 0 (at edgeFeather distance)
                // This creates a smooth gradient for better edge quality
                const originalAlpha = data[idx + 3];
                const featherFactor = 1 - distFromEdge / edgeFeather; // 1 at edge, 0 at edgeFeather
                data[idx + 3] = Math.max(
                  0,
                  Math.min(255, originalAlpha * featherFactor)
                );
              } else {
                data[idx + 3] = 0; // Fully transparent beyond feather distance
              }
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }

      // Downscale from high-res to output size with high-quality smoothing for smoother edges
      // Using higher initial scale (6x) and then downscaling gives better quality than lower scale
      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = outputWidth;
      outputCanvas.height = outputHeight;
      const outputCtx = outputCanvas.getContext("2d", {
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      }) as CanvasRenderingContext2D;

      // Draw the high-res canvas onto the output canvas with high-quality scaling
      // This downscaling from 6x to 1x produces much better quality than 4x to 1x
      outputCtx.drawImage(canvas, 0, 0, outputWidth, outputHeight);

      const finalImageData = outputCtx.getImageData(
        0,
        0,
        outputWidth,
        outputHeight
      );
      URL.revokeObjectURL(url);
      resolve(finalImageData);
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Helper: Extract content from SVG string (inner content only, no outer svg tag)
function extractSVGContent(svgString: string): string {
  const match = svgString.match(/<svg[^>]*>(.*)<\/svg>/s);
  if (match && match[1]) {
    return match[1].trim();
  }
  return svgString;
}

// Helper function to build animated SVG (pure CSS keyframes approach)
function buildAnimatedSVG(
  frames: string[],
  delay: number,
  backgroundColor?: string,
  isCircle?: boolean
): string {
  const duration = frames.length * delay;

  // Build individual keyframe animations for each frame
  // Each frame should be visible only during its time slice
  const frameAnimations = frames
    .map((_, i) => {
      const start = (i / frames.length) * 100;
      const end = ((i + 1) / frames.length) * 100;
      const keyframes = `0%, ${(start - 0.01).toFixed(2)}% {
      opacity: 0;
    }
    ${start.toFixed(2)}%, ${(end - 0.01).toFixed(2)}% {
      opacity: 1;
    }
    ${end.toFixed(2)}%, 100% {
      opacity: 0;
    }`;
      return `
    @keyframes frame-${i}-animation {
      ${keyframes}
    }
    .frame-${i} {
      animation: frame-${i}-animation ${duration}ms infinite;
    }`;
    })
    .join("");

  // Add background circle if backgroundColor is provided and isCircle is true
  // This will be rendered FIRST (behind) the frames
  const backgroundCircle =
    backgroundColor && isCircle
      ? `<circle cx="132" cy="160" r="120" fill="${backgroundColor}" />`
      : "";

  // Add mask for bottom overflow (same as AvatarComponent wrapper) when isCircle is true
  // In AvatarComponent, a white overlay rect uses this mask to hide overflow
  // For exported SVG, we apply the mask directly to the frames to hide overflow
  // SVG mask: White = visible, Black = hidden
  // So we start with white (visible everywhere) and paint black over overflow areas
  const maskDef = isCircle
    ? `<defs>
    <mask id="circleMask">
      <rect width="100%" height="100%" fill="white" />
      <!-- Left side overflow (bottom half only) - hide this -->
      <rect x="0" y="160" width="12" height="120" fill="black" />
      <!-- Right side overflow (bottom half only) - hide this -->
      <rect x="252" y="160" width="12" height="120" fill="black" />
      <!-- Bottom overflow (below circle bottom) - hide this -->
      <rect x="12" y="280" width="240" height="0" fill="black" />
      <!-- Bottom half circle overflow - left crescent - hide this -->
      <path d="M 12 160 A 120 120 0 0 0 132 280 L 12 280 Z" fill="black" />
      <!-- Bottom half circle overflow - right crescent - hide this -->
      <path d="M 252 160 A 120 120 0 0 1 132 280 L 252 280 Z" fill="black" />
    </mask>
  </defs>`
    : "";

  const maskAttr = isCircle ? ' mask="url(#circleMask)"' : "";

  // Build animated SVG with CSS animation
  // Structure: background circle (if Circle style, behind) -> frames group with mask (if Circle style, on top)
  // For Circle: background behind, mask hides bottom overflow
  // For Transparent: no background, no mask, just frames
  // In SVG, elements render in document order - earlier elements render behind later ones
  // The background circle MUST come before the frames group to render behind

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 264 280" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  ${maskDef}
  <style>
    .frame {
      opacity: 0;
    }${frameAnimations}
  </style>
  ${backgroundCircle}
  <g${maskAttr}>
    ${frames
      .map(
        (content, i) => `
    <g class="frame frame-${i}">${content}</g>`
      )
      .join("")}
  </g>
</svg>`;
}

// Helper: Download blob
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
