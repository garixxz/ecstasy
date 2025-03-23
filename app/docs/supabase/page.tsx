import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Supabase Integration | Ecstasy Documentation",
  description: "Learn how to use Supabase with the Ecstasy dating app",
}

export default function SupabaseDocsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Supabase Integration</h1>

      <div className="prose prose-lg max-w-none dark:prose-invert">
        <h2>Overview</h2>
        <p>
          Ecstasy uses Supabase for image storage and management. This guide explains how to set up and use Supabase
          with the app.
        </p>

        <h2>Setup</h2>
        <h3>1. Create a Supabase Project</h3>
        <ol>
          <li>
            Go to{" "}
            <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer">
              app.supabase.com
            </a>{" "}
            and sign in
          </li>
          <li>Create a new project</li>
          <li>Note your project URL and API keys</li>
        </ol>

        <h3>2. Configure Environment Variables</h3>
        <p>
          Add the following to your <code>.env.local</code> file:
        </p>
        <pre>
          <code>
            NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co{"\n"}
            NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key{"\n"}
            SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
          </code>
        </pre>

        <h3>3. Set Up Storage Buckets</h3>
        <p>Run the setup script to create the necessary buckets and policies:</p>
        <pre>
          <code>npx ts-node scripts/setup-supabase-storage.ts</code>
        </pre>

        <h2>Usage</h2>
        <h3>Uploading Images</h3>
        <p>
          Use the <code>ImageUpload</code> or <code>MultiImageUpload</code> components to upload images:
        </p>
        <pre>
          <code>
            {`<ImageUpload\n  onImageUpload={(url) => console.log(url)}\n  userId={session?.user?.id}\n  bucketName="profile-images"\n/>`}
          </code>
        </pre>

        <h3>Displaying Images</h3>
        <p>
          Use the <code>SafeImage</code> component to display images with fallback handling:
        </p>
        <pre>
          <code>
            {`<SafeImage\n  src={imageUrl}\n  alt="User profile"\n  width={400}\n  height={400}\n  fallbackText={userName}\n/>`}
          </code>
        </pre>

        <h3>Managing Images</h3>
        <p>Use the storage utility functions to manage images:</p>
        <pre>
          <code>
            {`// Delete a file\nawait deleteFileFromSupabase('profile-images', 'user-id/image.jpg')\n\n// List files\nconst files = await listFilesInFolder('profile-images', 'user-id')\n\n// Get public URLs\nconst urls = await getPublicUrlsForFolder('profile-images', '', 'user-id')`}
          </code>
        </pre>

        <h2>Troubleshooting</h2>
        <h3>CORS Issues</h3>
        <p>If you encounter CORS issues, ensure your Supabase project has the correct CORS configuration:</p>
        <pre>
          <code>
            {`{\n  "AllowedHeaders": ["*"],\n  "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],\n  "AllowedOrigins": ["*"],\n  "ExposeHeaders": []\n}`}
          </code>
        </pre>

        <h3>Image Loading Failures</h3>
        <p>If images fail to load:</p>
        <ul>
          <li>Check that the image URL is correct</li>
          <li>Verify that the bucket is public</li>
          <li>
            Ensure the <code>unoptimized</code> prop is set on Next.js Image components
          </li>
          <li>Check the browser console for errors</li>
        </ul>

        <h2>Next Steps</h2>
        <p>Now that you've set up Supabase for image storage, you might want to explore other Supabase features:</p>
        <ul>
          <li>
            <Link href="/docs/supabase/auth">Authentication</Link>
          </li>
          <li>
            <Link href="/docs/supabase/database">Database</Link>
          </li>
          <li>
            <Link href="/docs/supabase/realtime">Realtime</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

