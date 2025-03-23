# Image Handling in Ecstasy Dating App

This document provides comprehensive guidance on how images are handled in the Ecstasy Dating App.

## Overview

The app uses Supabase Storage for storing and serving user-uploaded images. This includes profile pictures and additional photos that users can add to their profiles.

## Setup Instructions

### 1. Supabase Configuration

1. Create a Supabase project at https://app.supabase.com/
2. Set up a storage bucket named "profile-images"
3. Configure the bucket policies:
   - For authenticated users:
     - Allow uploads: `(auth.role() = 'authenticated')`
     - Allow downloads: `(auth.role() = 'authenticated')`
   - For public access:
     - Allow downloads: `true`
4. Set up CORS configuration:
   ```json
   {
     "AllowedHeaders": ["*"],
     "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
     "AllowedOrigins": ["*"],
     "ExposeHeaders": []
   }
