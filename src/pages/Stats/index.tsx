import {useEffect, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {getStats} from "@/pages/Stats/client";
import {Skeleton} from "@/components/ui/skeleton";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface StatsResponse {
    total_applications: number;
    status_breakdown: Record<string, number>;
    role_breakdown: Record<string, number>;
    monthly_trend: Record<string, number>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function StatsDashboard() {
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStats()
            .then(setStats)
            .catch((err) => {
                console.error("Failed to fetch stats", err);
            })
            .finally(() => setLoading(false));
    }, []);

    const transform = (obj: Record<string, number>) =>
        Object.entries(obj).map(([key, value]) => ({name: key, value}));

    return (
        <section className="w-full">
            <Card className="rounded-xl border bg-white p-4 shadow-sm">
                <CardContent className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Application Stats</h2>

                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-md"/>
                            ))}
                        </div>
                    ) : stats ? (
                        <div className="space-y-6">
                            <p className="text-sm text-gray-700">
                                <strong>Total Applications:</strong> {stats.total_applications}
                            </p>

                            <div
                                className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-gray-800 mb-2">
                                        Status Breakdown
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={transform(stats.status_breakdown)}
                                                dataKey="value"
                                                nameKey="name"
                                                outerRadius={100}
                                            >
                                                {transform(stats.status_breakdown).map((_, index) => (
                                                    <Cell key={`status-${index}`}
                                                          fill={COLORS[index % COLORS.length]}/>
                                                ))}
                                            </Pie>
                                            <Tooltip/>
                                            <Legend/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-gray-800 mb-2">
                                        Role Breakdown
                                    </h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={transform(stats.role_breakdown)}
                                                dataKey="value"
                                                nameKey="name"
                                                outerRadius={100}
                                            >
                                                {transform(stats.role_breakdown).map((_, index) => (
                                                    <Cell key={`role-${index}`}
                                                          fill={COLORS[index % COLORS.length]}/>
                                                ))}
                                            </Pie>
                                            <Tooltip/>
                                            <Legend/>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-base font-semibold text-gray-800 mb-2">
                                    Monthly Applications
                                </h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={transform(stats.monthly_trend)}>
                                        <CartesianGrid strokeDasharray="3 3"/>
                                        <XAxis dataKey="name"/>
                                        <YAxis allowDecimals={false}/>
                                        <Tooltip/>
                                        <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]}/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-red-500">Failed to load statistics.</p>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}