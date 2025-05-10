// Dashboard.tsx
import TopBar from "@/pages/Dashboard/TopBar";
import Job from "@/pages/Job";
import ResumeMatcher from "@/pages/ResumeMatcher";

import StatsDashboard from "@/pages/Stats";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            <TopBar/>
            <div className="flex flex-col items-center gap-6 p-4 mt-6">
                <div className="w-full max-w-4xl">
                    <Job/>
                </div>
                <div className="w-full max-w-4xl">
                    <ResumeMatcher/>
                </div>
                <div className="w-full max-w-4xl">
                    <StatsDashboard/>
                </div>
            </div>
        </div>
    );
}
