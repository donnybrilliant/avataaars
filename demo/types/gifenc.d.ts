/**
 * Type declarations for gifenc package
 * @see https://github.com/mattdesl/gifenc
 */

declare module "gifenc" {
  export type QuantizeFormat = "rgb565" | "rgba4444" | "rgba5551";

  export interface QuantizeOptions {
    format?: QuantizeFormat;
    useSqrt?: boolean;
    oneBitAlpha?: boolean;
  }

  export type Palette = number[][];

  export class GIFEncoder {
    writeFrame(
      indexedPixels: Uint8Array,
      width: number,
      height: number,
      options?: {
        palette?: Palette;
        delay?: number;
        transparent?: boolean;
        transparentIndex?: number;
        repeat?: number;
      }
    ): void;

    finish(): void;
    bytes(): Uint8Array;
  }

  export function quantize(
    pixels: Uint8ClampedArray,
    maxColors: number,
    options?: QuantizeOptions
  ): Palette;

  export function applyPalette(
    pixels: Uint8ClampedArray,
    palette: Palette,
    format: QuantizeFormat
  ): Uint8Array;
}

