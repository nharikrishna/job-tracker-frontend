import {createBrowserRouter} from "react-router-dom";
import App from "@/App";
import Login from "@/pages/Account/Login.tsx";
import Signup from "@/pages/Account/Signup.tsx";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/router/ProtectedRoute.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <Login/>},
            {path: "register", element: <Signup/>},
        ],
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Dashboard/>
            </ProtectedRoute>
        ),
    },
]);
