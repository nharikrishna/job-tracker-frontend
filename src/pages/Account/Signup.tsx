import React, {useEffect, useState} from "react";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {signup} from "@/pages/Account/client.ts";
import {handleApi} from "@/utils/apiHandler.ts";
import {Link} from "react-router-dom";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState("");
    const [err, setErr] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setErr("");
        setSuccess("");

        if (!email || !password || !name) return;

        const result = await handleApi(
            () => signup({name, email, password}),
            setErr
        );

        if (result) {
            setSuccess("Registration Successful! Please log in.");
            setName("");
            setEmail("");
            setPassword("");
            setSubmitted(false);
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm p-6 shadow-lg">
                <CardContent>
                    <h2 className="text-2xl font-bold text-left mb-6">Sign Up</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <Input
                                type="text"
                                placeholder="Username"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setSubmitted(false);
                                }}
                                className="h-12 text-base"
                            />
                            {submitted && !name && (
                                <p className="text-sm text-red-600 mt-1">Username is required</p>
                            )}
                        </div>

                        <div>
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setSubmitted(false);
                                }}
                                className="h-12 text-base"
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

                        {err && (
                            <p className="text-sm text-red-600 mt-1 text-center">
                                {err}
                            </p>
                        )}

                        {success && (
                            <div
                                className={`text-sm mt-2 text-center px-3 py-2 rounded-lg font-medium
                                 "text-green-700 bg-green-100 border border-green-300"`}
                            >
                                {success}
                            </div>
                        )}

                        <Button type="submit" className="w-full h-12 text-base">
                            Register
                        </Button>
                    </form>

                    <p className="text-sm text-center text-gray-600 mt-6">
                        Already have an account?{" "}
                        <Link to="/" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
