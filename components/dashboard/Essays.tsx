"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { changeStatus, addEssays } from '@/backend/formServices';
import { getCurrentUser } from '@/backend/googleServices';
import { useRouter } from 'next/navigation';

interface data {
    nama: string;
    npm: string;
    tanggal_lahir: string;
    angkatan: string;
    question_1: string;
    question_2: string;
    question_3: string;
    question_4: string;
    phone: string;
    discord_username: string;
    ig_username: string;
    line_username: string;
    cvFile: File | null;
    photoFile: File | null;
    cv_url?: string;
    foto_url?: string;
    is_submitted: boolean;
}

interface EssayData {
    motivation: string;
    experience: string;
    contribution: string;
    commitment: string;
}

const Essays = ({ data }: { data: data }) => {
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
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const initialFormData = {
            motivation: data?.question_1 || '',
            experience: data?.question_2 || '',
            contribution: data?.question_3 || '',
            commitment: data?.question_4 || ''
        };

        setFormData(initialFormData);
        setIsSubmitted(data?.is_submitted);

        const newWordCounts = Object.fromEntries(
            Object.entries(initialFormData).map(([key, value]) => [
                key,
                value.trim().split(/\s+/).filter(Boolean).length
            ])
        ) as { motivation: number; experience: number; contribution: number; commitment: number; };
        setWordCounts(newWordCounts);
    }, [data]);

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

        // Check minimum word count (50 words per essay)
        const minWordCount = 50;
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
            const user = await getCurrentUser();
            const userId = user?.id;

            if (!userId) {
                setMessage({ text: 'You must be logged in to save essays', type: 'error' });
                return;
            }

            await addEssays({
                id: userId,
                question_1: formData.motivation,
                question_2: formData.experience,
                question_3: formData.contribution,
                question_4: formData.commitment
            });

            setMessage({ text: 'Essays saved successfully!', type: 'success' });
        } catch (error) {
            console.error('Error saving essays:', error);
            setMessage({ text: 'Failed to save essays. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const user = await getCurrentUser();
            const userId = user?.id;

            if (!userId) {
                setMessage({ text: 'You must be logged in to submit application', type: 'error' });
                return;
            }

            await changeStatus({
                id: userId,
                is_submitted: true
            });

            setMessage({ text: 'Application submitted successfully!', type: 'success' });
            setTimeout(() => {
                router.push('/registration');
            }, 1000);
        } catch (error) {
            console.error('Error submitting application:', error);
            if (error instanceof Error && error.message.includes("NULL")) {
                setMessage({ text: 'Failed to submit application. There are still some empty fields.', type: 'error' });
            } else {
                setMessage({ text: 'Failed to submit application. Please try again.', type: 'error' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-4 max-w-3xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Application Essays</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Mohon tulis jawaban yang lengkap untuk pertanyaan-pertanyaan berikut. Setiap esai minimal harus 50 kata.
                </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <Label htmlFor="motivation" className="text-lg font-medium">
                            Apa alasan atau motivasi utama kamu ingin bergabung sebagai Asisten Lab Digital?
                            <span className="ml-2 text-sm text-gray-500">
                                ({wordCounts.motivation} kata, minimal 50)
                            </span>
                        </Label>
                        <textarea
                            id="motivation"
                            name="motivation"
                            rows={5}
                            className="w-full p-2 border rounded-md bg-transparent"
                            placeholder="Jelaskan motivasi kamu untuk bergabung dengan Lab Digital..."
                            value={formData.motivation}
                            onChange={handleChange}
                            disabled={isSubmitted || loading}
                            required
                        />
                        {wordCounts.motivation > 0 && wordCounts.motivation < 50 && (
                            <p className="text-amber-500 text-sm">
                                Mohon tulis minimal 50 kata ({50 - wordCounts.motivation} kata lagi).
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="experience" className="text-lg font-medium">
                            Apa arti dan tugas seorang Asisten Lab menurut kamu?
                            <span className="ml-2 text-sm text-gray-500">
                                ({wordCounts.experience} kata, minimal 50)
                            </span>
                        </Label>
                        <textarea
                            id="experience"
                            name="experience"
                            rows={5}
                            className="w-full p-2 border rounded-md bg-transparent"
                            placeholder="Jelaskan arti dan tugas seorang aslab..."
                            value={formData.experience}
                            onChange={handleChange}
                            disabled={isSubmitted || loading}
                            required
                        />
                        {wordCounts.experience > 0 && wordCounts.experience < 50 && (
                            <p className="text-amber-500 text-sm">
                                Mohon tulis minimal 50 kata ({50 - wordCounts.experience} kata lagi).
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contribution" className="text-lg font-medium">
                            Menurut kamu, orang seperti apa yang layak menjadi Asisten Lab?
                            <span className="ml-2 text-sm text-gray-500">
                                ({wordCounts.contribution} kata, minimal 50)
                            </span>
                        </Label>
                        <textarea
                            id="contribution"
                            name="contribution"
                            rows={5}
                            className="w-full p-2 border rounded-md bg-transparent"
                            placeholder="Jelaskan pendapat kamu..."
                            value={formData.contribution}
                            onChange={handleChange}
                            disabled={isSubmitted || loading}
                            required
                        />
                        {wordCounts.contribution > 0 && wordCounts.contribution < 50 && (
                            <p className="text-amber-500 text-sm">
                                Mohon tulis minimal 50 kata ({50 - wordCounts.contribution} kata lagi).
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="commitment" className="text-lg font-medium">
                            Bagaimana cara untuk mengatur waktu dan komitmen kamu jika terpilih menjadi Asisten Lab?
                            <span className="ml-2 text-sm text-gray-500">
                                ({wordCounts.commitment} kata, minimal 50)
                            </span>
                        </Label>
                        <textarea
                            id="commitment"
                            name="commitment"
                            rows={5}
                            className="w-full p-2 border rounded-md bg-transparent"
                            placeholder="Jelaskan rencana komitmen kamu..."
                            value={formData.commitment}
                            onChange={handleChange}
                            disabled={isSubmitted || loading}
                            required
                        />
                        {wordCounts.commitment > 0 && wordCounts.commitment < 50 && (
                            <p className="text-amber-500 text-sm">
                                Mohon tulis minimal 50 kata ({50 - wordCounts.commitment} kata lagi).
                            </p>
                        )}
                    </div>

                    {message.text && (
                        <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className='flex justify-between'>
                        <Button type="submit" disabled={loading || isSubmitted}>
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                        <Button variant="outline" onClick={handleSubmitApplication} disabled={loading || isSubmitted}>
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Essays;