import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { GripVertical, Image as ImageIcon, RotateCcw, Trash2 } from "lucide-react";
import Draggable from "react-draggable";
import { ErrorCode, useDropzone, type FileRejection } from "react-dropzone";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import type { NumberParamSchema, SelectParamSchema } from "@/commands/types";
import { menus, type Menu, type MenuItem } from "@/data/menu";
import type { CommandLayer, Layer } from "@/layers/types";
import {
  applyLayers,
  createCommandLayer,
  createImageLayer,
  findLayer,
  getImageLayer,
  listCommandLayers,
  removeLayer,
  reorderCommandLayers,
  updateLayerParams,
} from "@/layers/layers";
import { fileToCanvas, loadSampleImage } from "@/lib/image";
import type { Route } from "./+types/home";

const MENUS_NAME = "editor-menus";

const MAX_IMAGE_SIZE_MB = 5;
const PANEL_WIDTH = 288;
const PANEL_HEIGHT = 240;
const MENUBAR_HEIGHT = 48;
const PANEL_MARGIN = 3;

const styles = {
  layout: "flex flex-col h-screen",
  picker: "flex-1 min-h-0",
  dropzone:
    "flex flex-col items-center justify-center gap-4 rounded-lg bg-background p-6 text-foreground transition-colors select-none",
  dropzoneDragging: "bg-accent/70",
  dropzoneButton:
    "rounded-md border border-border bg-secondary px-3 py-1.5 text-sm text-secondary-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-95",
  placeholder: "text-sm text-muted-foreground",
  uploadError: "text-xs text-destructive",
  menubar: "flex w-full h-12 items-center gap-0.5 border-b border-border",
  menu: "group relative [&[open]>summary]:bg-muted",
  menuTrigger:
    "flex h-10 list-none items-center rounded-sm px-3 text-sm font-medium select-none outline-none hover:bg-muted [&::-webkit-details-marker]:hidden",
  menuContent:
    "absolute left-0 top-full z-50 mt-1 min-w-36 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10",
  menuItem:
    "relative flex w-full cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm select-none outline-none [&_svg]:size-4",
  menuItemHover:
    "hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
  menuItemDestructive:
    "text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive",
  menuSeparator: "-mx-1 my-1 h-px bg-border",
  menuShortcut: "ml-auto text-xs tracking-widest text-muted-foreground",
  preview:
    "relative flex items-center justify-center overflow-auto rounded-lg bg-background flex-1 min-h-0 p-5",
  previewImage: "object-contain",
  imageFooter: "flex items-center gap-2 px-3 py-2 text-sm",
  imageIcon: "shrink-0 text-muted-foreground",
  imageName: "flex-1 truncate text-muted-foreground",
  imageRemoveButton:
    "shrink-0 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors",
  panel: "fixed z-40 flex flex-col rounded-lg border bg-card text-card-foreground shadow-lg",
  panelHeader:
    "border-b px-3 py-2 cursor-grab select-none active:cursor-grabbing",
  panelTitle: "text-sm font-semibold truncate",
  panelBody: "flex-1 overflow-y-auto scrollbar-thin",
  panelFooter: "border-t",
  list: "min-h-[120px]",
  empty:
    "flex items-center justify-center h-[120px] text-xs text-muted-foreground",
  item: "group flex items-center gap-2 px-3 py-2 text-sm cursor-grab active:cursor-grabbing hover:bg-accent/50 transition-colors",
  itemSelected: "bg-accent/70",
  itemDragging: "opacity-40",
  dragHandle:
    "shrink-0 pointer-events-none text-muted-foreground/50 group-hover:text-muted-foreground",
  itemIcon: "shrink-0 pointer-events-none text-muted-foreground",
  itemName: "flex-1 truncate pointer-events-none",
  itemRemoveButton:
    "shrink-0 p-0.5 rounded opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity",
  params: "flex flex-col gap-3 p-3",
  paramsEmpty:
    "flex items-center justify-center h-[80px] text-xs text-muted-foreground",
  paramGroup: "flex flex-col gap-1.5",
  paramLabelRow: "flex items-center justify-between",
  paramLabel: "text-xs font-medium text-muted-foreground",
  paramValue: "text-xs font-mono text-foreground tabular-nums",
  paramSlider:
    "w-full h-1.5 rounded-full bg-muted appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:shadow-sm",
  paramSelect:
    "w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground cursor-pointer",
  paramReset:
    "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
} as const;

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Feevale DIP Techniques" },
    {
      name: "description",
      content:
        "A solution for managing and testing DIP techniques, applying techniques presented at the Feevale DIP conference.",
    },
  ];
}

