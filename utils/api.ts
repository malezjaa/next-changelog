import axios, {AxiosRequestConfig} from "axios";

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
    baseURL: "https://api.github.com"
});

export const config: AxiosRequestConfig = {
    withCredentials: true,
    maxBodyLength: Infinity,
};

export const getNextJsReleases = async (): Promise<Release[]> => {
    const response= await axiosClient.get("/repos/vercel/next.js/releases", {
        ...config,
    });

    return response.data
}
