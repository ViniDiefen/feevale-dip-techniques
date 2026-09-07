import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const styles = {
  container: "relative flex items-center justify-center overflow-auto rounded-lg bg-background",
  image: "object-contain",
} as const;

interface ImagePreviewProps {
  canvas?: HTMLCanvasElement;
  className?: string;
}

export function ImagePreview({ canvas, className }: ImagePreviewProps) {
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    if (!canvas) {
      setSrc(undefined);
      return;
    }
    setSrc(canvas.toDataURL());
  }, [canvas]);

  return (
    <div className={cn(styles.container, className)}>
      {src && (
        <img src={src} className={styles.image} alt="Preview" />
      )}
    </div>
  );
}
