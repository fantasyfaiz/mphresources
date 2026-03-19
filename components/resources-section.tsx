'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { X, ArrowUpRight, Globe, Rocket, GraduationCap, BookOpen, Users, LayoutGrid } from 'lucide-react'
import { COLORS } from './mihrab-hero'
import Image from 'next/image'
import { supabase, type Resource } from '@/lib/supabase'

interface CardResource {
  id: string
  name: string
  subtitle?: string
  description: string
  tags: string[]
  logo?: string
  link?: string
  members?: string
  section?: string
  location_scope?: string
  location?: string
}

const tagColors = [
  { bg: `${COLORS.lightTeal}25`, text: COLORS.teal },
  { bg: `${COLORS.gold}25`,      text: COLORS.gold },
  { bg: `${COLORS.navy}15`,      text: COLORS.navy },
  { bg: `${COLORS.olive}20`,     text: COLORS.olive },
]

function dotLabel(r: CardResource): string {
  if (!r.members || r.members === 'N/A') {
    if (r.section === 'Scholarships') return 'Open applications'
    if (r.section === 'Fellowships')  return 'Accepting fellows'
    if (r.section === 'Other')        return 'Free resource'
    if (r.location_scope === 'global' || r.location_scope === 'national') return 'Nationwide'
    return 'Active'
  }
  if (r.members.includes('LinkedIn')) return '11.5k+ followers'
  return r.members
}

function dotColor(r: CardResource): string {
  if (r.section === 'Scholarships' || r.section === 'Fellowships') return COLORS.gold
  if (!r.members || r.members === 'N/A') return COLORS.lightTeal
  return '#4ade80'
}

const TABS: { label: string; short: string; icon: React.ElementType }[] = [
  { label: 'Professional Networks', short: 'Networks',      icon: Globe },
  { label: 'Entrepreneurship',      short: 'Builders',      icon: Rocket },
  { label: 'Scholarships',          short: 'Scholarships',  icon: GraduationCap },
  { label: 'Fellowships',           short: 'Fellowships',   icon: BookOpen },
  { label: 'Community',             short: 'Community',     icon: Users },
  { label: 'Other',                 short: 'Other',         icon: LayoutGrid },
]

