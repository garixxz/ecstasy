import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getUserProfile } from "@/lib/user-service"
import ProfileForm from "@/components/profile-form"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  const userProfile = await getUserProfile(session.user.id)

  return (
    <div className="min-h-screen bg-background cassette-bg grid-pattern">
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-8 neon-text">Your Profile</h1>
        <ProfileForm userId={session.user.id} initialData={userProfile} />
      </div>
    </div>
  )
}

