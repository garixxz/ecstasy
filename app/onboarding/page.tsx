import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getUserProfile } from "@/lib/user-service"
import OnboardingForm from "@/components/onboarding-form"

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  const userProfile = await getUserProfile(session.user.id)

  // If user has already completed onboarding, redirect to dashboard
  if (userProfile?.musicPreferences?.length) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background cassette-bg grid-pattern">
      <div className="container max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold text-center mb-8 neon-text">Tell Us About Your Music Taste</h1>
        <OnboardingForm userId={session.user.id} />
      </div>
    </div>
  )
}

