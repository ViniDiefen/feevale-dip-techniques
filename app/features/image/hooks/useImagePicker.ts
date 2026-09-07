import { useCallback, useRef } from "react";

interface UseImagePickerOptions {
  onImageSelected?: (image: File | undefined) => void;
}

export function useImagePicker({ onImageSelected }: UseImagePickerOptions = {}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const image = event.target.files?.[0];
      event.target.value = "";
      onImageSelected?.(image);
    },
    [onImageSelected]
  );

  return { inputRef, openPicker, handleInputChange };
}
