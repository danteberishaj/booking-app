import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { isFirebaseConfigured, storage } from "@/lib/firebase";

/**
 * Upload a single image file to Firebase Storage and return its public URL.
 * Throws a friendly error when Storage isn't available.
 */
export async function uploadListingImage(file: File, hostId: string): Promise<string> {
  if (!isFirebaseConfigured || !storage) {
    throw new Error("Firebase Storage isn't configured. Paste an image URL instead.");
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `listings/${hostId}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}
