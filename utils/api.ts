import axios, { AxiosRequestConfig } from "axios";

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

export const axiosClient = axios.create({
  maxBodyLength: Infinity,
  baseURL: "https://api.github.com",
});

export const config: AxiosRequestConfig = {
  withCredentials: true,
  maxBodyLength: Infinity,
};

export const getNextJsReleases = async (): Promise<Release[]> => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const headers = {
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      }),
    };

    const [response1, response2] = await Promise.all([
      axiosClient.get("/repos/vercel/next.js/releases", {
        ...config,
        params: { per_page: 100, page: 1 },
        headers,
      }),
      axiosClient.get("/repos/vercel/next.js/releases", {
        ...config,
        params: { per_page: 100, page: 2 },
        headers,
      }),
    ]);

    let allReleases: Release[] = [...response1.data, ...response2.data];

    const recentReleases = allReleases.filter((release) => {
      const releaseDate = new Date(release.created_at);
      return releaseDate >= oneYearAgo;
    });

    const oldestRelease = new Date(
      allReleases[allReleases.length - 1]?.created_at,
    );
    if (oldestRelease >= oneYearAgo && response2.data.length === 100) {
      let page = 3;
      const maxPages = 5;

      while (page <= maxPages) {
        const response = await axiosClient.get(
          "/repos/vercel/next.js/releases",
          {
            ...config,
            params: { per_page: 100, page },
            headers,
          },
        );

        if (response.data.length === 0) break;

        let reachedOldReleases = false;
        for (const release of response.data) {
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
    console.error(
      "GitHub API Error:",
      error.response?.status,
      error.response?.statusText,
    );

    if (error.response?.status === 403) {
      console.warn("GitHub API rate limit exceeded.");
      throw new Error(
        "GitHub API rate limit exceeded. Please try again later.",
      );
    }

    throw error;
  }
};
