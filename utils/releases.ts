import type { Release } from "@/utils/api";

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const relativeTimeDivisions: Array<{
  amount: number;
  unit: Intl.RelativeTimeFormatUnit;
}> = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
];

export const formatRelativeTime = (date: string): string => {
  let value = (new Date(date).getTime() - Date.now()) / 1000;

  for (const division of relativeTimeDivisions) {
    if (Math.abs(value) < division.amount) {
      return relativeTime.format(Math.round(value), division.unit);
    }

    value /= division.amount;
  }

  return relativeTime.format(Math.round(value), "year");
};

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
