import {
  AbsoluteFill,
  useVideoConfig,
  Audio,
  continueRender,
  delayRender,
  prefetch,
} from "remotion";
import React, {useEffect, useState} from "react";
import { VideoCaptions } from "../caption";
import type { SimpleVideoSchema } from "../../lib/schema/simple-video";
import type { z } from "zod";
import { loadFont } from "../../lib/load-font";
import { BackgroundMusic } from "../bg-music/default";
import {
  MIN_SEQUENCE_DURATION,
  TRANSITION_DURATION,
} from "../video-transitions/fade";
import {
  transitionToComponentMap,
  imageEffectToComponentMap,
  overlayToComponentMap,
} from "../../lib/config-entity-map";

export const SimpleVideo: React.FC<z.infer<typeof SimpleVideoSchema>> = ({
  imageUrls,
  backgroundMusicUrl,
  narrationUrl,
  captions,
  fontFamily,
  fontColor,
  captionAlignment,
  overlay,
  transition,
  imageEffect,
  fontSize,
}) => {
  const { durationInFrames } = useVideoConfig();

  // ---------------------------------------------
  // Preload handles
  // ---------------------------------------------
  const [imagesReady, setImagesReady] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [bgReady, setBgReady] = useState(false);
  const [fontReady, setFontReady] = useState(false);

  const imagesHandle = React.useMemo(() => delayRender("images"), []);
  const audioHandle = React.useMemo(() => delayRender("audio"), []);
  const bgHandle = React.useMemo(() => delayRender("bgmusic"), []);
  const fontHandle = React.useMemo(() => delayRender("font"), []);

  // ---------------------------------------------
  // Images preload
  // ---------------------------------------------
  useEffect(() => {
    Promise.all(imageUrls.map((src) => prefetch(src).waitUntilDone()))
      .then(() => {
        setImagesReady(true);
        continueRender(imagesHandle);
      })
      .catch((err) => {
        console.error("Image preload failed", err);
        throw err; // Fail fast
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------
  // Narration audio preload
  // ---------------------------------------------
  useEffect(() => {
    prefetch(narrationUrl)
      .waitUntilDone()
      .then(() => {
        setAudioReady(true);
        continueRender(audioHandle);
      })
      .catch((err) => {
        console.error("Audio preload failed", err);
        throw err;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------
  // Background music preload (optional)
  // ---------------------------------------------
  useEffect(() => {
    if (!backgroundMusicUrl) {
      setBgReady(true);
      continueRender(bgHandle);
      return;
    }
    prefetch(backgroundMusicUrl)
      .waitUntilDone()
      .then(() => {
        setBgReady(true);
        continueRender(bgHandle);
      })
      .catch((err) => {
        console.error("Background music preload failed", err);
        throw err;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------
  // Font preload
  // ---------------------------------------------
  useEffect(() => {
    loadFont({fontFamily})
      .then(() => {
        setFontReady(true);
        continueRender(fontHandle);
      })
      .catch((err: unknown) => {
        console.error("Font preload failed", err);
        throw err;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // IMPORTANT: Returning null here is SAFE because delayRender() prevents any frame
  // from being captured until ALL continueRender() calls have been made.
  // This is different from returning null without delayRender, which causes black frames.
  // The component will only start rendering actual frames after all assets are prefetched.
  if (!imagesReady || !audioReady || !bgReady || !fontReady) {
    return null;
  }

  // Validate required resources upfront - fail immediately if missing
  if (!imageUrls || imageUrls.length === 0) {
    throw new Error("No images provided for video rendering");
  }
  if (!narrationUrl) {
    throw new Error("No narration audio URL provided");
  }
  if (!fontFamily) {
    throw new Error("No font family specified");
  }

  // Calculate video structure
  const totalTransitions = imageUrls.length - 1;
  const totalTransitionFrames = totalTransitions * TRANSITION_DURATION;
  const framesIncludingTransitions = durationInFrames + totalTransitionFrames;
  const baseSequenceDuration = Math.round(framesIncludingTransitions / imageUrls.length);
  const sequenceDuration = Math.max(baseSequenceDuration, MIN_SEQUENCE_DURATION);

  // Render immediately - assume all resources are available
  return (
    <AbsoluteFill className="bg-black">
      {transitionToComponentMap[transition]({
        sequenceDuration,
        children: imageUrls.map((image) =>
          imageEffectToComponentMap[imageEffect]({
            key: image,
            src: image,
            duration: sequenceDuration,
          })
        ),
      })}
      {overlayToComponentMap[overlay]}
      <Audio src={narrationUrl} />
      {backgroundMusicUrl && <BackgroundMusic src={backgroundMusicUrl} />}
      {captions && (
        <VideoCaptions
          captions={captions}
          fontFamily={fontFamily}
          fontColor={fontColor}
          captionAlignment={captionAlignment}
          fontSize={fontSize}
        />
      )}
    </AbsoluteFill>
  );
};
