import { useState } from "react";
import { Menubar } from "@/components/Menubar";
import type { Route } from "./+types/home";
import { ImagePicker } from "@/components/ImagePicker";
import { ImagePreview } from "@/components/ImagePreview";

const styles = {
  layout: "flex flex-col h-screen",
  picker: "flex-1 min-h-0",
  preview: "flex-1 min-h-0 p-5",
} as const;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Feevale DIP Techniques" },
    {
      name: "description",
      content:
        "A solution for managing and testing DIP techniques, applying techniques presented at the Feevale DIP conference.",
    },
  ];
}

export default function Home() {
  const [image, setImage] = useState<File>();

  return (
    <div className={styles.layout}>
      {image && <Menubar />}
      {image && <ImagePreview image={image} className={styles.preview} />}
      {!image && <ImagePicker className={styles.picker} onChange={setImage} />}
    </div>
  );
}
