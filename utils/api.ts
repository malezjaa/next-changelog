export interface Release {
  id: number;
  name: string;
  tag_name: string;
  html_url: string;
  body: string;
  created_at: string;
  target_commitish: string;
  prerelease: boolean;
  draft: boolean;
  author: {
    login: string;
    avatar_url: string;
  };
}

export const getNextJsReleases = async (): Promise<Release[]> => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      }),
    };

    const fetchReleases = async (page: number): Promise<Release[]> => {
      const url = new URL(
        "https://api.github.com/repos/vercel/next.js/releases",
      );
      url.searchParams.append("per_page", "100");
      url.searchParams.append("page", page.toString());

      const response = await fetch(url.toString(), {
        headers,
        credentials: "include",
        next: {
          revalidate: 1200,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          console.warn("GitHub API rate limit exceeded.");
          throw new Error(
            "GitHub API rate limit exceeded. Please try again later.",
          );
        }
        throw new Error(
          `GitHub API Error: ${response.status} ${response.statusText}`,
        );
      }

      return response.json();
    };

    const [releases1, releases2] = await Promise.all([
      fetchReleases(1),
      fetchReleases(2),
    ]);

    let allReleases: Release[] = [...releases1, ...releases2];

    const recentReleases = allReleases.filter((release) => {
      const releaseDate = new Date(release.created_at);
      return releaseDate >= oneYearAgo;
    });

    const oldestRelease = new Date(
      allReleases[allReleases.length - 1]?.created_at,
    );
    if (oldestRelease >= oneYearAgo && releases2.length === 100) {
      let page = 3;
      const maxPages = 5;

      while (page <= maxPages) {
        const releases = await fetchReleases(page);

        if (releases.length === 0) break;

        let reachedOldReleases = false;
        for (const release of releases) {
          const releaseDate = new Date(release.created_at);
          if (releaseDate >= oneYearAgo) {
            recentReleases.push(release);
          } else {
            reachedOldReleases = true;
            break;
          }
        }

        if (reachedOldReleases) break;
        page++;
      }
    }

    return recentReleases;
  } catch (error: any) {
    console.error("GitHub API Error:", error.message);

    throw error;
  }
};
