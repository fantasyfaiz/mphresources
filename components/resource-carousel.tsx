"use client"

import React from "react"

import { useRef, useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, X, ArrowUpRight } from "lucide-react"
import { COLORS } from "./mihrab-hero"
import Image from "next/image"

interface Resource {
  id: string
  name: string
  subtitle?: string
  description: string
  tags: string[]
  logo?: string
  link?: string
  members?: string
  logoSize?: "small" | "medium" | "large"
}

interface ResourceCarouselProps {
  title: string
  resources: Resource[]
}

// Modal Component
function CardModal({ 
  resource, 
  isOpen, 
  onClose,
  tagColors 
}: { 
  resource: Resource
  isOpen: boolean
  onClose: () => void
  tagColors: { bg: string; text: string }[]
}) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Liquid Metal Modal content */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg p-6 shadow-xl z-10 rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          background: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #252525 100%)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Metallic sheen overlay */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            background: "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 40%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 60%, transparent 100%)",
          }}
        />
        
        {/* Subtle border glow */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        />

        {/* Grainy texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-lg opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-200 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with logo and name */}
        <div className="relative flex items-center gap-4 mb-5">
          <Image
            src={resource.logo || "/images/muppies-logo.png"}
            alt={resource.name}
            width={60}
            height={60}
            className="object-contain"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)) brightness(1.1)",
            }}
          />
          <div>
            <h2 id="modal-title" className="font-semibold text-xl text-white">
              {resource.name}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">{resource.subtitle || resource.description}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="relative flex flex-wrap gap-1 mb-5">
          {resource.tags.map((tag, tagIndex) => {
            const color = tagColors[tagIndex % tagColors.length]
            return (
              <span
                key={tag}
                className="px-1 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: color.bg,
                  color: color.text,
                }}
              >
                {tag}
              </span>
            )
          })}
        </div>

        {/* Description */}
        <div className="relative mb-6 max-h-48 overflow-y-auto">
          <p className="text-sm leading-relaxed text-gray-300">
            {resource.description}
          </p>
        </div>

        {/* Member count */}
        <div className="relative flex items-center gap-2 mb-5">
          <div 
            className="w-2.5 h-2.5 rounded-full"
            style={{ 
              backgroundColor: "#4ade80",
              boxShadow: "0 0 8px rgba(74, 222, 128, 0.5)",
              animation: "flicker 2s ease-in-out infinite" 
            }}
          />
          <span className="text-sm font-medium text-gray-200">{resource.members || "500+"} members</span>
        </div>

        {/* Learn more CTA */}
        <a
          href={resource.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-block text-sm font-medium hover:underline text-gray-300 hover:text-white transition-colors"
        >
          Learn more &rarr;
        </a>
      </div>
    </div>
  )
}

