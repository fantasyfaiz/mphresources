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
  if (r.name === 'Iqra Fellowship') return 'Applications closed'
  if (r.name === 'Dr. Shakir Scholarship' || r.name === 'Razia Sheikh Scholarship') return 'Closes Apr 30'
  if (r.name === 'Muslim Public Service Network Fellowship') return 'Rolling: Mar 31 · Late: May 1'
  if (!r.members || r.members === 'N/A') {
    if (r.section === 'Scholarships') return 'Open applications'
    if (r.section === 'Fellowships')  return 'Accepting fellows'
    if (r.section === 'Other')        return 'Free resource'
    if (r.location_scope === 'global' || r.location_scope === 'national') return 'Nationwide'
    return 'Active'
  }
  if (r.members.includes('LinkedIn')) return '11.5k+ followers'
  if (r.members.includes('granted') || r.members.includes('fellows') || r.members.includes('companies')) return r.members
  if (r.members.toLowerCase().includes('member')) return r.members
  return `${r.members} members`
}

function dotColor(r: CardResource): string {
  if (r.name === 'Iqra Fellowship') return '#9ca3af'
  if (r.name === 'Dr. Shakir Scholarship' || r.name === 'Razia Sheikh Scholarship') return '#4ade80'
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

function SubmitModal({ onClose, defaultCategory }: { onClose: () => void; defaultCategory: string }) {
  const [form, setForm] = React.useState({ name: '', link: '', category: defaultCategory, description: '', email: '' })
  const [submitted, setSubmitted] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose])

  const handleSubmit = async () => {
    if (!form.name.trim()) return
    setLoading(true)
    await supabase.from('submissions').insert({
      name: form.name,
      link: form.link,
      category: form.category,
      description: form.description,
      submitted_by_email: form.email,
    })
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900" style={{ fontFamily: 'var(--font-fraunces, serif)' }}>
            {submitted ? 'Thank you!' : 'Suggest a resource'}
          </h2>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-600 text-sm mb-1">Your submission has been received.</p>
            <p className="text-gray-400 text-xs">We review all submissions and add approved resources within a few days.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ backgroundColor: '#111111' }}>Done</button>
          </div>
        ) : (
          <div className="px-6 py-5 flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Resource name *</label>
              <input type="text" placeholder="e.g. Muslim Finance Network"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-gray-400 bg-gray-50" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Website link</label>
              <input type="url" placeholder="https://"
                value={form.link} onChange={e => setForm(p => ({ ...p, link: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-gray-400 bg-gray-50" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-gray-400 bg-gray-50">
                <option>Professional Networks</option>
                <option>Entrepreneurship</option>
                <option>Scholarships</option>
                <option>Fellowships</option>
                <option>Community</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Short description</label>
              <textarea placeholder="What is this resource and who is it for?"
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-gray-400 bg-gray-50 resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Your email (optional)</label>
              <input type="email" placeholder="so we can follow up if needed"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-gray-400 bg-gray-50" />
            </div>
            <button onClick={handleSubmit} disabled={!form.name.trim() || loading}
              className="w-full py-3 rounded-xl text-sm font-medium text-white mt-1 transition-all"
              style={{ backgroundColor: form.name.trim() ? '#111111' : '#e5e7eb', color: form.name.trim() ? 'white' : '#9ca3af' }}>
              {loading ? 'Submitting...' : 'Suggest resource →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

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
        style={{ background: '#E2E1DF', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div className="absolute inset-0 pointer-events-none rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.06)' }} />

        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-700 z-10">
          <X className="w-5 h-5" />
        </button>

        <div className="relative flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
            <Image src={resource.logo || '/placeholder.png'} alt={resource.name} width={48} height={48} unoptimized className="object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>
          <div>
            <h2 className="font-semibold text-xl text-gray-900">{resource.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{resource.subtitle}</p>
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
          <p className="text-sm leading-relaxed text-gray-700">
            {resource.name === 'Alif'
              ? 'Alif is a venture fund and community for Muslim founders. They invest in early-stage startups (up to $500k), connect founders with engineers, marketers, and designers through their network, and host events where you can meet other builders and find your first believers.'
              : resource.name === 'Muppies'
              ? 'Muppies is a professional network spanning eight industries: consulting, entrepreneurship, finance, general management, law, social enterprise/public sector, technology, and product management. Members range from college juniors all the way to C-suite executives.'
              : resource.name === 'Muslim Professionals'
              ? 'Muslim Professionals is a community network for Muslim professionals. Applying gives you access to their Slack group, a networking sheet, and notifications on meetups and inner happenings.'
              : resource.name === 'Muslim Public Service Network Fellowship'
              ? 'A fellowship for Muslim professionals heading to Washington, D.C. Ideal for individuals who have secured (or are on their way to securing) a summer job or internship in D.C. Age requirement: 20+. Rolling applications close March 31 — late applications accepted until May 1.'
              : resource.name === 'Islamic Scholarship Fund'
              ? 'Since 2009, ISF has awarded $3.46 million in scholarships and grants, helping place scholars in positions that impact public policy and opinion across media, film, law, government, and more.'
              : resource.description}
          </p>
        </div>

        <div className="relative flex items-center gap-2 mb-5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor(resource), animation: 'flicker 2s ease-in-out infinite' }} />
          <span className="text-sm text-gray-600">{dotLabel(resource)}</span>
        </div>

        {resource.link && (
          <a href={resource.link} target="_blank" rel="noopener noreferrer"
            className="relative inline-flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-black transition-colors">
            Learn more <ArrowUpRight className="w-4 h-4" />
          </a>
        )}

        {/* Location badge for community cards */}
        {resource.section === 'Community' && resource.location && (
          <div className="relative mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400" style={{ fontFamily: "var(--font-host-grotesk, sans-serif)" }}>
              📍 {resource.location.split(';').map((l: string) => l.trim()).join(' & ')}
            </p>
          </div>
        )}

        {/* Muppies extra links */}
        {resource.name === 'Muppies' && (
          <div className="relative mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
            <a href="https://www.muppies.org/membership/" target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-gray-800 hover:text-black transition-colors flex items-center gap-1">
              Apply for membership <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Muslim Professionals extra links */}
        {resource.name === 'Muslim Professionals' && (
          <div className="relative mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
            <a href="https://www.academy.muslimprofessionals.us/" target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-gray-800 hover:text-black transition-colors flex items-center gap-1">
              MP Academy — free courses <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a href="https://mpsouq.com/" target="_blank" rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
              MP Souq — Muslim-owned business directory <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* MPSN Fellowship links */}
        {resource.name === 'Muslim Public Service Network Fellowship' && (
          <div className="relative mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
            <a href="https://www.muslimpublicservice.org/application" target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-gray-800 hover:text-black transition-colors flex items-center gap-1">
              Apply now <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a href="http://instagram.com/mpsndc/" target="_blank" rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
              Instagram @mpsndc <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.linkedin.com/company/mpsndc" target="_blank" rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
              LinkedIn <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Roots extra links */}
        {resource.name === 'Roots' && (
          <div className="relative mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
            <a href="https://www.rootsdfw.org/suhbah-coffee" target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-gray-800 hover:text-black transition-colors flex items-center gap-1">
              Suhbah Coffee Space <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.rootsdfw.org/programs/adults" target="_blank" rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
              Browse past programs <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.rootsdfw.org/calendar" target="_blank" rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
              Program calendar <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Taleef Collective media link */}
        {resource.name === 'Taleef Collective' && (
          <div className="relative mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
            <a href="https://www.taleefcollective.org/media" target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-gray-800 hover:text-black transition-colors flex items-center gap-1">
              Featured talks &amp; media <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.taleefcollective.org/living-learning" target="_blank" rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
              Programs &amp; living-learning <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.instagram.com/taleefcollective/" target="_blank" rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
              Instagram <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.youtube.com/channel/UCh14wbm-k-SaHvgYV1AHCEw" target="_blank" rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
              YouTube <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* b132 founder */}
        {resource.name === 'b132' && (
          <div className="relative mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Founder</p>
            <a href="mailto:humayunz@umich.edu" className="text-sm font-medium text-gray-800 hover:text-black transition-colors flex items-center gap-1">
              Zayd Humayun <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <p className="text-xs text-gray-400 mt-0.5">humayunz@umich.edu</p>
          </div>
        )}

        {/* Iqra Fellowship contact */}
        {resource.name === 'Iqra Fellowship' && (
          <div className="relative mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Questions?</p>
            <a href="mailto:fellowship@bostonislamicseminary.org" className="text-sm font-medium text-gray-800 hover:text-black transition-colors flex items-center gap-1 break-all">
              fellowship@bostonislamicseminary.org <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0" />
            </a>
          </div>
        )}

        {/* Alif links */}
        {resource.name === 'Alif' && (
          <div className="relative mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
            <a href="https://alif.build/portfolio" target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-gray-800 hover:text-black transition-colors flex items-center gap-1">
              View portfolio companies <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.linkedin.com/in/omarwaseem/" target="_blank" rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1">
              Founder: Omar Waseem <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
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
            width={128} height={128}
            unoptimized
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            style={{
              width: `${LOGO_SIZE[resource.name] || 96}px`,
              height: `${LOGO_SIZE[resource.name] || 96}px`,
            }}
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

function FlipWord({ words }: { words: string[] }) {
  const [index, setIndex] = React.useState(0)
  const [visible, setVisible] = React.useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % words.length)
        setVisible(true)
      }, 300)
    }, 2200)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <span className="relative inline-block" style={{ minWidth: '140px' }}>
      <span
        style={{
          display: 'inline-block',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-8px)',
          borderBottom: '2px solid #2D2D2D',
          paddingBottom: '1px',
        }}
      >
        {words[index]}
      </span>
    </span>
  )
}

// Logo size overrides — default is 96px, use style prop for actual display
const LOGO_SIZE: Record<string, number> = {
  // Professional Networks — slightly smaller
  "Muppies":                          60,
  "Muslim Professionals":             60,
  // Entrepreneurship — slightly larger
  "Alif":                             130,
  "b132":                             130,
  "Pillars Fund":                     130,
  // Scholarships — larger for text-based logos
  "Dr. Shakir Scholarship":           140,
  "Razia Sheikh Scholarship":         140,
  "AMANA Mutual Funds Scholarship":   140,
  "Pillars Artist Fund":              140,
  "Zakat Foundation Scholarship":     70,
  // Fellowships
  "Iqra Fellowship":                  68,
  "Muslim Public Service Network Fellowship": 130,
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
  const [submitOpen, setSubmitOpen] = useState(false)
  const [submitCategory, setSubmitCategory] = useState('Professional Networks')

  useEffect(() => {
    const handler = () => setSubmitOpen(true)
    window.addEventListener('open-suggest-modal', handler)
    return () => window.removeEventListener('open-suggest-modal', handler)
  }, [])
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

  const tabResources = allResources.filter(r => r.section === activeTab && r.name !== 'MSA')
  // Debug: log to confirm data is loading
  // console.log('tabResources', tabResources.map(r => r.name))

  return (
    <section className="py-16 bg-white overflow-x-hidden">
      <div className="mb-8 px-4 md:px-8 lg:px-16">
        <h2 className="text-2xl md:text-3xl mb-1 text-[#2D2D2D] flex items-baseline gap-2 flex-wrap" style={{ fontFamily: "var(--font-fraunces, serif)", fontWeight: 400, letterSpacing: "-0.02em" }}>
          <span>Explore</span>
          <FlipWord words={["Resources", "Networks", "Builders", "Fellowships", "Communities", "Scholarships"]} />
        </h2>
        <p className="text-sm" style={{ color: COLORS.olive }}>Discover curated professional resources across the Muslim ecosystem</p>
      </div>

      {/* Tab bar — desktop icon grid, mobile scrollable pills */}
      <div className="mb-8">

        {/* Desktop only: full width icon tabs */}
        <div className="hidden md:flex w-full border-b border-gray-200">
          {TABS.map((tab) => {
            const TabIcon = tab.icon
            const isActive = activeTab === tab.label
            return (
              <button
                key={tab.label}
                onClick={() => { setActiveTab(tab.label); scrollRef.current?.scrollTo({ left: 0 }) }}
                className="flex flex-col items-center justify-start gap-3 py-6 flex-1 transition-all duration-200 border-b-2"
                style={{ borderBottomColor: isActive ? '#111111' : 'transparent' }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-200"
                  style={{ backgroundColor: isActive ? '#E2E1DF' : 'transparent' }}>
                  <TabIcon className="w-6 h-6" style={{ color: isActive ? '#111111' : '#aaaaaa' }} />
                </div>
                <span className="text-xs font-medium text-center px-1" style={{ color: isActive ? '#111111' : '#aaaaaa', lineHeight: '1.3' }}>
                  {tab.label === 'Professional Networks' ? (<>Professional<br/>Networks/Societies</>) : tab.label === 'Entrepreneurship' ? (<>Entrepreneurship<br/>&amp; Builders</>) : tab.label === 'Community' ? (<>Other<br/>Communities</>) : tab.label}
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
                    backgroundColor: isActive ? '#E6EFF1' : 'white',
                    color: isActive ? COLORS.teal : '#6b7280',
                    borderColor: isActive ? COLORS.teal : '#e5e7eb',
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
          {/* Option A: add resource card at end of carousel */}
          <div className="flex-shrink-0 w-64 md:w-72">
            <button
              onClick={() => { setSubmitCategory(activeTab); setSubmitOpen(true) }}
              className="group w-full aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all hover:border-gray-400"
              style={{ borderColor: '#d1d5db', backgroundColor: '#fafafa' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:bg-gray-100"
                style={{ backgroundColor: '#f3f4f6' }}>
                <span style={{ fontSize: 20, color: '#9ca3af', lineHeight: 1 }}>+</span>
              </div>
              <span className="text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">Suggest a resource</span>
              <span className="text-xs text-gray-300">Takes 2 minutes</span>
            </button>
            <div className="mt-3 space-y-1">
              <p className="text-sm font-medium text-gray-300">Know one we missed?</p>
            </div>
          </div>
        </div>
      )}

      {selectedResource && (
        <CardModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
      )}
      {submitOpen && (
        <SubmitModal onClose={() => setSubmitOpen(false)} defaultCategory={submitCategory} />
      )}
    </section>
  )
}
