import { supabaseClient, checkSupabaseConnection } from './supabaseClient';

// File upload functions using Supabase Storage
export const uploadFile = async (file, bucketName) => {
  try {
    // First check if Supabase connection is working
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to database. Please check your internet connection and try again.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(filePath, file);

    if (error) {
      console.error(`Error uploading to ${bucketName}:`, error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    const { data: urlData } = supabaseClient.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error(`Error uploading file to ${bucketName}:`, error);
    throw error;
  }
};

export const uploadCV = async (file) => {
  return uploadFile(file, 'cv-files');
};

export const uploadPhoto = async (file) => {
  return uploadFile(file, 'profile-photos');
};

// Application submission function
export const submitApplication = async (formData) => {
  try {
    // Check connection first
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to database. Please check your internet connection and try again.');
    }
    
    const { data, error } = await supabaseClient
      .from('applicants')
      .insert([formData])
      .select();
    
    if (error) {
      console.error('Error submitting application:', error);
      throw new Error(`Failed to submit application: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

// Check if application already exists
export const checkExistingApplication = async (email) => {
  try {
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      return false; // If we can't connect, assume no existing application
    }
    
    const { data, error } = await supabaseClient
      .from('applicants')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No records found, which is fine
        return false;
      }
      console.error('Error checking existing application:', error);
      throw new Error(`Failed to check existing application: ${error.message}`);
    }
    
    return !!data;
  } catch (error) {
    console.error('Error checking existing application:', error);
    throw error;
  }
};

// Save form progress
export const saveFormProgress = async (email, step, formData) => {
  try {
    // Validate input parameters
    if (!email) throw new Error('Email is required');
    if (!step || ![1, 2, 3].includes(step)) throw new Error('Valid step number is required');

    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to database. Please check your internet connection and try again.');
    }
    
    const currentTimestamp = new Date().toISOString();
    
    // Mark the current step as completed
    const stepData = {
      ...formData,
      [`step${step}_completed`]: true,
      last_updated: currentTimestamp,
      status: 'draft',
    };
    
    // Check if draft already exists
    const { data: existingData, error: checkError } = await supabaseClient
      .from('applicants_draft')
      .select('*')
      .eq('email', email)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing draft:', checkError);
      throw new Error(`Failed to check existing draft: ${checkError.message}`);
    }
    
    // If draft exists, update it; otherwise, insert new record
    if (existingData) {
      const { data, error: updateError } = await supabaseClient
        .from('applicants_draft')
        .update(stepData)
        .eq('email', email)
        .select();
        
      if (updateError) {
        console.error('Error updating draft:', updateError);
        throw new Error(`Failed to update draft: ${updateError.message}`);
      }

      return data;
    } else {
      const { data, error: insertError } = await supabaseClient
        .from('applicants_draft')
        .insert([{ ...stepData, email }])
        .select();
        
      if (insertError) {
        console.error('Error creating draft:', insertError);
        throw new Error(`Failed to create draft: ${insertError.message}`);
      }

      return data;
    }
  } catch (error) {
    console.error('Error saving form progress:', error);
    throw error;
  }
};

// Get saved form progress
export const getFormProgress = async (email) => {
  try {
    if (!email) {
      console.error('Email is required for getFormProgress');
      return null;
    }
    
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to database. Please check your internet connection and try again.');
    }
    
    const { data, error } = await supabaseClient
      .from('applicants_draft')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // No draft found, which is fine for new users
        console.log(`No existing draft found for ${email}`);
        return null;
      }
      
      console.error('Error getting form progress:', error);
      throw new Error(`Failed to get form progress: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error getting form progress:', error);
    throw error; // Throw error instead of returning null to propagate it properly
  }
};

// Finalize application by moving it from draft to submitted
export const finalizeApplication = async (email) => {
  try {
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
      throw new Error('Cannot connect to database. Please check your internet connection and try again.');
    }
    
    // Get the draft application
    const { data: draftData, error: draftError } = await supabaseClient
      .from('applicants_draft')
      .select('*')
      .eq('email', email)
      .single();
      
    if (draftError) {
      console.error('Error getting draft for finalization:', draftError);
      throw new Error(`Failed to get draft for finalization: ${draftError.message}`);
    }
    
    if (!draftData) {
      throw new Error('No draft application found');
    }
    
    // Validate all required fields are complete
    const validation1 = validateFormStep(1, draftData);
    const validation2 = validateFormStep(2, draftData);
    const validation3 = validateFormStep(3, draftData);
    
    if (!validation1.valid || !validation2.valid || !validation3.valid) {
      const message = [validation1, validation2, validation3]
        .filter(v => !v.valid)
        .map(v => v.message)
        .join('; ');
      throw new Error(`Cannot submit incomplete application: ${message}`);
    }
    
    // Remove draft-specific fields
    const { 
      step1_completed, 
      step2_completed, 
      step3_completed, 
      status, 
      id, 
      created_at, 
      ...applicationData 
    } = draftData;
    
    // Add submission timestamp
    applicationData.submitted_at = new Date().toISOString();
    
    // Insert into applicants table
    const { data, error } = await supabaseClient
      .from('applicants')
      .insert([applicationData])
      .select();
      
    if (error) {
      console.error('Error inserting finalized application:', error);
      throw new Error(`Failed to submit application: ${error.message}`);
    }
    
    // Update status in draft table
    const { error: updateError } = await supabaseClient
      .from('applicants_draft')
      .update({ status: 'submitted' })
      .eq('email', email);
      
    if (updateError) {
      console.warn('Failed to update draft status:', updateError);
      // Don't throw here, as the application is already submitted
    }
      
    return data;
  } catch (error) {
    console.error('Error finalizing application:', error);
    throw error;
  }
};

// Validate form step
export const validateFormStep = (step, formData) => {
  switch(step) {
    case 1: // Personal Information
      if (!formData.nama || formData.nama.trim() === '') {
        return { valid: false, message: 'Full Name is required' };
      }
      if (!formData.npm || formData.npm.trim() === '') {
        return { valid: false, message: 'NPM is required' };
      }
      if (!formData.angkatan || formData.angkatan.trim() === '') {
        return { valid: false, message: 'Batch Year is required' };
      }
      return { valid: true };
      
    case 2: // Contact Files
      if (!formData.cv_url || formData.cv_url.trim() === '') {
        return { valid: false, message: 'CV upload is required' };
      }
      if (!formData.foto_url || formData.foto_url.trim() === '') {
        return { valid: false, message: 'Profile photo upload is required' };
      }
      if (!formData.ig_username || formData.ig_username.trim() === '') {
        return { valid: false, message: 'Instagram username is required' };
      }
      if (!formData.line_username || formData.line_username.trim() === '') {
        return { valid: false, message: 'Line ID is required' };
      }
      return { valid: true };
      
    case 3: // Essays
      const minWords = 100;
      const countWords = text => (text || '').trim().split(/\s+/).filter(Boolean).length;
      
      if (!formData.question_1 || formData.question_1.trim() === '') {
        return { valid: false, message: 'First essay question must be answered' };
      }
      if (countWords(formData.question_1) < minWords) {
        return { valid: false, message: `First essay must be at least ${minWords} words` };
      }
      
      if (!formData.question_2 || formData.question_2.trim() === '') {
        return { valid: false, message: 'Second essay question must be answered' };
      }
      if (countWords(formData.question_2) < minWords) {
        return { valid: false, message: `Second essay must be at least ${minWords} words` };
      }
      
      if (!formData.question_3 || formData.question_3.trim() === '') {
        return { valid: false, message: 'Third essay question must be answered' };
      }
      if (countWords(formData.question_3) < minWords) {
        return { valid: false, message: `Third essay must be at least ${minWords} words` };
      }
      
      if (!formData.question_4 || formData.question_4.trim() === '') {
        return { valid: false, message: 'Fourth essay question must be answered' };
      }
      if (countWords(formData.question_4) < minWords) {
        return { valid: false, message: `Fourth essay must be at least ${minWords} words` };
      }
      
      return { valid: true };
      
    default:
      return { valid: false, message: 'Invalid step' };
  }
};