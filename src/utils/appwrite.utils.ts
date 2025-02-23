import { Client, ID, Storage } from "appwrite";

const client = new Client();
client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!;

export const uploadFileToAppWrite = async (
  file: File,
  setProgress?: (progress: number) => void,
): Promise<string | null> => {
  const storage = new Storage(client);
  const fileId = ID.unique();

  try {
    const fileUpload = await storage.createFile(
      bucketId,
      fileId,
      file,
      [],
      (progress) => setProgress?.(Math.round(progress.progress)),
    );

    const fileUrl = await storage.getFileView(bucketId, fileUpload.$id);

    return fileUrl; // Return the URL to access the file
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Appwrite error: ${error.message}`);
    }

    throw new Error("An unexpected error occurred while uploading the file.");
  }
};
