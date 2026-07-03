export async function compressToWebp(
  blob: Blob,
  maxDim = 1200,
  quality = 0.8,
): Promise<Blob> {
  const img = await createImageBitmap(blob);
  let { width, height } = img;

  if (width > maxDim || height > maxDim) {
    const ratio = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return blob;

  ctx.drawImage(img, 0, 0, width, height);
  img.close();

  return new Promise(resolve => {
    canvas.toBlob(
      b => resolve(b ?? blob),
      'image/webp',
      quality,
    );
  });
}
