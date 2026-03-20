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
      { label: "Who", value: "Students, professionals, founders & investors" },
      { label: "Contact", value: "conference@mbsanational.org", href: "mailto:conference@mbsanational.org" },
    ],
    cta: { label: "View speakers & register", href: "https://mbsanational.org/conference" },
    secondary: { label: "Instagram", href: "https://www.instagram.com/mbsanational" },
    accent: "#0F1D3A",
    accentLight: "rgba(255,255,255,0.06)",
  },
  {
    id: "quran",
    tag: "Hackathon",
    tagline: "$10,000 in prizes",
    title: "Quran Hackathon",
    description: "Build something meaningful at the intersection of technology and the Quran. Open to developers, designers, and dreamers. $10k in prizes. Hosted by Provision Capital.",
    details: [
      { label: "Prize pool", value: "$10,000" },
      { label: "Host", value: "Provision Capital" },
    ],
    cta: { label: "Apply now", href: "https://launch.provisioncapital.com/quran-hackathon" },
    secondary: null,
    accent: "#2E5A6C",
    accentLight: "rgba(255,255,255,0.06)",
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
        minHeight: '320px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circle */}
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '180px', height: '180px', borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.07)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '-10px', right: '-10px',
        width: '100px', height: '100px', borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.05)',
        pointerEvents: 'none',
      }} />

      {/* Top */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{
            fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-host-grotesk, sans-serif)',
          }}>
            {item.tag}
          </span>
          <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)' }} />
          <span style={{
            fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-host-grotesk, sans-serif)', fontWeight: 600,
          }}>
            {item.tagline}
          </span>
        </div>

        <h3 style={{
          fontFamily: 'var(--font-fraunces, serif)', fontWeight: 400,
          fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.02em',
          color: 'white', lineHeight: 1.2, margin: '0 0 14px',
        }}>
          {item.title}
        </h3>

        <p style={{
          fontSize: '14px', lineHeight: 1.65,
          color: 'rgba(255,255,255,0.55)',
          fontFamily: 'var(--font-host-grotesk, sans-serif)',
          margin: '0 0 20px', maxWidth: '480px',
        }}>
          {item.description}
        </p>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '28px' }}>
          {item.details.map((d, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-host-grotesk, sans-serif)', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: '56px' }}>{d.label}</span>
              {d.href ? (
                <a href={d.href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-host-grotesk, sans-serif)', textDecoration: 'underline', textUnderlineOffset: '3px' }}>{d.value}</a>
              ) : (
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-host-grotesk, sans-serif)' }}>{d.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <a
          href={item.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', fontWeight: 600, color: item.accent,
            backgroundColor: 'white', borderRadius: '999px',
            padding: '10px 20px', textDecoration: 'none',
            fontFamily: 'var(--font-host-grotesk, sans-serif)',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {item.cta.label} <ArrowUpRight style={{ width: '13px', height: '13px' }} />
        </a>
        {item.secondary && (
          <a
            href={item.secondary.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '999px',
              padding: '10px 18px', textDecoration: 'none',
              fontFamily: 'var(--font-host-grotesk, sans-serif)',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            {item.secondary.label} <ArrowUpRight style={{ width: '13px', height: '13px' }} />
          </a>
        )}
      </div>
    </div>
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
      {/* Header */}
      <div
        ref={headerRef}
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          marginBottom: '32px',
        }}
      >
        <p style={{
          fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#9ca3af', fontFamily: 'var(--font-host-grotesk, sans-serif)', marginBottom: '8px',
        }}>
          Featured
        </p>
        <h2 style={{
          fontFamily: 'var(--font-fraunces, serif)', fontWeight: 400,
          fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', letterSpacing: '-0.02em',
          color: '#1a1a1a', lineHeight: 1.2, margin: 0,
        }}>
          Opportunities worth your attention
        </h2>
      </div>

      {/* Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
      }}>
        {FEATURED.map((item, i) => (
          <FeaturedCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
