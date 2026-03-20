"use client"
import { useEffect, useRef, useState } from "react"

function useFadeIn() {
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
  return { ref, visible }
}

const FAQS = [
  {
    q: "What is Muslim Professional Hub?",
    a: "MPH is a curated discovery platform that connects Muslim professionals to organizations, scholarships, fellowships, and entrepreneurial resources across industries. We do the research so you don't have to.",
  },
  {
    q: "Is this free to use?",
    a: "Yes, completely free. MPH is a community resource built to serve Muslim professionals at every stage of their career.",
  },
  {
    q: "How do I find resources that are relevant to me?",
    a: "Click the search bar on the homepage and take the short quiz — it asks about your career field, city, and what type of resource you're looking for. We'll show you a personalized list based on your answers.",
  },
  {
    q: "Can I suggest a resource that isn't listed?",
    a: "Absolutely. Hit the 'Suggest a resource' button anywhere on the page and fill out the short form. We review all submissions and add approved resources within a few days.",
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="border-t border-gray-200 py-5 cursor-pointer"
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center justify-between gap-4">
        <span
          className="text-base md:text-lg text-gray-900"
          style={{ fontFamily: "var(--font-fraunces, serif)", fontWeight: 400, letterSpacing: "-0.01em" }}
        >
          {q}
        </span>
        <span
          className="text-2xl shrink-0 text-gray-400 transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)', lineHeight: 1 }}
        >
          +
        </span>
      </div>
      <div
        style={{
          maxHeight: open ? '200px' : '0px',
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <p
          className="mt-3 text-sm md:text-base leading-relaxed text-gray-500"
          style={{ fontFamily: "var(--font-host-grotesk, sans-serif)" }}
        >
          {a}
        </p>
      </div>
    </div>
  )
}

export function InspireSection() {
  const block1 = useFadeIn()
  const block2 = useFadeIn()
  const block3 = useFadeIn()
  const cta = useFadeIn()

  const fadeStyle = (visible: boolean, delay = "0s") => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}`,
  })

  return (
    <>
      {/* Load Caveat font for signature */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&display=swap');`}</style>

      <section className="bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-24 flex flex-col gap-16">

          {/* Hadith */}
          <div ref={block1.ref} style={fadeStyle(block1.visible)}>
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-host-grotesk, sans-serif)", color: "#9ca3af" }}
            >
              The Prophet Muhammad (ﷺ) said:
            </p>
            <p
              className="text-3xl md:text-4xl leading-snug"
              style={{ fontFamily: "var(--font-fraunces, serif)", fontWeight: 400, letterSpacing: "-0.02em", color: "#1a1a1a" }}
            >
              "If the Final Hour comes while one of you has a seedling in his hand, let him plant it."
            </p>
          </div>

          {/* Message */}
          <div ref={block2.ref} style={fadeStyle(block2.visible, "0.1s")}>
            <p
              className="text-lg md:text-xl leading-relaxed"
              style={{ fontFamily: "var(--font-fraunces, serif)", fontWeight: 400, color: "#4b5563" }}
            >
              A Muslim is called to act with purpose, goodness, and hope — regardless of circumstances.
              So continue to grow, to strive, and to better yourself. Every sincere effort, no matter
              how small, carries weight with Allah.
            </p>
            <p
              className="text-lg md:text-xl leading-relaxed mt-4"
              style={{ fontFamily: "var(--font-fraunces, serif)", fontWeight: 400, color: "#4b5563" }}
            >
              This page exists to help you take that next step.
            </p>
          </div>

          {/* Signature */}
          <div ref={block3.ref} style={fadeStyle(block3.visible, "0.2s")}>
            <div style={{ display: "inline-block" }}>
              <p
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: "2rem",
                  fontWeight: 400,
                  color: "#1a1a1a",
                  lineHeight: 1.2,
                  letterSpacing: "0.01em",
                }}
              >
                Sincerely, Faiz Ahmed
              </p>
              <div style={{ height: "2px", backgroundColor: "#1a1a1a", marginTop: "4px", borderRadius: "1px" }} />
            </div>
          </div>

          {/* CTA */}
          <div ref={cta.ref} style={fadeStyle(cta.visible, "0.15s")}>
            <p
              className="text-sm mb-6"
              style={{ fontFamily: "var(--font-host-grotesk, sans-serif)", color: "#9ca3af" }}
            >
              Connect with other Muslim professionals
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://instagram.com/mphhh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: "#111111", color: "white", fontFamily: "var(--font-host-grotesk, sans-serif)" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Follow on Instagram
              </a>
              <a
                href="https://discord.gg/mphhh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border transition-all hover:bg-gray-50"
                style={{ borderColor: "#e5e7eb", color: "#111111", fontFamily: "var(--font-host-grotesk, sans-serif)" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.079.11 18.1.128 18.116a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                </svg>
                Join Discord
              </a>
              <button
                onClick={() => window.dispatchEvent(new Event('open-suggest-modal'))}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border transition-all hover:bg-gray-50"
                style={{ borderColor: "#e5e7eb", color: "#111111", fontFamily: "var(--font-host-grotesk, sans-serif)" }}
              >
                + Suggest a resource
              </button>
            </div>
          </div>

        {/* FAQ */}
        <div className="pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            {/* Left */}
            <div className="md:w-64 shrink-0">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2" style={{ fontFamily: "var(--font-host-grotesk, sans-serif)" }}>FAQ</p>
              <h2
                className="text-2xl md:text-3xl text-gray-900 mb-4"
                style={{ fontFamily: "var(--font-fraunces, serif)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.2 }}
              >
                What You Need to Know
              </h2>
              <button
                onClick={() => window.dispatchEvent(new Event('open-suggest-modal'))}
                className="px-5 py-2.5 rounded-full text-sm font-medium border transition-all hover:bg-gray-50"
                style={{ fontFamily: "var(--font-host-grotesk, sans-serif)", borderColor: "#e5e7eb", color: "#111111" }}
              >
                Suggest a resource →
              </button>
            </div>

            {/* Right — accordion */}
            <div className="flex-1">
              {FAQS.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} />
              ))}
              <div className="border-t border-gray-200" />
            </div>
          </div>
        </div>

        </div>{/* end max-w-2xl */}

        <div
          className="flex items-center justify-center pb-12 text-xs text-gray-300"
          style={{ fontFamily: "var(--font-host-grotesk, sans-serif)" }}
        >
          © 2026 Muslim Professional Hub
        </div>
      </section>
    </>
  )
}
