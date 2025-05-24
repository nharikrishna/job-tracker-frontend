// Imports remain unchanged
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import {
    createJob,
    deleteJob as deleteJobAPI,
    getAllJobs,
    updateJob,
} from "@/pages/Job/client";
import { type Job, JOB_STATUSES } from "@/types/job";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { getResumeMatch } from "@/pages/ResumeMatcher/client.ts";

const getStatusLabel = (val: string) =>
    JOB_STATUSES.find((s) => s.value.toLowerCase() === val.toLowerCase())?.label || "Select status";

const StatusSelect = ({
                          currentValue,
                          onChange,
                          onSave,
                          hasChanged,
                      }: {
    jobId: string;
    currentValue: string;
    onChange: (val: string) => void;
    onSave: () => void;
    hasChanged: boolean;
}) => (
    <div className="flex items-center gap-2">
        <Select value={currentValue} onValueChange={onChange}>
            <SelectTrigger className="w-[140px]">
                <SelectValue>{getStatusLabel(currentValue)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
                {JOB_STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                        {status.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        {hasChanged && (
            <Button size="sm" onClick={onSave} className="text-xs">
                Save
            </Button>
        )}
    </div>
);

export default function Job() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [statusChanges, setStatusChanges] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [openJob, setOpenJob] = useState<Job | null>(null);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [newCompany, setNewCompany] = useState("");
    const [newRole, setNewRole] = useState("");
    const [newStatus, setNewStatus] = useState("WISHLIST");
    const [newApplicationDate, setNewApplicationDate] = useState("");
    const [newNotes, setNewNotes] = useState("");
    const [newTags, setNewTags] = useState("");
    const [matchScore, setMatchScore] = useState<number | null>(null);
    const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const data = await getAllJobs();
                setJobs(data);
            } catch (err) {
                console.error("Failed to fetch jobs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleOpenJob = async (job: Job) => {
        setOpenJob(job);
        try {
            const match = await getResumeMatch(job.id);
            if (match) {
                setMatchScore(match.score);
                setSuggestedKeywords(match.suggestion_keywords || []);
            } else {
                setMatchScore(null);
                setSuggestedKeywords([]);
            }
        } catch (error) {
            console.error("Failed to fetch resume match", error);
            setMatchScore(null);
            setSuggestedKeywords([]);
        }
    };

    const handleStatusChange = (jobId: string, newStatus: string) => {
        setStatusChanges((prev) => ({ ...prev, [jobId]: newStatus }));
    };

    const saveStatus = async (jobId: string) => {
        const updatedStatus = statusChanges[jobId];
        try {
            const updated = await updateJob(jobId, { status: updatedStatus });
            setJobs((prev) =>
                prev.map((job) => (job.id === jobId ? { ...job, status: updated.status } : job))
            );
        } catch (error) {
            console.error("Failed to update job status", error);
            toast({
                title: "Update Failed",
                description: "Could not update the job status.",
                variant: "destructive",
            });
        } finally {
            setStatusChanges((prev) => {
                const updated = { ...prev };
                delete updated[jobId];
                return updated;
            });
        }
    };

    const deleteJob = async (jobId: string) => {
        const job = jobs.find((j) => j.id === jobId);
        if (!window.confirm(`Are you sure you want to delete "${job?.company}"?`)) return;

        try {
            await deleteJobAPI(jobId);
            setJobs((prev) => prev.filter((job) => job.id !== jobId));
            toast({
                title: "Job Deleted",
                description: `${job?.company} has been removed.`,
            });
        } catch (error) {
            console.error("Failed to delete job", error);
            toast({
                title: "Delete Failed",
                description: "Something went wrong while deleting the job.",
                variant: "destructive",
            });
        }
    };

    const handleCreate = async () => {
        if (!newCompany || !newRole) return;
        try {
            const created = await createJob({
                company: newCompany,
                role: newRole,
                status: newStatus,
                application_date: newApplicationDate || undefined,
                notes: newNotes || undefined,
                tags: newTags ? newTags.split(",").map((tag) => tag.trim()) : undefined,
            });
            setJobs((prev) => [...prev, created]);
            setCreateDialogOpen(false);
            setNewCompany("");
            setNewRole("");
            setNewStatus("WISHLIST");
            setNewApplicationDate("");
            setNewNotes("");
            setNewTags("");
        } catch (error) {
            console.error("Failed to create job", error);
            toast({
                title: "Creation Failed",
                description: "Could not create the job.",
                variant: "destructive",
            });
        }
    };

    return (
        <section className="h-full w-full">
            <Card className="rounded-xl border bg-white p-4 shadow-sm">
                <CardContent className="space-y-4">
                    {/* header */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Job Applications</h2>
                        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="default">+ Job</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-xl">
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-semibold">Add New Job</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 text-sm text-gray-700">
                                    <Input placeholder="Company" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} />
                                    <Input placeholder="Role" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
                                    <Select value={newStatus} onValueChange={setNewStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {JOB_STATUSES.map((status) => (
                                                <SelectItem key={status.value} value={status.value}>
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Input type="date" value={newApplicationDate} onChange={(e) => setNewApplicationDate(e.target.value)} />
                                    <Input placeholder="Notes" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
                                    <Input placeholder="Tags (comma-separated)" value={newTags} onChange={(e) => setNewTags(e.target.value)} />
                                    <Button onClick={handleCreate} className="w-full">Create Job</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* body */}
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : jobs.length === 0 ? (
                        <p className="text-lg text-gray-500">No applications found.</p>
                    ) : (
                        <>
                            <div className="block md:hidden space-y-6">
                                {jobs.map((job) => {
                                    const statusValue = statusChanges[job.id] || job.status;
                                    return (
                                        <div key={job.id} className="border rounded-xl p-4 space-y-2 shadow-sm">
                                            <div className="text-base font-medium text-gray-900 cursor-pointer" onClick={() => handleOpenJob(job)}>
                                                {job.company}
                                                <div className="border-b border-gray-300 mt-1 w-full" />
                                            </div>
                                            <div className="text-sm font-semibold text-gray-800">Role: {job.role}</div>
                                            <div className="text-sm font-semibold text-gray-800">Created: {format(new Date(job.created_at), "dd MMM yyyy")}</div>
                                            <StatusSelect
                                                jobId={job.id}
                                                currentValue={statusValue}
                                                onChange={(val) => handleStatusChange(job.id, val)}
                                                onSave={() => saveStatus(job.id)}
                                                hasChanged={statusChanges[job.id] !== undefined}
                                            />
                                            <Button variant="ghost" size="icon" onClick={() => deleteJob(job.id)}>
                                                <Trash2 className="w-4 h-4 text-red-600" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="hidden md:block overflow-hidden">
                                <table className="min-w-full text-sm text-left">
                                    <thead>
                                    <tr className="border-b text-gray-700 text-base">
                                        <th className="py-2 px-4">Company</th>
                                        <th className="py-2 px-4">Role</th>
                                        <th className="py-2 px-4">Status</th>
                                        <th className="py-2 px-4">Created At</th>
                                        <th className="py-2 px-4">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {jobs.map((job) => {
                                        const statusValue = statusChanges[job.id] || job.status;
                                        return (
                                            <tr key={job.id} className="border-b hover:bg-gray-50">
                                                <td className="py-2 px-4 text-base text-gray-900 cursor-pointer" onClick={() => handleOpenJob(job)}>
                                                    {job.company}
                                                </td>
                                                <td className="py-2 px-4 text-base text-gray-900">{job.role}</td>
                                                <td className="py-2 px-4">
                                                    <StatusSelect
                                                        jobId={job.id}
                                                        currentValue={statusValue}
                                                        onChange={(val) => handleStatusChange(job.id, val)}
                                                        onSave={() => saveStatus(job.id)}
                                                        hasChanged={statusChanges[job.id] !== undefined}
                                                    />
                                                </td>
                                                <td className="py-2 px-4 text-gray-700">{format(new Date(job.created_at), "dd MMM yyyy, hh:mm a")}</td>
                                                <td className="py-2 px-4">
                                                    <Button variant="ghost" size="icon" onClick={() => deleteJob(job.id)}>
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>

                            {openJob && (
                                <Dialog open={!!openJob} onOpenChange={() => setOpenJob(null)}>
                                    <DialogContent className="max-w-md rounded-xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-semibold">
                                                {openJob.company}
                                                <div className="border-b border-gray-200 mt-1" />
                                            </DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <p><strong>Role:</strong> {openJob.role}</p>
                                            <p><strong>Status:</strong> {getStatusLabel(openJob.status)}</p>
                                            <p><strong>Application Date:</strong> {openJob.application_date ? format(new Date(openJob.application_date), "dd MMM yyyy") : "Not specified"}</p>
                                            <p><strong>Notes:</strong> {openJob.notes || "None"}</p>
                                            <p><strong>Tags:</strong> {openJob.tags?.join(", ") || "None"}</p>
                                            <p>
                                                <strong>Resume File:</strong>{" "}
                                                {openJob.resume_file_path ? (
                                                    <a
                                                        href={`${openJob.resume_file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 underline"
                                                    >
                                                        Download Resume
                                                    </a>
                                                ) : (
                                                    "None"
                                                )}
                                            </p>
                                            <p>
                                                <strong>Job Description File:</strong>{" "}
                                                {openJob.job_description_file_path ? (
                                                    <a
                                                        href={`${openJob.job_description_file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 underline"
                                                    >
                                                        Download Job Description
                                                    </a>
                                                ) : (
                                                    "None"
                                                )}
                                            </p>
                                            {matchScore !== null && (
                                                <p><strong>Match Score:</strong> {Math.round(matchScore)}%</p>
                                            )}
                                            {suggestedKeywords.length > 0 && (
                                                <p><strong>Suggested Keywords:</strong> {suggestedKeywords.join(", ")}</p>
                                            )}
                                            <p><strong>Created At:</strong> {format(new Date(openJob.created_at), "dd MMM yyyy, hh:mm a")}</p>
                                            <p><strong>Updated At:</strong> {format(new Date(openJob.updated_at), "dd MMM yyyy, hh:mm a")}</p>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
