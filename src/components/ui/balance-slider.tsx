"use client";

import React, { useRef, useState } from "react";
import { Slider } from "@/components/ui/slider";
import NumberFlow from "@number-flow/react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="w-full space-y-3 py-1">
      {/* Header — label + price + reset button */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {label}
            </span>
            {badge && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1 text-slate-100 font-bold tabular-nums text-xl">
            {formatAsCurrency && <span className="text-slate-400 font-normal">$</span>}
            <NumberFlow value={value} />
          </div>
        </div>

        {onReset && defaultValue !== undefined && (
          <Button
            variant="outline"
            size="xs"
            onClick={onReset}
            disabled={isDefault}
            className="cursor-pointer text-slate-400 hover:text-slate-100 border-slate-700 bg-slate-800/60"
            title="Reset to preset default"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Slider Track with Ghost Preview */}
      <div className="space-y-1.5">
        <div
          ref={rootRef}
          className="relative w-full py-1 cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setPreview(null)}
        >
          <Slider
            value={[value]}
            onValueChange={(val) => onChange(Array.isArray(val) ? val[0] : val)}
            min={min}
            max={max}
            step={step}
            className="w-full"
          />

          {previewPct !== null && ghostWidth > 0 && (
            <div
              className="pointer-events-none absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-blue-500/30 transition-[left,width] duration-75 z-0"
              style={{ left: `${ghostLeft}%`, width: `${ghostWidth}%` }}
            />
          )}
        </div>

        {/* Milestone Labels */}
        <div className="flex justify-between text-[11px] font-mono text-slate-500 select-none">
          {labels.map((val) => (
            <span key={val}>{formatShort(val)}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BalanceSlider;
