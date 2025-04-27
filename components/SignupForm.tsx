"use client";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  IconBrandGoogle,
} from "@tabler/icons-react";
import { signInWithGoogle, signUpWithEmail } from '../backend/googleServices';
import { motion, AnimatePresence } from "framer-motion";

export default function SignupForm() {
  const [emailSignupLoading, setEmailSignupLoading] = useState(false);
  const [googleSignInLoading, setGoogleSignInLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    valid: false,
    message: ''
  });

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

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
    setMessage('');

    if (!email) {
      setError('Email is required');
      return;
    }

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
      setEmailSignupLoading(true);
      const msg = await signUpWithEmail(email, password, firstName, lastName);
      setMessage(String(msg));
    } catch (error) {
      setError(String(error));
    } finally {
      setEmailSignupLoading(false);
    }
  };

  return (
    <div className="overflow-auto h-screen flex flex-col justify-start shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black relative">
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
        Welcome to Oprec Digilab
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Sign up to join the Digilab Open Recruitment process
      </p>

      <form className="mt-8" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" placeholder="Bryan" type="text" onChange={(e) => setFirstName(e.target.value)} />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Herdianto" type="text" onChange={(e) => setLastName(e.target.value)} />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="youremail@gmail.com" type="email" onChange={(e) => setEmail(e.target.value)} />
        </LabelInputContainer>

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
          type="submit"
          disabled={emailSignupLoading || googleSignInLoading}
          className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] disabled:opacity-50"
        >
          {emailSignupLoading ? 'Signing up...' : 'Sign up →'}
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-col items-center space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={emailSignupLoading || googleSignInLoading}
            className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] disabled:opacity-50"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              {googleSignInLoading ? 'Loading...' : 'Continue with Google'}
            </span>
            <BottomGradient />
          </button>

          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-neutral-800 dark:text-neutral-300 hover:underline">
              Login
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
