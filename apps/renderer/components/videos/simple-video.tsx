import {
  AbsoluteFill,
  useVideoConfig,
  Audio,
  continueRender,
  delayRender,
} from "remotion";
import { useEffect, useState } from "react";
import { VideoCaptions } from "../caption";
import type React from "react";
import { loadFont } from "../../lib/load-font";
import type { SimpleVideoSchema } from "../../lib/schema/simple-video";
import type { z } from "zod";
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
import { preloadAudio } from "@remotion/preload";

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
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [bgMusicLoaded, setBgMusicLoaded] = useState(false);
  const [imageLoadHandle] = useState(() => delayRender());
  const [fontLoadHandle] = useState(() => delayRender());
  const [audioLoadHandle] = useState(() => delayRender());
  const [bgMusicLoadHandle] = useState(() => delayRender());

  useEffect(() => {
    const preloadImages = async () => {
      try {
        await Promise.all(imageUrls.map(preloadImage));
        setLoadedImages(imageUrls);
        continueRender(imageLoadHandle);
      } catch (error) {
        console.error("Error loading images:", error);
        continueRender(imageLoadHandle);
      }
    };

    preloadImages();
  }, [imageUrls, imageLoadHandle]);

  useEffect(() => {
    const loadFontAndContinue = async () => {
      try {
        await loadFont({ fontFamily });
        setFontLoaded(true);
        continueRender(fontLoadHandle);
      } catch (error) {
        console.error("Error loading font:", error);
        continueRender(fontLoadHandle);
      }
    };

    loadFontAndContinue();
  }, [fontFamily, fontLoadHandle]);

  useEffect(() => {
    const loadAudio = async () => {
      try {
        preloadAudio(narrationUrl);
        setAudioLoaded(true);
        continueRender(audioLoadHandle);
      } catch (error) {
        console.error("Error loading narration audio:", error);
        continueRender(audioLoadHandle);
      }
    };

    loadAudio();
  }, [narrationUrl, audioLoadHandle]);

  useEffect(() => {
    if (!backgroundMusicUrl) {
      setBgMusicLoaded(true);
      continueRender(bgMusicLoadHandle);
      return;
    }

    const loadBgMusic = async () => {
      try {
        preloadAudio(backgroundMusicUrl);
        setBgMusicLoaded(true);
        continueRender(bgMusicLoadHandle);
      } catch (error) {
        console.error("Error loading background music:", error);
        continueRender(bgMusicLoadHandle);
      }
    };

    loadBgMusic();
  }, [backgroundMusicUrl, bgMusicLoadHandle]);

  if (
    loadedImages.length === 0 ||
    !fontLoaded ||
    !audioLoaded ||
    !bgMusicLoaded
  ) {
    return null;
  }

  // Calculate total transitions and frames needed
  const totalTransitions = loadedImages.length - 1;
  const totalTransitionFrames = totalTransitions * TRANSITION_DURATION;

  // Calculate sequence duration
  const framesIncludingTransitions = durationInFrames + totalTransitionFrames;
  const baseSequenceDuration = Math.round(
    framesIncludingTransitions / loadedImages.length
  );
  const sequenceDuration = Math.max(
    baseSequenceDuration,
    MIN_SEQUENCE_DURATION
  );

  return (
    <AbsoluteFill className="bg-black">
      {transitionToComponentMap[transition]({
        sequenceDuration,
        children: loadedImages.map((image) =>
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

const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};
