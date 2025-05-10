export interface SignupData {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}
