import { VideoStyle, VideoBgMusic } from "../types/core/video-formdata.types";

export const STYLE_TO_PROMPT_MAP: Record<VideoStyle, string> = {
  realistic: "Ultra-Realistic",
  painterly: "Tim Hildebrandt",
  anime: "Studio Ghibli",
  illustrated: "Greg Rutkowski",
  detailed: "Guy Delisle",
  whimsical: "Bob Staake's whimsical",
} as const;

// Background music mapping
export const MUSIC_TO_FILE_MAP: Record<VideoBgMusic, string | undefined> = {
  none: undefined,
  "between-spaces": "bg-music/between-the-spaces-the-soundlings.mp3",
  "deck-halls": "bg-music/deck-halls-the-soundlings.mp3",
  "doc-wyatt": "bg-music/doc-wyatt-everet-almond.mp3",
  "everybody-get-up": "bg-music/everybody-get-up-everet-almond.mp3",
  "for-the-win": "bg-music/for-the-win-everet-almond.mp3",
  "funk-af": "bg-music/funk-af-everet-almond.mp3",
  "future-freeway": "bg-music/future-freeway-adam-macdougall.mp3",
  "losing-marbles": "bg-music/losing-your-marbles-the-soundlings.mp3",
  "miss-u": "bg-music/miss-u-everet.mp3",
  "satin-moonrise": "bg-music/satin-moonrise-adam-macdougall.mp3",
  "shady-guise": "bg-music/shady-guise-the-soundlings.mp3",
  "two-gong-fire": "bg-music/two-gong-fire-ocean.mp3",
  "win-the-battle": "bg-music/win-the-battle-win-the-war.mp3",
} as const;
