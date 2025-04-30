import { createClient } from './supabaseClient';

const supabaseClient = createClient();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

export const signInWithGoogle = async () => {
    try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          })

        if (error) {
            throw error;
        }
    } catch (error) {
        console.error('Error signing in with Google:', error);
        throw error;
    }
};

export const signUpWithEmail = async (email, password, firstName = '', lastName = '') => {
    try {
        if (!EMAIL_REGEX.test(email)) {
            throw new Error('Invalid email format');
        }

        if (!PASSWORD_REGEX.test(password)) {
            throw new Error('Password must be at least 8 characters and include a letter and a number');
        }

        const displayName = [firstName, lastName].join(' ').trim();

        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
                data: {
                    display_name: displayName,
                }
            },
        });

        if (error) {
            if (error.message.includes('User already registered')) {
                throw new Error('User already registered. Please sign in instead.');
            }
            else if (error.message.includes('email rate limit exceeded')) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }
            throw error;
        }

        if (data?.user && !data.user.email_confirmed_at) {
            return 'Sign up successful! Check your email to verify your account.';
        }

        return data;
    } catch (error) {
        console.error('Error during sign-up:', error);
        throw error;
    }
};

export const signInWithEmail = async (email, password) => {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            if (error.message.includes('Email not confirmed')) {
                throw new Error('Please check your email for a confirmation link. You must confirm your email before signing in.');
            }
            if (error.message.includes('Invalid login credentials')) {
                throw new Error('Invalid email or password. Please try again.');
            }
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error signing in with email:', error);
        throw error;
    }
};

export const signOut = async () => {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) return;
  
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
  
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

export const getCurrentUser = async () => {
    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
};