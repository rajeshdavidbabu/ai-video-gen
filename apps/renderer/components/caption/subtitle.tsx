import type React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Word } from "./word";
import type {
  WordTiming,
  FontColor,
  CaptionAlignment,
  FontSize,
} from "@/types";

export interface SubtitleProps {
  text: string;
  words: WordTiming[];
  startFrame: number;
  fontFamily: string;
  fontColor: FontColor;
  captionAlignment: CaptionAlignment;
  fontSize: FontSize;
}

const Subtitle: React.FC<SubtitleProps> = ({
  text,
  words,
  startFrame,
  fontFamily,
  fontColor,
  captionAlignment,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteFrame = frame + startFrame; // Calculate absolute frame
  const currentTimeMs = (absoluteFrame / fps) * 1000 + 100; // Add 200ms to make the animation start earlier

  const enter = spring({
    frame,
    fps,
    config: {
      damping: 35,
    },
    durationInFrames: 10,
  });

  // Split text into array of words and their active states with timing
  const wordsWithStates = text.split(" ").map((_, index) => {
    const wordTiming = words[index];
    const hasBeenRead = currentTimeMs >= wordTiming.startMs;

    // Calculate the frame when this word starts
    const wordStartFrame = Math.floor((wordTiming.startMs / 1000) * fps) - startFrame;
    const wordEndFrame = Math.floor((wordTiming.endMs / 1000) * fps) - startFrame;

    return { 
      word: wordTiming.text, 
      startFrame: wordStartFrame,
      endFrame: wordEndFrame,
    };
  });

  // Overlay stroked text with normal text to create an effect where the stroke is outside
  return (
    <AbsoluteFill>
      <AbsoluteFill>
        <Word
          enterProgress={enter}
          words={wordsWithStates}
          stroke
          fontFamily={fontFamily}
          fontColor={fontColor}
          fontSize={fontSize}
          captionAlignment={captionAlignment}
        />
      </AbsoluteFill>
      <AbsoluteFill>
        <Word
          enterProgress={enter}
          words={wordsWithStates}
          stroke={false}
          fontFamily={fontFamily}
          fontColor={fontColor}
          fontSize={fontSize}
          captionAlignment={captionAlignment}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default Subtitle;