function clampPanelPosition(x: number, y: number, panelHeight: number) {
  return {
    x: Math.max(PANEL_MARGIN, Math.min(x, window.innerWidth - PANEL_WIDTH - PANEL_MARGIN)),
    y: Math.max(
      MENUBAR_HEIGHT + PANEL_MARGIN,
      Math.min(y, window.innerHeight - panelHeight - PANEL_MARGIN)
    ),
  };
}

function FloatingPanel({
  title,
  children,
  footer,
  defaultPosition,
  height = 168,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  defaultPosition?: { x: number; y: number };
  height?: number;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(() =>
    clampPanelPosition(
      defaultPosition?.x ?? window.innerWidth - PANEL_WIDTH - PANEL_MARGIN,
      defaultPosition?.y ?? window.innerHeight - height - PANEL_MARGIN,
      height
    )
  );

  useEffect(() => {
    const handleResize = () =>
      setPosition((prev) => clampPanelPosition(prev.x, prev.y, height));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [height]);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".panel-handle"
      position={position}
      bounds={{
        left: PANEL_MARGIN,
        top: MENUBAR_HEIGHT + PANEL_MARGIN,
        right: window.innerWidth - PANEL_WIDTH - PANEL_MARGIN,
        bottom: window.innerHeight - height - PANEL_MARGIN,
      }}
      onDrag={(_, data) => setPosition({ x: data.x, y: data.y })}
    >
      <div
        ref={nodeRef}
        className={styles.panel}
        style={{ left: 0, top: 0, width: PANEL_WIDTH, height }}
      >
        <div className={`panel-handle ${styles.panelHeader}`}>
          <span className={styles.panelTitle}>{title}</span>
        </div>
        <div className={styles.panelBody}>{children}</div>
        {footer ? <div className={styles.panelFooter}>{footer}</div> : null}
      </div>
    </Draggable>
  );
}

function LayerRow({
  layer,
  index,
  selected,
  onSelect,
  onRemove,
}: {
  layer: CommandLayer;
  index: number;
  selected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const { ref, isDragging } = useSortable({ id: layer.id, index });
  const Icon = layer.command.icon;

  return (
    <li
      ref={ref}
      className={`${styles.item} ${isDragging ? styles.itemDragging : ""} ${
        selected ? styles.itemSelected : ""
      }`}
      onClick={() => onSelect(layer.id)}
    >
      <GripVertical size={14} className={styles.dragHandle} />
      <Icon size={14} className={styles.itemIcon} />
      <span className={styles.itemName}>{layer.command.label}</span>
      <button
        type="button"
        className={styles.itemRemoveButton}
        onClick={(event) => {
          event.stopPropagation();
          onRemove(layer.id);
        }}
        aria-label="Remover camada"
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
}

function closeMenu(element: Element | null) {
  const menu = element?.closest("details");
  if (menu instanceof HTMLDetailsElement) menu.open = false;
}

function CommandMenuItem({
  item,
  onCommandExecute,
}: {
  item: MenuItem;
  onCommandExecute: (item: MenuItem) => void;
}) {
  const Icon = item.command.icon;
  const className =
    item.variant === "destructive"
      ? `${styles.menuItem} ${styles.menuItemDestructive}`
      : `${styles.menuItem} ${styles.menuItemHover}`;

  return (
    <button
      type="button"
      className={className}
      onClick={(event) => {
        closeMenu(event.currentTarget);
        onCommandExecute(item);
      }}
    >
      <Icon />
      {item.command.label}
      {item.shortcut !== undefined ? (
        <span className={styles.menuShortcut}>{item.shortcut}</span>
      ) : null}
    </button>
  );
}

function CommandMenu({
  menu,
  onCommandExecute,
}: {
  menu: Menu;
  onCommandExecute: (item: MenuItem) => void;
}) {
  return (
    <details name={MENUS_NAME} className={styles.menu}>
      <summary className={styles.menuTrigger}>{menu.label}</summary>
      <div className={styles.menuContent}>
        {menu.items.map((entry, index) =>
          entry.type === "separator" ? (
            <div key={index} aria-hidden="true" className={styles.menuSeparator} />
          ) : (
            <CommandMenuItem
              key={entry.command.label}
              item={entry}
              onCommandExecute={onCommandExecute}
            />
          )
        )}
      </div>
    </details>
  );
}

function ParamSlider({
  schema,
  value,
  onChange,
}: {
  schema: NumberParamSchema;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className={styles.paramGroup}>
      <div className={styles.paramLabelRow}>
        <label className={styles.paramLabel}>{schema.label}</label>
        <span className={styles.paramValue}>{value}</span>
      </div>
      <input
        type="range"
        className={styles.paramSlider}
        min={schema.min}
        max={schema.max}
        step={schema.step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function ParamSelect({
  schema,
  value,
  onChange,
}: {
  schema: SelectParamSchema;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={styles.paramGroup}>
      <label className={styles.paramLabel}>{schema.label}</label>
      <select
        className={styles.paramSelect}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {schema.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function uploadErrorMessage(rejections: readonly FileRejection[]): string | undefined {
  const error = rejections[0]?.errors[0];
  if (!error) return undefined;
  return error.code === ErrorCode.FileTooLarge
    ? `A imagem deve ter no máximo ${MAX_IMAGE_SIZE_MB} MB.`
    : "Selecione um arquivo de imagem.";
}

export default function Home() {
  const [image, setImage] = useState<File>();
  const [originalCanvas, setOriginalCanvas] = useState<HTMLCanvasElement>();
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const handleImageLoad = useCallback((file: File | undefined) => {
    if (!file) return;
    setImage(file);
    fileToCanvas(file)
      .then((canvas) => {
        setOriginalCanvas(canvas);
        setLayers([createImageLayer(file)]);
      })
      .catch(() => {
        setImage(undefined);
        setOriginalCanvas(undefined);
      });
  }, []);

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    let cancelled = false;
    loadSampleImage()
      .then((file) => {
        if (!cancelled) handleImageLoad(file);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [handleImageLoad]);

  useEffect(() => {
    const selector = `details[name="${MENUS_NAME}"]`;
    const closeMenus = () => {
      document.querySelectorAll<HTMLDetailsElement>(`${selector}[open]`).forEach((menu) => {
        menu.open = false;
      });
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest(selector)) return;
      closeMenus();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenus();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleDrop = useCallback(
    (accepted: File[]) => {
      handleImageLoad(accepted[0]);
    },
    [handleImageLoad]
  );

  const { getRootProps, getInputProps, open, isDragActive, fileRejections } =
    useDropzone({
      accept: { "image/*": [] },
      maxSize: MAX_IMAGE_SIZE_MB * 1024 * 1024,
      multiple: false,
      noClick: true,
      onDrop: handleDrop,
    });

  const handleImageRemove = useCallback(() => {
    setImage(undefined);
    setOriginalCanvas(undefined);
    setLayers([]);
    setSelectedLayerId(null);
  }, []);

  const handleCommandExecute = useCallback(
    (item: MenuItem) => {
      if (!originalCanvas) return;
      const layer = createCommandLayer(item.command);
      setLayers((prev) => [...prev, layer]);
      setSelectedLayerId(layer.id);
    },
    [originalCanvas]
  );

  const handleLayerReorder = useCallback((fromIndex: number, toIndex: number) => {
    setLayers((prev) => reorderCommandLayers(prev, fromIndex, toIndex));
  }, []);

  const handleLayerRemove = useCallback((id: string) => {
    setLayers((prev) => removeLayer(prev, id));
    setSelectedLayerId((prev) => (prev === id ? null : prev));
  }, []);

  const handleLayerSelect = useCallback((id: string) => {
    setSelectedLayerId((prev) => (prev === id ? null : id));
  }, []);

  const handleLayerParamsUpdate = useCallback((id: string, params: any) => {
    setLayers((prev) => updateLayerParams(prev, id, params));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (event.canceled) return;
    const source = event.operation.source;
    if (!source || !isSortable(source)) return;
    const { initialIndex, index } = source;
    if (initialIndex === index) return;
    handleLayerReorder(initialIndex, index);
  }, [handleLayerReorder]);

  const [processedCanvas, setProcessedCanvas] = useState<HTMLCanvasElement>();
  useEffect(() => {
    if (!originalCanvas) {
      setProcessedCanvas(undefined);
      return;
    }
    const frame = requestAnimationFrame(() =>
      setProcessedCanvas(applyLayers(originalCanvas, layers))
    );
    return () => cancelAnimationFrame(frame);
  }, [originalCanvas, layers]);
  const previewRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !processedCanvas) return;
    canvas.width = processedCanvas.width;
    canvas.height = processedCanvas.height;
    canvas.getContext("2d")?.drawImage(processedCanvas, 0, 0);
  }, [processedCanvas]);
  const commandLayers = useMemo(() => listCommandLayers(layers), [layers]);
  const imageLayer = useMemo(() => getImageLayer(layers), [layers]);
  const selectedLayer = useMemo(
    () => findLayer(layers, selectedLayerId),
    [layers, selectedLayerId]
  );
  const uploadError = uploadErrorMessage(fileRejections);

  return (
    <div className={styles.layout}>
      {image === undefined ? (
        <div
          {...getRootProps({
            className: `${styles.dropzone} ${styles.picker} ${
              isDragActive ? styles.dropzoneDragging : ""
            }`,
          })}
        >
          <input {...getInputProps()} />
          <p className={styles.placeholder}>Arraste e solte uma imagem aqui</p>
          <button
            type="button"
            onClick={open}
            className={styles.dropzoneButton}
          >
            Selecionar arquivo
          </button>
          {uploadError ? (
            <p className={styles.uploadError} role="alert">
              {uploadError}
            </p>
          ) : null}
        </div>
      ) : null}

      {image !== undefined ? (
        <nav className={styles.menubar} aria-label="Menus de edição">
          {menus.map((menu) => (
            <CommandMenu
              key={menu.label}
              menu={menu}
              onCommandExecute={handleCommandExecute}
            />
          ))}
        </nav>
      ) : null}

      {image !== undefined ? (
        <div className={styles.preview}>
          {processedCanvas !== undefined ? (
            <canvas
              ref={previewRef}
              className={styles.previewImage}
              role="img"
              aria-label="Preview"
            />
          ) : null}
        </div>
      ) : null}

      {image !== undefined && imageLayer !== undefined ? (
        <FloatingPanel title="Camadas" height={PANEL_HEIGHT} footer={
          <div className={styles.imageFooter}>
            <ImageIcon size={14} className={styles.imageIcon} />
            <span className={styles.imageName}>{imageLayer.image.name}</span>
            <button
              type="button"
              className={styles.imageRemoveButton}
              onClick={handleImageRemove}
              aria-label="Remover imagem"
            >
              <Trash2 size={14} />
            </button>
          </div>
        }>
          {commandLayers.length === 0 ? (
            <div className={styles.empty}>Nenhuma camada aplicada</div>
          ) : (
            <DragDropProvider onDragEnd={handleDragEnd}>
              <ul className={styles.list}>
                {commandLayers.map((layer, index) => (
                  <LayerRow
                    key={layer.id}
                    layer={layer}
                    index={index}
                    selected={selectedLayer?.id === layer.id}
                    onSelect={handleLayerSelect}
                    onRemove={handleLayerRemove}
                  />
                ))}
              </ul>
            </DragDropProvider>
          )}
        </FloatingPanel>
      ) : null}

      {selectedLayer !== undefined && selectedLayer.type === "command" ? (
        <FloatingPanel
          title={`${selectedLayer.command.label} — Parâmetros`}
          defaultPosition={{
            x: window.innerWidth - PANEL_WIDTH - PANEL_WIDTH - 6,
            y: window.innerHeight - 200 - 3,
          }}
          height={200}
        >
          {selectedLayer.command.params.length === 0 ? (
            <div className={styles.paramsEmpty}>
              Este comando não possui parâmetros editáveis
            </div>
          ) : (
            <div className={styles.params}>
              {selectedLayer.command.params.map((schema) =>
                schema.type === "number" ? (
                  <ParamSlider
                    key={schema.key}
                    schema={schema}
                    value={selectedLayer.params[schema.key]}
                    onChange={(value) =>
                      handleLayerParamsUpdate(selectedLayer.id, {
                        ...selectedLayer.params,
                        [schema.key]: value,
                      })
                    }
                  />
                ) : (
                  <ParamSelect
                    key={schema.key}
                    schema={schema}
                    value={selectedLayer.params[schema.key]}
                    onChange={(value) =>
                      handleLayerParamsUpdate(selectedLayer.id, {
                        ...selectedLayer.params,
                        [schema.key]: value,
                      })
                    }
                  />
                )
              )}
              <button
                type="button"
                className={styles.paramReset}
                onClick={() =>
                  handleLayerParamsUpdate(
                    selectedLayer.id,
                    selectedLayer.command.defaultParams
                  )
                }
              >
                <RotateCcw size={12} />
                Restaurar padrão
              </button>
            </div>
          )}
        </FloatingPanel>
      ) : null}
    </div>
  );
}
