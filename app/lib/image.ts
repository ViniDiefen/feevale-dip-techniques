export function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        reject(new Error("Canvas 2D is not supported in this browser."));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = () => reject(new Error("Could not load the image."));
    img.src = URL.createObjectURL(file);
  });
}

export async function loadSampleImage(): Promise<File> {
  const response = await fetch("/lena.jpg");
  const blob = await response.blob();
  return new File([blob], "lena.jpg", { type: blob.type || "image/jpeg" });
}
