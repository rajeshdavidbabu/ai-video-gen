"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { useCreateVideo } from "@/lib/state/create-video-store";
import type { VideoStyle } from "@/lib/state/create-video-schema";
import { styles } from "@/lib/state/data";

export function StepFour() {
  const { form, updateField } = useCreateVideo();

  return (
    <div className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="text-xl font-serif">4. Style</legend>
        <div className="space-y-3">
          <Label className="text-sm font-sans font-medium">
            Pick an AI generated image style
          </Label>
          <RadioGroup
            value={form.style}
            onValueChange={(value: VideoStyle) => updateField("style", value)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {styles.map((style) => (
              <div
                key={style.id}
                className="relative rounded-xl border border-input shadow-sm shadow-black/5 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 overflow-hidden"
              >
                <Label
                  htmlFor={`style-${style.id}`}
                  className="block cursor-pointer"
                >
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src={style.images[0]}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="p-4 flex justify-between items-start">
                    <div className="grid grow gap-1">
                      <Label
                        className="font-medium cursor-pointer"
                        htmlFor={`style-${style.id}`}
                      >
                        {style.name}
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        {style.description}
                      </span>
                    </div>
                    <RadioGroupItem
                      value={style.id}
                      id={`style-${style.id}`}
                      className="mt-1"
                    />
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </fieldset>
    </div>
  );
}
