import {
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
} from "lucide-react";
import type { TargetLength, Voice, VideoStyle, VideoBgMusic, Overlay, FontFamily, FontColor, CaptionAlignment } from "@/lib/state/create-video-schema";

interface LengthData {
  id: string;
  value: TargetLength;
  label: string;
}

interface VoiceData {
  id: Voice;
  name: string;
  description: string;
  audioSrc: string;
}

interface StyleData {
  id: VideoStyle;
  name: string;
  description: string;
  images: string[];
  value: VideoStyle;
}

interface FontData {
  id: FontFamily;
  name: string;
  description: string;
  preview: string;
}

interface ColorData {
  id: FontColor;
  name: string;
  description: string;
  preview: string;
  value: string;
}

interface CaptionAlignmentData {
  id: string;
  value: CaptionAlignment;
  label: string;
  icon: React.ReactNode;
}

interface OverlayData {
  id: Overlay;
  name: string;
  description: string;
  images: string[];
}

interface BgMusicData {
  id: VideoBgMusic;
  name: string;
  description: string;
  audioSrc: string;
  value: string;
}

export const lengths: LengthData[] = [
  { id: "length-short", value: "short", label: "< 1.25 mins" },
  { id: "length-medium", value: "medium", label: "1.25 - 3 mins" },
];

export const voices: VoiceData[] = [
  {
    id: "tA1VCNzCpAUIo9dguV0U",
    name: "David",
    description: "British, professional, male",
    audioSrc: "/voices/david_tA1VCNzCpAUIo9dguV0U.mp3",
  },
  {
    id: "nPczCjzI2devNBz1zQrb",
    name: "Brian",
    description: "American, narrative, male",
    audioSrc: "/voices/brian_nPczCjzI2devNBz1zQrb.mp3",
  },
  {
    id: "Xb7hH8MSUJpSbSDYk0k2",
    name: "Alice",
    description: "British, warm, female",
    audioSrc: "/voices/alice_Xb7hH8MSUJpSbSDYk0k2.mp3",
  },

  {
    id: "N2lVS1w4EtoT3dr4eOWO",
    name: "Callum",
    description: "Scottish, friendly, male",
    audioSrc: "/voices/callum_N2lVS1w4EtoT3dr4eOWO.mp3",
  },
  {
    id: "cgSgspJ2msm6clMCkdW9",
    name: "Jessica",
    description: "American, engaging, female",
    audioSrc: "/voices/jessica_cgSgspJ2msm6clMCkdW9.mp3",
  },
  {
    id: "mSO1bIy3Q4vuy3Le6kYF",
    name: "Valentino",
    description: "British, authoritative, male",
    audioSrc: "/voices/valentino_mSO1bIy3Q4vuy3Le6kYF.mp3",
  },
];

export type Stability = 'stable' | 'recommended' | 'experimental';

export const styles: (StyleData & { stability: Stability })[] = [
  {
    id: "realistic",
    name: "Ultra Realistic",
    description: "Photorealistic, detailed, natural",
    images: ["/styles/ultra-realistic.png"],
    value: "realistic",
    stability: 'recommended',
  },
  {
    id: "illustrated",
    name: "Illustrated Reality",
    description: "Bold, graphic, contemporary",
    images: ["/styles/greg-rutkowski.png"],
    value: "illustrated",
    stability: 'stable',
  },
  {
    id: "painterly",
    name: "Painterly Vision",
    description: "Artistic, textured, atmospheric",
    images: ["/styles/tim-hildebrandt.png"],
    value: "painterly",
    stability: 'stable',
  },
  {
    id: "anime",
    name: "Anime Inspired",
    description: "Animated, ethereal, storytelling",
    images: ["/styles/studio-ghibli.png"],
    value: "anime",
    stability: 'experimental',
  },
  {
    id: "detailed",
    name: "Detailed Artistry",
    description: "Rich, intricate, expressive",
    images: ["/styles/guy-delisle.png"],
    value: "detailed",
    stability: 'experimental',
  },
  {
    id: "whimsical",
    name: "Whimsical Wonder",
    description: "Fun, artistic, playful style",
    images: ["/styles/bob-staake-whimsical.png"],
    value: "whimsical",
    stability: 'experimental',
  },
];

export const fonts: FontData[] = [
  {
    id: "montserrat-extrabold",
    name: "Modern Sans",
    description: "Clean, contemporary, bold",
    preview: "/font-styles/montserrat-extrabold.png",
  },
  {
    id: "rubik-bold",
    name: "Geometric Modern",
    description: "Friendly, geometric, balanced",
    preview: "/font-styles/rubik-bold.png",
  },
  {
    id: "oswald",
    name: "Dynamic Display",
    description: "Impactful, strong, modern",
    preview: "/font-styles/oswald.png",
  },
  {
    id: "the-bold",
    name: "Simple Bold",
    description: "Simple, bold, modern",
    preview: "/font-styles/the-bold.png",
  },
  {
    id: "raleway-bold",
    name: "Sleek Sans",
    description: "Minimalist, versatile, clear",
    preview: "/font-styles/raleway-extrabold.png",
  },
  {
    id: "dm-serif-display",
    name: "Classic Serif",
    description: "Elegant, traditional, refined",
    preview: "/font-styles/dm-serif-display.png",
  },
];

