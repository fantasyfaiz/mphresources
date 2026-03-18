import type { Metadata } from 'next'
import { Fraunces, Host_Grotesk } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const hostGrotesk = Host_Grotesk({
  subsets: ['latin'],
  variable: '--font-host-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MPH — Muslim Professional Hub',
  description: 'Connecting the fragmented Muslim professional ecosystem',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hostGrotesk.variable}`}>
      <body style={{ fontFamily: 'var(--font-host-grotesk), sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
