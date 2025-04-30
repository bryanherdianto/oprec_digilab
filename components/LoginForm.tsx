"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    IconBrandGoogle,
} from "@tabler/icons-react";
import { signInWithGoogle, signInWithEmail } from '../backend/googleServices';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();
    const [emailLoginLoading, setEmailLoginLoading] = useState(false);
    const [googleSignInLoading, setGoogleSignInLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        try {
            setGoogleSignInLoading(true);
            setError('');
            await signInWithGoogle();
        } catch (error) {
            setError(`Login failed: ${error}`);
        } finally {
            setGoogleSignInLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email is required');
            return;
        }
        if (!password) {
            setError('Password is required');
            return;
        }
        try {
            setEmailLoginLoading(true);
            await signInWithEmail(email, password);
            router.push("/registration");
        } catch (error) {
            setError(String(error));
        } finally {
            setEmailLoginLoading(false);
        }
    };

    return (
        <div className="overflow-auto h-screen flex flex-col justify-start shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
            <div className="fixed z-50 top-4 right-4 left-4 sm:left-auto space-y-2">
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded-md shadow"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                Welcome to Oprec Digilab
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                Login to join the Digilab Open Recruitment process
            </p>

            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        placeholder="youremail@gmail.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={emailLoginLoading || googleSignInLoading}
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={emailLoginLoading || googleSignInLoading}
                    />
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50"
                    type="submit"
                    disabled={emailLoginLoading || googleSignInLoading}
                >
                    {emailLoginLoading ? 'Logging in...' : 'Login →'}
                    <BottomGradient />
                </button>

                <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                <div className="flex flex-col items-center space-y-4">
                    <button
                        type="button"
                        className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] disabled:opacity-50"
                        onClick={handleGoogleLogin}
                        disabled={emailLoginLoading || googleSignInLoading}
                    >
                        <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            {googleSignInLoading ? 'Loading...' : 'Continue with Google'}
                        </span>
                        <BottomGradient />
                    </button>

                    <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-semibold text-neutral-800 dark:text-neutral-300 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
            <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};
