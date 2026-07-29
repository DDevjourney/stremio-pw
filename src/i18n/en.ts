import type { Dictionary } from './types'

export const en: Dictionary = {
  htmlLang: 'en',
  documentTitle: 'Stremio — Everything you watch. One app.',

  nav: {
    links: [
      { href: '#features', label: 'Features' },
      { href: '#how-it-works', label: 'How it works' },
      { href: '#compare', label: 'Compare' },
      { href: '#faq', label: 'FAQ' },
    ],
    cta: 'Get Stremio',
    switchLanguage: 'Cambiar a español',
    otherLanguageCode: 'ES',
  },

  hero: {
    badge: 'Free and open source · No subscription, ever',
    headlineLead: 'Everything you watch.',
    headlineAccent: 'One app.',
    sub: 'Stremio brings films, series, live channels and your own library into a single beautiful interface — on your laptop, your phone and your TV. No subscription. No juggling six apps to find one film.',
    ctaPrimary: 'Get Stremio Free',
    ctaSecondary: 'See how it works',
    microcopy: 'Available for Windows, macOS, Linux, Android, iOS, smart TVs and the web.',
    search: 'Search everything…',
    rowContinue: 'Continue watching',
    rowPopular: 'Popular this week',
    seeAll: 'See all',
  },

  genres: {
    crime: 'Crime',
    scifi: 'Sci-fi',
    drama: 'Drama',
    animation: 'Animation',
    scifiHorror: 'Sci-fi horror',
    action: 'Action',
    thriller: 'Thriller',
  },

  value: {
    eyebrow: 'Why Stremio',
    title: 'Built for how people actually watch',
    lead: 'Not another catalog to subscribe to — a single place where everything you already want to watch finally lives together.',
    items: [
      {
        title: 'Free, forever',
        body: 'No subscription, no trial that quietly renews, no per-profile upsell. Stremio is free to download and free to use — on every device you own.',
      },
      {
        title: 'A catalog without walls',
        body: 'Official and community add-ons plug straight into one interface. Films, series, live channels, subtitles and your own library — searched together, not app by app.',
      },
      {
        title: 'Every screen you own',
        body: 'Windows, macOS, Linux, Android, iOS, Android TV, Samsung and LG smart TVs, plus a full web player. Start on the train, finish on the sofa.',
      },
    ],
  },

  how: {
    eyebrow: 'How it works',
    title: 'From download to playing in four steps',
    lead: 'Most people are watching something within five minutes of installing. There is no account to create and nothing to configure before you start.',
    steps: [
      {
        number: '01',
        title: 'Install Stremio',
        body: 'Grab the build for your platform. It is a couple of megabytes and there is no account required to start browsing.',
      },
      {
        number: '02',
        title: 'Add your add-ons',
        body: 'Open the add-on catalog and enable the sources you want. Each one is a single click and can be removed just as fast.',
      },
      {
        number: '03',
        title: 'Build your library',
        body: 'Follow a series and Stremio tracks where you left off, marks new episodes, and syncs that progress across your devices.',
      },
      {
        number: '04',
        title: 'Press play',
        body: 'One search covers every source you have enabled. Pick a stream, choose subtitles, and watch — in up to 4K where the source allows.',
      },
    ],
    noteTitle: 'A note on add-ons.',
    noteBody:
      'Stremio is the player; add-ons are the sources. Start with the official catalog — it covers metadata, subtitles and free public-domain content — and only add community sources you recognise and trust.',
  },

  compare: {
    eyebrow: 'Side by side',
    title: 'How it stacks up',
    lead: 'Netflix and Disney+ are polished services with genuinely good original content. The difference is what you give up for it — and what one free app can cover instead.',
    feature: 'Feature',
    freePill: 'Free',
    yes: 'Yes',
    no: 'No',
    rows: [
      {
        label: 'Monthly price',
        note: 'Standard individual plans, US pricing, as advertised in 2025.',
        stremio: 'Free',
        netflix: 'From $7.99',
        disney: 'From $9.99',
      },
      {
        label: 'Catalog you control',
        note: 'Whether you can add or remove content sources yourself.',
        stremio: true,
        netflix: false,
        disney: false,
      },
      { label: 'Search across sources', stremio: true, netflix: false, disney: false },
      { label: 'Desktop, mobile, TV & web', stremio: true, netflix: true, disney: true },
      {
        label: 'Offline viewing',
        stremio: 'Via add-ons',
        netflix: 'Selected titles',
        disney: 'Selected titles',
      },
      {
        label: 'Titles leave without warning',
        note: 'Licensing windows expire on the big services; your add-ons are yours.',
        stremio: false,
        netflix: true,
        disney: true,
      },
      {
        label: 'Ad-free by default',
        note: 'Entry-level plans on both services are ad-supported.',
        stremio: true,
        netflix: false,
        disney: false,
      },
      { label: 'Open source', stremio: true, netflix: false, disney: false },
    ],
    tableCaption:
      'Comparison of Stremio, Netflix and Disney+ across price, catalog control, platform availability and offline viewing.',
    scrollHint: 'Scroll the table sideways to see every column.',
    caption:
      'Pricing reflects advertised standard individual plans in the US and will vary by region. Netflix and Disney+ are trademarks of their respective owners; this page is an independent portfolio demo and is not affiliated with any of them.',
  },

  testimonials: {
    eyebrow: 'Testimonials',
    title: 'People who stopped juggling apps',
    lead: 'A few words from the sort of person who used to keep a spreadsheet of which subscription had which series.',
    rating: 'Rated 5 out of 5',
    items: [
      {
        quote:
          'I was paying for three services and still could not find half of what I wanted to watch. Now there is one icon on my TV and my monthly bill went down by about forty euros.',
        name: 'Marta Ibáñez',
        context: 'Switched from three subscriptions to one app',
        initials: 'MI',
      },
      {
        quote:
          'The part that sold me was the library syncing. I start an episode on my laptop at lunch and my phone knows exactly where I stopped. That used to be the thing I gave the big platforms credit for.',
        name: 'Daniel Okafor',
        context: 'Uses Stremio across laptop, phone and Android TV',
        initials: 'DO',
      },
      {
        quote:
          'Setting up add-ons took me maybe five minutes and I am not especially technical. The interface looks better than most of the paid apps I have used, honestly.',
        name: 'Priya Raghunathan',
        context: 'First-time user, set up in under 10 minutes',
        initials: 'PR',
      },
      {
        quote:
          'Subtitles are where it quietly wins. Every language I need, adjustable timing, and it remembers my preference per series instead of asking every single time.',
        name: 'Lukas Brenner',
        context: 'Watches mostly foreign-language series',
        initials: 'LB',
      },
      {
        quote:
          'I installed it on my parents’ smart TV over a weekend visit and have not had a single support call since. For that household, that is the highest praise I can give any software.',
        name: 'Sofía Marín',
        context: 'Installed it for family on a smart TV',
        initials: 'SM',
      },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Questions worth asking',
    lead: 'The honest answers, including the one about legality that most pages skip over.',
    supportPre: 'Still unsure? The ',
    supportLink: 'official Stremio site',
    supportPost: ' has full documentation and community support.',
    items: [
      {
        question: 'What exactly is Stremio?',
        answer:
          'Stremio is a free media centre application. On its own it is an interface: a beautiful library, a player, subtitle handling and progress syncing. Content arrives through add-ons that you choose and install, which is what lets one app cover films, series, live channels and your personal collection at once.',
      },
      {
        question: 'Is it legal?',
        answer:
          'The Stremio application itself is legitimate, open-source software, and the official add-ons distribute licensed or public-domain content. Because anyone can publish a community add-on, the legality of what you stream depends entirely on the add-ons you install. Stick to official and well-known sources, and follow the copyright law where you live.',
      },
      {
        question: 'Which add-ons should I start with?',
        answer:
          'Start with what ships in the official catalog — Cinemeta for film and series metadata, OpenSubtitles for subtitles, and the public-domain and live-channel add-ons. That is enough to see how the app works before you go exploring the wider community catalog.',
      },
      {
        question: 'Will it run on my device?',
        answer:
          'Almost certainly. There are native builds for Windows, macOS, Linux, Android, iOS and Android TV, apps for Samsung and LG smart TVs, and a web player that runs in any modern browser. You can also cast from the mobile app to a Chromecast.',
      },
      {
        question: 'Do I need an account?',
        answer:
          'Not to watch. You can install Stremio and start browsing straight away. Creating a free account is optional and only exists so your library, watch progress and add-on setup follow you between devices.',
      },
      {
        question: 'Is there really no cost anywhere?',
        answer:
          'The application is free and open source, with no paid tier and no ads in the interface. Some individual third-party add-ons connect to services that charge separately — a debrid provider, for instance — but those are entirely optional and nothing in core Stremio is paywalled.',
      },
    ],
  },

  finalCta: {
    eyebrow: 'Start tonight',
    title: 'Your next film is one download away',
    sub: 'The average household pays for streaming services it barely opens. Install Stremio, spend five minutes setting it up, and see how much of that you still need next month.',
    cta: 'Get Stremio Free',
    reassurances: ['No credit card', 'No account required', 'Under a minute to install'],
    platforms: [
      'Windows',
      'macOS',
      'Linux',
      'Android',
      'iOS',
      'Android TV',
      'Samsung TV',
      'LG TV',
      'Web',
    ],
  },

  footer: {
    links: [
      { href: '#features', label: 'Features' },
      { href: '#how-it-works', label: 'How it works' },
      { href: '#compare', label: 'Compare' },
      { href: '#faq', label: 'FAQ' },
    ],
    disclaimerStrong: 'This is a portfolio demo, not an official Stremio site.',
    disclaimerBody:
      ' It was built as a front-end design exercise and has no affiliation with, endorsement from, or connection to Stremio. Testimonials on this page are fictional and written for illustration. Netflix and Disney+ are trademarks of their respective owners and are referenced here only for comparison. Poster artwork is served by Cinemeta, Stremio’s public metadata add-on, and remains the property of its respective rights holders. For the real product, visit ',
    downloadLabel: 'Download',
    copyright: 'Design and build © {year} — demo project.',
  },
}
