import type React from "react";
import type { Caption } from "@remotion/captions";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import Subtitle from "./subtitle";
import type { VideoCaptionsProps, CombinedToken } from "@/types";
import type { Captions } from "@/types";

const convertCaptions = (data: Captions): Caption[] => {
  return data.results.channels[0].alternatives[0].words.map((word) => ({
    text: word.punctuated_word,
    startMs: word.start * 1000,
    endMs: word.end * 1000,
    timestampMs: null,
    confidence: null,
  }));
};

const combineTokens = (
  captions: Caption[],
  maxGapMs: number,
  maxWords = 3
): CombinedToken[] => {
  const combinedTokens: CombinedToken[] = [];
  let currentToken: CombinedToken | null = null;
  let wordCount = 0;

  for (const caption of captions) {
    if (
      !currentToken ||
      wordCount >= maxWords ||
      caption.startMs - currentToken.endMs > maxGapMs
    ) {
      if (currentToken) {
        combinedTokens.push(currentToken);
      }
      currentToken = {
        ...caption,
        text: caption.text,
        words: [
          {
            text: caption.text,
            startMs: caption.startMs,
            endMs: caption.endMs,
          },
        ],
      };
      wordCount = 1;
    } else {
      currentToken.text += ` ${caption.text}`;
      currentToken.endMs = caption.endMs;
      currentToken.words.push({
        text: caption.text,
        startMs: caption.startMs,
        endMs: caption.endMs,
      });
      wordCount++;
    }
  }

  if (currentToken) {
    combinedTokens.push(currentToken);
  }

  return combinedTokens;
};

export const VideoCaptions: React.FC<VideoCaptionsProps> = ({
  captions,
  fontFamily,
  fontColor,
  captionAlignment,
  fontSize,
}) => {
  const { fps } = useVideoConfig();

  const convertedCaptions = convertCaptions(captions);
  const combinedTokens = combineTokens(convertedCaptions, 200);

  return (
    <AbsoluteFill>
      {combinedTokens.map((token, index) => {
        const nextToken = combinedTokens[index + 1] ?? null;
        const tokenStartFrame = Math.round((token.startMs / 1000) * fps);
        const tokenEndFrame = Math.round(
          Math.min(
            nextToken
              ? (nextToken.startMs / 1000) * fps
              : Number.POSITIVE_INFINITY,
            (token.endMs / 1000) * fps
          )
        );
        const durationInFrames = tokenEndFrame - tokenStartFrame;

        if (durationInFrames <= 0) {
          console.warn(`Token ${index} has invalid duration:`, token);
          return null;
        }

        return (
          <Sequence
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            from={tokenStartFrame}
            durationInFrames={durationInFrames}
          >
            <Subtitle
              text={token.text}
              words={token.words}
              startFrame={tokenStartFrame}
              fontFamily={fontFamily}
              fontColor={fontColor}
              captionAlignment={captionAlignment}
              fontSize={fontSize}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
