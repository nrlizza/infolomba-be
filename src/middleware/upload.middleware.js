import multer from 'multer';
import { supabase } from '../config/supabase.config.js';

// Memory storage
const storage = multer.memoryStorage();

// Allowed types
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

// Multer middleware
export const upload = (fields = []) => {
  const multerUpload = multer({
    storage,
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!allowedTypes.includes(file.mimetype)) {
        const err = new Error('Invalid file type');
        err.code = 'INVALID_FILE_TYPE';
        return cb(err, false);
      }
      cb(null, true);
    },
  });

  // Handle single or multiple fields
  return fields.length > 0 ? multerUpload.fields(fields) : multerUpload.single('file');
};

export async function uploadFileToSupabase(file, folder = 'test') {
  if (!file) return null;

  const fileName = `${Date.now()}_${file.originalname}`;   // <-- nama file
  const filePath = `${folder}/${fileName}`;                // <-- path relatif di bucket

  // Upload file ke Supabase
  const { data: uploadData, error: uploadError } = await supabase
    .storage
    .from(process.env.SUPABASE_BUCKET)
    .upload(filePath, file.buffer, { contentType: file.mimetype, upsert: false });

  if (uploadError) throw uploadError;

  // Get public URL (opsional, buat display)
  const { data: { publicUrl }, error: urlError } = supabase
    .storage
    .from(process.env.SUPABASE_BUCKET)
    .getPublicUrl(filePath);

  if (urlError) throw urlError;

  return { fileName, filePath, publicUrl };  // <-- simpan fileName atau filePath di DB
}

