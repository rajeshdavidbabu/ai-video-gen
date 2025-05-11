import type {
  CaptionAlignmentSchema,
  CaptionsSchema,
  FontColorSchema,
  FontFamilySchema,
  FontSizeSchema,
  SimpleVideoSchema,
} from "@/lib/schema/simple-video";
import type { z } from "zod";

export interface WordTiming {
  text: string;
  startMs: number;
  endMs: number;
}

export interface CombinedToken {
  text: string;
  startMs: number;
  endMs: number;
  words: WordTiming[];
}

export interface VideoCaptionsProps {
  captions: Captions;
  fontFamily: FontFamily;
  fontColor: FontColor;
  captionAlignment: CaptionAlignment;
  fontSize: FontSize;
}

export type CaptionAlignment = z.infer<typeof CaptionAlignmentSchema>;

export type FontColor = z.infer<typeof FontColorSchema>;

export type FontFamily = z.infer<typeof FontFamilySchema>;

export type Captions = z.infer<typeof CaptionsSchema>;

export type FontSize = z.infer<typeof FontSizeSchema>;
