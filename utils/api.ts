import axios, {AxiosRequestConfig} from "axios";

export const axiosClient = axios.create({
    maxBodyLength: Infinity,
    baseURL: "https://api.github.com"
});

export const config: AxiosRequestConfig = {
    withCredentials: true,
    maxBodyLength: Infinity,
};

export const getNextJsReleases = async (): Promise<any[]> => {
    const response= await axiosClient.get("/repos/vercel/next.js/releases", {
        ...config,
    });

    return response.data
}
