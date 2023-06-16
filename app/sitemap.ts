import { MetadataRoute } from 'next'
import {getBaseUrl} from "@/utils/urls";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${getBaseUrl()}/`,
            lastModified: new Date(),
        },
    ]
}