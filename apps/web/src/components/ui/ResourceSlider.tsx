import * as s from './ResourceSlider.css';

interface ResourceSliderProps {
  label: string;
  steps: number[];
  value: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  disabled?: boolean;
}

export function ResourceSlider({ label, steps, value, format, onChange, disabled }: ResourceSliderProps) {
  const index = steps.indexOf(value);
  const currentIndex = index === -1 ? 0 : index;

  return (
    <div className={s.container}>
      <div className={s.labelRow}>
        <span className={s.label}>{label}</span>
        <span className={s.value}>{format(value)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={steps.length - 1}
        step={1}
        value={currentIndex}
        onChange={(e) => onChange(steps[parseInt(e.target.value, 10)])}
        disabled={disabled}
        className={s.slider}
      />
    </div>
  );
}
