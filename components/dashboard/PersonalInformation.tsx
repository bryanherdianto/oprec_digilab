"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { addPersonalInformation } from '@/backend/formServices';
import { getCurrentUser } from '@/backend/googleServices';

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

interface PersonalInfoData {
    fullName: string;
    npm: string;
    dateOfBirth: string;
    batch: string;
}

const PersonalInformation = ({ data }: { data: data }) => {
    const [formData, setFormData] = useState<PersonalInfoData>({
        fullName: '',
        npm: '',
        dateOfBirth: '',
        batch: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        setFormData({
            fullName: data?.nama || '',
            npm: data?.npm || '',
            dateOfBirth: data?.tanggal_lahir.split('T')[0] || '',
            batch: data?.angkatan || ''
        });

        setIsSubmitted(data?.is_submitted);
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const user = await getCurrentUser();

            await addPersonalInformation({
                id: user?.id,
                nama: formData.fullName,
                npm: formData.npm,
                angkatan: formData.batch,
                tanggal_lahir: formData.dateOfBirth,
            });

            setMessage({ text: 'Personal information saved successfully!', type: 'success' });
        } catch (error) {
            console.error('Error saving personal information:', error);
            setMessage({ text: 'Failed to save information. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 p-4 max-w-3xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Personal Information</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Please provide your personal details for the application process.
                </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                disabled={isSubmitted || loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="npm">NPM (Student ID)</Label>
                            <Input
                                id="npm"
                                name="npm"
                                placeholder="Enter your NPM"
                                value={formData.npm}
                                onChange={handleChange}
                                required
                                disabled={isSubmitted || loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                                id="dateOfBirth"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                required
                                disabled={isSubmitted || loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="batch">Batch</Label>
                            <Input
                                id="batch"
                                name="batch"
                                placeholder="Enter your batch"
                                value={formData.batch}
                                onChange={handleChange}
                                required
                                disabled={isSubmitted || loading}
                            />
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-3 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <Button type="submit" disabled={loading || isSubmitted}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default PersonalInformation;