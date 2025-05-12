import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {getCurrentUser} from "@/pages/Profile/client";
import type {User} from "@/types/user";
import {User as UserIcon} from "lucide-react";

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [err, setErr] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getCurrentUser();
                setUser(data);
            } catch (error: unknown) {
                setErr("Failed to load profile. Please try again.");
                console.error(error);
            }
        };
        fetchUser();
    }, []);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-sm">
                    <UserIcon className="w-4 h-4"/>
                    Profile
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-sm min-h-[24rem] rounded-2xl bg-white shadow-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <DialogTitle className="text-2xl font-semibold">Your Profile</DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                            View and manage your account
                        </DialogDescription>
                    </div>
                </div>

                <div className="mt-3">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-900">{user?.name || "N/A"}</p>
                            <p className="text-sm text-gray-500">{user?.email || "N/A"}</p>
                        </div>
                    </div>
                </div>

                {err && (
                    <p className="mt-3 text-sm text-red-600 text-center">{err}</p>
                )}

                {!err && user && (
                    <div className="mt-3 space-y-5">
                        <ProfileRow label="Role" value={user.role?.toLowerCase?.() || "N/A"}/>
                        <ProfileRow
                            label="Joined"
                            value={new Date(user.created_at).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function ProfileRow({label, value}: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center border-b pb-3">
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-sm font-medium text-gray-900">{value}</p>
        </div>
    );
}