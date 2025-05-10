import axios from "../../utils/axios.ts";
import type {AuthResponse, SignupData} from "@/types/auth.ts";

export const REMOTE_SERVER: string = import.meta.env.VITE_REMOTE_SERVER;
export const USERS_API = `${REMOTE_SERVER}/users`;
export const AUTH_API = `${REMOTE_SERVER}/auth`;

export const login
    = async (credentials: URLSearchParams): Promise<AuthResponse> => {
    const response = await axios.post(`${AUTH_API}/login`, credentials, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    return response.data;
};

export const signup = async (user: SignupData) => {
    const response = await axios.post(`${USERS_API}`, user);
    return response.data;
};