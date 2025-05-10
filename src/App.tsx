import {Outlet} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";
import {Toaster} from "@/components/ui/toaster";

export default function App() {
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Outlet/>
            <Toaster/>
        </div>
    );
}
