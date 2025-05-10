export interface StatsResponse {
    total_applications: number;
    status_breakdown: Record<string, number>;
    role_breakdown: Record<string, number>;
    monthly_trend: Record<string, number>;
}