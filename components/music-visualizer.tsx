"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface MusicVisualizerProps {
  score: number
  height?: number
}

export default function MusicVisualizer({ score, height = 60 }: MusicVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const barCount = 32
    const barWidth = canvas.width / barCount
    const maxBarHeight = height

    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      gradient.addColorStop(0, "#ff00aa")
      gradient.addColorStop(1, "#00aaff")

      for (let i = 0; i < barCount; i++) {
        // Calculate bar height based on position and score
        // Use sine wave for a more natural look
        const normalizedScore = Math.max(0.1, score)
        const amplitude = normalizedScore * maxBarHeight
        const frequency = 0.15
        const time = Date.now() * 0.001
        const x = i / barCount

        // Create a wave pattern that's affected by the score
        const wave1 = Math.sin(x * Math.PI * 4 + time * 2) * 0.5 + 0.5
        const wave2 = Math.sin(x * Math.PI * 8 + time * 3) * 0.5 + 0.5
        const wave3 = Math.sin(x * Math.PI * 2 + time) * 0.5 + 0.5

        // Combine waves with different weights based on position
        const combinedWave = wave1 * 0.6 + wave2 * 0.3 + wave3 * 0.1

        // Apply score as a multiplier
        const barHeight = combinedWave * amplitude

        // Draw bar
        ctx.fillStyle = gradient
        ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 1, barHeight)
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [score, height])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full rounded-md overflow-hidden neomorphic-inset"
    >
      <canvas ref={canvasRef} width={300} height={height} className="w-full h-full" />
    </motion.div>
  )
}

