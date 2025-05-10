import axios from "@/utils/axios";
import type {StatsResponse} from "@/types/stats"; // optional: if you want to extract the type
export const REMOTE_SERVER: string = import.meta.env.VITE_REMOTE_SERVER;
export const STATS_API = `${REMOTE_SERVER}/stats`;

export const getStats = async (): Promise<StatsResponse> => {
    const response = await axios.get<StatsResponse>(`${STATS_API}/`);
    return response.data;
};