export const colors: ColorData[] = [
  {
    id: "bright",
    name: "Bright Yellow",
    description: "Energetic, warm, vibrant",
    preview: "/font-colors/ffff00.png",
    value: "#ffff00",
  },
  {
    id: "sunset",
    name: "Sunset Orange",
    description: "Energetic, warm, vibrant",
    preview: "/font-colors/ffc83a.png",
    value: "#ffc83a",
  },
  {
    id: "pure",
    name: "Pure White",
    description: "Clean, minimal, pure",
    preview: "/font-colors/ffffff.png",
    value: "#ffffff",
  },
  {
    id: "royal",
    name: "Royal Purple",
    description: "Luxurious, creative, wise",
    preview: "/font-colors/dbc2ff.png",
    value: "#dbc2ff",
  },
  {
    id: "nature",
    name: "Nature Green",
    description: "Calm, trustworthy, deep",
    preview: "/font-colors/48faa8.png",
    value: "#48faa8",
  },
  {
    id: "coral",
    name: "Coral Pink",
    description: "Playful, gentle, modern",
    preview: "/font-colors/ff7878.png",
    value: "#ff7878",
  },
];

export const alignments: CaptionAlignmentData[] = [
  {
    id: "align-top",
    value: "top",
    label: "Top",
    icon: <AlignVerticalJustifyStart className="h-4 w-4" />,
  },
  {
    id: "align-center",
    value: "center",
    label: "Center",
    icon: <AlignVerticalJustifyCenter className="h-4 w-4" />,
  },
  {
    id: "align-bottom",
    value: "bottom",
    label: "Bottom",
    icon: <AlignVerticalJustifyEnd className="h-4 w-4" />,
  },
];

export const music: BgMusicData[] = [
  {
    id: "none",
    name: "No Background Music",
    description: "No audio background",
    audioSrc: "",
    value: "",
  },
  {
    id: "shady-guise",
    name: "Cinematic",
    description: "Epic orchestral, cinematic swells, dramatic",
    audioSrc: "/bg-music/shady-guise-the-soundlings_trimmed.mp3",
    value: "shady-guise-the-soundlings.mp3",
  },
  {
    id: "between-spaces",
    name: "Mysterious",
    description: "Mysterious, building tension, ethereal",
    audioSrc: "/bg-music/between-the-spaces-the-soundlings_trimmed.mp3",
    value: "between-the-spaces-the-soundlings.mp3",
  },
  {
    id: "deck-halls",
    name: "Serene",
    description: "Gentle acoustic, soothing melodies, peaceful",
    audioSrc: "/bg-music/deck-halls-the-soundlings_trimmed.mp3",
    value: "deck-halls-the-soundlings.mp3",
  },
  {
    id: "for-the-win",
    name: "Dramatic Buildup",
    description: "Intense funk, dramatic builds, powerful",
    audioSrc: "/bg-music/for-the-win-everet-almond_trimmed.mp3",
    value: "for-the-win-everet-almond.mp3",
  },
  {
    id: "losing-marbles",
    name: "Engaging",
    description: "Whimsical tension, playful mystery, engaging",
    audioSrc: "/bg-music/losing-your-marbles-the-soundlings_trimmed.mp3",
    value: "losing-your-marbles-the-soundlings.mp3",
  },
  {
    id: "two-gong-fire",
    name: "Exotic",
    description: "Reggae fusion, mysterious rhythm, exotic",
    audioSrc: "/bg-music/two-gong-fire-ocean_trimmed.mp3",
    value: "two-gong-fire-ocean.mp3",
  },
  {
    id: "win-the-battle",
    name: "Triumphant",
    description: "High-energy pop, triumphant, motivating",
    audioSrc: "/bg-music/win-the-battle-win-the-war_trimmed.mp3",
    value: "win-the-battle-win-the-war.mp3",
  },
];

export const overlays: OverlayData[] = [
  {
    id: "none",
    name: "No Overlay",
    description: "Clean, pure, unfiltered look",
    images: ["/overlays/no-overlay.png"],
  },
  {
    id: "sparkles",
    name: "Sparkle Effect",
    description: "Magical, dreamy, enchanting",
    images: ["/overlays/sparkles.png"],
  },
  {
    id: "movie-grain",
    name: "Movie Grains",
    description: "Cinematic, textured, nostalgic",
    images: ["/overlays/movie-grains.png"],
  },
];
