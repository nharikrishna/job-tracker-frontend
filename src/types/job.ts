export interface Job {
    id: string;
    user_id: string;
    company: string;
    role: string;
    status: string;
    application_date?: string;
    notes?: string;
    tags?: string[];
    resume_file_path?: string;
    job_description_file_path?: string;
    created_at: string;
    updated_at: string;
}

export const JOB_STATUSES = [
    {label: "Applied", value: "Applied"},
    {label: "OA", value: "OA"},
    {label: "Interview", value: "Interview"},
    {label: "Rejected", value: "Rejected"},
    {label: "Offer", value: "Offer"},
    {label: "Wishlist", value: "Wishlist"},
    {label: "Other", value: "Other"},
];