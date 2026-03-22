"use client"
import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"

const FEATURED = [
  {
    id: "mbsa",
    tag: "Conference",
    tagline: "Students · Founders · Investors",
    title: "MBSA National Conference",
    description: "The flagship gathering of Muslim business talent. Speaker sessions, fireside chats, a case competition, finance competition, and a startup demo day for b132 Batch 2 — all in one day.",
    details: [
      { label: "Who", value: "Students, Professionals, & Investors", href: null },
      { label: "Contact", value: "conference@mbsanational.org", href: "mailto:conference@mbsanational.org" },
    ],
    cta: { label: "View speakers & register", href: "https://mbsanational.org/conference" },
    secondary: { label: "Instagram", href: "https://www.instagram.com/mbsanational" },
    accent: "#0F1D3A",
    mihrab: true,
  },
  {
    id: "quran",
    tag: "Hackathon",
    tagline: "$10,000 in prizes",
    title: "Quran Hackathon",
    description: "Build something meaningful at the intersection of technology and the Quran. Open to developers, designers, and dreamers. $10k in prizes. Hosted by Provision Capital.",
    details: [
      { label: "Prize pool", value: "$10,000", href: null },
      { label: "Host", value: "Provision Capital", href: null },
    ],
    cta: { label: "Apply now", href: "https://launch.provisioncapital.com/quran-hackathon" },
    secondary: null,
    accent: "#2E5A6C",
    mihrab: true,
  },
  {
    id: "ummat",
    tag: "Pitch Competition",
    tagline: "Serious Founders Only",
    title: "Ummat Shark Tank",
    description: "Pitch your business to community investors and win up to $20,000 in investment. Final 4 ideas pitch live at the EXPO event. Shortlisting via Google Meet virtual sessions.",
    details: [
      { label: "Prize", value: "Up to $20,000 investment", href: null },
      { label: "Host", value: "United Multicultural Muslim Alliance of Texas", href: null },
    ],
    cta: { label: "Apply now", href: "https://docs.google.com/forms/d/e/1FAIpQLSfdHH-yfrYgWfJ_-LHuDNG5iGYNqQCXCl_RT8mCbH-fY0wGIg/viewform" },
    secondary: null,
    accent: "#1a3a2a",
    mihrab: true,
  },
]

function FeaturedCard({ item, index }: { item: typeof FEATURED[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`@keyframes mihrabPulse { 0%,100%{opacity:0.12} 50%{opacity:0.3} }`}</style>
      <div
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 0.15}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 0.15}s`,
          backgroundColor: item.accent,
          borderRadius: '20px',
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '380px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Mihrab background PNG */}
        {item.mihrab && (
          <div style={{
            position: 'absolute', bottom: 0, right: '-10px',
            width: '240px', height: '100%',
            backgroundImage: 'url(/images/Mihrab_design.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom right',
            animation: 'mihrabPulse 1.5s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Tag row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-host-grotesk, sans-serif)' }}>
              {item.tag}
            </span>
            <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)' }} />
            <span style={{ fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-host-grotesk, sans-serif)', fontWeight: 600 }}>
              {item.tagline}
            </span>
          </div>

          {/* Title — Fraunces */}
          <h3 style={{ fontFamily: 'var(--font-fraunces, serif)', fontWeight: 700, fontSize: 'clamp(1.6rem, 3vw, 2.1rem)', letterSpacing: '-0.02em', color: 'white', lineHeight: 1.15, margin: '0 0 16px' }}>
            {item.title}
          </h3>

          {/* Description — Host Grotesk */}
          <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-host-grotesk, sans-serif)', margin: '0 0 24px', maxWidth: '480px' }}>
            {item.description}
          </p>

          {/* Details — fixed width label column so values align */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
            {item.details.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-host-grotesk, sans-serif)', textTransform: 'uppercase', letterSpacing: '0.08em', width: '80px', flexShrink: 0 }}>
                  {d.label}:
                </span>
                {d.href ? (
                  <a href={d.href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-host-grotesk, sans-serif)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>{d.value}</a>
                ) : (
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-host-grotesk, sans-serif)' }}>{d.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <a href={item.cta.href} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: item.accent, backgroundColor: 'white', borderRadius: '999px', padding: '12px 22px', textDecoration: 'none', fontFamily: 'var(--font-host-grotesk, sans-serif)', transition: 'opacity 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {item.cta.label} <ArrowUpRight style={{ width: '13px', height: '13px' }} />
          </a>
          {item.secondary && (
            <a href={item.secondary.href} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '999px', padding: '12px 20px', textDecoration: 'none', fontFamily: 'var(--font-host-grotesk, sans-serif)', transition: 'opacity 0.2s', backgroundColor: 'rgba(255,255,255,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {item.secondary.label} <ArrowUpRight style={{ width: '13px', height: '13px' }} />
            </a>
          )}
        </div>
      </div>
    </>
  )
}

export function FeaturedSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true) },
      { threshold: 0.2 }
    )
    if (headerRef.current) observer.observe(headerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-white py-16 px-4 md:px-8 lg:px-16 overflow-x-hidden">
      <div ref={headerRef} style={{ opacity: headerVisible ? 1 : 0, transform: headerVisible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)", marginBottom: '32px' }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9ca3af', fontFamily: 'var(--font-host-grotesk, sans-serif)', marginBottom: '8px' }}>Featured</p>
        <h2 style={{ fontFamily: 'var(--font-fraunces, serif)', fontWeight: 400, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', letterSpacing: '-0.02em', color: '#1a1a1a', lineHeight: 1.2, margin: 0 }}>
          Opportunities worth your attention
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {FEATURED.map((item, i) => (
          <FeaturedCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
