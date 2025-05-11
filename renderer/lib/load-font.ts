import { continueRender, delayRender } from "remotion";
import { fontFamilyToUrlMap } from "./config-entity-map";
import type { FontFamily } from "@/types";
const loadedFonts = new Set<string>();

interface LoadFontProps {
  fontFamily: FontFamily;
}

export const loadFont = async ({
  fontFamily,
}: LoadFontProps): Promise<void> => {
  if (loadedFonts.has(fontFamily)) {
    return Promise.resolve();
  }

  const waitForFont = delayRender();

  try {
    const font = new FontFace(
      fontFamily,
      `url('${fontFamilyToUrlMap[fontFamily]}') format('truetype')`
    );

    await font.load();
    document.fonts.add(font);
    loadedFonts.add(fontFamily);
  } catch (error) {
    console.error("Error loading font:", error);
  } finally {
    continueRender(waitForFont);
  }
};
