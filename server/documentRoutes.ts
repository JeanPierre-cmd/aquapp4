import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { Readable } from 'stream';

const router = Router();

// Configure multer for in-memory file storage to process before saving
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'image/jpeg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no válido. Solo se aceptan PDF y JPG.'));
    }
  },
});

// POST /api/files - Handles file upload
router.post('/files', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
  }

  try {
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;
    const sizeBytes = req.file.size;

    // 1. Calculate SHA-256 hash
    const hash = crypto.createHash('sha256');
    const stream = Readable.from(fileBuffer);
    for await (const chunk of stream) {
        hash.update(chunk);
    }
    const fileHash = hash.digest('hex');

    // --- TODO: Backend Processing ---
    // 2. Check if hash already exists in the 'files' table to prevent duplicates.
    //    - If it exists, return the existing file's data.
    //    - If not, proceed.

    // 3. Upload file to Supabase Storage (or other provider).
    //    const { data: uploadData, error: uploadError } = await supabase.storage
    //      .from('documents')
    //      .upload(`public/${fileHash}-${fileName}`, fileBuffer, {
    //        contentType: mimeType,
    //        upsert: false, // Don't overwrite if it somehow exists
    //      });
    //    if (uploadError) throw uploadError;
    //    const storageKey = uploadData.path;

    // 4. Extract metadata (PDF pages, JPG EXIF).
    //    let pageCount = null;
    //    let exifData = null;
    //    if (mimeType === 'application/pdf') { /* Use pdf.js logic */ }
    //    if (mimeType === 'image/jpeg') { /* Use exifr logic */ }

    // 5. Insert record into 'files' table in Supabase DB.
    // 6. Insert initial record into 'file_metadata' table.

    // For now, returning a mock response
    console.log(`File processed: ${fileName}, Hash: ${fileHash}`);
    res.status(201).json({
      message: 'Archivo subido y procesado (simulación).',
      fileId: crypto.randomUUID(),
      name: fileName,
      mime: mimeType,
      size: sizeBytes,
      hash: fileHash,
      // --- Mocked data ---
      pages: mimeType === 'application/pdf' ? 10 : undefined,
      exif: mimeType === 'image/jpeg' ? { "Make": "CameraCorp" } : undefined,
      previewUrl: 'https://via.placeholder.com/150'
    });

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar el archivo.' });
  }
});

export default router;
