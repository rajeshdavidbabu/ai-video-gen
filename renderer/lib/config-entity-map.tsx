import React, { type ReactElement, type ReactNode } from "react";
import { MovieGrain } from "../components/overlays/movie-grains";
import { Sparkles } from "../components/overlays/sparkles";
import type {
  ImageEffectSchema,
  TransitionSchema,
  OverlaySchema,
  FontColorSchema,
  FontFamilySchema,
} from "./schema/simple-video";
import type { z } from "zod";
import { staticFile } from "remotion";
import { Fade } from "../components/video-transitions/fade";
import { Default as DefaultTransition } from "../components/video-transitions/default";
import { Shake } from "../components/images/shake";
import { StaticZoom } from "../components/images/static-zoom";
import { ZoomAndShake } from "../components/images/zoom-and-shake";
import { DynamicZoom } from "../components/images/dynamic-zoom";
import { Default } from "../components/images/default";
import { HorizontalPan } from "../components/images/horizontal-pan";
import type { FontSize } from "@/types";

export const fontFamilyToUrlMap: Record<
  z.infer<typeof FontFamilySchema>,
  string
> = {
  "dm-serif-display": staticFile("fonts/DMSerifDisplay-Regular.ttf"),
  "montserrat-extrabold": staticFile("fonts/Montserrat-ExtraBold.ttf"),
  oswald: staticFile("fonts/Oswald-Bold.ttf"),
  "raleway-bold": staticFile("fonts/Raleway-ExtraBold.ttf"),
  "rubik-bold": staticFile("fonts/Rubik-Bold.ttf"),
  "the-bold": staticFile("fonts/theboldfont.ttf"),
};

/* <MovieGrain opacity={0.8} speed={0.9} /> */
export const overlayToComponentMap: Record<
  z.infer<typeof OverlaySchema>,
  ReactNode | null
> = {
  "movie-grain": <MovieGrain opacity={0.2} speed={0.9} />,
  sparkles: <Sparkles count={70} speed={0.2} />,
  none: null,
};

export const transitionToComponentMap: Record<
  z.infer<typeof TransitionSchema>,
  (props: {
    children: ReactNode;
    sequenceDuration: number;
  }) => ReactElement | null
> = {
  fade: ({ children, sequenceDuration }) => (
    <Fade sequenceDuration={sequenceDuration}>{children}</Fade>
  ),
  none: ({ children, sequenceDuration }) => (
    <DefaultTransition sequenceDuration={sequenceDuration}>
      {children}
    </DefaultTransition>
  ),
};

export const imageEffectToComponentMap: Record<
  z.infer<typeof ImageEffectSchema>,
  (props: { src: string; duration: number; key: string }) => ReactElement | null
> = {
  shake: ({ src, duration }) => <Shake src={src} duration={duration} />,
  "static-zoom": ({ src, duration, key }) => (
    <StaticZoom src={src} duration={duration} key={key} />
  ),
  "zoom-and-shake": ({ src, duration, key }) => (
    <ZoomAndShake src={src} duration={duration} key={key} />
  ),
  "dynamic-zoom": ({ src, duration, key }) => (
    <DynamicZoom src={src} duration={duration} key={key} />
  ),
  "horizontal-pan": ({ src, duration, key }) => (
    <HorizontalPan src={src} duration={duration} key={key} />
  ),
  none: ({ src, duration, key }) => (
    <Default src={src} duration={duration} key={key} />
  ),
};

export const fontColorToTailwindColorMap: Record<
  z.infer<typeof FontColorSchema>,
  string
> = {
  bright: "#ffff00", // Bright Yellow
  sunset: "#ffc83a", // Sunset Orange
  pure: "#ffffff", // Pure White
  royal: "#dbc2ff", // Royal Purple
  nature: "#48faa8", // Nature Green
  coral: "#ff7878", // Coral Pink
};

export const fontSizeToTailwindSizeMap: Record<FontSize, number> = {
  small: 50,
  medium: 70,
  large: 80,
};
