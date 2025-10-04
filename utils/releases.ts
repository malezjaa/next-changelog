import type { Release } from "@/utils/api";

export const getReleaseType = (release: Release): "stable" | "canary" => {
  const tagName = release.tag_name.toLowerCase();
  const name = release.name.toLowerCase();

  const isCanary =
    tagName.includes("canary") ||
    name.includes("canary") ||
    release.prerelease ||
    tagName.includes("alpha") ||
    tagName.includes("beta") ||
    tagName.includes("rc") ||
    name.includes("alpha") ||
    name.includes("beta") ||
    name.includes("rc");

  return isCanary ? "canary" : "stable";
};
