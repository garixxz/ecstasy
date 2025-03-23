import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Sample user IDs (replace with your actual user IDs)
const users = [
  { id: 'user1', name: 'Sarah Johnson' },
  { id: 'user2', name: 'Michael Chen' },
  { id: 'user3', name: 'Emma Wilson' },
  { id: 'user4', name: 'James Smith' },
  { id: 'user5', name: 'Olivia Martinez' },
]

// Sample image paths (replace with your actual image paths)
const sampleImagesDir = path.join(__dirname, 'sample-images')

async function uploadSampleImages() {
  console.log('Starting sample image upload...')
  
  for (const user of users) {
    console.log(`Processing user: ${user.name}`)
    
    // Create a folder for each user
    const userFolder = `${user.id}`
    
    // Upload profile image
    const profileImagePath = path.join(sampleImagesDir, `${user.id}-profile.jpg`)
    if (fs.existsSync(profileImagePath)) {
      const profileImageFile = fs.readFileSync(profileImagePath)
      const { error: profileError } = await supabase.storage
        .from('profile-images')
        .upload(`${userFolder}/profile.jpg`, profileImageFile, {
          contentType: 'image/jpeg',
          upsert: true
        })
      
      if (profileError) {
        console.error(`Error uploading profile image for ${user.name}:`, profileError)
      } else {
        console.log(`Uploaded profile image for ${user.name}`)
      }
    }
    
    // Upload additional images
    for (let i = 1; i <= 3; i++) {
      const imagePath = path.join(sampleImagesDir, `${user.id}-${i}.jpg`)
      if (fs.existsSync(imagePath)) {
        const imageFile = fs.readFileSync(imagePath)
        const { error: imageError } = await supabase.storage
          .from('profile-images')
          .upload(`${userFolder}/image${i}.jpg`, imageFile, {
            contentType: 'image/jpeg',
            upsert: true
          })
        
        if (imageError) {
          console.error(`Error uploading image ${i} for ${user.name}:`, imageError)
        } else {
          console.log(`Uploaded image ${i} for ${user.name}`)
        }
      }
    }
  }
  
  console.log('Sample image upload complete!')
}

uploadSampleImages().catch(console.error)
