import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import sharp from 'sharp';
import { config } from '../../config';

// Initialize S3 client
const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export interface UploadImageOptions {
  file: Express.Multer.File;
  folder?: string; // e.g., 'articles', 'products', 'categories'
  fileName?: string; // Optional custom filename
  quality?: number; // Image quality (1-100, default: 85)
  maxWidth?: number; // Maximum width in pixels (default: 1920)
  maxHeight?: number; // Maximum height in pixels (default: 1920)
}

export interface UploadImageResult {
  url: string;
  key: string;
  bucket: string;
}

/**
 * Compress and optimize image using Sharp
 */
async function compressImage(
  buffer: Buffer,
  mimetype: string,
  options: { quality?: number; maxWidth?: number; maxHeight?: number }
): Promise<{ buffer: Buffer; mimetype: string; extension: string }> {
  const { quality = 85, maxWidth = 1920, maxHeight = 1920 } = options;

  let sharpInstance = sharp(buffer);

  // Get image metadata
  const metadata = await sharpInstance.metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  // Resize if image is larger than max dimensions (maintain aspect ratio)
  if (width > maxWidth || height > maxHeight) {
    sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // Determine output format and optimize
  let outputBuffer: Buffer;
  let outputMimetype: string;
  let extension: string;

  if (mimetype === 'image/png') {
    // Convert PNG to WebP for better compression, or optimize PNG
    if (width * height > 500000) {
      // Large images: convert to WebP
      outputBuffer = await sharpInstance
        .webp({ quality, effort: 6 })
        .toBuffer();
      outputMimetype = 'image/webp';
      extension = 'webp';
    } else {
      // Small images: optimize PNG
      outputBuffer = await sharpInstance
        .png({ quality, compressionLevel: 9, effort: 10 })
        .toBuffer();
      outputMimetype = 'image/png';
      extension = 'png';
    }
  } else if (mimetype === 'image/gif') {
    // Convert GIF to WebP for better compression
    // Note: Sharp converts only the first frame of animated GIFs
    outputBuffer = await sharpInstance
      .webp({ quality, effort: 6 })
      .toBuffer();
    outputMimetype = 'image/webp';
    extension = 'webp';
  } else if (mimetype === 'image/webp') {
    // Optimize existing WebP
    outputBuffer = await sharpInstance
      .webp({ quality, effort: 6 })
      .toBuffer();
    outputMimetype = 'image/webp';
    extension = 'webp';
  } else {
    // JPEG/JPG: convert to optimized JPEG or WebP
    // Use WebP for better compression if supported
    outputBuffer = await sharpInstance
      .webp({ quality, effort: 6 })
      .toBuffer();
    outputMimetype = 'image/webp';
    extension = 'webp';
  }

  return {
    buffer: outputBuffer,
    mimetype: outputMimetype,
    extension,
  };
}

/**
 * Upload image to S3 bucket
 */
export async function uploadImageToS3(
  options: UploadImageOptions
): Promise<UploadImageResult> {
  const { file, folder = 'articles', fileName, quality, maxWidth, maxHeight } = options;

  // Validate file type
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`);
  }

  // Validate file size (max 10MB before compression)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error(`File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`);
  }

  // Compress and optimize image
  let processedImage: { buffer: Buffer; mimetype: string; extension: string };
  try {
    processedImage = await compressImage(file.buffer, file.mimetype, {
      quality,
      maxWidth,
      maxHeight,
    });
  } catch (error: any) {
    console.error('Error compressing image:', error);
    // Fallback: use original image if compression fails
    processedImage = {
      buffer: file.buffer,
      mimetype: file.mimetype,
      extension: file.originalname.split('.').pop() || 'jpg',
    };
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const sanitizedOriginalName = file.originalname
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .toLowerCase()
    .substring(0, 50)
    .replace(/\.[^/.]+$/, ''); // Remove original extension

  const finalFileName = fileName || `${sanitizedOriginalName}_${timestamp}_${randomString}.${processedImage.extension}`;
  const key = `${folder}/${finalFileName}`;

  // Calculate compression stats
  const originalSize = file.size;
  const compressedSize = processedImage.buffer.length;
  const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

  console.log(`Image compression: ${(originalSize / 1024).toFixed(2)}KB -> ${(compressedSize / 1024).toFixed(2)}KB (${compressionRatio}% reduction)`);

  // Upload to S3
  const command = new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
    Body: processedImage.buffer,
    ContentType: processedImage.mimetype,
    CacheControl: 'max-age=31536000', // 1 year cache
    // Note: ACL is optional. If your bucket has public access blocked,
    // you may need to configure bucket policy instead of using ACL
    // ACL: 'public-read', // Uncomment if your bucket allows ACLs
  });

  try {
    await s3Client.send(command);

    // Generate public URL
    // Format: https://bucket-name.s3.region.amazonaws.com/key
    // Or: https://bucket-name.s3-region.amazonaws.com/key (for some regions)
    const url = config.aws.bucket.includes('.')
      ? `https://${config.aws.bucket}/${key}`
      : `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${key}`;

    return {
      url,
      key,
      bucket: config.aws.bucket,
    };
  } catch (error: any) {
    console.error('Error uploading to S3:', error);
    throw new Error(`Failed to upload image to S3: ${error.message}`);
  }
}

/**
 * Delete image from S3 bucket
 */
export async function deleteImageFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
  });

  try {
    await s3Client.send(command);
  } catch (error: any) {
    console.error('Error deleting from S3:', error);
    throw new Error(`Failed to delete image from S3: ${error.message}`);
  }
}

/**
 * Generate presigned URL for temporary access (if needed)
 */
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error: any) {
    console.error('Error generating presigned URL:', error);
    throw new Error(`Failed to generate presigned URL: ${error.message}`);
  }
}

/**
 * Extract S3 key from URL
 */
export function extractS3KeyFromUrl(url: string): string | null {
  try {
    // Match S3 URL pattern: https://bucket.s3.region.amazonaws.com/key
    const match = url.match(/https?:\/\/[^/]+\/(.+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

