import React from 'react'
import { Hero } from '../components/landing/Hero'
import { LiveStats } from '../components/landing/LiveStats'
import { HowItWorks } from '../components/landing/HowItWorks'
import { Features } from '../components/landing/Features'
import { FeeTable } from '../components/landing/FeeTable'
import { Footer } from '../components/landing/Footer'
import { Navbar } from '../components/layout/Navbar'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-cyan-500/30">
      <Navbar />
      <Hero />
      <LiveStats />
      <HowItWorks />
      <Features />
      <FeeTable />
      <Footer />
    </div>
  )
}
