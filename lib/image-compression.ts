// Client-side pre-upload compression: downscale + convert to WebP so large
// camera/export PNGs (the 2048x2048 4-5MB product shots) don't slow down
// next/image's on-demand optimization pass or bloat UploadThing storage.

const MAX_DIMENSION = 1600;
const QUALITY = 0.82;

export async function convertToWebP(file: File): Promise<File> {
  if (file.type === "image/webp" || !file.type.startsWith("image/")) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY),
  );
  if (!blob) return file;

  const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], name, { type: "image/webp" });
}

export async function convertFilesToWebP(files: File[]): Promise<File[]> {
  return Promise.all(files.map(convertToWebP));
}
