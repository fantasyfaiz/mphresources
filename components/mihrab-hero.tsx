'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp, X, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase, type Resource } from '@/lib/supabase'

export const COLORS = {
  teal: '#2E5A6C',
  lightTeal: '#568FA1',
  navy: '#0F1D3A',
  olive: '#514B38',
  gold: '#936A21',
}

const colorArray = Object.values(COLORS)

const SEARCH_SENTENCES_DESKTOP = [
  'I am a college senior looking for startup opportunities on the west coast',
  'how can I meet fellow muslim finance professionals',
  'what are some mentorship opportunities for college muslims',
]
const SEARCH_SENTENCES_MOBILE = [
  'finance professionals',
  'entrepreneurship opportunities',
  'scholarships in public policy',
  'chicago muslim communities',
]

const CAREER_FIELDS = [
  'Finance & Economics', 'Technology & Engineering', 'Law & Policy',
  'Healthcare & Medicine', 'Media & Journalism', 'Creative Arts & Film',
  'Entrepreneurship & Business', 'Nonprofit & Civic Work', 'Government & Public Service',
  'General / Not sure yet',
]
const CITIES = [
  'New York', 'Chicago', 'Los Angeles', 'San Francisco / Bay Area',
  'Washington D.C.', 'Dallas / DFW', 'Houston', 'Seattle',
  'Boston', 'Philadelphia', 'National / Remote', 'Other',
]
const RESOURCE_TYPES = [
  'Professional Networks', 'Entrepreneurship', 'Scholarships',
  'Fellowships', 'Community', 'Other',
]

type QuizAnswers = {
  careerFields: string[]
  cities: string[]
  resourceTypes: string[]
}
type UserInfo = { firstName: string; email: string }

