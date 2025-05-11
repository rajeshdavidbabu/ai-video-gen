"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCreateVideo } from "@/lib/state/create-video-store";
import type { TargetLength } from "@/lib/state/create-video-schema";
import { lengths } from "@/lib/state/data";

export function StepOne() {
  const { form, updateField } = useCreateVideo();

  return (
    <div className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="text-xl font-serif">1. Target length</legend>
        <RadioGroup
          className="grid grid-cols-2 gap-3"
          value={form.targetLength}
          onValueChange={(value: TargetLength) =>
            updateField("targetLength", value)
          }
        >
          {lengths.map((length) => (
            <Label
              key={length.id}
              className="relative flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-input px-4 py-2 text-center shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring/70 has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50"
            >
              <RadioGroupItem
                id={length.id}
                value={length.value}
                className="sr-only after:absolute after:inset-0"
                disabled={length.value !== "short"}
              />
              <span className="text-sm font-medium leading-none text-foreground">
                {length.label}
                {length.value !== "short" && (
                  <div className="ml-2 text-xs text-muted-foreground">
                    (Coming soon)
                  </div>
                )}
              </span>
            </Label>
          ))}
        </RadioGroup>
      </fieldset>
    </div>
  );
}
