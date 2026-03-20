
"use client"
import { useEffect, useRef, useState } from "react"

const PHRASES = [
  {
    text: "The Prophet Muhammad (ﷺ) said:",
    size: "sm",
  },
  {
    text: "\u201cIf the Final Hour comes while one of you has a seedling in his hand,",
    size: "lg",
  },
  {
    text: "let him plant it.\u201d",
    size: "xl",
  },
  {
    text: "A Muslim is called to act with purpose, goodness, and hope\u2014regardless of circumstances.",
    size: "md",
  },
  {
    text: "So continue to grow. To strive. To better yourself.",
    size: "lg",
  },
  {
    text: "Because every sincere effort, no matter how small, carries weight with Allah.",
    size: "md",
  },
  {
    text: "This page exists to help you take that next step.",
    size: "lg",
  },
  {
    text: "join the community",
    size: "cta",
  },
]

function ScrollPhrase({ text, size, index }: { text: string; size: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const sizeClass =
    size === "xl" ? "text-4xl md:text-6xl lg:text-7xl" :
    size === "lg" ? "text-2xl md:text-4xl lg:text-5xl" :
    size === "md" ? "text-xl md:text-2xl lg:text-3xl" :
    size === "sm" ? "text-sm md:text-base uppercase tracking-widest" :
    "text-lg"

  const isCta = size === "cta"

  return (
    <div
      ref={ref}
      className="flex items-center justify-center min-h-[60vh] px-6 md:px-16"
    >
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
          transitionDelay: "0.05s",
          maxWidth: "800px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {isCta ? (
          <div className="flex flex-col items-center gap-6">
            <p className="text-base md:text-lg text-gray-400" style={{ fontFamily: "var(--font-fraunces, serif)" }}>
              Connect with other Muslim professionals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a
                href="https://instagram.com/mphhh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: "#111111", color: "white" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Follow on Instagram
              </a>
              <a
                href="https://discord.gg/mphhh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium border transition-all hover:bg-gray-50"
                style={{ borderColor: "#e5e7eb", color: "#111111" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.079.11 18.1.128 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Join Discord
              </a>
            </div>
          </div>
        ) : (
          <p
            className={`${sizeClass} text-gray-900 leading-tight`}
            style={{
              fontFamily: size === "sm" ? "var(--font-host-grotesk, sans-serif)" : "var(--font-fraunces, serif)",
              fontWeight: 400,
              letterSpacing: size === "sm" ? "0.1em" : "-0.02em",
              color: size === "sm" ? "#9ca3af" : "#1a1a1a",
            }}
          >
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

export function InspireSection() {
  return (
    <section className="bg-white py-24 border-t border-gray-50">
      {PHRASES.map((phrase, i) => (
        <ScrollPhrase key={i} text={phrase.text} size={phrase.size} index={i} />
      ))}
      <div className="flex items-center justify-center pb-24 text-xs text-gray-300" style={{ fontFamily: "var(--font-host-grotesk, sans-serif)" }}>
        © 2025 Muslim Professional Hub
      </div>
    </section>
  )
}
