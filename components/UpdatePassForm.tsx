"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { updatePassword } from '../backend/googleServices';
import { motion, AnimatePresence } from "framer-motion";

export default function UpdatePassForm() {
    const [emailLoginLoading, setEmailLoginLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState({
        valid: false,
        message: ''
    });

    const checkPasswordStrength = (pass: string) => {
        if (!pass) {
            setPasswordStrength({ valid: false, message: '' });
            return;
        }

        const hasLetter = /[A-Za-z]/.test(pass);
        const hasNumber = /\d/.test(pass);
        const hasMinLength = pass.length >= 8;

        if (!hasMinLength) {
            setPasswordStrength({ valid: false, message: 'Password must be at least 8 characters' });
        } else if (!hasLetter) {
            setPasswordStrength({ valid: false, message: 'Password must include at least one letter' });
        } else if (!hasNumber) {
            setPasswordStrength({ valid: false, message: 'Password must include at least one number' });
        } else {
            setPasswordStrength({ valid: true, message: '' });
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!password) {
            setError('Password is required');
            return;
        }

        if (!passwordStrength.valid) {
            setError('Please use a stronger password');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            setEmailLoginLoading(true);
            await updatePassword(password);
            setMessage('Password has been updated successfully!');
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
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-md shadow"
                        >
                            {message}
                        </motion.div>
                    )}
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
                Update Your Password
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                Enter a new password for your account
            </p>

            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" placeholder="••••••••" type="password" onChange={(e) => {
                        setPassword(e.target.value);
                        checkPasswordStrength(e.target.value);
                    }} minLength={8} />
                    <AnimatePresence>
                        {!passwordStrength.valid && password && (
                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="text-sm text-red-500">
                                {passwordStrength.message}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" placeholder="••••••••" type="password" onChange={(e) => setConfirmPassword(e.target.value)} minLength={8} />
                    <AnimatePresence>
                        {password && confirmPassword && password !== confirmPassword && (
                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} className="text-sm text-red-500">
                                Passwords do not match
                            </motion.p>
                        )}
                    </AnimatePresence>
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50"
                    type="submit"
                    disabled={emailLoginLoading}
                >
                    {emailLoginLoading ? 'Updating...' : 'Update Password →'}
                    <BottomGradient />
                </button>
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
