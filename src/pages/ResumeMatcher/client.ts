import axios from "@/utils/axios";
import type {ResumeMatch} from "@/types/resume.ts";

export const REMOTE_SERVER: string = import.meta.env.VITE_REMOTE_SERVER;
const RESUME_MATCH_API = `${REMOTE_SERVER}/resume-match`;


export const checkResumeMatch = async (
    jobId: string,
    resume: File,
    jobDescription: File
) => {
    const formData = new FormData();
    formData.append("job_id", jobId);
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);

    const response = await axios.post(`${RESUME_MATCH_API}/check`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const getResumeMatch = async (jobId: string): Promise<ResumeMatch | null> => {
    try {
        const response = await axios.get<ResumeMatch>(`${RESUME_MATCH_API}/${jobId}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};