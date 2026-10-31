
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function SigninPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            toast.error("Email and password are required");
            return;
        }

        try {
            setLoading(true);

            const { error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                toast.error(error.message || "Login failed");
                return;
            }

            toast.success("Login successful!");

            router.push("/");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (
        provider: "google" | "github"
    ) => {
        try {
            await authClient.signIn.social({
                provider,
                callbackURL: "/",
            });
        } catch {
            toast.error(`${provider} login failed`);
        }
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-100 px-4 py-12">

            {/* Background Decoration */}
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />

            <div className="relative w-full max-w-md">

                {/* Logo */}
                <Link href="/" className="mb-8 flex items-center justify-center gap-2">
                    <span className="text-4xl">🛒</span>
                    <span className="text-3xl font-extrabold tracking-tight text-[#168044]">
                        বাজার দর
                    </span>
                </Link>

                {/* Login Card */}
                <div className="rounded-3xl border border-green-100 bg-white/95 p-6 shadow-2xl shadow-green-900/10 sm:p-9">

                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-3xl">
                            👋
                        </div>

                        <h1 className="text-3xl font-extrabold text-gray-800">
                            Welcome Back!
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Sign in to continue to your account
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="example@email.com"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-700">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#168044] py-3.5 font-bold text-white shadow-lg shadow-green-800/20 transition hover:bg-[#116b38] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Sign In"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-gray-200" />
                        <span className="text-xs font-semibold text-gray-400">
                            OR CONTINUE WITH
                        </span>
                        <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-3">

                        <button
                            type="button"
                            onClick={() => handleSocialLogin("google")}
                            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            <span className="font-bold text-lg text-red-500">G</span>
                            Google
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin("github")}
                            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            <span className="text-lg">⌘</span>
                            GitHub
                        </button>

                    </div>

                    {/* Signup Link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            href="/signup"
                            className="font-bold text-[#168044] hover:underline"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    © 2026 বাজার দর. All rights reserved.
                </p>

            </div>
        </main>
    );
}
