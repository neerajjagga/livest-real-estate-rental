'use server';

import cloudinary from "@/lib/cloudinary";

export async function generateCloudinarySignature(folder: string = "nextjs_uploads") {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
        {
            timestamp,
            folder,
        },
        process.env.CLOUDINARY_API_SECRET!
    );

    return {
        signature,
        timestamp,
        folder,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
    };
}

// export const uploadPropertyImage = async (formData: FormData) => {
//     try {
//         const file = formData.get('image') as File;

//         if (!file) {
//             throw new Error('No file uploaded');
//         }

//         const bytes = await file.arrayBuffer();
//         const buffer = Buffer.from(bytes);

//         const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

//         const result = await cloudinary.uploader.upload(base64, {
//             folder: 'property-images',
//             resource_type: 'auto',
//         });

//         revalidatePath("/");

//         return result.secure_url;
//     } catch (error) {
//         console.error('Error uploading image:', error);
//         throw new Error('Failed to upload image');
//     }  
// };