"use client";

import React, { useRef, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import NumberFlow from "@number-flow/react";
import { RotateCcw } from "lucide-react";

interface BalanceSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange: (value: number) => void;
  onReset?: () => void;
  badge?: string;
  formatAsCurrency?: boolean;
}

export function BalanceSlider({
  label,
  value,
  min = 1000000,
  max = 50000000,
  step = 250000,
  defaultValue,
  onChange,
  onReset,
  badge,
  formatAsCurrency = true,
}: BalanceSliderProps) {
  const [preview, setPreview] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const isDefault = defaultValue !== undefined ? value === defaultValue : false;

  const toPct = (v: number) => ((v - min) / (max - min)) * 100;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const raw = ((e.clientX - rect.left) / rect.width) * (max - min) + min;
    const clamped = Math.max(min, Math.min(max, Math.round((raw - min) / step) * step + min));
    setPreview(clamped);
  };

  const currentPct = toPct(value);
  const previewPct = preview !== null ? toPct(preview) : null;

  let ghostLeft = 0;
  let ghostWidth = 0;
  if (previewPct !== null) {
    if (previewPct < currentPct) {
      ghostLeft = previewPct;
      ghostWidth = currentPct - previewPct;
    } else if (previewPct > currentPct) {
      ghostLeft = currentPct;
      ghostWidth = previewPct - currentPct;
    }
  }

  const stepsCount = 5;
  const labels: number[] = [];
  for (let i = 0; i < stepsCount; i++) {
    const rawVal = min + (i * (max - min)) / (stepsCount - 1);
    const rounded = Math.round((rawVal - min) / step) * step + min;
    if (!labels.includes(rounded)) labels.push(rounded);
  }

  const formatShort = (v: number) => {
    if (v >= 1000000) return `$${(v / 1000000).toFixed(0)}M`;
    if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
    return `$${v}`;
  };

  return (
    <div className="balance-slider-card">
      {/* Header — label + amount + reset button */}
      <div className="balance-slider-header">
        <div>
          <div className="balance-title-row">
            <span className="balance-title-text">{label}</span>
            {badge && <span className="balance-witness-badge">{badge}</span>}
          </div>
          <div className="balance-amount-display">
            {formatAsCurrency && <span style={{ color: "#94a3b8", fontWeight: 400 }}>$</span>}
            <NumberFlow value={value} />
          </div>
        </div>

        {onReset && defaultValue !== undefined && (
          <button
            type="button"
            onClick={onReset}
            disabled={isDefault}
            className="balance-reset-btn"
            title="Reset to preset default"
          >
            <RotateCcw style={{ width: "12px", height: "12px" }} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Slider Track with Ghost Preview */}
      <div style={{ position: "relative", width: "100%", padding: "4px 0" }}>
        <div
          ref={rootRef}
          style={{ position: "relative", width: "100%" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setPreview(null)}
        >
          <SliderPrimitive.Root
            value={[value]}
            onValueChange={(val) => onChange(Array.isArray(val) ? val[0] : val)}
            min={min}
            max={max}
            step={step}
            data-radix-slider-root=""
          >
            <SliderPrimitive.Track data-radix-slider-track="">
              <SliderPrimitive.Range data-radix-slider-range="" />
            </SliderPrimitive.Track>
            <SliderPrimitive.Thumb data-radix-slider-thumb="" />
          </SliderPrimitive.Root>

          {previewPct !== null && ghostWidth > 0 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                height: "8px",
                borderRadius: "9999px",
                backgroundColor: "rgba(59, 130, 246, 0.35)",
                left: `${ghostLeft}%`,
                width: `${ghostWidth}%`,
                pointerEvents: "none",
                zIndex: 0,
                transition: "left 75ms ease, width 75ms ease",
              }}
            />
          )}
        </div>

        {/* Milestone Labels */}
        <div className="balance-milestones-row">
          {labels.map((val) => (
            <span key={val}>{formatShort(val)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BalanceSlider;
