import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get a public URL for an image
export const getImagePublicUrl = (bucketName: string, path: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path)
  return data.publicUrl
}

// Helper function to upload an image to Supabase
export async function uploadImageToSupabase(
  file: File,
  bucketName = "profile-images",
  path = "",
): Promise<string | null> {
  try {
    // Create a unique file path
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = path ? `${path}/${fileName}` : fileName

    // Upload the file
    const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file)

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      return null
    }

    // Get the public URL
    return getImagePublicUrl(bucketName, filePath)
  } catch (error) {
    console.error("Error in uploadImageToSupabase:", error)
    return null
  }
}

