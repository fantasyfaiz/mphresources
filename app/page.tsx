'use client'

import { MihrabHero } from '@/components/mihrab-hero'
import { ResourcesSection } from '@/components/resources-section'
import { InspireSection } from '@/components/inspire-section'

export default function Home() {
  return (
    <main>
      <MihrabHero onSearch={() => {}} />
      <ResourcesSection />
      <InspireSection />
    </main>
  )
}
