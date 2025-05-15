export type VideoStyle =
  | "realistic"
  | "painterly"
  | "anime"
  | "illustrated"
  | "detailed"
  | "whimsical";

export type VideoLength = "short" | "medium";

export type VideoBgMusic =
  | "none"
  | "between-spaces"
  | "deck-halls"
  | "doc-wyatt"
  | "everybody-get-up"
  | "for-the-win"
  | "funk-af"
  | "future-freeway"
  | "losing-marbles"
  | "miss-u"
  | "satin-moonrise"
  | "shady-guise"
  | "two-gong-fire"
  | "win-the-battle";

export type Voice =
  | "Xb7hH8MSUJpSbSDYk0k2" // Alice
  | "nPczCjzI2devNBz1zQrb" // Brian
  | "N2lVS1w4EtoT3dr4eOWO" // Callum
  | "tA1VCNzCpAUIo9dguV0U" // David
  | "cgSgspJ2msm6clMCkdW9" // Jessica
  | "mSO1bIy3Q4vuy3Le6kYF"; // Valentino

export type Topic =
  | "history"
  | "facts"
  | "lifehacks"
  | "science"
  | "psychology"
  | "tech"
  | "future";

export type ImageEffect =
  | "shake"
  | "static-zoom"
  | "zoom-and-shake"
  | "dynamic-zoom"
  | "horizontal-pan"
  | "none";

export type Overlay = "none" | "sparkles" | "movie-grain";

export type FontSize = "small" | "medium" | "large";

export type FontFamily =
  | "dm-serif-display"
  | "montserrat-extrabold"
  | "oswald"
  | "raleway-bold"
  | "rubik-bold"
  | "the-bold";

export type FontColor =
  | "sunset"
  | "bright"
  | "pure"
  | "royal"
  | "nature"
  | "coral";

export type Transition = "fade" | "none";

export type CaptionAlignment = "top" | "center" | "bottom";

export type Language = "en";

/**
 * @discriminator contentType
 **/
export type ContentUnion = 
  | { 
      contentType: "prompt"; 
      /**
       * @minLength 1
       * @maxLength 500
       */
      text: string 
    }
  | { 
      contentType: "script"; 
      /**
       * @minLength 1
       * @maxLength 1250
       */
      text: string 
    }
  | { 
      contentType: "topic"; 
      selectedTopic: Topic | null
    };

export type VideoFormData = {
  targetLength: VideoLength;
  content: ContentUnion;
  style: VideoStyle;
  voice: Voice;
  language: Language;
  music: VideoBgMusic;
  captionAlignment: CaptionAlignment;
  imageEffect?: ImageEffect;
  fontFamily: FontFamily;
  fontColor: FontColor;
  overlay: Overlay;
  transition?: Transition;
  fontSize?: FontSize;
};

export type VideoOptions = {
  styleReferenceImageUrl?: string;
  referenceJobId?: {
    images?: string;
    audio?: string;
  };
};
