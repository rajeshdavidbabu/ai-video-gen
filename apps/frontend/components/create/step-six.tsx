"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useCreateVideo } from "@/lib/state/create-video-store";
import type { VideoBgMusic } from "@/lib/state/create-video-schema";
import { music } from "@/lib/state/data";

export function StepSix() {
  const { form, updateField } = useCreateVideo();
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayMusic = (styleId: string, audioSrc: string) => {
    if (playing === styleId) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioSrc;
        audioRef.current.currentTime = 0; // Start from beginning
        audioRef.current.play();
        setPlaying(styleId);
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  return (
    <div className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="text-xl font-serif">6. Background Music</legend>
        <RadioGroup
          value={form.music}
          onValueChange={(value: VideoBgMusic) => updateField("music", value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {music.map((music) => (
            <div
              key={music.id}
              className="relative flex items-center gap-3 p-4 rounded-lg border border-input shadow-sm shadow-black/5 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
            >
              <RadioGroupItem
                value={music.id}
                id={`music-${music.id}`}
                className="order-1 after:absolute after:inset-0"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handlePlayMusic(music.id, music.audioSrc)}
                className="z-10"
                disabled={music.id === "none"}
              >
                {playing === music.id ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <div className="grid grow gap-1">
                <Label htmlFor={`music-${music.id}`} className="font-medium">
                  {music.name}
                </Label>
                <span className="text-sm text-muted-foreground">
                  {music.description}
                </span>
              </div>
            </div>
          ))}
        </RadioGroup>
      </fieldset>

      {/* Hidden audio element for music playback */}
      <audio ref={audioRef} onEnded={() => setPlaying(null)} />
    </div>
  );
}
