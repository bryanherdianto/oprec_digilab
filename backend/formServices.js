'use server';

import { createClient } from "./supabaseServer";

export const getCurrentUser = async () => {
  try {
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export const uploadFile = async (file, bucketName) => {
  try {
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

export const addPersonalInformation = async (user) => {
  try {
    const { data, error } = await supabaseClient
      .from('applicants')
      .upsert([
        {
          id: user.id,
          nama: user.nama,
          npm: user.npm,
          angkatan: user.angkatan,
          tanggal_lahir: user.tanggal_lahir
        }
      ])
    if (error) {
      console.error('Error adding personal information:', error);
      throw new Error(`Failed to add personal information: ${error.message}`);
    }
    return data;
  } catch (error) {
    console.error('Error adding personal information:', error);
    throw error;
  }
}

export const addContactsFiles = async (user) => {
  try {
    const { data, error } = await supabaseClient
      .from('applicants')
      .upsert([
        {
          id: user.id,
          phone: user.phone,
          address: user.address,
          ig_username: user.ig_username,
          line_username: user.line_username,
          discord_username: user.discord_username,
          cv_url: user.cv_url,
          foto_url: user.foto_url
        }
      ])
    if (error) {
      console.error('Error adding contacts and files:', error);
      throw new Error(`Failed to add contacts and files: ${error.message}`);
    }
    return data;
  } catch (error) {
    console.error('Error adding contacts and files:', error);
    throw error;
  }
}

export const addEssays = async (user) => {
  try {
    const { data, error } = await supabaseClient
      .from('applicants')
      .upsert([
        {
          id: user.id,
          question_1: user.question_1,
          question_2: user.question_2,
          question_3: user.question_3,
          question_4: user.question_4
        }
      ])
    if (error) {
      console.error('Error adding essays:', error);
      throw new Error(`Failed to add essays: ${error.message}`);
    }
    return data;
  } catch (error) {
    console.error('Error adding essays:', error);
    throw error;
  }
}

export const changeStatus = async (user) => {
  try {
    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !authUser) {
      throw new Error('User is not authenticated.');
    }

    const userId = authUser.id;

    const { data: applicantData, error: fetchError } = await supabaseClient
      .from('applicants')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching user data:', fetchError);
      throw new Error(`Failed to fetch user data: ${fetchError.message}`);
    }

    const nullFields = [];
    for (const [key, value] of Object.entries(applicantData)) {
      if (value === null || value === undefined) {
        nullFields.push(key);
      }
    }

    if (user.is_submitted === true && nullFields.length > 0) {
      throw new Error(
        `Cannot submit because the following fields are NULL: ${nullFields.join(', ')}.`
      );
    }

    const { data, error } = await supabaseClient
      .from('applicants')
      .upsert([
        {
          id: userId,
          is_submitted: user.is_submitted,
        },
      ]);

    if (error) {
      console.error('Error changing status:', error);
      throw new Error(`Failed to change status: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error changing status:', error);
    throw error;
  }
};

export const getStatus = async () => {
  try {
    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !authUser) {
      throw new Error('User is not authenticated.');
    }

    const userId = authUser.id;

    const { data, error } = await supabaseClient
      .from('applicants')
      .select('is_submitted')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching status:', error);
      throw new Error(`Failed to fetch status: ${error.message}`);
    }

    return data.is_submitted;
  } catch (error) {
    console.error('Error fetching status:', error);
    throw error;
  }
}

export const getNullLength = async () => {
  try {
    const supabaseClient = await createClient();
    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !authUser) {
      throw new Error('User is not authenticated.');
    }

    const userId = authUser.id;

    const { data: applicantData, error: fetchError } = await supabaseClient
      .from('applicants')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!applicantData && !fetchError) {
      return 0;
    }

    if (fetchError) {
      console.error('Error fetching user data:', fetchError);
      throw new Error(`Failed to fetch user data: ${fetchError.message}`);
    }

    const nullFields = [];
    for (const [key, value] of Object.entries(applicantData)) {
      if (value === null || value === undefined) {
        nullFields.push(key);
      }
    }

    return ((15 - nullFields.length) / 15.0) * 100.0;
  } catch (error) {
    console.error('Error changing status:', error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const supabaseClient = await createClient();
    const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !authUser) {
      throw new Error('User is not authenticated.');
    }

    const userId = authUser.id;

    const { data, error } = await supabaseClient
      .from('applicants')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user data:', error);
      throw new Error(`Failed to fetch user data: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error changing status:', error);
    throw error;
  }
};

const getMimeType = (filename) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    default:
      return 'application/octet-stream';
  }
};

export const downloadFileFromPublicUrl = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch file from URL');
  }

  const blob = await response.blob();

  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const mimeType = getMimeType(filename);

  return new File([blob], filename, { type: mimeType });
};