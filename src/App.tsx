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
          Where the signal terminates. Only this block inverts — `.lit`
          redefines the same tokens, so everything nested inside flips
          without knowing it has been flipped. The footer is deliberately
          NOT wrapped: it stays on the dark chassis as the back of the rack
          (see Footer.module.css), so the page ends on the unit, not on a
          second lit panel.
        */}
        <div className="lit">
          <FinalCTA />
        </div>
      </main>
      <Footer />
    </LanguageProvider>
  )
}
