import { supabase } from "@/lib/supabase"

/**
 * Deletes a file from Supabase Storage
 */
export async function deleteFileFromSupabase(bucketName: string, filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage.from(bucketName).remove([filePath])

    if (error) {
      console.error("Error deleting file:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteFileFromSupabase:", error)
    return false
  }
}

/**
 * Lists all files in a Supabase Storage bucket/folder
 */
export async function listFilesInFolder(bucketName: string, folderPath = ""): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage.from(bucketName).list(folderPath)

    if (error) {
      console.error("Error listing files:", error)
      return []
    }

    // Filter out folders and return only file paths
    return data
      .filter((item) => !item.id.endsWith("/"))
      .map((item) => `${folderPath ? `${folderPath}/` : ""}${item.name}`)
  } catch (error) {
    console.error("Error in listFilesInFolder:", error)
    return []
  }
}

/**
 * Gets public URLs for all files in a folder
 */
export async function getPublicUrlsForFolder(bucketName: string, folderPath = "", userId: string): Promise<string[]> {
  try {
    // List all files in the folder
    const filePaths = await listFilesInFolder(bucketName, `${userId}/${folderPath}`)

    // Get public URLs for each file
    return filePaths.map((path) => {
      const { data } = supabase.storage.from(bucketName).getPublicUrl(path)

      return data.publicUrl
    })
  } catch (error) {
    console.error("Error in getPublicUrlsForFolder:", error)
    return []
  }
}

