import {useEffect, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {toast} from "@/hooks/use-toast";
import {checkResumeMatch} from "./client";
import {getAllJobs} from "@/pages/Job/client";
import type {Job} from "@/types/job";

interface ResumeMatchResult {
    score: number;
    suggested_keywords: string[];
    remarks?: string;
}

export default function ResumeMatcher() {
    const [jobId, setJobId] = useState<string>("");
    const [jobs, setJobs] = useState<Job[]>([]);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [jdFile, setJdFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ResumeMatchResult | null>(null);


    useEffect(() => {
        (async () => {
            try {
                const data = await getAllJobs();
                setJobs(data);
            } catch (err) {
                toast({
                    title: "Error",
                    description: "Could not load job list.",
                    variant: "destructive",
                });
                console.error(err);
            }
        })();
    }, []);

    const handleSubmit = async () => {
        if (!jobId) {
            toast({
                title: "Missing Job",
                description: "Please select a job before checking.",
                variant: "destructive",
            });
            return;
        }

        if (!resumeFile) {
            toast({
                title: "Missing Resume",
                description: "Please upload your resume.",
                variant: "destructive",
            });
            return;
        }

        if (!jdFile) {
            toast({
                title: "Missing Job Description",
                description: "Please upload the job description.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const res = await checkResumeMatch(jobId, resumeFile, jdFile);
            setResult({
                score: res.score,
                suggested_keywords: res.suggestion_keywords || [],
                remarks: res.remarks || "",
            });

        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to process resume match.",
                variant: "destructive",
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="h-full w-full">
            <Card className="rounded-xl border bg-white p-4 shadow-sm">
                <CardContent className="space-y-4 text-sm text-gray-800">
                    <h2 className="text-2xl font-semibold text-gray-800">Resume Match Checker</h2>

                    <div className="space-y-2">
                        <Label htmlFor="job">Select Job</Label>
                        <Select value={jobId} onValueChange={setJobId}>
                            <SelectTrigger id="job">
                                <SelectValue placeholder="Choose job"/>
                            </SelectTrigger>
                            <SelectContent>
                                {jobs.map((job) => (
                                    <SelectItem key={job.id} value={job.id}>
                                        {job.company} - {job.role}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="resume">Upload Resume (PDF)</Label>
                        <Input
                            id="resume"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jd">Upload Job Description (PDF)</Label>
                        <Input
                            id="jd"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setJdFile(e.target.files?.[0] || null)}
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        size="sm"
                        className="mt-2"
                    >
                        {loading ? "Checking..." : "Check Match"}
                    </Button>

                    {result && (
                        <div className="pt-4 space-y-4">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                                <p className="text-lg font-semibold text-green-700">
                                    Match Score: <span
                                    className="text-green-900">{result.score}%</span>
                                </p>
                            </div>

                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-md font-semibold text-blue-700 mb-2">
                                    Suggested Keywords:
                                </p>
                                <ul className="list-disc ml-6 text-sm text-blue-800">
                                    {result.suggested_keywords.map((kw, i) => (
                                        <li key={i}>{kw}</li>
                                    ))}
                                </ul>
                            </div>
                            {result.remarks && (
                                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <p className="text-md font-semibold text-yellow-700 mb-1">
                                        Summary Remark:
                                    </p>
                                    <p className="text-sm text-yellow-800">{result.remarks}</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}