"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabaseClient } from '@/backend/supabaseClient';

interface EssayData {
    motivation: string;
    experience: string;
    contribution: string;
    commitment: string;
}

const Essays = () => {
    const [formData, setFormData] = useState<EssayData>({
        motivation: '',
        experience: '',
        contribution: '',
        commitment: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [wordCounts, setWordCounts] = useState({
        motivation: 0,
        experience: 0,
        contribution: 0,
        commitment: 0
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        // Update word count
        const words = value.trim().split(/\s+/).filter(Boolean).length;
        setWordCounts(prev => ({
            ...prev,
            [name]: words
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        // Check minimum word count (100 words per essay)
        const minWordCount = 100;
        const essayBelowMinimum = Object.entries(wordCounts).find(
            ([, count]) => count < minWordCount
        );

        if (essayBelowMinimum) {
            setMessage({
                text: `Your ${essayBelowMinimum[0]} essay is below the minimum word count of ${minWordCount} words.`,
                type: 'error'
            });
            setLoading(false);
            return;
        }

        try {
            const user = await supabaseClient.auth.getUser();
            const userId = user.data.user?.id;

            if (!userId) {
                setMessage({ text: 'You must be logged in to save essays', type: 'error' });
                return;
            }

            const { error } = await supabaseClient
                .from('essays')
                .upsert({
                    user_id: userId,
                    motivation_essay: formData.motivation,
                    experience_essay: formData.experience,
                    contribution_essay: formData.contribution,
                    commitment_essay: formData.commitment,
                    updated_at: new Date()
                });

            if (error) throw error;

            setMessage({ text: 'Essays saved successfully!', type: 'success' });
        } catch (error) {
            console.error('Error saving essays:', error);
            setMessage({ text: 'Failed to save essays. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-4 max-w-3xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Application Essays</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Please write thoughtful responses to the following questions. Each essay should be at least 100 words.
                </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <Label htmlFor="motivation" className="text-lg font-medium">
                            Why do you want to join the Digital Laboratory?
                            <span className="ml-2 text-sm text-gray-500">
                                ({wordCounts.motivation} words, minimum 100)
                            </span>
                        </Label>
                        <textarea
                            id="motivation"
                            name="motivation"
                            rows={5}
                            className="w-full p-2 border rounded-md bg-transparent"
                            placeholder="Describe your motivation for joining the Digital Laboratory..."
                            value={formData.motivation}
                            onChange={handleChange}
                            required
                        />
                        {wordCounts.motivation > 0 && wordCounts.motivation < 100 && (
                            <p className="text-amber-500 text-sm">
                                Please write at least 100 words ({100 - wordCounts.motivation} more words needed).
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="experience" className="text-lg font-medium">
                            Describe your relevant experience in programming or digital technology.
                            <span className="ml-2 text-sm text-gray-500">
                                ({wordCounts.experience} words, minimum 100)
                            </span>
                        </Label>
                        <textarea
                            id="experience"
                            name="experience"
                            rows={5}
                            className="w-full p-2 border rounded-md bg-transparent"
                            placeholder="Describe your technical experience..."
                            value={formData.experience}
                            onChange={handleChange}
                            required
                        />
                        {wordCounts.experience > 0 && wordCounts.experience < 100 && (
                            <p className="text-amber-500 text-sm">
                                Please write at least 100 words ({100 - wordCounts.experience} more words needed).
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contribution" className="text-lg font-medium">
                            How do you think you can contribute to the Digital Laboratory?
                            <span className="ml-2 text-sm text-gray-500">
                                ({wordCounts.contribution} words, minimum 100)
                            </span>
                        </Label>
                        <textarea
                            id="contribution"
                            name="contribution"
                            rows={5}
                            className="w-full p-2 border rounded-md bg-transparent"
                            placeholder="Describe how you can contribute..."
                            value={formData.contribution}
                            onChange={handleChange}
                            required
                        />
                        {wordCounts.contribution > 0 && wordCounts.contribution < 100 && (
                            <p className="text-amber-500 text-sm">
                                Please write at least 100 words ({100 - wordCounts.contribution} more words needed).
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="commitment" className="text-lg font-medium">
                            How will you manage your time and commitment if selected?
                            <span className="ml-2 text-sm text-gray-500">
                                ({wordCounts.commitment} words, minimum 100)
                            </span>
                        </Label>
                        <textarea
                            id="commitment"
                            name="commitment"
                            rows={5}
                            className="w-full p-2 border rounded-md bg-transparent"
                            placeholder="Describe your commitment plan..."
                            value={formData.commitment}
                            onChange={handleChange}
                            required
                        />
                        {wordCounts.commitment > 0 && wordCounts.commitment < 100 && (
                            <p className="text-amber-500 text-sm">
                                Please write at least 100 words ({100 - wordCounts.commitment} more words needed).
                            </p>
                        )}
                    </div>

                    {message.text && (
                        <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Essays;