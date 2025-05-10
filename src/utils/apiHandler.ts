import axios from "axios";

export async function handleApi<T>(fn: () => Promise<T>, setErr: (msg: string) => void): Promise<T | null> {
    try {
        return await fn();
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const detail = error.response?.data?.detail;
            setErr(typeof detail === "string" ? detail : "Request failed.");
        } else {
            setErr("An unexpected error occurred.");
        }
        return null;
    }
}
