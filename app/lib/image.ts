export function fileToCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        reject(new Error("Canvas 2D não suportado neste navegador."));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
    img.src = URL.createObjectURL(file);
  });
}

export async function loadSampleImage(): Promise<File> {
  const response = await fetch("/lena.jpg");
  const blob = await response.blob();
  return new File([blob], "lena.jpg", { type: blob.type || "image/jpeg" });
}
