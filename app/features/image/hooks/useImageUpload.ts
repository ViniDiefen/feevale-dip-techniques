import { useCallback, useState } from "react";
import { isImageFile, isUnderMaxSize } from "@/shared/lib/utils";

interface UseImageUploadOptions {
  onChange?: (image: File | undefined) => void;
  maxSizeMB?: number;
}

export function useImageUpload({ onChange, maxSizeMB = 5 }: UseImageUploadOptions = {}) {
  const [error, setError] = useState<string>();

  const setImage = useCallback(
    (newImage?: File) => {
      if (!newImage) {
        setError(undefined);
        onChange?.(undefined);
        return;
      }

      setError(undefined);

      if (!isImageFile(newImage)) {
        setError("Selecione um arquivo de imagem.");
        return;
      }

      if (!isUnderMaxSize(newImage, maxSizeMB)) {
        setError(`A imagem deve ter no máximo ${maxSizeMB} MB.`);
        return;
      }

      onChange?.(newImage);
    },
    [maxSizeMB, onChange]
  );

  return { error, setImage };
}
