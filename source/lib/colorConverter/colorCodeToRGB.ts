export function colorCodeToRGB(colorCode: string): { r: number; g: number; b: number } {
  switch (colorCode) {
    case "red": {
      const red = 255;
      const green = 0;
      const blue = 0;

      return { r: red, g: green, b: blue };
    }
    case "green": {
      const red = 0;
      const green = 255;
      const blue = 0;

      return { r: red, g: green, b: blue };
    }
    case "blue": {
      const red = 0;
      const green = 0;
      const blue = 255;

      return { r: red, g: green, b: blue };
    }
    default: {
      if (colorCode.substring(0, 1) != "#") {
        throw new Error(`argument is not a color code. The value passed is '${colorCode}'`);
      }
    }
  }

  const rgb = ((): { red: number; green: number; blue: number } => {
    switch (colorCode.length) {
      case 4: {
        return {
          red: parseInt(colorCode.substring(1, 2), 16),
          green: parseInt(colorCode.substring(2, 3), 16),
          blue: parseInt(colorCode.substring(3, 4), 16),
        };
      }
      case 7: {
        return {
          red: parseInt(colorCode.substring(1, 3), 16),
          green: parseInt(colorCode.substring(3, 5), 16),
          blue: parseInt(colorCode.substring(5, 7), 16),
        };
      }
      default: {
        return {
          red: parseInt(colorCode.substring(1, 3), 16),
          green: parseInt(colorCode.substring(3, 5), 16),
          blue: parseInt(colorCode.substring(5, 7), 16),
        };
      }
    }
  })();

  if (Number.isNaN(rgb.red) || Number.isNaN(rgb.green) || Number.isNaN(rgb.blue)) {
    throw new Error(`The calculation result is Nan. The value passed is '${colorCode}'`);
  }

  return { r: rgb.red, g: rgb.green, b: rgb.blue };
}
