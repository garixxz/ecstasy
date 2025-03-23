import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupStorage() {
  console.log("Setting up Supabase Storage...")

  // Create buckets
  const buckets = [
    { name: "profile-images", public: true },
    { name: "message-attachments", public: false },
  ]

  for (const bucket of buckets) {
    console.log(`Creating bucket: ${bucket.name}`)

    // Check if bucket exists
    const { data: existingBuckets } = await supabase.storage.listBuckets()
    const bucketExists = existingBuckets?.some((b) => b.name === bucket.name)

    if (!bucketExists) {
      // Create the bucket
      const { error } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
      })

      if (error) {
        console.error(`Error creating bucket ${bucket.name}:`, error)
        continue
      }

      console.log(`Bucket ${bucket.name} created successfully`)
    } else {
      console.log(`Bucket ${bucket.name} already exists`)

      // Update bucket to ensure it has the correct public setting
      const { error } = await supabase.storage.updateBucket(bucket.name, {
        public: bucket.public,
      })

      if (error) {
        console.error(`Error updating bucket ${bucket.name}:`, error)
      }
    }
  }

  // Set up CORS
  const corsConfig = {
    AllowedHeaders: ["*"],
    AllowedMethods: ["GET", "POST", "PUT", "DELETE"],
    AllowedOrigins: ["*"],
    ExposeHeaders: [],
    MaxAgeSeconds: 3600,
  }

  for (const bucket of buckets) {
    console.log(`Setting CORS for bucket: ${bucket.name}`)

    // Set CORS configuration
    // Note: This is using a hypothetical API - actual implementation may vary
    // based on Supabase's API for setting CORS
    try {
      // This is a placeholder - Supabase might not expose this API directly
      // You might need to use the Supabase dashboard or REST API
      console.log(`CORS configuration for ${bucket.name} would be:`, corsConfig)
    } catch (error) {
      console.error(`Error setting CORS for bucket ${bucket.name}:`, error)
    }
  }

  console.log("Supabase Storage setup complete!")
}

setupStorage().catch(console.error)

