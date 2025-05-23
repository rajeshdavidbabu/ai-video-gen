// Generated by ts-to-zod
import { z } from "zod";

export const videoStyleSchema = z.union([
  z.literal("realistic"),
  z.literal("painterly"),
  z.literal("anime"),
  z.literal("illustrated"),
  z.literal("detailed"),
  z.literal("whimsical"),
]);

export const videoLengthSchema = z.union([
  z.literal("short"),
  z.literal("medium"),
]);

export const videoBgMusicSchema = z.union([
  z.literal("none"),
  z.literal("between-spaces"),
  z.literal("deck-halls"),
  z.literal("doc-wyatt"),
  z.literal("everybody-get-up"),
  z.literal("for-the-win"),
  z.literal("funk-af"),
  z.literal("future-freeway"),
  z.literal("losing-marbles"),
  z.literal("miss-u"),
  z.literal("satin-moonrise"),
  z.literal("shady-guise"),
  z.literal("two-gong-fire"),
  z.literal("win-the-battle"),
]);

export const voiceSchema = z.union([
  z.literal("Xb7hH8MSUJpSbSDYk0k2"),
  z.literal("nPczCjzI2devNBz1zQrb"),
  z.literal("N2lVS1w4EtoT3dr4eOWO"),
  z.literal("tA1VCNzCpAUIo9dguV0U"),
  z.literal("cgSgspJ2msm6clMCkdW9"),
  z.literal("mSO1bIy3Q4vuy3Le6kYF"),
]);

export const topicSchema = z.union([
  z.literal("history"),
  z.literal("facts"),
  z.literal("lifehacks"),
  z.literal("science"),
  z.literal("psychology"),
  z.literal("tech"),
  z.literal("future"),
]);

export const imageEffectSchema = z.union([
  z.literal("shake"),
  z.literal("static-zoom"),
  z.literal("zoom-and-shake"),
  z.literal("dynamic-zoom"),
  z.literal("horizontal-pan"),
  z.literal("none"),
]);

export const overlaySchema = z.union([
  z.literal("none"),
  z.literal("sparkles"),
  z.literal("movie-grain"),
]);

export const fontSizeSchema = z.union([
  z.literal("small"),
  z.literal("medium"),
  z.literal("large"),
]);

export const fontFamilySchema = z.union([
  z.literal("dm-serif-display"),
  z.literal("montserrat-extrabold"),
  z.literal("oswald"),
  z.literal("raleway-bold"),
  z.literal("rubik-bold"),
  z.literal("the-bold"),
]);

export const fontColorSchema = z.union([
  z.literal("sunset"),
  z.literal("bright"),
  z.literal("pure"),
  z.literal("royal"),
  z.literal("nature"),
  z.literal("coral"),
]);

export const transitionSchema = z.union([z.literal("fade"), z.literal("none")]);

export const captionAlignmentSchema = z.union([
  z.literal("top"),
  z.literal("center"),
  z.literal("bottom"),
]);

export const languageSchema = z.literal("en");

export const contentUnionSchema = z.discriminatedUnion("contentType", [
  z.object({
    contentType: z.literal("prompt"),
    text: z.string().min(1).max(500),
  }),
  z.object({
    contentType: z.literal("script"),
    text: z.string().min(1).max(1250),
  }),
  z.object({
    contentType: z.literal("topic"),
    selectedTopic: topicSchema.nullable(),
  }),
]);

export const videoFormDataSchema = z.object({
  targetLength: videoLengthSchema,
  content: contentUnionSchema,
  style: videoStyleSchema,
  voice: voiceSchema,
  language: languageSchema,
  music: videoBgMusicSchema,
  captionAlignment: captionAlignmentSchema,
  imageEffect: imageEffectSchema.optional(),
  fontFamily: fontFamilySchema,
  fontColor: fontColorSchema,
  overlay: overlaySchema,
  transition: transitionSchema.optional(),
  fontSize: fontSizeSchema.optional(),
});

export const videoOptionsSchema = z.object({
  styleReferenceImageUrl: z.string().optional(),
  referenceJobId: z
    .object({
      images: z.string().optional(),
      audio: z.string().optional(),
    })
    .optional(),
});


// Edited
export type VideoFormData = z.infer<typeof videoFormDataSchema>;
export type TopicType = z.infer<typeof topicSchema>;
export type ContentUnion = z.infer<typeof contentUnionSchema>;
export type TargetLength = z.infer<typeof videoLengthSchema>;
export type Voice = z.infer<typeof voiceSchema>;
export type Language = z.infer<typeof languageSchema>;
export type VideoStyle = z.infer<typeof videoStyleSchema>;
export type VideoBgMusic = z.infer<typeof videoBgMusicSchema>;
export type ImageEffect = z.infer<typeof imageEffectSchema>;
export type Overlay = z.infer<typeof overlaySchema>;
export type FontFamily = z.infer<typeof fontFamilySchema>;
export type FontColor = z.infer<typeof fontColorSchema>;
export type Transition = z.infer<typeof transitionSchema>;
export type FontSize = z.infer<typeof fontSizeSchema>;
export type CaptionAlignment = z.infer<typeof captionAlignmentSchema>;
// Referenced from contentUnionSchema
export const CONTENT_LIMITS = {
  PROMPT_LIMIT: 500,
  SCRIPT_LIMIT: 1250,
};
