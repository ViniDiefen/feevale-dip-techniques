import { cn } from "@/lib/utils";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useImagePicker } from "@/hooks/useImagePicker";
import { useDragState } from "@/hooks/useDragState";

const styles = {
  dropzone:
    "flex flex-col items-center justify-center gap-4 rounded-lg bg-background p-6 text-foreground transition-colors select-none",
  dropzoneDragging: "bg-accent/70",
  button:
    "rounded-md border border-border bg-secondary px-3 py-1.5 text-sm text-secondary-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-95",
  placeholder: "text-sm text-muted-foreground",
  error: "text-xs text-destructive",
} as const;

interface ImagePickerProps {
  className?: string;
  onChange?: (image: File | undefined) => void;
  maxSizeMB?: number;
}

export function ImagePicker({ className, onChange, maxSizeMB = 5 }: ImagePickerProps) {
  const { error, setImage } = useImageUpload({ onChange, maxSizeMB });
  const { inputRef, openPicker, handleInputChange } = useImagePicker({ onImageSelected: setImage });
  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useDragState({ onDrop: setImage });

  return (
    <div
      className={cn(
        styles.dropzone,
        isDragging && styles.dropzoneDragging,
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <p className={styles.placeholder}>Arraste e solte uma imagem aqui</p>
      <button type="button" onClick={openPicker} className={styles.button}>
        Selecionar arquivo
      </button>

      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="image/*"
        onChange={handleInputChange}
      />

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
