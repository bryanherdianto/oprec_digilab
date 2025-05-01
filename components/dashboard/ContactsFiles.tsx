"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileUpload } from "@/components/ui/file-upload";
import { getCurrentUser } from '@/backend/googleServices';
import { addContactsFiles, uploadCV, uploadPhoto, uploadTranskrip } from '@/backend/formServices';

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
  transkripFile: File | null;
  cv_url?: string;
  foto_url?: string;
  transkrip_url?: string;
  is_submitted: boolean;
}

interface ContactFilesData {
  phone: string;
  discord_username: string;
  ig_username: string;
  line_username: string;
  cvFile: File | null;
  photoFile: File | null;
  transkripFile: File | null;
  cvUrl?: string;
  photoUrl?: string;
  transkripUrl?: string;
}

const ContactsFiles = ({ data }: { data: data }) => {
  const [formData, setFormData] = useState<ContactFilesData>({
    phone: '',
    discord_username: '',
    ig_username: '',
    line_username: '',
    cvFile: null,
    photoFile: null,
    transkripFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsSubmitted(data?.is_submitted);

    setFormData({
      phone: data?.phone || '',
      discord_username: data?.discord_username || '',
      ig_username: data?.ig_username || '',
      line_username: data?.line_username || '',
      cvFile: data?.cvFile || null,
      photoFile: data?.photoFile || null,
      transkripFile: data?.transkripFile || null,
      cvUrl: data?.cv_url || '',
      photoUrl: data?.foto_url || '',
      transkripUrl: data?.transkrip_url || ''
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

      if (!user) {
        throw new Error("User not found.");
      }

      // Check if files have been uploaded
      if (!formData.cvFile && !formData.photoFile && !formData.transkripFile) {
        setMessage({ text: 'Please upload the files needed!', type: 'error' });
        return;
      }

      // Check if new files are provided or if we should keep the existing ones
      const newCvUrl = formData.cvFile
        ? await uploadCV(formData.cvFile) // upload the new CV file if provided
        : formData.cvUrl; // keep existing CV URL if no new file is provided

      const newPhotoUrl = formData.photoFile
        ? await uploadPhoto(formData.photoFile) // upload the new photo file if provided
        : formData.photoUrl; // keep existing photo URL if no new file is provided

      // Add transkrip upload logic
      const newTranskripUrl = formData.transkripFile
        ? await uploadTranskrip(formData.transkripFile) // You'll need to create this function
        : formData.transkripUrl;

      // Now, update the user profile with the new or existing URLs
      await addContactsFiles({
        id: user.id,
        phone: formData.phone,
        ig_username: formData.ig_username,
        line_username: formData.line_username,
        discord_username: formData.discord_username,
        cv_url: newCvUrl, // Use new or existing CV URL
        foto_url: newPhotoUrl, // Use new or existing photo URL
        transkrip_url: newTranskripUrl
      });

      setMessage({ text: 'Contacts and files saved successfully!', type: 'success' });
    } catch (error) {
      console.error('Error saving contacts and files:', error);
      setMessage({ text: 'Failed to save information. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-3xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Contact Information & Files</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Please provide your contact details and upload required documents.
        </p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-medium mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isSubmitted || loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Discord Username</Label>
                <Input
                  id="discord_username"
                  name="discord_username"
                  placeholder="Enter your discord username"
                  value={formData.discord_username}
                  onChange={handleChange}
                  required
                  disabled={isSubmitted || loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Instagram Username</Label>
                <Input
                  id="ig_username"
                  name="ig_username"
                  placeholder="Enter your instagram username"
                  value={formData.ig_username}
                  onChange={handleChange}
                  required
                  disabled={isSubmitted || loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">LINE Username</Label>
                <Input
                  id="line_username"
                  name="line_username"
                  placeholder="Enter your line username"
                  value={formData.line_username}
                  onChange={handleChange}
                  required
                  disabled={isSubmitted || loading}
                />
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div>
            <h2 className="text-xl font-medium mb-4">Required Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload
                label="Upload CV"
                acceptedFileTypes={{ 'application/pdf': ['.pdf'] }}
                maxSizeMB={5}
                onChange={(file, desiredFilename) => {
                  if (file) {
                    setFormData(prev => ({ ...prev, cvFile: file, cvOutputFilename: desiredFilename }));
                  } else {
                    setFormData(prev => ({ ...prev, cvFile: null, cvOutputFilename: undefined }));
                  }
                }}
                disabled={isSubmitted || loading}
                initialFileUrl={formData.cvUrl} // Pass existing CV URL
              />

              <FileUpload
                label="Upload Profile Photo"
                acceptedFileTypes={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
                maxSizeMB={2}
                onChange={(file, desiredFilename) => {
                  if (file) {
                    setFormData(prev => ({ ...prev, photoFile: file, photoOutputFilename: desiredFilename }));
                  } else {
                    setFormData(prev => ({ ...prev, photoFile: null, photoOutputFilename: undefined }));
                  }
                }}
                disabled={isSubmitted || loading}
                initialFileUrl={formData.photoUrl} // Pass existing Photo URL
              />

              <FileUpload
                label="Upload Transkrip Nilai"
                acceptedFileTypes={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
                maxSizeMB={2}
                onChange={(file, desiredFilename) => {
                  if (file) {
                    setFormData(prev => ({ ...prev, transkripFile: file, transkripOutputFilename: desiredFilename }));
                  } else {
                    setFormData(prev => ({ ...prev, transkripFile: null, transkripOutputFilename: undefined }));
                  }
                }}
                disabled={isSubmitted || loading}
                initialFileUrl={formData.transkripUrl}
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

export default ContactsFiles;