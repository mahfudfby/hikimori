// src/utils/cloudinaryUpload.ts
import { CLOUDINARY_CONFIG } from '../config/services';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

  const res = await fetch(CLOUDINARY_CONFIG.apiUrl, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Upload ke Cloudinary gagal');
  const data = await res.json();
  return data.secure_url as string;
};
