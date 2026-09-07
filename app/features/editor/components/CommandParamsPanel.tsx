import { RotateCcw } from "lucide-react";
import type { CommandLayer } from "@/layers/types";
import type { NumberParamSchema, SelectParamSchema } from "@/commands/types";

const styles = {
  container: "flex flex-col gap-3 p-3",
  empty: "flex items-center justify-center h-[80px] text-xs text-muted-foreground",
  paramGroup: "flex flex-col gap-1.5",
  labelRow: "flex items-center justify-between",
  label: "text-xs font-medium text-muted-foreground",
  value: "text-xs font-mono text-foreground tabular-nums",
  slider: "w-full h-1.5 rounded-full bg-muted appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background [&::-moz-range-thumb]:shadow-sm",
  select: "w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground cursor-pointer",
  resetButton: "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
} as const;

interface CommandParamsPanelProps {
  layer: CommandLayer;
  onParamsUpdate: (params: any) => void;
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
      <div className={styles.labelRow}>
        <label className={styles.label}>{schema.label}</label>
        <span className={styles.value}>{value}</span>
      </div>
      <input
        type="range"
        className={styles.slider}
        min={schema.min}
        max={schema.max}
        step={schema.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
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
      <label className={styles.label}>{schema.label}</label>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {schema.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CommandParamsPanel({ layer, onParamsUpdate }: CommandParamsPanelProps) {
  const { command, params } = layer;

  if (command.params.length === 0) {
    return <div className={styles.empty}>Este comando não possui parâmetros editáveis</div>;
  }

  const handleParamChange = (key: string, value: any) => {
    onParamsUpdate({ ...params, [key]: value });
  };

  const handleReset = () => {
    onParamsUpdate(command.defaultParams);
  };

  return (
    <div className={styles.container}>
      {command.params.map((schema) =>
        schema.type === "number" ? (
          <ParamSlider
            key={schema.key}
            schema={schema}
            value={params[schema.key]}
            onChange={(value) => handleParamChange(schema.key, value)}
          />
        ) : (
          <ParamSelect
            key={schema.key}
            schema={schema}
            value={params[schema.key]}
            onChange={(value) => handleParamChange(schema.key, value)}
          />
        )
      )}
      <button className={styles.resetButton} onClick={handleReset}>
        <RotateCcw size={12} />
        Restaurar padrão
      </button>
    </div>
  );
}
