import { MetadataRoute } from "next";
import { getBaseUrl } from "@/utils/urls";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${getBaseUrl()}/sitemap.xml`,
  };
}
