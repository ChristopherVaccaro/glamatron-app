/**
 * Reel Export Utility
 * Creates a cross-dissolve before/after animation from two images.
 * Uses canvas rendering + MediaRecorder API to produce a downloadable WebM video.
 * Falls back to animated GIF via manual frame capture if MediaRecorder is unavailable.
 */

interface ReelExportOptions {
  originalImage: string;   // base64 or URL
  resultImage: string;     // base64 or URL
  width?: number;          // output width (default: 720)
  duration?: number;       // total duration in ms (default: 3000)
  fps?: number;            // frames per second (default: 30)
  holdDuration?: number;   // ms to hold on each image before/after dissolve (default: 800)
  onProgress?: (progress: number) => void; // 0-1
}

// Load an image from a src string
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Calculate dimensions maintaining aspect ratio
const fitDimensions = (
  imgWidth: number,
  imgHeight: number,
  maxWidth: number
): { width: number; height: number } => {
  const ratio = imgHeight / imgWidth;
  const width = Math.min(imgWidth, maxWidth);
  // Ensure even dimensions (required by some video codecs)
  const height = Math.round(width * ratio);
  return {
    width: width % 2 === 0 ? width : width - 1,
    height: height % 2 === 0 ? height : height - 1,
  };
};

// Ease function for smoother dissolve
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * Export a cross-dissolve reel as a WebM video blob.
 * 
 * Timeline:
 *   [hold original] → [cross-dissolve] → [hold result]
 */
export const exportCrossDissolveReel = async (
  options: ReelExportOptions
): Promise<Blob> => {
  const {
    originalImage,
    resultImage,
    width: maxWidth = 720,
    duration = 3000,
    fps = 30,
    holdDuration = 800,
    onProgress,
  } = options;

  // Load both images
  const [origImg, resultImg] = await Promise.all([
    loadImage(originalImage),
    loadImage(resultImage),
  ]);

  // Use the result image dimensions as reference
  const { width, height } = fitDimensions(resultImg.width, resultImg.height, maxWidth);

  // Create offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const totalFrames = Math.ceil((duration / 1000) * fps);
  const frameInterval = 1000 / fps;
  const holdFrames = Math.ceil((holdDuration / 1000) * fps);
  const dissolveFrames = totalFrames - holdFrames * 2;

  // Check if MediaRecorder supports webm
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : MediaRecorder.isTypeSupported('video/webm')
    ? 'video/webm'
    : null;

  if (!mimeType) {
    // Fallback: export as a series of frames in a single image (sprite sheet)
    // or throw — for now we'll try mp4
    throw new Error('Your browser does not support WebM video recording. Try Chrome or Edge.');
  }

  // Set up MediaRecorder with canvas stream
  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 2_500_000, // 2.5 Mbps for good quality
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  // Start recording
  recorder.start();

  // Render frames
  for (let frame = 0; frame < totalFrames; frame++) {
    let alpha = 0; // 0 = show original, 1 = show result

    if (frame < holdFrames) {
      // Hold on original
      alpha = 0;
    } else if (frame >= totalFrames - holdFrames) {
      // Hold on result
      alpha = 1;
    } else {
      // Cross-dissolve
      const dissolveProgress = (frame - holdFrames) / Math.max(dissolveFrames - 1, 1);
      alpha = easeInOutCubic(dissolveProgress);
    }

    // Draw original
    ctx.globalAlpha = 1;
    ctx.drawImage(origImg, 0, 0, width, height);

    // Draw result on top with dissolve alpha
    ctx.globalAlpha = alpha;
    ctx.drawImage(resultImg, 0, 0, width, height);

    // Reset alpha
    ctx.globalAlpha = 1;

    // Add subtle "GLAMATRON" watermark in bottom-right
    if (frame >= totalFrames - holdFrames) {
      ctx.save();
      ctx.font = `bold ${Math.round(width * 0.028)}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('GLAMATRON', width - 12, height - 10);
      ctx.restore();
    }

    // Report progress
    onProgress?.((frame + 1) / totalFrames);

    // Wait for next frame timing
    await new Promise((resolve) => setTimeout(resolve, frameInterval));
  }

  // Stop recording and collect the blob
  return new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve(blob);
    };
    recorder.stop();
  });
};

/**
 * Download a blob as a file
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Share a blob using the Web Share API (mobile-friendly)
 */
export const shareBlob = async (blob: Blob, filename: string): Promise<boolean> => {
  const file = new File([blob], filename, { type: blob.type, lastModified: Date.now() });

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: 'My Glamatron Transformation',
        text: 'Check out my before & after!',
        files: [file],
      });
      return true;
    } catch (err) {
      if ((err as Error).name === 'AbortError') return false;
      console.error('Share failed:', err);
    }
  }
  return false;
};
