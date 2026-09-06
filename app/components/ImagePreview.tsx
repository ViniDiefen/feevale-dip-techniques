import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const styles = {
  container: "relative flex items-center justify-center overflow-hidden rounded-lg bg-background",
  image: "max-h-full max-w-full object-contain",
  error: "text-xs text-destructive",
} as const;

interface ImagePreviewProps {
  image: File;
  className?: string;
}

export function ImagePreview({ image, className }: ImagePreviewProps) {
  const [src, setSrc] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const objectUrl = URL.createObjectURL(image);
    setSrc(objectUrl);
    setError(undefined);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  return (
    <div className={cn(styles.container, className)}>
      {src && (
        <img
          src={src}
          alt={image.name}
          className={styles.image}
          onError={() => setError("Erro ao carregar imagem")}
        />
      )}
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
