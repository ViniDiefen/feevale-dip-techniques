import { RotateCcw } from "lucide-react";
import type { NumberParamSchema, SelectParamSchema } from "@/commands/types";
import type { CommandLayer } from "@/layers/types";
import { FloatingPanel, PANEL_WIDTH } from "./FloatingPanel";

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

export function CommandParamsPanel({
  layer,
  onParamsChange,
}: {
  layer: CommandLayer;
  onParamsChange: (params: any) => void;
}) {
  return (
    <FloatingPanel
      title={`${layer.command.label} — Parâmetros`}
      defaultPosition={{
        x: window.innerWidth - PANEL_WIDTH - PANEL_WIDTH - 6,
        y: window.innerHeight - 200 - 3,
      }}
      height={200}
    >
      {layer.command.params.length === 0 ? (
        <div className={styles.paramsEmpty}>
          Este comando não possui parâmetros editáveis
        </div>
      ) : (
        <div className={styles.params}>
          {layer.command.params.map((schema) =>
            schema.type === "number" ? (
              <ParamSlider
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
            ) : (
              <ParamSelect
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
            )
          )}
          <button
            type="button"
            className={styles.paramReset}
            onClick={() => onParamsChange(layer.command.defaultParams)}
          >
            <RotateCcw size={12} />
            Restaurar padrão
          </button>
        </div>
      )}
    </FloatingPanel>
  );
}
