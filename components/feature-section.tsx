"use client"

import { motion } from "framer-motion"
import { Music, Heart, Headphones, Users } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <Music className="h-10 w-10 text-pink-500" />,
      title: "Music-Based Matching",
      description:
        "Our algorithm analyzes your music preferences to find compatible matches who share your taste in music.",
    },
    {
      icon: <Heart className="h-10 w-10 text-purple-500" />,
      title: "Meaningful Connections",
      description: "Connect with people who understand your musical soul for more authentic relationships.",
    },
    {
      icon: <Headphones className="h-10 w-10 text-pink-500" />,
      title: "Discover New Music",
      description: "Expand your musical horizons through the tastes of your matches and potential partners.",
    },
    {
      icon: <Users className="h-10 w-10 text-purple-500" />,
      title: "Community Events",
      description: "Join virtual and in-person music events with people who share your musical interests.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight sm:text-4xl mb-4"
          >
            Why Choose Ecstasy
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Discover how our unique approach to dating through music creates more meaningful connections.
          </motion.p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background rounded-xl p-6 shadow-sm"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

