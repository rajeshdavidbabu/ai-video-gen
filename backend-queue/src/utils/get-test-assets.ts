import { AssetRepository } from "../core/ports/asset-repository.port";

export async function getTestAssets(assetRepository: AssetRepository) {
  const imageKeys = Array.from(
    { length: 10 },
    (_, i) => `test/images/image${i + 1}.png`
  );

  return {
    imageUrls: await Promise.all(imageKeys.map((key) => assetRepository.getPresignedUrl(key))),
    audioUrl: await assetRepository.getPresignedUrl("test/audio/narration.mp3"),
    captionsUrl: await assetRepository.getPresignedUrl("test/audio/captions.json"),
    backgroundMusicUrl: await assetRepository.getPresignedUrl("test/audio/bg-music.mp3"),
  };
}
