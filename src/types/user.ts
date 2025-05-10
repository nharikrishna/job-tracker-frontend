export interface User {
    id: string;
    name: string;
    role: "USER" | "ADMIN";
    email: string;
    created_at: string;
}