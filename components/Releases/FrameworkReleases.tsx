import { getNextJsReleases, type Release } from "@/utils/api";
import { getReleaseType } from "@/utils/releases";
import FilteredReleases from "./FilteredReleases";

export const revalidate = 300;

export default async function FrameworkReleases() {
  let releases: Release[];

  try {
    releases = await getNextJsReleases();
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Please try again later";

    return (
      <div className="instrument-card px-6 py-14 text-center">
        <p className="text-lg text-coral">Failed to load releases</p>
        <p className="mt-2 text-sm text-ash">{message}</p>
      </div>
    );
  }

  const indexableReleases = releases
    .filter((release) => getReleaseType(release) === "stable")
    .slice(0, 8);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Latest Next.js release notes",
    description: "Recent stable Next.js framework releases from GitHub.",
    numberOfItems: indexableReleases.length,
    itemListElement: indexableReleases.map((release, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: release.name || release.tag_name,
      url: release.html_url,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <FilteredReleases releases={releases} />
    </>
  );
}
