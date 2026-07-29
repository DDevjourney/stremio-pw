import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ValueProps } from './components/ValueProps'
import { HowItWorks } from './components/HowItWorks'
import { Comparison } from './components/Comparison'
import { Testimonials } from './components/Testimonials'
import { FAQ } from './components/FAQ'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'
import { LanguageProvider } from './i18n/LanguageContext'

export default function App() {
  return (
    <LanguageProvider>
      <Nav />
      <main>
        <Hero />
        <ValueProps />
        <HowItWorks />
        <Comparison />
        <Testimonials />
        <FAQ />
        {/*
          The page closes on ink: this block and the footer both reverse, so
          the piece ends on a printed page turn instead of trailing off.
        */}
        <div className="lit">
          <FinalCTA />
        </div>
      </main>
      <Footer />
    </LanguageProvider>
  )
}
