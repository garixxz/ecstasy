import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seed...")

  // Update the sample users in the seed file
  const users = [
    {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      password: await hash("password123", 10),
      profile: {
        bio: "Music lover and concert enthusiast. Always looking for new sounds and experiences.",
        birthdate: new Date("1997-05-15"),
        gender: "female",
        location: "New York, NY",
        // Use a Supabase URL for the profile image
        imageUrl: "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-alipazani-2681751.jpg",
      },
      genres: ["Pop", "R&B", "Indie"],
      artists: ["The Weeknd", "Dua Lipa", "Tame Impala", "SZA"],
      images: [
        "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-alipazani-2681751.jpg",
        "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-chuck-2738466.jpg",
        "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-clipping-marketing-digital-2150566657-31208515.jpg",
      ],
    },
    {
      name: "Michael Chen",
      email: "michael@example.com",
      password: await hash("password123", 10),
      profile: {
        bio: "DJ and producer. Music is my life and passion.",
        birthdate: new Date("1995-08-22"),
        gender: "male",
        location: "Los Angeles, CA",
        imageUrl: "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-cottonbro-4275717.jpg",
      },
      genres: ["Electronic", "House", "Techno"],
      artists: ["Daft Punk", "Disclosure", "Kaytranada", "Four Tet"],
      images: [
        "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-cottonbro-4275717.jpg",
        "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-creationhill-1681010.jpg",
      ],
    },
    {
      name: "Emma Wilson",
      email: "emma@example.com",
      password: await hash("password123", 10),
      profile: {
        bio: "Vinyl collector and indie rock enthusiast. Let's talk about our favorite albums!",
        birthdate: new Date("1999-03-10"),
        gender: "female",
        location: "Chicago, IL",
        imageUrl: "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-dave-tombi-48516388-14983798.jpg",
      },
      genres: ["Rock", "Indie", "Alternative"],
      artists: ["Arctic Monkeys", "The Strokes", "Radiohead", "Phoebe Bridgers"],
      images: [
        "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-dave-tombi-48516388-14983798.jpg",
        "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-luis-araujo-1042531-3656518.jpg",
        "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-orionquest-2691608.jpg",
      ],
    },
    {
      name: "James Smith",
      email: "james@example.com",
      password: await hash("password123", 10),
      profile: {
        bio: "Hip hop head and beatmaker. Always looking for new collaborations.",
        birthdate: new Date("1996-11-28"),
        gender: "male",
        location: "Atlanta, GA",
        imageUrl: "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-ralph-rabago-3290891.jpg",
      },
      genres: ["Hip Hop", "R&B", "Soul"],
      artists: ["Kendrick Lamar", "J. Cole", "Anderson .Paak", "Tyler, The Creator"],
      images: [
        "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-ralph-rabago-3290891.jpg",
        "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-thgusstavo-2774292.jpg",
      ],
    },
    {
      name: "Olivia Martinez",
      email: "olivia@example.com",
      password: await hash("password123", 10),
      profile: {
        bio: "Classical pianist with a love for jazz. Music is my language.",
        birthdate: new Date("1998-07-03"),
        gender: "female",
        location: "Boston, MA",
        imageUrl: "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-tomaz-barcellos-999425-1987301.jpg",
      },
      genres: ["Classical", "Jazz", "Soul"],
      artists: ["Miles Davis", "John Coltrane", "Norah Jones", "Ludovico Einaudi"],
      images: [
        "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-tomaz-barcellos-999425-1987301.jpg",
        "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-vinicius-wiesehofer-289347-1130626.jpg",
        "https://uloapkdedinhxzorxznx.supabase.co/storage/v1/object/public/profile-images//pexels-vinicius-wiesehofer-289347-1130626.jpg",
      ],
    },
  ]

  // Create users with profiles and music preferences
  for (const userData of users) {
    const { genres, artists, profile, images, ...userInfo } = userData

    const user = await prisma.user.create({
      data: {
        ...userInfo,
        profile: {
          create: profile,
        },
      },
    })

    // Get the profile
    const userProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    if (userProfile) {
      // Add genres
      for (const genre of genres) {
        await prisma.musicPreference.create({
          data: {
            profileId: userProfile.id,
            type: "genre",
            name: genre,
          },
        })
      }

      // Add artists
      for (const artist of artists) {
        await prisma.musicPreference.create({
          data: {
            profileId: userProfile.id,
            type: "artist",
            name: artist,
          },
        })
      }

      // Add images
      for (const imageUrl of images) {
        await prisma.userImage.create({
          data: {
            profileId: userProfile.id,
            url: imageUrl,
          },
        })
      }
    }
  }

  // Create some likes and matches
  const allUsers = await prisma.user.findMany()

  // User 0 likes User 1
  await prisma.like.create({
    data: {
      fromUserId: allUsers[0].id,
      toUserId: allUsers[1].id,
      isMatch: false,
    },
  })

  // User 1 likes User 0 (creates a match)
  await prisma.like.create({
    data: {
      fromUserId: allUsers[1].id,
      toUserId: allUsers[0].id,
      isMatch: true,
    },
  })

  // Update the first like to be a match
  await prisma.like.updateMany({
    where: {
      fromUserId: allUsers[0].id,
      toUserId: allUsers[1].id,
    },
    data: {
      isMatch: true,
    },
  })

  // User 2 likes User 0
  await prisma.like.create({
    data: {
      fromUserId: allUsers[2].id,
      toUserId: allUsers[0].id,
      isMatch: false,
    },
  })

  // Create some messages
  await prisma.message.create({
    data: {
      fromUserId: allUsers[0].id,
      toUserId: allUsers[1].id,
      content: "Hey! I love your music taste. What concerts have you been to recently?",
    },
  })

  await prisma.message.create({
    data: {
      fromUserId: allUsers[1].id,
      toUserId: allUsers[0].id,
      content: "Thanks! I just saw Tame Impala last month. It was amazing! What about you?",
    },
  })

  console.log("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
