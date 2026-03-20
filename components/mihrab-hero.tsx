"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUp } from "lucide-react"

// Color scheme
export const COLORS = {
  teal: "#2E5A6C",
  lightTeal: "#568FA1",
  navy: "#0F1D3A",
  olive: "#514B38",
  gold: "#936A21",
}

const colorArray = Object.values(COLORS)

// Desktop search sentences (longer)
const SEARCH_SENTENCES_DESKTOP = [
  "I am a college senior looking for startup opportunities on the west coast",
  "how can I meet fellow muslim finance professionals",
  "what are some mentorship opportunities for college muslims",
]

// Mobile search sentences (shorter)
const SEARCH_SENTENCES_MOBILE = [
  "finance professionals",
  "entrepreneurship opportunities",
  "scholarships in public policy",
  "chicago muslim communities",
  "los angeles muslim communities",
]

export function MihrabHero() {
  const blobRef = useRef<HTMLDivElement>(null)
  const mobileBlobRef = useRef<HTMLDivElement>(null)
  const colorIndexRef = useRef(0)
  const mobileColorIndexRef = useRef(0)
  const [displayText, setDisplayText] = useState("")
  const [isTyping, setIsTyping] = useState(true)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [searchValue, setSearchValue] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check for mobile and reduced motion preference
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    const checkReducedMotion = () => {
      setPrefersReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    }
    
    checkMobile()
    checkReducedMotion()
    
    window.addEventListener("resize", checkMobile)
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    motionQuery.addEventListener("change", checkReducedMotion)
    
    return () => {
      window.removeEventListener("resize", checkMobile)
      motionQuery.removeEventListener("change", checkReducedMotion)
    }
  }, [])

  // Desktop blob animation
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return
    
    const blob = blobRef.current
    if (!blob) return

    let x = Math.random() * 60 + 20
    let y = Math.random() * 60 + 20
    let vx = (Math.random() - 0.5) * 0.3
    let vy = (Math.random() - 0.5) * 0.3

    const animatePosition = () => {
      x += vx
      y += vy

      if (x <= 10 || x >= 90) vx *= -1
      if (y <= 10 || y >= 90) vy *= -1

      blob.style.left = `${x}%`
      blob.style.top = `${y}%`

      requestAnimationFrame(animatePosition)
    }

    animatePosition()

    const changeColor = () => {
      colorIndexRef.current = (colorIndexRef.current + 1) % colorArray.length
      blob.style.backgroundColor = colorArray[colorIndexRef.current]
    }

    const colorInterval = setInterval(changeColor, 3000)

    return () => {
      clearInterval(colorInterval)
    }
  }, [isMobile, prefersReducedMotion])

  // Mobile blob animation (rectangular, outlines search bar, only color changes)
  useEffect(() => {
    if (!isMobile || prefersReducedMotion) return
    
    const blob = mobileBlobRef.current
    if (!blob) return

    const changeColor = () => {
      mobileColorIndexRef.current = (mobileColorIndexRef.current + 1) % colorArray.length
      blob.style.backgroundColor = colorArray[mobileColorIndexRef.current]
    }

    const colorInterval = setInterval(changeColor, 3000)

    return () => {
      clearInterval(colorInterval)
    }
  }, [isMobile, prefersReducedMotion])

  // Typewriter effect
  useEffect(() => {
    const sentences = isMobile ? SEARCH_SENTENCES_MOBILE : SEARCH_SENTENCES_DESKTOP
    const currentSentence = sentences[sentenceIndex % sentences.length]
    let charIndex = 0
    let timeoutId: NodeJS.Timeout

    if (isTyping) {
      const typeChar = () => {
        if (charIndex <= currentSentence.length) {
          setDisplayText(currentSentence.slice(0, charIndex))
          charIndex++
          timeoutId = setTimeout(typeChar, 50)
        } else {
          timeoutId = setTimeout(() => {
            setIsTyping(false)
          }, 2000)
        }
      }
      typeChar()
    } else {
      charIndex = currentSentence.length
      const deleteChar = () => {
        if (charIndex >= 0) {
          setDisplayText(currentSentence.slice(0, charIndex))
          charIndex--
          timeoutId = setTimeout(deleteChar, 30)
        } else {
          setSentenceIndex((prev) => (prev + 1) % sentences.length)
          setIsTyping(true)
        }
      }
      deleteChar()
    }

    return () => clearTimeout(timeoutId)
  }, [isTyping, sentenceIndex, isMobile])

  return (
    <section className="relative min-h-screen w-full bg-white overflow-hidden">
      {/* Desktop: Animated blob layer */}
      {!isMobile && (
        <div className="absolute inset-0 z-0">
          <div
            ref={blobRef}
            className="absolute w-32 h-32 rounded-full transition-colors duration-[2000ms] ease-in-out"
            style={{
              backgroundColor: colorArray[0],
              opacity: 0.5,
              transform: "translate(-50%, -50%)",
              filter: "blur(40px)",
            }}
          />
          {/* Grain overlay for blob */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: "overlay" }}>
            <defs>
              <filter id="grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="5" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
            </defs>
            <rect width="100%" height="100%" filter="url(#grain)" opacity="0.5" />
          </svg>
        </div>
      )}

      {/* Mobile: Stationary blob in center - only color changes */}
      {isMobile && (
        <div className="absolute inset-0 z-0">
          <div
            ref={mobileBlobRef}
            className="absolute w-20 h-20 rounded-full transition-colors duration-[2000ms] ease-in-out"
            style={{
              backgroundColor: colorArray[0],
              opacity: 0.5,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              filter: "blur(30px)",
            }}
          />
          {/* Grain overlay for mobile blob */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ mixBlendMode: "overlay" }}>
            <defs>
              <filter id="mobileGrain">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="5" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
            </defs>
            <rect width="100%" height="100%" filter="url(#mobileGrain)" opacity="0.5" />
          </svg>
        </div>
      )}

      {/* Mihrab pattern background */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: "url(/images/mihrab.png)",
          backgroundSize: "20px auto",
          backgroundRepeat: "repeat",
          opacity: 1,
        }}
      />

      {/* Bottom fade gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, white)",
        }}
      />

      {/* Content overlay */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-32">
        {/* Intro badge */}
        <div
          className="mb-8 inline-flex items-center text-sm font-medium select-none"
          style={{
            backgroundColor: "#E6EFF1",
            color: COLORS.navy,
          }}
        >
          <span className="py-0.5">Introducing MPH &rarr;</span>
        </div>

        {/* Main headline with shine effect */}
        <h1
          className="relative font-serif text-3xl md:text-5xl lg:text-6xl font-semibold text-center max-w-4xl leading-tight text-balance px-2 text-[#2D2D2D] overflow-hidden"
        >
          <span className="relative z-10">Connecting the Fragmented Muslim Professional Ecosystem</span>
          {/* Animated shine across text */}
          <span 
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)",
              animation: "textShine 5s ease-in-out infinite",
              WebkitBackgroundClip: "text",
              mixBlendMode: "overlay",
            }}
          />
        </h1>
        
        {/* Text shine animation */}
        <style jsx>{`
          @keyframes textShine {
            0% { transform: translateX(-100%); }
            40%, 100% { transform: translateX(100%); }
          }
        `}</style>

        {/* Search bar - responsive */}
        <div className="mt-8 md:mt-10 w-full max-w-2xl px-2">
          <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 bg-white shadow-lg border border-gray-200">
            {/* Input area with typewriter placeholder */}
            <div className="flex-1 relative min-w-0">
              {searchValue === "" && (
                <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden">
                  <span className="text-gray-400 font-serif italic text-sm md:text-base truncate">
                    {displayText}
                    <span className="inline-block w-0.5 h-4 md:h-5 bg-gray-400 ml-0.5 animate-pulse align-middle" />
                  </span>
                </div>
              )}
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full text-sm md:text-base text-gray-800 bg-transparent border-none outline-none font-serif italic"
              />
            </div>

            {/* Liquid metal submit button */}
            <button 
              className="relative p-2 md:p-3 shrink-0 overflow-hidden transition-shadow hover:shadow-lg"
              style={{
                background: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #252525 100%)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Metallic sheen */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.08) 40%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.08) 60%, transparent 100%)",
                }}
              />
              {/* Light streak animation */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div 
                  className="absolute w-8 h-full -skew-x-12"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)",
                    animation: "lightStreak 3s ease-in-out infinite",
                  }}
                />
              </div>
              <ArrowUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-white relative z-10" />
            </button>
          </div>
        </div>

        {/* Light streak animation */}
        <style jsx>{`
          @keyframes lightStreak {
            0% { left: -50%; }
            50%, 100% { left: 150%; }
          }
        `}</style>

        {/* Subheadline */}
        <p
          className="mt-6 md:mt-8 text-sm md:text-base lg:text-lg text-center max-w-2xl leading-relaxed px-4"
          style={{ color: COLORS.olive }}
        >
          MPH is a curated discovery platform for Muslim professionals connecting you to
          organizations, scholarships, fellowships, & entrepreneurial resources across industries
        </p>
      </div>
    </section>
  )
}
