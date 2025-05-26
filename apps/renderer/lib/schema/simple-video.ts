import { z } from "zod";

const WordSchema = z.object({
  word: z.string(),
  start: z.number(),
  end: z.number(),
  confidence: z.number(),
  punctuated_word: z.string(),
});

const SentenceSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
});

const ParagraphSchema = z.object({
  sentences: z.array(SentenceSchema),
  num_words: z.number(),
  start: z.number(),
  end: z.number(),
});

const ParagraphsWrapperSchema = z.object({
  transcript: z.string(),
  paragraphs: z.array(ParagraphSchema),
});

const AlternativeSchema = z.object({
  transcript: z.string(),
  confidence: z.number(),
  words: z.array(WordSchema),
  paragraphs: ParagraphsWrapperSchema,
});

const ChannelSchema = z.object({
  alternatives: z.array(AlternativeSchema),
  detected_language: z.string().optional(),
  language_confidence: z.number().optional(),
});

export const CaptionsSchema = z.object({
  metadata: z.object({
    created: z.string(),
    duration: z.number(),
    channels: z.number(),
  }),
  results: z.object({
    channels: z.array(ChannelSchema),
  }),
});

export const ElevenLabsCaptionSchema = z.object({
  text: z.string(),
  alignment: z.object({
    characters: z.array(z.string()),
    character_start_times_seconds: z.array(z.number()),
    character_end_times_seconds: z.array(z.number()),
  }),
});

export const CaptionAlignmentSchema = z
  .enum(["top", "center", "bottom"])
  .default("center");

export const FontSizeSchema = z
  .enum(["small", "medium", "large"])
  .default("medium");

export const OverlaySchema = z
  .enum(["movie-grain", "sparkles", "none"])
  .default("none");

export const TransitionSchema = z.enum(["fade", "none", "slide"]).default("none");

export const ImageEffectSchema = z
  .enum([
    "shake",
    "static-zoom",
    "zoom-and-shake",
    "dynamic-zoom",
    "horizontal-pan",
    "none",
  ])
  .default("none");

export const FontColorSchema = z
  .enum(["sunset", "bright", "pure", "royal", "nature", "coral"])
  .default("sunset");

export const FontFamilySchema = z
  .enum([
    "dm-serif-display",
    "montserrat-extrabold",
    "oswald",
    "raleway-bold",
    "rubik-bold",
    "the-bold",
  ])
  .default("montserrat-extrabold");

export const SimpleVideoSchema = z.object({
  imageUrls: z.array(z.string()),
  backgroundMusicUrl: z.string().optional(),
  narrationUrl: z.string(),
  captionsUrl: z.string(),
  captions: CaptionsSchema.optional(),
  fontFamily: FontFamilySchema,
  fontColor: FontColorSchema,
  fontSize: FontSizeSchema,
  captionAlignment: CaptionAlignmentSchema,
  overlay: OverlaySchema,
  transition: TransitionSchema,
  imageEffect: ImageEffectSchema,
});
