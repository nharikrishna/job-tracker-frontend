import axios from "@/utils/axios";
import type {User} from "@/types/user";

export const REMOTE_SERVER: string = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/users`;

export const getCurrentUser = async (): Promise<User> => {
    const response = await axios.get<User>(`${USERS_API}/me`);
    return response.data;
};
