export function cloudinaryUploadUrl() {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;
}
