import { useEffect, useRef } from "react";

const styles = {
  preview:
    "relative flex items-center justify-center overflow-auto rounded-lg bg-background flex-1 min-h-0 p-5",
  previewImage: "object-contain",
} as const;

export function ImagePreview({ canvas }: { canvas: HTMLCanvasElement | undefined }) {
  const previewRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const target = previewRef.current;
    if (!target || !canvas) return;
    target.width = canvas.width;
    target.height = canvas.height;
    target.getContext("2d")?.drawImage(canvas, 0, 0);
  }, [canvas]);

  return (
    <div className={styles.preview}>
      {canvas !== undefined ? (
        <canvas
          ref={previewRef}
          className={styles.previewImage}
          role="img"
          aria-label="Preview"
        />
      ) : null}
    </div>
  );
}
