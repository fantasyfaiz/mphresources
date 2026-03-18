'use client'

import { MihrabHero } from '@/components/mihrab-hero'
import { ResourcesSection } from '@/components/resources-section'

export default function Home() {
  return (
    <main>
      <MihrabHero onSearch={() => {}} />
      <ResourcesSection />
    </main>
  )
}
