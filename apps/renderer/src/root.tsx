import { Composition, staticFile } from "remotion";
import { SimpleVideo } from "../components/videos/simple-video";
import {
  SimpleVideoSchema,
  ElevenLabsCaptionSchema,
} from "../lib/schema/simple-video";
import "./style.css";
import type { z } from "zod";
import { convertCharactersToWords } from "../lib/convert-11-labs-caption";

const imageUrlsCDN = [
  "https://images.unsplash.com/uploads/1413387620228d142bee4/23eceb86",
  "https://images.unsplash.com/reserve/jEs6K0y1SbK3DAvgrBe5_IMG_3410.jpg",
  "https://images.unsplash.com/uploads/141219200475673afcb68/f5bd8360",
  "https://images.unsplash.com/reserve/ijl3tATFRpCjKWXwUoBz_DSCF7168.jpg",
  "https://images.unsplash.com/reserve/6vaWXsQuSWSgm5NEF2p9_WC4A4194.jpg",
  "https://images.unsplash.com/photo-1415340839394-8e0c3c29672c",
  "https://images.unsplash.com/photo-1431263154979-0982327fccbb",
];

export const RemotionRoot: React.FC = () => {
  const defaultProps = SimpleVideoSchema.parse({
    imageUrls: imageUrlsCDN,
    backgroundMusicUrl: staticFile("audio/bg-music.mp3"),
    narrationUrl: staticFile("audio/narration.mp3"),
    captionsUrl: staticFile("audio/captions.json"),
    fontFamily: "oswald",
    fontColor: "sunset",
    imageEffect: "zoom-and-shake",
    overlay: "sparkles",
    transition: "fade",
    captionAlignment: "center",
    fontSize: "medium",
  } satisfies z.input<typeof SimpleVideoSchema>);

  console.log("defaultProps", defaultProps);

  return (
    <Composition
      id="SimpleVideo"
      width={1080}
      height={1920}
      fps={60}
      component={SimpleVideo}
      defaultProps={defaultProps}
      calculateMetadata={async ({ props }) => {
        // Validate input props
        const validatedProps = SimpleVideoSchema.parse(props);

        // Fetch captions
        const response = await fetch(validatedProps.captionsUrl);
        const rawCaptions = await response.json();

        // Validate ElevenLabs captions format
        const elevenlabsCaptions = ElevenLabsCaptionSchema.parse(rawCaptions);

        // Convert validated ElevenLabs captions to our format
        const convertedCaptions = convertCharactersToWords(elevenlabsCaptions);

        // Create and validate runtime props
        const runtimeProps = SimpleVideoSchema.parse({
          ...validatedProps,
          captions: convertedCaptions,
        });

        return {
          durationInFrames: Math.ceil(convertedCaptions.metadata.duration * 60),
          props: runtimeProps,
        };
      }}
    />
  );
};
