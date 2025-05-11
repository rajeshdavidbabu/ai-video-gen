import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs/promises";
import { SimpleVideoSchema } from "./lib/schema/simple-video";
import { webpackOverride } from "./remotion.config";

const main = async () => {
  // Define the ID of the composition you want to render
  const compositionId = "SimpleVideo";

  // Entry point of your Remotion project
  const entry = path.join(process.cwd(), "src/index.ts");
  // Specify the output directory for the bundle
  const outDir = path.join(process.cwd(), "remotion-bundle");

  // Delete the old bundle if it exists
  try {
    await fs.rm(outDir, { recursive: true, force: true });
    console.log("Old bundle deleted.");
  } catch (err) {
    console.error("Error deleting old bundle:", err);
    // You can choose to throw an error or proceed
  }

  // Bundle your project
  console.log("Creating a Webpack bundle of the video...");

  // Bundle your project
  console.log("Creating a Webpack bundle of the video...");
  const bundleLocation = await bundle({
    entryPoint: entry,
    outDir: outDir,
    webpackOverride,
    // You can provide a custom Webpack configuration if needed
    // webpackOverride: (config) => config,
  });
  console.log("Bundle created at ", bundleLocation);

  // Define the input props for the video
  const ASSETS_BASE_URL = "http://127.0.0.1:8080";

  const inputProps = SimpleVideoSchema.parse({
    imageUrls: [
      `${ASSETS_BASE_URL}/images/image1.jpg`,
      `${ASSETS_BASE_URL}/images/image2.jpg`,
      `${ASSETS_BASE_URL}/images/image3.jpg`,
      `${ASSETS_BASE_URL}/images/image4.jpg`,
      `${ASSETS_BASE_URL}/images/image5.jpg`,
      `${ASSETS_BASE_URL}/images/image6.jpg`,
    ],
    backgroundMusicUrl: `${ASSETS_BASE_URL}/audio/bg-music.mp3`,
    narrationUrl: `${ASSETS_BASE_URL}/audio/narration.mp3`,
    captions: require(path.join(process.cwd(), "public/audio/captions.json")),
    font: {
      family: "TheBoldFont",
      url: `${ASSETS_BASE_URL}/fonts/TheBoldFont.ttf`,
      format: "truetype" as const,
    },
  });

  // Select the composition you want to render
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
    inputProps,
  });

  if (!composition) {
    throw new Error(`No composition with the ID "${compositionId}" found.`);
  }

  // Render the video
  console.log("Starting render...", composition);
  const outputLocation = path.join(process.cwd(), `out/${compositionId}.mp4`);

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation,
    inputProps,
  });

  console.log("Render done!", outputLocation);
};

main().catch((err) => {
  console.error("Error during rendering:", err);
  process.exit(1);
});
