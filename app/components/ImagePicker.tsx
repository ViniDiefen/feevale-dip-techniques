import { ErrorCode, useDropzone, type FileRejection } from "react-dropzone";

const MAX_IMAGE_SIZE_MB = 5;

const styles = {
  picker: "flex-1 min-h-0",
  dropzone:
    "flex flex-col items-center justify-center gap-4 rounded-lg bg-background p-6 text-foreground transition-colors select-none",
  dropzoneDragging: "bg-accent/70",
  dropzoneButton:
    "rounded-md border border-border bg-secondary px-3 py-1.5 text-sm text-secondary-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-95",
  placeholder: "text-sm text-muted-foreground",
  uploadError: "text-xs text-destructive",
} as const;

function uploadErrorMessage(rejections: readonly FileRejection[]): string | undefined {
  const error = rejections[0]?.errors[0];
  if (!error) return undefined;
  return error.code === ErrorCode.FileTooLarge
    ? `A imagem deve ter no máximo ${MAX_IMAGE_SIZE_MB} MB.`
    : "Selecione um arquivo de imagem.";
}

export function ImagePicker({
  onImageLoad,
}: {
  onImageLoad: (file: File | undefined) => void;
}) {
  const { getRootProps, getInputProps, open, isDragActive, fileRejections } =
    useDropzone({
      accept: { "image/*": [] },
      maxSize: MAX_IMAGE_SIZE_MB * 1024 * 1024,
      multiple: false,
      noClick: true,
      onDrop: (accepted) => onImageLoad(accepted[0]),
    });
  const uploadError = uploadErrorMessage(fileRejections);

  return (
    <div
      {...getRootProps({
        className: `${styles.dropzone} ${styles.picker} ${
          isDragActive ? styles.dropzoneDragging : ""
        }`,
      })}
    >
      <input {...getInputProps()} />
      <p className={styles.placeholder}>Arraste e solte uma imagem aqui</p>
      <button type="button" onClick={open} className={styles.dropzoneButton}>
        Selecionar arquivo
      </button>
      {uploadError ? (
        <p className={styles.uploadError} role="alert">
          {uploadError}
        </p>
      ) : null}
    </div>
  );
}
