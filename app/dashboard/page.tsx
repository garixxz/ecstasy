import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { getUserProfile } from "@/lib/user-service"
import Dashboard from "@/components/dashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  const userProfile = await getUserProfile(session.user.id)

  // If user hasn't completed their profile, redirect to onboarding
  if (!userProfile?.musicPreferences?.length) {
    redirect("/onboarding")
  }

  return <Dashboard userId={session.user.id} />
}

