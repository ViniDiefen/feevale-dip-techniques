import { RotateCcw } from "lucide-react";
import type {
  NumberParamSchema,
  ParamSchema,
  SegmentedParamSchema,
  SelectParamSchema,
} from "@/commands/types";
import type { Layer } from "@/layers/types";
import { FloatingPanel, PANEL_HEIGHT, PANEL_MARGIN, PANEL_WIDTH } from "./FloatingPanel";

const styles = {
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
  paramSegmented: "flex gap-1 rounded-md bg-muted p-1",
  paramSegment:
    "flex flex-1 items-center justify-center rounded py-1.5 cursor-pointer transition-colors",
  paramSegmentActive: "bg-background shadow-sm",
  paramSegmentInactive: "hover:bg-background/60",
  paramReset:
    "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
} as const;

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

function ParamSegmented({
  schema,
  value,
  onChange,
}: {
  schema: SegmentedParamSchema;
  value: string;
  onChange: (value: string) => void;
}) {
  const selected = schema.options.find((option) => option.value === value);
  return (
    <div className={styles.paramGroup}>
      <div className={styles.paramLabelRow}>
        <label className={styles.paramLabel}>{schema.label}</label>
        <span className={styles.paramValue}>{selected?.label}</span>
      </div>
      <div className={styles.paramSegmented} role="radiogroup" aria-label={schema.label}>
        {schema.options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={option.value === value}
            aria-label={option.label}
            title={option.label}
            className={`${styles.paramSegment} ${option.value === value ? styles.paramSegmentActive : styles.paramSegmentInactive}`}
            onClick={() => onChange(option.value)}
          >
            {option.icon ? <option.icon size={14} /> : option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Param({
  schema,
  value,
  onChange,
}: {
  schema: ParamSchema;
  value: any;
  onChange: (value: any) => void;
}) {
  switch (schema.type) {
    case "number":
      return <ParamSlider schema={schema} value={value} onChange={onChange} />;
    case "select":
      return <ParamSelect schema={schema} value={value} onChange={onChange} />;
    case "segmented":
      return <ParamSegmented schema={schema} value={value} onChange={onChange} />;
  }
}

export function CommandParamsPanel({
  layer,
  onParamsChange,
}: {
  layer: Layer;
  onParamsChange: (params: any) => void;
}) {
  return (
    <FloatingPanel
      title={`${layer.command.label} — Parameters`}
      defaultPosition={{
        // To the left of the layers panel.
        x: window.innerWidth - 2 * PANEL_WIDTH - 2 * PANEL_MARGIN,
        y: window.innerHeight - PANEL_HEIGHT - PANEL_MARGIN,
      }}
      height={PANEL_HEIGHT}
    >
      {layer.command.params.length === 0 ? (
        <div className={styles.paramsEmpty}>
          This command has no editable parameters
        </div>
      ) : (
        <div className={styles.params}>
          {layer.command.params.map((schema) => (
            <Param
              key={schema.key}
              schema={schema}
              value={layer.params[schema.key]}
              onChange={(value) =>
                onParamsChange({
                  ...layer.params,
                  [schema.key]: value,
                })
              }
            />
          ))}
          <button
            type="button"
            className={styles.paramReset}
            onClick={() => onParamsChange(layer.command.defaultParams)}
          >
            <RotateCcw size={12} />
            Reset to default
          </button>
        </div>
      )}
    </FloatingPanel>
  );
}