function CardModal({ resource, onClose }: { resource: CardResource; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-lg p-6 shadow-xl z-10 rounded-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ background: 'linear-gradient(145deg, #3d3d3d 0%, #2e2e2e 50%, #383838 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
        <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.05) 60%, transparent 100%)' }} />
        <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }} />

        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-200 z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="relative flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
            <Image src={resource.logo || '/placeholder.png'} alt={resource.name} width={48} height={48} unoptimized className="object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>
          <div>
            <h2 className="font-semibold text-xl text-white">{resource.name}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{resource.subtitle}</p>
          </div>
        </div>

        <div className="relative flex flex-wrap gap-1.5 mb-5">
          {resource.tags.map((tag, i) => (
            <span key={tag} className="px-2.5 py-1 text-xs font-medium rounded-full"
              style={{ backgroundColor: `${tagColors[i % tagColors.length].text}20`, color: tagColors[i % tagColors.length].text }}>
              {tag}
            </span>
          ))}
        </div>

        <div className="relative mb-5 max-h-40 overflow-y-auto">
          <p className="text-sm leading-relaxed text-gray-200">{resource.description}</p>
        </div>

        <div className="relative flex items-center gap-2 mb-5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor(resource), animation: 'flicker 2s ease-in-out infinite' }} />
          <span className="text-sm text-gray-200">{dotLabel(resource)}</span>
        </div>

        {resource.link && (
          <a href={resource.link} target="_blank" rel="noopener noreferrer"
            className="relative inline-flex items-center gap-1 text-sm font-medium text-gray-100 hover:text-white transition-colors">
            Learn more <ArrowUpRight className="w-4 h-4" />
          </a>
        )}
        <style jsx>{`@keyframes flicker{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>
    </div>
  )
}

function ResourceCard({ resource, isFirst, onCardClick }: { resource: CardResource; isFirst: boolean; onCardClick: () => void }) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCardClick() }
  }, [onCardClick])

  return (
    <div className="flex-shrink-0 w-64 md:w-72">
      {/* Card image area */}
      <div
        className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl"
        onClick={onCardClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        style={{ backgroundColor: '#F3F4F6' }}
      >


        {/* Dot + status */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor(resource), animation: 'flicker 2s ease-in-out infinite' }} />
          <span className="text-xs font-medium text-gray-500">{dotLabel(resource)}</span>
        </div>

        {/* Hover arrow */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
          <ArrowUpRight className="w-4 h-4" />
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center h-full px-6">
          <Image
            src={resource.logo || '/placeholder.png'}
            alt={resource.name}
            width={96} height={96}
            unoptimized
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            style={{}}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>

        <style jsx>{`
          @keyframes flicker{0%,100%{opacity:1}50%{opacity:0.4}}
          @keyframes lightStreak{0%{left:-30%}60%,100%{left:130%}}
        `}</style>
      </div>

      {/* Below card content */}
      <div className="mt-3 space-y-2">
        <div>
          <h3 className="font-medium text-sm text-gray-900 leading-snug">{resource.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{resource.subtitle}</p>
        </div>

        {/* Pill tags — location first for Community */}
        <div className="flex flex-wrap gap-1">
          {(() => {
            const locationTag = (resource.section === 'Community' && resource.location)
              ? resource.location.split(';')[0].split(',')[0].trim()
              : null
            const baseTags = resource.tags.slice(0, locationTag ? 2 : 3)
            const displayTags = locationTag ? [locationTag, ...baseTags] : baseTags
            return displayTags.map((tag, i) => (
              <span key={tag} className="px-2.5 py-0.5 text-xs font-medium rounded-full"
                style={{ backgroundColor: tagColors[i % tagColors.length].bg, color: tagColors[i % tagColors.length].text }}>
                {tag}
              </span>
            ))
          })()}
        </div>

        {resource.link && (
          <a href={resource.link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-xs text-gray-400 hover:text-gray-700 transition-colors underline underline-offset-2"
            onClick={e => e.stopPropagation()}>
            Learn More <ArrowUpRight className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  )
}

// Logo filename map — maps resource name to exact filename in public/images/
const LOGO_MAP: Record<string, string> = {
  "Muppies":                                  "/images/muppies-logo.png",
  "Muslim Women Professionals":               "/images/mwp-logo.png",
  "Muslim Public Service Network":            "/images/mpsn-logo.png",
  "Muslim Public Service Network Fellowship": "/images/mpsn-logo.png",
  "AMCOB":                                    "/images/amcob-logo.webp",
  "LaunchGood":                               "/images/launchgood-logo.svg",
  "Muslim Professionals":                     "/images/muslim-professionals-logo.png",
  "Ummah Professionals":                      "/images/ummah-professionals-logo.png",
  "Alif":                                     "/images/alif-logo.png",
  "Founders Inc":                             "/images/founders-inc-logo.png",
  "b132":                                     "/images/b132-logo.png",
  "Pillars Fund":                             "/images/pillars-fund-logo.png",
  "Pillars Artist Fund":                      "/images/pillars-fund-logo.png",
  "Islamic Scholarship Fund":                 "/images/isf-logo.png",
  "Dr. Shakir Scholarship":                   "/images/isna-logo.png",
  "Razia Sheikh Scholarship":                 "/images/isna-logo.png",
  "AMANA Mutual Funds Scholarship":           "/images/isna-logo.png",
  "IMANA Medical Scholarship":                "/images/imana-logo.png",
  "Iqra Fellowship":                          "/images/iqra-fellowship-logo.png",
  "Taleef Collective":                        "/images/taleef-logo.png",
  "MCC East Bay":                             "/images/mcc_east_bay.png",
  "Islamic Foundation":                       "/images/islamic_foundation_logo.webp",
  "Rawdah":                                   "/images/Rawdah-logo.png",
  "Qalam Institute":                          "/images/qalamlogo.png",
  "Roots":                                    "/images/Roots-Community.webp",
  "American Muslim Community Foundation":     "/images/american_muslim_community_foundation.png",
  "IMAN":                                     "/images/imanlogo.jpg",
  "Mpower Change":                            "/images/mpowerchangelogo.webp",
  "Al Maqasid":                               "/images/almaqasid_logo.webp",
  "Wasat":                                    "/images/Wasat_logo.webp",
  "Islah LA":                                 "/images/islahLA_1.png",
  "Zakat Foundation Scholarship":             "/images/zakatfoundationlogo.webp",
}

export function ResourcesSection() {
  const [allResources, setAllResources] = useState<CardResource[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Professional Networks')
  const [selectedResource, setSelectedResource] = useState<CardResource | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.from('resources').select('*').eq('is_active', true).order('id')
      .then(({ data }) => {
        if (data) setAllResources(data.map((r: Resource) => ({
          id: String(r.id),
          name: r.name,
          subtitle: r.subtitle,
          description: r.description,
          tags: r.tags ? r.tags.split(',').map((t: string) => t.trim()) : [],
          logo: LOGO_MAP[r.name] || `/images/${r.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-logo.png`,
          link: r.link,
          members: r.members,
          section: r.section,
          location_scope: r.location_scope,
          location: r.location,
        })))
        setLoading(false)
      })
  }, [])

  const tabResources = allResources.filter(r => r.section === activeTab)

  return (
    <section className="py-16 bg-white overflow-x-hidden">
      <div className="mb-8 px-4 md:px-8 lg:px-16">
        <h2 className="text-2xl md:text-3xl mb-1 text-[#2D2D2D]" style={{ fontFamily: "var(--font-fraunces, serif)", fontWeight: 400, letterSpacing: "-0.02em" }}>Explore Resources</h2>
        <p className="text-sm" style={{ color: COLORS.olive }}>Discover curated professional resources across the Muslim ecosystem</p>
      </div>

      {/* Tab bar — desktop icon grid, mobile scrollable pills */}
      <div className="mb-8">

        {/* Desktop only: full width icon tabs */}
        <div className="hidden md:flex w-full border-b border-gray-100">
          {TABS.map((tab) => {
            const TabIcon = tab.icon
            const isActive = activeTab === tab.label
            return (
              <button
                key={tab.label}
                onClick={() => { setActiveTab(tab.label); scrollRef.current?.scrollTo({ left: 0 }) }}
                className="flex flex-col items-center justify-start gap-3 py-6 flex-1 transition-all duration-200 border-b-2"
                style={{ borderBottomColor: isActive ? COLORS.navy : '#e5e7eb' }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200"
                  style={{ backgroundColor: isActive ? COLORS.navy : 'transparent' }}>
                  <TabIcon className="w-6 h-6" style={{ color: isActive ? 'white' : '#c4c4c4' }} />
                </div>
                <span className="text-xs font-medium text-center leading-tight px-1"
                  style={{ color: isActive ? COLORS.navy : '#9ca3af' }}>
                  {tab.label === 'Professional Networks' ? 'Professional Networks/Societies' : tab.label === 'Entrepreneurship' ? 'Entrepreneurship & Builders' : tab.label === 'Community' ? 'Other Communities' : tab.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Mobile only: scrollable pill tabs */}
        <div className="md:hidden px-4 pb-4 pt-1" style={{ overflowX: 'scroll', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
          <div className="flex gap-3" style={{ width: 'max-content' }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.label
              const shortLabel = tab.label === 'Professional Networks' ? 'Networks' :
                tab.label === 'Entrepreneurship' ? 'Builders' :
                tab.label
              return (
                <button
                  key={tab.label}
                  onClick={() => { setActiveTab(tab.label); scrollRef.current?.scrollTo({ left: 0 }) }}
                  style={{
                    padding: '8px 22px',
                    borderRadius: '999px',
                    fontSize: '14px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    border: '1px solid',
                    backgroundColor: isActive ? COLORS.navy : 'white',
                    color: isActive ? 'white' : '#6b7280',
                    borderColor: isActive ? COLORS.navy : '#e5e7eb',
                    transition: 'all 0.15s',
                  }}
                >
                  {shortLabel}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Resource cards */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        </div>
      ) : tabResources.length === 0 ? (
        <div className="px-4 md:px-8 lg:px-16 py-12 text-center text-sm text-gray-400">
          No resources yet in this category.
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-6 px-4 md:px-8 lg:px-16"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {tabResources.map((resource, i) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isFirst={i === 0}
              onCardClick={() => setSelectedResource(resource)}
            />
          ))}
        </div>
      )}

      {selectedResource && (
        <CardModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
      )}
    </section>
  )
}
