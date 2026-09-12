"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

import type { SurveyOption } from "./survey-steps";

type SingleChoiceFieldProps = {
  name: string;
  options: SurveyOption[];
  value: string;
  onChange: (value: string) => void;
};

export function SingleChoiceField({
  name,
  options,
  value,
  onChange,
}: SingleChoiceFieldProps) {
  return (
    <RadioGroup
      aria-labelledby="survey-question-title"
      className="grid gap-3 sm:grid-cols-2"
      name={name}
      onValueChange={onChange}
      value={value}
    >
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        const isSelected = value === option.value;

        return (
          <Label
            className={cn(
              "min-h-16 cursor-pointer border bg-card px-4 py-3 text-base leading-snug font-medium transition-colors hover:border-primary/60 hover:bg-secondary/60",
              isSelected && "border-primary bg-secondary text-primary",
            )}
            htmlFor={id}
            key={option.value}
          >
            <RadioGroupItem id={id} value={option.value} />
            <span>{option.label}</span>
          </Label>
        );
      })}
    </RadioGroup>
  );
}

type MultipleChoiceFieldProps = {
  name: string;
  options: SurveyOption[];
  values: string[];
  onChange: (values: string[]) => void;
};

export function MultipleChoiceField({
  name,
  options,
  values,
  onChange,
}: MultipleChoiceFieldProps) {
  function toggleValue(optionValue: string, checked: boolean) {
    onChange(
      checked
        ? [...values, optionValue]
        : values.filter((value) => value !== optionValue),
    );
  }

  return (
    <div
      aria-labelledby="survey-question-title"
      className="grid gap-3 sm:grid-cols-2"
      role="group"
    >
      {options.map((option) => {
        const id = `${name}-${option.value}`;
        const isSelected = values.includes(option.value);

        return (
          <Label
            className={cn(
              "min-h-16 cursor-pointer border bg-card px-4 py-3 text-base leading-snug font-medium transition-colors hover:border-primary/60 hover:bg-secondary/60",
              isSelected && "border-primary bg-secondary text-primary",
            )}
            htmlFor={id}
            key={option.value}
          >
            <Checkbox
              checked={isSelected}
              className="rounded-none"
              id={id}
              onCheckedChange={(checked) =>
                toggleValue(option.value, checked)
              }
            />
            <span>{option.label}</span>
          </Label>
        );
      })}
    </div>
  );
}

type ConcentrationFieldProps = {
  value: number;
  onChange: (value: number) => void;
};

export function ConcentrationField({
  value,
  onChange,
}: ConcentrationFieldProps) {
  return (
    <div className="border bg-card px-5 py-8 sm:px-8 sm:py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Current rating
          </p>
          <output
            aria-live="polite"
            className="font-mono text-5xl font-semibold tracking-tighter text-primary"
          >
            {value}
          </output>
        </div>
        <p className="max-w-40 text-right text-sm text-muted-foreground">
          {value <= 3
            ? "Easily distracted"
            : value <= 7
              ? "Moderately focused"
              : "Deeply focused"}
        </p>
      </div>

      <Slider
        aria-label="Concentration rating"
        className="[&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:rounded-none [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:rounded-none"
        max={10}
        min={1}
        onValueChange={(nextValue) =>
          onChange(
            typeof nextValue === "number"
              ? nextValue
              : (nextValue[0] ?? 1),
          )
        }
        step={1}
        value={[value]}
      />

      <div className="mt-4 flex justify-between gap-4 font-mono text-sm text-muted-foreground">
        <span>1 · Easily distracted</span>
        <span className="text-right">10 · Deeply focused</span>
      </div>
    </div>
  );
}
