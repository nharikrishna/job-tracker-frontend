import axios from "@/utils/axios";
import type {Job} from "@/types/job";

export const REMOTE_SERVER: string = import.meta.env.VITE_REMOTE_SERVER;
export const JOBS_API = `${REMOTE_SERVER}/jobs`;

export const getAllJobs = async (): Promise<Job[]> => {
    const response = await axios.get<Job[]>(JOBS_API);
    return response.data;
};

export const deleteJob = async (jobId: string): Promise<void> => {
    await axios.delete(`${JOBS_API}/${jobId}`);
};

export const updateJob = async (jobId: string, data: Partial<Job>): Promise<Job> => {
    const response = await axios.patch<Job>(`${JOBS_API}/${jobId}`, data);
    return response.data;
};

export const createJob = async (data: Partial<Job>): Promise<Job> => {
    const response = await axios.post<Job>(JOBS_API, data);
    return response.data;
};