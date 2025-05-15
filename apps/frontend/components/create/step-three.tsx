"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { useCreateVideo } from "@/lib/state/create-video-store";
import type { Language, Voice } from "@/lib/state/create-video-schema";
import { voices } from "@/lib/state/data";

export function StepThree() {
  const { form, updateField } = useCreateVideo();
  const [playing, setPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayVoice = (voiceId: string, audioSrc: string) => {
    if (playing === voiceId) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioSrc;
        audioRef.current.play();
        setPlaying(voiceId);
      }
    }
  };

  return (
    <div className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="text-xl font-serif">3. Language & Voice</legend>

        <div className="space-y-6">
          {/* Language Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-sans font-medium">Language</Label>
            <Select
              value={form.language}
              onValueChange={(value: Language) =>
                updateField("language", value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  <span className="flex items-center gap-2">🇺🇸 English</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <span className="flex items-center gap-2">🇺🇸 English</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Voice Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-sans font-medium">Voice</Label>
            <RadioGroup
              value={form.voice}
              onValueChange={(value: Voice) => updateField("voice", value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {voices.map((voice) => (
                <div
                  key={voice.id}
                  className="relative flex items-center gap-3 p-4 rounded-lg border border-input shadow-sm shadow-black/5 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                >
                  <RadioGroupItem
                    value={voice.id}
                    id={`voice-${voice.id}`}
                    className="order-1 after:absolute after:inset-0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handlePlayVoice(voice.id, voice.audioSrc)}
                    className="z-10"
                  >
                    {playing === voice.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="grid grow gap-1">
                    <Label
                      htmlFor={`voice-${voice.id}`}
                      className="font-medium"
                    >
                      {voice.name}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {voice.description}
                    </span>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </fieldset>

      {/* Hidden audio element for voice playback */}
      <audio ref={audioRef} onEnded={() => setPlaying(null)} />
    </div>
  );
}
