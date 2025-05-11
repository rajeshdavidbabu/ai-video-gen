import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind";
import type { Configuration as WebpackConfiguration } from "webpack";

export const webpackOverride = (currentConfiguration: WebpackConfiguration) => {
  return enableTailwind(currentConfiguration);
};

Config.overrideWebpackConfig(webpackOverride);
