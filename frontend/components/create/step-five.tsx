"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { useCreateVideo } from "@/lib/state/create-video-store";
import { fonts, colors, alignments } from "@/lib/state/data";
import type { CaptionAlignment, FontColor, FontFamily } from "@/lib/state/create-video-schema";

interface FontData {
  id: string;
  name: string;
  description: string;
  preview: string;
}

interface ColorData {
  id: string;
  name: string;
  description: string;
  preview: string;
  value: string;
}

interface CaptionAlignmentData {
  id: string;
  value: string;
  label: string;
  icon: React.ReactNode;
}

export function StepFive() {
  const { form, updateField } = useCreateVideo();

  return (
    <div className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="text-xl font-serif">5. Captions</legend>

        <div className="space-y-6">
          {/* Font Selection */}
          <div className="space-y-3">
            <Label
              className="text-sm font-sans font-medium"
              htmlFor="font-style-selection"
            >
              Pick a font style
            </Label>
            <RadioGroup
              id="font-style-selection"
              value={form.fontFamily}
              onValueChange={(value: FontFamily) => updateField("fontFamily", value)}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {fonts.map((font) => (
                <div
                  key={font.id}
                  className="relative rounded-xl border border-input shadow-sm shadow-black/5 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 overflow-hidden"
                >
                  <Label
                    htmlFor={`font-${font.id}`}
                    className="block cursor-pointer"
                  >
                    <div className="relative w-full aspect-[3/2] bg-white">
                      <Image
                        src={font.preview}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover w-full h-full"
                        priority
                      />
                    </div>
                    <div className="p-4 flex justify-between items-start">
                      <div className="grid grow gap-1">
                        <Label
                          className="font-medium cursor-pointer"
                          htmlFor={`font-${font.id}`}
                        >
                          {font.name}
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {font.description}
                        </span>
                      </div>
                      <RadioGroupItem
                        value={font.id}
                        id={`font-${font.id}`}
                        className="mt-1"
                      />
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-sans font-medium">
              Pick a color
            </Label>
            <RadioGroup
              value={form.fontColor}
              onValueChange={(value: FontColor) => updateField("fontColor", value)}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {colors.map((color) => (
                <div
                  key={color.id}
                  className="relative rounded-xl border border-input shadow-sm shadow-black/5 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 overflow-hidden"
                >
                  <Label
                    htmlFor={`color-${color.id}`}
                    className="block cursor-pointer"
                  >
                    <div className="relative aspect-[2/1] w-full">
                      <Image
                        src={color.preview}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        priority
                      />
                    </div>
                    <div className="p-4 flex justify-between items-start w-full">
                      <div className="grid grow gap-1">
                        <Label
                          className="font-medium cursor-pointer"
                          htmlFor={`color-${color.id}`}
                        >
                          {color.name}
                        </Label>
                        <span className="text-sm text-muted-foreground">
                          {color.description}
                        </span>
                      </div>
                      <RadioGroupItem
                        value={color.id}
                        id={`color-${color.id}`}
                        className="mt-1"
                      />
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Caption Alignment */}
          <div className="space-y-3">
            <Label className="text-sm font-sans font-medium">
              Caption alignment
            </Label>
            <RadioGroup
              value={form.captionAlignment}
              onValueChange={(value: CaptionAlignment) =>
                updateField("captionAlignment", value)
              }
              className="grid grid-cols-3 gap-2"
            >
              {alignments.map((item) => (
                <Label
                  key={item.id}
                  className="relative flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-input px-2 py-3 text-center shadow-sm shadow-black/5 outline-offset-2 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ring/70"
                >
                  <RadioGroupItem
                    id={item.id}
                    value={item.value}
                    className="sr-only after:absolute after:inset-0"
                  />
                  {item.icon}
                  <p className="text-sm font-medium leading-none text-foreground">
                    {item.label}
                  </p>
                </Label>
              ))}
            </RadioGroup>
          </div>
        </div>
      </fieldset>
    </div>
  );
}