// Liquid Metal Card Component (for first card in Professional Societies)
function LiquidMetalCard({ 
  resource, 
  tagColors,
  onCardClick 
}: { 
  resource: Resource
  tagColors: { bg: string; text: string }[]
  onCardClick: () => void
}) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onCardClick()
    }
  }, [onCardClick])

  return (
    <div className="flex-shrink-0 w-96">
      {/* Liquid Metal Card - straight edges */}
      <div
        className="group relative aspect-[16/10] cursor-pointer overflow-hidden hover:shadow-lg transition-shadow"
        onClick={onCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`${resource.name} card. Press Enter to view details.`}
        style={{
          background: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #252525 100%)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Metallic sheen overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.05) 40%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 60%, transparent 100%)",
          }}
        />
        
        {/* Animated light streak */}
        <div 
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          <div 
            className="absolute w-32 h-full -skew-x-12"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)",
              animation: "lightStreak 4s ease-in-out infinite",
              animationDelay: "1s",
            }}
          />
        </div>

        {/* Subtle border glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.02)",
          }}
        />

        {/* Grainy texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        {/* Flickering dot with status */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div 
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: "#4ade80",
              boxShadow: "0 0 8px rgba(74, 222, 128, 0.5)",
              animation: "flicker 2s ease-in-out infinite",
            }}
          />
          <span className="text-sm font-medium tracking-wider text-gray-300 uppercase">{resource.members || "500+"} members</span>
        </div>

        {/* Arrow CTA - top right */}
        <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-600/50">
          <ArrowUpRight className="w-4 h-4 text-gray-300" />
        </div>
        
        {/* Centered logo without circle - just drop shadow with hover animation */}
        <div className="flex items-center justify-center h-full">
          <Image
            src={resource.logo || "/images/muppies-logo.png"}
            alt={resource.name}
            width={resource.logoSize === "small" ? 90 : resource.logoSize === "large" ? 140 : 120}
            height={resource.logoSize === "small" ? 90 : resource.logoSize === "large" ? 140 : 120}
            className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
            style={{
              filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) brightness(1.1)",
            }}
          />
        </div>
      </div>

      {/* Content below card */}
      <div className="mt-4 flex items-start justify-between">
        {/* Left side - name and description */}
        <div>
          <h3 className="font-medium text-base text-gray-900">
            {resource.name}
          </h3>
          <p className="text-sm mt-0.5 text-gray-400">
            {resource.subtitle || resource.description}
          </p>
        </div>

        {/* Right side - tags with hard-edged highlights */}
        <div className="flex flex-wrap gap-1 justify-end">
          {resource.tags.map((tag, tagIndex) => {
            const color = tagColors[tagIndex % tagColors.length]
            return (
              <span
                key={tag}
                className="px-1 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: color.bg,
                  color: color.text,
                }}
              >
                {tag}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Regular Card Component
function ResourceCard({ 
  resource, 
  tagColors,
  onCardClick 
}: { 
  resource: Resource
  tagColors: { bg: string; text: string }[]
  onCardClick: () => void
}) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onCardClick()
    }
  }, [onCardClick])

  return (
    <div className="flex-shrink-0 w-96">
      {/* Card */}
      <div
        className="group relative aspect-[16/10] cursor-pointer bg-[#F3F4F6] overflow-hidden hover:shadow-lg transition-shadow"
        onClick={onCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`${resource.name} card. Press Enter to view details.`}
      >
        {/* Grainy texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.25]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        {/* Flickering dot with status */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div 
            className="w-2.5 h-2.5 rounded-full bg-blue-500"
            style={{
              animation: "flicker 2s ease-in-out infinite",
            }}
          />
          <span className="text-sm font-medium text-gray-900">{resource.members || "500+"} members</span>
        </div>
        
        {/* Centered logo with drop shadow and hover animation */}
        <div className="flex items-center justify-center h-full">
          <Image
            src={resource.logo || "/images/muppies-logo.png"}
            alt={resource.name}
            width={resource.logoSize === "small" ? 100 : resource.logoSize === "large" ? 160 : 140}
            height={resource.logoSize === "small" ? 100 : resource.logoSize === "large" ? 160 : 140}
            className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
            style={{
              filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
            }}
          />
        </div>
      </div>

      {/* Content below card */}
      <div className="mt-4 flex items-start justify-between">
        {/* Left side - name and description */}
        <div>
          <h3 className="font-medium text-base text-gray-900">
            {resource.name}
          </h3>
          <p className="text-sm mt-0.5 text-gray-400">
            {resource.subtitle || resource.description}
          </p>
        </div>

        {/* Right side - tags with hard-edged highlights */}
        <div className="flex flex-wrap gap-1 justify-end">
          {resource.tags.map((tag, tagIndex) => {
            const color = tagColors[tagIndex % tagColors.length]
            return (
              <span
                key={tag}
                className="px-1 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: color.bg,
                  color: color.text,
                }}
              >
                {tag}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function ResourceCarousel({ title, resources }: ResourceCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Tag color variants using our color scheme - hard edged highlights
  const tagColors = [
    { bg: `${COLORS.lightTeal}25`, text: COLORS.teal }, // teal
    { bg: `${COLORS.gold}25`, text: COLORS.gold }, // gold
    { bg: `${COLORS.navy}15`, text: COLORS.navy }, // navy
    { bg: `${COLORS.olive}20`, text: COLORS.olive }, // olive
  ]

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 px-4 md:px-8 lg:px-16">
        <h2 className="relative text-xl md:text-2xl font-serif font-semibold text-[#2D2D2D] overflow-hidden inline-block">
          <span className="relative z-10">{title}</span>
          <span 
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)",
              animation: "textShine 5s ease-in-out infinite",
              mixBlendMode: "overlay",
            }}
          />
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 border transition-colors hover:bg-gray-50"
            style={{ borderColor: `${COLORS.teal}30` }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" style={{ color: COLORS.teal }} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 border transition-colors hover:bg-gray-50"
            style={{ borderColor: `${COLORS.teal}30` }}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" style={{ color: COLORS.teal }} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 px-4 md:px-8 lg:px-16"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {resources.map((resource, index) => (
          // Use LiquidMetalCard for first card in Professional Networks/Societies
          title === "Professional Networks/Societies" && index === 0 ? (
            <LiquidMetalCard 
              key={resource.id} 
              resource={resource} 
              tagColors={tagColors}
              onCardClick={() => setSelectedResource(resource)}
            />
          ) : (
            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              tagColors={tagColors}
              onCardClick={() => setSelectedResource(resource)}
            />
          )
        ))}
      </div>

      {/* Modal */}
      {selectedResource && (
        <CardModal
          resource={selectedResource}
          isOpen={!!selectedResource}
          onClose={() => setSelectedResource(null)}
          tagColors={tagColors}
        />
      )}

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes lightStreak {
          0% { left: -30%; }
          50%, 100% { left: 130%; }
        }
        @keyframes textShine {
          0% { transform: translateX(-100%); }
          40%, 100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
