import React, {useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {login} from "@/pages/Account/client.ts";
import {handleApi} from "@/utils/apiHandler.ts";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [err, setErr] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        if (!email || !password) return;

        const params = new URLSearchParams();
        params.append("username", email);
        params.append("password", password);

        const result = await handleApi(() => login(params), setErr);
        if (result) {
            localStorage.setItem("token", result.access_token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${result.access_token}`;
            navigate("/dashboard");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm p-6 shadow-lg">
                <CardContent>
                    <h2 className="text-2xl font-bold text-left mb-6">Login</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setSubmitted(false);
                                }}
                                className={`h-12 text-base`}
                            />
                            {submitted && !email && (
                                <p className="text-sm text-red-600 mt-1">Email is required</p>
                            )}
                        </div>

                        <div>
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setSubmitted(false);
                                }}
                                className="h-12 text-base"
                            />
                            {submitted && !password && (
                                <p className="text-sm text-red-600 mt-1">Password is required</p>
                            )}
                        </div>

                        {err && submitted && (
                            <p className="mt-2 text-sm text-red-600">
                                {err}
                            </p>
                        )}

                        <Button type="submit" className="w-full h-12 text-base">
                            Login
                        </Button>
                    </form>

                    <p className="text-sm text-center text-gray-600 mt-6">
                        Don't have an account? {" "}
                        <Link to="/register"
                              className="text-blue-600 hover:underline">Register</Link>

                    </p>
                </CardContent>
            </Card>
        </div>
    );
}