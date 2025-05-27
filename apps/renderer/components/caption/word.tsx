import type React from "react";
import { AbsoluteFill, interpolate, useVideoConfig, useCurrentFrame } from "remotion";
import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import {
  fontColorToTailwindColorMap,
  fontSizeToTailwindSizeMap,
} from "../../lib/config-entity-map";
import type { CaptionAlignment, FontColor, FontSize } from "@/types";

interface WordWithState {
  word: string;
  startFrame: number; // frame when the word starts being spoken (relative to the current Sequence)
  endFrame: number;   // frame when the word stops being spoken (relative to the current Sequence)
}

export interface WordProps {
  enterProgress: number;
  stroke: boolean;
  words: WordWithState[];
  fontFamily: string;
  fontColor: FontColor;
  fontSize: FontSize;
  captionAlignment: CaptionAlignment;
}

export const Word: React.FC<WordProps> = ({
  enterProgress,
  stroke,
  words,
  fontFamily,
  fontColor,
  fontSize,
  captionAlignment,
}) => {
  const { width } = useVideoConfig();
  const frame = useCurrentFrame();

  const transformStyle = makeTransform([
    scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
    translateY(interpolate(enterProgress, [0, 1], [50, 0])),
  ]);

  const fontColorHex = fontColorToTailwindColorMap[fontColor];
  const fontSizeValue = fontSizeToTailwindSizeMap[fontSize];

  return (
    <AbsoluteFill
      className="flex justify-center items-center h-full"
      style={
        captionAlignment === "center"
          ? {
              top: undefined,
              bottom: undefined,
            }
          : {
              top: captionAlignment === "top" ? undefined : 600,
              bottom: captionAlignment === "bottom" ? undefined : 600,
            }
      }
    >
      <div
        className={"uppercase text-center break-words max-w-[80%]"}
        style={{
          fontFamily,
          transform: transformStyle,
          fontSize: fontSizeValue,
          lineHeight: 1,
          WebkitTextStroke: stroke ? "5px black" : "none",
          zIndex: stroke ? 1 : 2,
        }}
      >
        {words.map((wordData, index) => {
          // Determine the scale for this frame based on the word timing
          const scaleInOutFrames = 6; // frames to scale in and out (0.2s at 30fps)

          // Default scale
          let wordScale = 1;

          if (frame >= wordData.startFrame && frame <= wordData.endFrame) {
            // Word is currently being spoken
            const t = interpolate(
              frame,
              [wordData.startFrame, wordData.startFrame + scaleInOutFrames],
              [1, 1.1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            const tOut = interpolate(
              frame,
              [wordData.endFrame - scaleInOutFrames, wordData.endFrame],
              [1.1, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            // During middle frames hold at 1.1, else use in/out values
            wordScale = frame < wordData.startFrame + scaleInOutFrames ? t : tOut;
          }

          return (
            <span
              key={`${wordData.word}-${index}`}
              className={"inline-block relative drop-shadow-lg"}
              style={{
                filter: frame >= wordData.startFrame ? "none" : "brightness(0.7)",
                color: frame >= wordData.startFrame ? fontColorHex : "white",
                padding: "0.2em",
                borderRadius: "0.1em",
                textRendering: "geometricPrecision",
                textShadow: "0 0 10px #333",
                transform: `scale(${wordScale})`
              }}
            >
              {wordData.word}
              {index < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
