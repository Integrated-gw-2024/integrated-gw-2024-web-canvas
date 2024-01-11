export function rgbToHsb(r: { r: number; g: number; b: number }): { h: number; s: number; b: number };

export function rgbToHsb(r: number | { r: number; g: number; b: number } = 0, g = 0, b = 0): { h: number; s: number; b: number } {
  const rgb = { r: 0, g: 0, b: 0 };

  if (typeof r === "object") {
    rgb.r = r.r;
    rgb.g = r.g;
    rgb.b = r.b;
  } else {
    rgb.r = r;
    rgb.b = b;
    rgb.g = g;
  }

  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const max = Math.max(rgb.r, rgb.g, rgb.b);

  const brightness = max / 255;

  if (max == 0) {
    const hue = -1;
    const saturation = 0;

    return { h: hue, s: saturation, b: brightness };
  }

  const delta = max - min;
  const saturation = delta / max;

  let hue = 0;
  switch (max) {
    // between yellow & magenta
    case rgb.r:
      hue = (rgb.g - rgb.b) / delta;
      break;
    // between cyan & yellow
    case rgb.g:
      hue = 2 + (rgb.b - rgb.r) / delta;
      break;
    // between magenta & cyan
    case rgb.b:
      hue = 4 + (rgb.r - rgb.g) / delta;
      break;
  }

  // degrees
  hue *= 60;
  if (hue < 0) {
    hue += 360;
  }

  return { h: hue, s: saturation, b: brightness };
}
