const MAX_BARCODE_IMAGE_DIMENSION = 2400;

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("That photo could not be opened. Try taking another picture."));
    image.src = url;
  });
}

function drawScaledImage(image) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const scale = Math.min(1, MAX_BARCODE_IMAGE_DIMENSION / Math.max(sourceWidth, sourceHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(sourceWidth * scale));
  canvas.height = Math.max(1, Math.round(sourceHeight * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("This browser could not prepare the barcode photo.");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function rotateCanvas(source, quarterTurns) {
  const canvas = document.createElement("canvas");
  const sideways = Math.abs(quarterTurns) % 2 === 1;
  canvas.width = sideways ? source.height : source.width;
  canvas.height = sideways ? source.width : source.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("This browser could not prepare the barcode photo.");
  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(quarterTurns * Math.PI / 2);
  context.drawImage(source, -source.width / 2, -source.height / 2);
  return canvas;
}

export async function decodeBarcodeImage(file) {
  if (!file) throw new Error("Choose a barcode photo.");
  if (file.type && !file.type.startsWith("image/")) throw new Error("Choose a photo or image file.");
  if (file.size > 20 * 1024 * 1024) throw new Error("Choose an image smaller than 20 MB.");

  const objectUrl = URL.createObjectURL(file);
  try {
    const [{ BrowserMultiFormatReader, BarcodeFormat }, { DecodeHintType }] = await Promise.all([
      import("@zxing/browser"),
      import("@zxing/library"),
    ]);
    const image = await loadImage(objectUrl);
    const canvas = drawScaledImage(image);
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.EAN_8,
      BarcodeFormat.EAN_13,
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);
    const attempts = [canvas, rotateCanvas(canvas, 1), rotateCanvas(canvas, -1)];
    for (const attempt of attempts) {
      try {
        const reader = new BrowserMultiFormatReader(hints);
        const result = reader.decodeFromCanvas(attempt);
        const code = String(result?.getText?.() || result?.text || "").replace(/\D/g, "");
        if (code) return code;
      } catch {
        // Try the other common photo orientations before showing guidance.
      }
    }
    throw new Error("Barcode not found.");
  } catch (error) {
    if (error?.message?.startsWith("Choose ") || error?.message?.startsWith("This browser") || error?.message?.startsWith("That photo")) throw error;
    throw new Error("I could not find a readable UPC or EAN barcode. Retake it straight-on in even light with the full barcode in frame.");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
