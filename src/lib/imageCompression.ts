import imageCompression from 'browser-image-compression';

const compressionOptions = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp' as const,
};

export async function compressImage(file: File): Promise<File> {
  try {
    console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    
    const compressedFile = await imageCompression(file, compressionOptions);
    
    console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Return with webp extension
    const newFileName = file.name.replace(/\.[^/.]+$/, '.webp');
    return new File([compressedFile], newFileName, { type: 'image/webp' });
  } catch (error) {
    console.error('Error compressing image:', error);
    // Return original file if compression fails
    return file;
  }
}
