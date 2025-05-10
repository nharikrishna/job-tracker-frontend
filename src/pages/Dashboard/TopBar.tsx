import {useNavigate} from "react-router-dom";
import {LogOut} from "lucide-react";
import {Button} from "@/components/ui/button";
import Profile from "@/pages/Profile";


export default function TopBar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Job Tracker</h1>

            <div className="flex items-center gap-3">
                <Profile/>

                <Button
                    variant="destructive"
                    className="flex items-center gap-2 text-sm"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4"/>
                    Logout
                </Button>
            </div>
        </header>
    );
}
