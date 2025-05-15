"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { useCreateVideo } from "@/lib/state/create-video-store";
import {
  CONTENT_LIMITS,
  type ContentUnion,
} from "@/lib/state/create-video-schema";

export function StepTwo() {
  const { form, setContentType, setPromptText, setScriptText } =
    useCreateVideo();

  const prompt = useCharacterLimit({
    maxLength: CONTENT_LIMITS.PROMPT_LIMIT,
    initialValue:
      form.content.contentType === "prompt" ? form.content.text : "",
    onChange: (value) => setPromptText(value),
  });

  const script = useCharacterLimit({
    maxLength: CONTENT_LIMITS.SCRIPT_LIMIT,
    initialValue:
      form.content.contentType === "script" ? form.content.text : "",
    onChange: (value) => setScriptText(value),
  });

  return (
    <div className="space-y-8">
      <fieldset className="space-y-4">
        <legend className="text-xl font-serif">2. Content Setup (Required)</legend>

        <Tabs
          value={form.content.contentType}
          onValueChange={(value) => setContentType(value as ContentUnion["contentType"])}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="script">Script</TabsTrigger>
          </TabsList>

          {/* Prompt Content */}
          <TabsContent value="prompt" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-sm font-sans font-medium">
                Let AI generate a script from the prompt
              </Label>
              <Textarea
                id="prompt"
                placeholder="Eg: Create an engaging script about the holy roman empire and how it shaped the modern world. Hook the audience with a compelling starter."
                value={prompt.value}
                maxLength={CONTENT_LIMITS.PROMPT_LIMIT}
                onChange={prompt.handleChange}
                className="w-full min-h-[100px] p-3 rounded-lg border resize-none"
                aria-describedby="prompt-characters-left"
              />
              <span
                id="prompt-characters-left"
                className="text-right text-xs text-muted-foreground"
                aria-live="polite"
              >
                <span className="tabular-nums">
                  {CONTENT_LIMITS.PROMPT_LIMIT - prompt.characterCount}
                </span>{" "}
                characters left (approximately{" "}
                {Math.floor(
                  (CONTENT_LIMITS.PROMPT_LIMIT - prompt.characterCount) / 5
                )}{" "}
                words)
              </span>
            </div>
          </TabsContent>

          {/* Script Content */}
          <TabsContent value="script" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="script" className="text-sm font-sans font-medium">
                Enter full script
              </Label>
              <Textarea
                id="script"
                placeholder="Eg: Before Christianity reached Scandinavia, the region was dominated by Norse mythology and pagan traditions..."
                value={script.value}
                maxLength={CONTENT_LIMITS.SCRIPT_LIMIT}
                onChange={script.handleChange}
                className="w-full min-h-[100px] p-3 rounded-lg border resize-none"
                aria-describedby="script-characters-left"
              />
              <span
                id="script-characters-left"
                className="text-right text-xs text-muted-foreground"
                aria-live="polite"
              >
                <span className="tabular-nums">
                  {CONTENT_LIMITS.SCRIPT_LIMIT - script.characterCount}
                </span>{" "}
                characters left (approximately{" "}
                {Math.floor(
                  (CONTENT_LIMITS.SCRIPT_LIMIT - script.characterCount) / 5
                )}{" "}
                words)
              </span>
            </div>
          </TabsContent>
        </Tabs>
      </fieldset>
    </div>
  );
}