export function MihrabHero({ onSearch }: { onSearch: (q: string) => void }) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // quiz
  const [quizOpen, setQuizOpen] = useState(false)
  const [quizStep, setQuizStep] = useState(0) // 0,1,2 = questions; 3 = email gate
  const [answers, setAnswers] = useState<QuizAnswers>({ careerFields: [], cities: [], resourceTypes: [] })

  // email gate
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  // results
  const [showResults, setShowResults] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(false)
  const [introText, setIntroText] = useState('')

  // profile dropdowns
  const [showCareerDrop, setShowCareerDrop] = useState(false)
  const [showCityDrop, setShowCityDrop] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])



  useEffect(() => {
    const sentences = isMobile ? SEARCH_SENTENCES_MOBILE : SEARCH_SENTENCES_DESKTOP
    const current = sentences[sentenceIndex % sentences.length]
    let i = 0; let tid: NodeJS.Timeout
    if (isTyping) {
      const type = () => {
        if (i <= current.length) { setDisplayText(current.slice(0, i++)); tid = setTimeout(type, 50) }
        else tid = setTimeout(() => setIsTyping(false), 2000)
      }
      type()
    } else {
      i = current.length
      const del = () => {
        if (i >= 0) { setDisplayText(current.slice(0, i--)); tid = setTimeout(del, 30) }
        else { setSentenceIndex(p => (p + 1) % sentences.length); setIsTyping(true) }
      }
      del()
    }
    return () => clearTimeout(tid)
  }, [isTyping, sentenceIndex, isMobile])

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [resources, loading])

  const toggle = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]

  const canProceed = () => {
    if (quizStep === 0) return answers.careerFields.length > 0
    if (quizStep === 1) return answers.cities.length > 0
    if (quizStep === 2) return answers.resourceTypes.length > 0
    return false
  }

  const handleNext = () => {
    if (quizStep < 2) setQuizStep(s => s + 1)
    else setQuizStep(3) // go to email gate
  }

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  const handleGateSubmit = async (skip = false) => {
    if (!skip) {
      if (!firstName.trim()) { setEmailError('Please enter your first name'); return }
      if (!validateEmail(email)) { setEmailError('Please enter a valid email'); return }
    }
    setEmailError('')
    setQuizOpen(false)
    setShowResults(true)
    setLoading(true)

    const info = skip ? null : { firstName: firstName.trim(), email: email.trim() }
    setUserInfo(info)

    // Save lead to Supabase (fire and forget)
    if (!skip && info) {
      supabase.from('leads').insert({
        first_name: info.firstName,
        email: info.email,
        career_fields: answers.careerFields.join(', '),
        cities: answers.cities.join(', '),
        resource_types: answers.resourceTypes.join(', '),
      }).then(() => {})
    }

    // Fetch resources
    const { data, error } = await supabase
      .from('resources').select('*').eq('is_active', true).order('id')

    if (error || !data) {
      setIntroText('I had trouble loading resources. Please try again.')
      setLoading(false)
      return
    }

    const filtered = (data as Resource[]).filter(r => {
      const matchesType = answers.resourceTypes.some(t =>
        r.section?.toLowerCase().includes(t.toLowerCase())
      )
      const matchesCareer = answers.careerFields.some(f =>
        f === 'General / Not sure yet' ||
        r.career_fields?.toLowerCase().includes(f.toLowerCase().split(' ')[0]) ||
        r.tags?.toLowerCase().includes(f.toLowerCase().split(' ')[0]) ||
        r.description?.toLowerCase().includes(f.toLowerCase().split(' ')[0])
      )
      const matchesCity = answers.cities.some(c =>
        c === 'National / Remote' || c === 'Other' ||
        r.location?.toLowerCase().includes(c.toLowerCase().split('/')[0].trim()) ||
        r.location_scope === 'national' || r.location_scope === 'global'
      )
      return matchesType && (matchesCareer || matchesCity)
    })

    setResources(filtered)

    const count = filtered.length
    const sections = [...new Set(filtered.map(r => r.section))]
    const greeting = info ? `Wa alaikum assalam, ${info.firstName}! ` : 'Assalamu alaikum! '
    let intro = `${greeting}Based on your interests, I found **${count} resource${count !== 1 ? 's' : ''}** across ${sections.length} categor${sections.length !== 1 ? 'ies' : 'y'}.\n\n`
    intro += answers.careerFields.includes('General / Not sure yet')
      ? `Since you're still exploring, I've pulled a broad range to help you discover what resonates.`
      : `Your interest in **${answers.careerFields.slice(0, 2).join(' and ')}** opens up some great opportunities. Here's what I found:`
    setIntroText(intro)
    setLoading(false)
  }

  const resetSearch = () => {
    setShowResults(false); setQuizOpen(false); setQuizStep(0)
    setAnswers({ careerFields: [], cities: [], resourceTypes: [] })
    setFirstName(''); setEmail(''); setEmailError('')
    setResources([]); setIntroText(''); setUserInfo(null)
    setShowCareerDrop(false); setShowCityDrop(false)
    onSearch('')
  }

  const steps = [
    { key: 'careerFields' as const, question: 'What are your career interests?', hint: 'Pick all that apply', items: CAREER_FIELDS },
    { key: 'cities' as const, question: 'Which cities or regions interest you?', hint: 'Where are you based or looking?', items: CITIES },
    { key: 'resourceTypes' as const, question: 'What type of resources are you looking for?', hint: 'Pick all that apply', items: RESOURCE_TYPES },
  ]

  const initials = userInfo
    ? userInfo.firstName.charAt(0).toUpperCase()
    : ''

  // ── RESULTS PAGE ──
  if (showResults) {
    const grouped: Record<string, Resource[]> = {}
    resources.forEach(r => { if (!grouped[r.section]) grouped[r.section] = []; grouped[r.section].push(r) })

    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Sticky header */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 md:px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button onClick={resetSearch} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Search again
              </button>
              <span className="hidden md:block h-4 w-px bg-gray-200" />
              <span className="hidden md:block text-sm font-serif italic text-gray-400">MPH Resources</span>
            </div>

            {/* Right: profile + editable filters */}
            <div className="relative">
              <div className="flex flex-col items-end gap-1.5">

                {/* Name + email pill — only if they filled it in */}
                {userInfo && (
                  <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                      style={{ backgroundColor: '#E6EFF1', color: COLORS.navy }}>
                      {initials}
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-gray-800 leading-none">{userInfo.firstName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{userInfo.email}</p>
                    </div>
                  </div>
                )}

                {/* Career interests — click to edit */}
                <div className="flex flex-col items-end">
                  <button
                    onClick={() => { setShowCareerDrop(v => !v); setShowCityDrop(false) }}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all"
                    style={{ borderColor: showCareerDrop ? COLORS.teal : '#e5e7eb', color: showCareerDrop ? COLORS.teal : '#6b7280', backgroundColor: showCareerDrop ? '#E6EFF1' : 'white' }}
                  >
                    Career interests
                    {showCareerDrop ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  {showCareerDrop && (
                    <div className="mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-72 z-30" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px' }}>
                      <p className="text-xs text-gray-400 mb-2">Tap to add or remove</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {CAREER_FIELDS.map(f => {
                          const selected = answers.careerFields.includes(f)
                          return (
                            <button key={f}
                              onClick={() => setAnswers(prev => ({ ...prev, careerFields: toggle(prev.careerFields, f) }))}
                              className="px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
                              style={{ backgroundColor: selected ? COLORS.teal : 'white', color: selected ? 'white' : '#374151', borderColor: selected ? COLORS.teal : '#e5e7eb' }}>
                              {f}
                            </button>
                          )
                        })}
                      </div>
                      <button
                        onClick={async () => {
                          setShowCareerDrop(false)
                          setLoading(true)
                          const { data } = await supabase.from('resources').select('*').eq('is_active', true).order('id')
                          if (data) {
                            const filtered = (data as Resource[]).filter(r => {
                              const matchesType = answers.resourceTypes.some(t => r.section?.toLowerCase().includes(t.toLowerCase()))
                              const matchesCareer = answers.careerFields.some(f => f === 'General / Not sure yet' || r.career_fields?.toLowerCase().includes(f.toLowerCase().split(' ')[0]) || r.tags?.toLowerCase().includes(f.toLowerCase().split(' ')[0]))
                              const matchesCity = answers.cities.some(c => c === 'National / Remote' || c === 'Other' || r.location?.toLowerCase().includes(c.toLowerCase().split('/')[0].trim()) || r.location_scope === 'national' || r.location_scope === 'global')
                              return matchesType && (matchesCareer || matchesCity)
                            })
                            setResources(filtered)
                            const greeting = userInfo ? `Wa alaikum assalam, ${userInfo.firstName}! ` : 'Assalamu alaikum! '
                            setIntroText(`${greeting}Updated — found **${filtered.length} resource${filtered.length !== 1 ? 's' : ''}** matching your interests.`)
                          }
                          setLoading(false)
                        }}
                        className="w-full py-2 rounded-lg text-xs font-medium text-white transition-all"
                        style={{ backgroundColor: COLORS.navy }}>
                        Update results →
                      </button>
                    </div>
                  )}
                </div>

                {/* Cities & regions — click to edit */}
                <div className="flex flex-col items-end">
                  <button
                    onClick={() => { setShowCityDrop(v => !v); setShowCareerDrop(false) }}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all"
                    style={{ borderColor: showCityDrop ? COLORS.teal : '#e5e7eb', color: showCityDrop ? COLORS.teal : '#6b7280', backgroundColor: showCityDrop ? '#E6EFF1' : 'white' }}
                  >
                    Cities & regions
                    {showCityDrop ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  {showCityDrop && (
                    <div className="mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-64 z-30" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '4px' }}>
                      <p className="text-xs text-gray-400 mb-2">Tap to add or remove</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {CITIES.map(c => {
                          const selected = answers.cities.includes(c)
                          return (
                            <button key={c}
                              onClick={() => setAnswers(prev => ({ ...prev, cities: toggle(prev.cities, c) }))}
                              className="px-2.5 py-1 rounded-full text-xs font-medium border transition-all"
                              style={{ backgroundColor: selected ? COLORS.teal : 'white', color: selected ? 'white' : '#374151', borderColor: selected ? COLORS.teal : '#e5e7eb' }}>
                              {c}
                            </button>
                          )
                        })}
                      </div>
                      <button
                        onClick={async () => {
                          setShowCityDrop(false)
                          setLoading(true)
                          const { data } = await supabase.from('resources').select('*').eq('is_active', true).order('id')
                          if (data) {
                            const filtered = (data as Resource[]).filter(r => {
                              const matchesType = answers.resourceTypes.some(t => r.section?.toLowerCase().includes(t.toLowerCase()))
                              const matchesCareer = answers.careerFields.some(f => f === 'General / Not sure yet' || r.career_fields?.toLowerCase().includes(f.toLowerCase().split(' ')[0]) || r.tags?.toLowerCase().includes(f.toLowerCase().split(' ')[0]))
                              const matchesCity = answers.cities.some(c => c === 'National / Remote' || c === 'Other' || r.location?.toLowerCase().includes(c.toLowerCase().split('/')[0].trim()) || r.location_scope === 'national' || r.location_scope === 'global')
                              return matchesType && (matchesCareer || matchesCity)
                            })
                            setResources(filtered)
                            const greeting = userInfo ? `Wa alaikum assalam, ${userInfo.firstName}! ` : 'Assalamu alaikum! '
                            setIntroText(`${greeting}Updated — found **${filtered.length} resource${filtered.length !== 1 ? 's' : ''}** matching your interests.`)
                          }
                          setLoading(false)
                        }}
                        className="w-full py-2 rounded-lg text-xs font-medium text-white transition-all"
                        style={{ backgroundColor: COLORS.navy }}>
                        Update results →
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Chat body */}
        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
          {/* User bubble */}
          <div className="flex justify-end">
            <div className="max-w-sm bg-gray-100 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-gray-600 font-serif italic">
              Looking for: {answers.resourceTypes.join(', ')}. Interests: {answers.careerFields.join(', ')}. Location: {answers.cities.join(', ')}.
            </div>
          </div>

          {loading ? (
            <div className="flex gap-1.5 items-center pl-1">
              {[0, 150, 300].map(d => (
                <div key={d} className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-5 w-full">
              <p className="text-base leading-relaxed text-gray-800 font-serif">
                {introText.split('**').map((part, j) =>
                  j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
                )}
              </p>

              {Object.entries(grouped).map(([section, sectionResources]) => (
                <div key={section} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-100" />
                    <span className="text-xs font-medium tracking-widest uppercase text-gray-400">{section}</span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </div>
                  {sectionResources.map(r => (
                    <div key={r.id} className="border border-gray-100 rounded-2xl p-4 hover:border-gray-200 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="font-medium text-gray-900">{r.name}</span>
                          <span className="text-gray-400 text-sm ml-2">— {r.subtitle}</span>
                        </div>
                        {r.link && (
                          <a href={r.link} target="_blank" rel="noopener noreferrer"
                            className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-500">
                            Visit →
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-3">{r.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {r.members && r.members !== 'N/A' && (
                          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{r.members}</span>
                        )}
                        {(r.location_scope === 'national' || r.location_scope === 'global') ? (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">Nationwide</span>
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">{r.location?.split(';')[0].trim()}</span>
                        )}
                        {r.tags?.split(',').slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-gray-50 text-gray-400 rounded-full">{tag.trim()}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {resources.length > 0 && (
                <p className="text-sm text-gray-400 font-serif italic mt-1">
                  See something that resonates? Click "Visit →" to learn more, or{' '}
                  <button onClick={resetSearch} className="underline hover:text-gray-600 transition-colors">
                    search again
                  </button>{' '}with different filters.
                </p>
              )}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
    )
  }

  // ── HERO ──
  return (
    <section className="relative min-h-screen w-full bg-white overflow-x-hidden overflow-y-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0 pointer-events-none mph-gradient" />
      <style>{`
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .mph-gradient {
          background: linear-gradient(135deg, #dceaf0, #ede8e0, #e8ddd4, #dceaf0, #f0e8e0);
          background-size: 300% 300%;
          animation: gradientShift 8s ease infinite;
        }
      `}</style>
      <div className="absolute inset-0 z-10" style={{ backgroundImage: 'url(/images/mihrab.png)', backgroundSize: '20px auto', backgroundRepeat: 'repeat', opacity: 1 }} />
      <div className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, white)' }} />
      {/* Mobile only: top fade from white to transparent */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, white, transparent)' }} />

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-32">
<h1 id="mph-headline" className="relative text-3xl md:text-5xl lg:text-6xl text-center px-2 text-[#2D2D2D]" style={{ fontFamily: "var(--font-fraunces, serif)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2, paddingBottom: "0.1em" }}>
          <span className="relative z-10">Connecting the Fragmented<br />Muslim Professional Ecosystem</span>
          <span className="absolute inset-0 z-20 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)', animation: 'textShine 5s ease-in-out infinite', mixBlendMode: 'overlay' }} />
        </h1>
        <style jsx>{`@keyframes textShine { 0% { transform: translateX(-100%); } 40%, 100% { transform: translateX(100%); } }`}</style>

        <div className="mt-8 md:mt-10 flex items-center gap-3 px-2" style={{ maxWidth: "min(90vw, 900px)", width: "100%" }}>
          {/* Pill search bar */}
          <div
            className="flex-1 flex items-center px-5 bg-white cursor-text border border-gray-200"
            style={{ borderRadius: '999px', height: '50px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
            onClick={() => setQuizOpen(true)}
          >
            <div className="flex-1 relative min-w-0" style={{ height: '24px' }}>
              <div className="absolute inset-0 flex items-center pointer-events-none overflow-hidden">
                <span className="text-gray-400 italic text-sm truncate" style={{ fontFamily: 'var(--font-fraunces, serif)' }}>
                  {displayText}
                  <span className="inline-block w-0.5 h-4 bg-gray-400 ml-0.5 animate-pulse align-middle" />
                </span>
              </div>
            </div>
          </div>
          {/* Arrow button */}
          <button
            onClick={() => setQuizOpen(true)}
            className="shrink-0 flex items-center justify-center"
            style={{ width: '50px', height: '50px', borderRadius: '14px', background: '#111111' }}
          >
            <ArrowUp className="w-4 h-4 text-white" />
          </button>
        </div>


      </div>

      {/* Quiz / gate overlay */}
      {quizOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(15,29,58,0.6)', backdropFilter: 'blur(6px)' }}>
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

            {/* Header with progress */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="h-1.5 rounded-full transition-all duration-300"
                    style={{ width: i === quizStep ? '28px' : '8px', backgroundColor: i <= quizStep ? COLORS.teal : '#e5e7eb' }} />
                ))}
                <span className="ml-2 text-xs text-gray-400">{quizStep + 1} of 4</span>
              </div>
              <button onClick={() => setQuizOpen(false)} className="text-gray-300 hover:text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quiz steps 0-2 */}
            {quizStep < 3 && (
              <>
                <div className="px-6 pt-5 pb-4">
                  <h2 className="text-xl font-serif font-semibold text-gray-900 mb-1">{steps[quizStep].question}</h2>
                  <p className="text-sm text-gray-400 mb-4">{steps[quizStep].hint}</p>
                  <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
                    {steps[quizStep].items.map(item => {
                      const selected = answers[steps[quizStep].key].includes(item)
                      return (
                        <button key={item}
                          onClick={() => setAnswers(prev => ({ ...prev, [steps[quizStep].key]: toggle(prev[steps[quizStep].key], item) }))}
                          className="px-3 py-2 rounded-full text-sm transition-all duration-150 border font-medium"
                          style={{ backgroundColor: selected ? COLORS.teal : 'white', color: selected ? 'white' : '#374151', borderColor: selected ? COLORS.teal : '#e5e7eb' }}>
                          {item}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="px-6 py-5 flex items-center justify-between border-t border-gray-50">
                  <button onClick={() => quizStep > 0 ? setQuizStep(s => s - 1) : setQuizOpen(false)}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {quizStep > 0 ? 'Back' : 'Cancel'}
                  </button>
                  <button onClick={handleNext} disabled={!canProceed()}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                    style={{ backgroundColor: canProceed() ? COLORS.navy : '#f3f4f6', color: canProceed() ? 'white' : '#9ca3af', cursor: canProceed() ? 'pointer' : 'not-allowed' }}>
                    Next →
                  </button>
                </div>
              </>
            )}

            {/* Step 3: Email gate */}
            {quizStep === 3 && (
              <>
                <div className="px-6 pt-6 pb-4">
                  <h2 className="text-xl font-serif font-semibold text-gray-900 mb-1">Almost there!</h2>
                  <p className="text-sm text-gray-400 mb-5">Where should we send your resource list?</p>

                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">First name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={e => { setFirstName(e.target.value); setEmailError('') }}
                        placeholder="e.g. Ahmad"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => { setEmail(e.target.value); setEmailError('') }}
                        onKeyDown={e => e.key === 'Enter' && handleGateSubmit()}
                        placeholder="you@email.com"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-gray-400 transition-colors bg-gray-50"
                      />
                    </div>
                    {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                    <p className="text-xs text-gray-400 text-center">No spam. Just your resources.</p>
                  </div>
                </div>

                <div className="px-6 py-5 flex flex-col gap-2 border-t border-gray-50">
                  <button onClick={() => handleGateSubmit(false)}
                    className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all"
                    style={{ backgroundColor: COLORS.navy }}>
                    Show my resources →
                  </button>
                  <button onClick={() => handleGateSubmit(true)}
                    className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    Skip for now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
