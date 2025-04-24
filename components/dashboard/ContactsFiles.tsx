"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { supabaseClient } from '@/backend/supabaseClient';
import { IconUpload, IconCheck, IconX } from '@tabler/icons-react';

interface ContactFilesData {
  email: string;
  phone: string;
  address: string;
  cvFile: File | null;
  photoFile: File | null;
  cvUrl: string;
  photoUrl: string;
}

const ContactsAndFiles = () => {
  const [formData, setFormData] = useState<ContactFilesData>({
    email: '',
    phone: '',
    address: '',
    cvFile: null,
    photoFile: null,
    cvUrl: '',
    photoUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [uploadStatus, setUploadStatus] = useState({
    cv: '',
    photo: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (name === 'cvFile' && file.type !== 'application/pdf') {
        setUploadStatus({...uploadStatus, cv: 'error'});
        setMessage({ text: 'CV must be a PDF file', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        return;
      }
      
      if (name === 'photoFile' && !file.type.startsWith('image/')) {
        setUploadStatus({...uploadStatus, photo: 'error'});
        setMessage({ text: 'Please select a valid image file', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        return;
      }
      
      // Validate file size
      const maxSize = name === 'cvFile' ? 5 * 1024 * 1024 : 2 * 1024 * 1024; // 5MB for CV, 2MB for photo
      if (file.size > maxSize) {
        setUploadStatus({...uploadStatus, [name === 'cvFile' ? 'cv' : 'photo']: 'error'});
        setMessage({ 
          text: `File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`, 
          type: 'error' 
        });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        return;
      }
      
      // Update form data with selected file
      setFormData({
        ...formData,
        [name]: file
      });
      
      setUploadStatus({
        ...uploadStatus, 
        [name === 'cvFile' ? 'cv' : 'photo']: 'selected'
      });
    }
  };

  const uploadFileToSupabase = async (file: File, folder: string) => {
    try {
      const user = await supabaseClient.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) throw new Error('User not found');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;
      
      const { error: uploadError, } = await supabaseClient.storage
        .from('applicant_files')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabaseClient.storage
        .from('applicant_files')
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      const user = await supabaseClient.auth.getUser();
      const userId = user.data.user?.id;
      
      if (!userId) {
        setMessage({ text: 'You must be logged in to save information', type: 'error' });
        return;
      }
      
      // Upload files if selected
      let cvUrl = formData.cvUrl;
      let photoUrl = formData.photoUrl;
      
      if (formData.cvFile) {
        cvUrl = await uploadFileToSupabase(formData.cvFile, 'cv');
        setUploadStatus({...uploadStatus, cv: 'success'});
      }
      
      if (formData.photoFile) {
        photoUrl = await uploadFileToSupabase(formData.photoFile, 'photos');
        setUploadStatus({...uploadStatus, photo: 'success'});
      }
      
      // Update contact information and file URLs in database
      const { error } = await supabaseClient
        .from('contacts')
        .upsert({
          user_id: userId,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          cv_url: cvUrl,
          photo_url: photoUrl,
          updated_at: new Date()
        });
        
      if (error) throw error;
      
      setMessage({ text: 'Contact information and files saved successfully!', type: 'success' });
      
      // Update URLs in form data
      setFormData(prev => ({
        ...prev,
        cvUrl,
        photoUrl
      }));
    } catch (error) {
      console.error('Error saving information:', error);
      setMessage({ text: 'Failed to save information. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const renderUploadStatus = (type: 'cv' | 'photo') => {
    const status = type === 'cv' ? uploadStatus.cv : uploadStatus.photo;
    
    if (status === 'selected') {
      return (
        <span className="ml-2 text-blue-500 flex items-center">
          <IconCheck size={16} className="mr-1" /> File selected
        </span>
      );
    } else if (status === 'success') {
      return (
        <span className="ml-2 text-green-500 flex items-center">
          <IconCheck size={16} className="mr-1" /> Uploaded successfully
        </span>
      );
    } else if (status === 'error') {
      return (
        <span className="ml-2 text-red-500 flex items-center">
          <IconX size={16} className="mr-1" /> Upload failed
        </span>
      );
    }
    
    return null;
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  className="w-full p-2 border rounded-md bg-transparent"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          
          {/* File Uploads */}
          <div>
            <h2 className="text-xl font-medium mb-4">Required Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cvFile">CV (PDF only, max 5MB)</Label>
                <div className="flex items-center">
                  <label htmlFor="cvFile" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 p-2 border border-dashed rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                      <IconUpload size={20} />
                      <span>Select CV</span>
                    </div>
                    <input
                      id="cvFile"
                      name="cvFile"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {renderUploadStatus('cv')}
                </div>
                {formData.cvUrl && (
                  <div className="mt-2">
                    <a href={formData.cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      View uploaded CV
                    </a>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photoFile">Profile Photo (JPEG/PNG, max 2MB)</Label>
                <div className="flex items-center">
                  <label htmlFor="photoFile" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 p-2 border border-dashed rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                      <IconUpload size={20} />
                      <span>Select Photo</span>
                    </div>
                    <input
                      id="photoFile"
                      name="photoFile"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {renderUploadStatus('photo')}
                </div>
                {formData.photoUrl && (
                  <div className="mt-2">
                    <img 
                      src={formData.photoUrl} 
                      alt="Uploaded photo" 
                      className="h-20 w-20 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
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

export default ContactsAndFiles;