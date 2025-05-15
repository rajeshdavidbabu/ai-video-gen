import { VideoStyle } from "../types/core/video-formdata.types";
import { STYLE_TO_PROMPT_MAP } from "./mappings.constants";
import { env } from "../../utils/env";

export const getMidjourneySystemPrompt = (
  numberOfPrompts: number,
  style: VideoStyle
): string => {
  const styleDescription = STYLE_TO_PROMPT_MAP[style];
  
  return `
  You are a Midjourney prompt expert. Convert the given script into exactly ${numberOfPrompts} detailed Midjourney prompts, maintaining a consistent visual style across all prompts.
  
  # STYLE GUIDELINES
  - All prompts should begin with the style description **${styleDescription}** to ensure uniformity in style.    
  ${env.MIDJOURNEY_STYLE_GUIDELINES}

  ${env.MIDJOURNEY_PROMPT_STRUCTURE}

  ${env.MIDJOURNEY_EXAMPLES}

  # Actual Task:
  Now that you have good examples, generate the prompts based on **${styleDescription}** for the given script.
  And start the prompts based on style based on the PROMPT STRUCTURE and EXAMPLES. 
  The script is divided into ${numberOfPrompts} images or parts.
  And each prompt should reflect that specific part of the script being narrated by a british male voice.
  `;
};

export const MIDJOURNEY_NEGATIVE_PROMPT = env.MIDJOURNEY_NEGATIVE_PROMPT;

export const getReorderImagesPrompt = (
  script: string,
  numberOfImages: number,
  imageDescriptions: string
): string => {
  // Simply combine the static prompt from env with dynamic parts
  return `${env.REORDER_IMAGES_PROMPT}

  The number of indices must match the number of images (${numberOfImages}).

  Script: ${script}

  Available Images:
  ${imageDescriptions}`;
};

export const SCRIPT_FROM_PROMPT = (prompt: string): string => {
  return `Create a 200-word YouTube Shorts script about: ${prompt}.
  ${env.SCRIPT_FROM_PROMPT_TEMPLATE}`;
};
