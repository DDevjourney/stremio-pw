import type { Dictionary } from './types'

export const es: Dictionary = {
  htmlLang: 'es',
  documentTitle: 'Stremio — Todo lo que ves. Una sola app.',

  nav: {
    links: [
      { href: '#features', label: 'Ventajas' },
      { href: '#how-it-works', label: 'Cómo funciona' },
      { href: '#compare', label: 'Comparativa' },
      { href: '#faq', label: 'Preguntas' },
    ],
    cta: 'Descargar',
    switchLanguage: 'Switch to English',
    otherLanguageCode: 'EN',
  },

  hero: {
    badge: 'Gratis y de código abierto · Sin suscripción, nunca',
    headlineLead: 'Todo lo que ves.',
    headlineAccent: 'Una sola app.',
    sub: 'Stremio reúne películas, series, canales en directo y tu propia biblioteca en una única interfaz cuidada — en tu portátil, en tu móvil y en tu televisor. Sin suscripción. Sin abrir seis apps para encontrar una película.',
    ctaPrimary: 'Consigue Stremio gratis',
    ctaSecondary: 'Ver cómo funciona',
    microcopy: 'Disponible para Windows, macOS, Linux, Android, iOS, smart TV y web.',
    rowContinue: 'Seguir viendo',
    rowPopular: 'Popular esta semana',
    seeAll: 'Ver todo',
    ident: 'EN DIRECTO · TODAS LAS FUENTES',
    timecode: '00:00:00:00',
  },

  genres: {
    crime: 'Crimen',
    scifi: 'Ciencia ficción',
    drama: 'Drama',
    animation: 'Animación',
    scifiHorror: 'Terror y ci-fi',
    action: 'Acción',
    thriller: 'Thriller',
  },

  value: {
    eyebrow: 'Por qué Stremio',
    title: 'Pensado para cómo se ve de verdad',
    lead: 'No es otro catálogo al que suscribirte, sino un único sitio donde por fin convive todo lo que ya quieres ver.',
    resources: {
      catalog: 'Catálogo',
      meta: 'Metadatos',
      stream: 'Emisión',
      subtitles: 'Subtítulos',
    },
    items: [
      {
        title: 'Gratis, para siempre',
        body: 'Sin suscripción, sin pruebas que se renuevan solas, sin pagar de más por cada perfil. Stremio se descarga y se usa gratis, en todos tus dispositivos.',
        resource: 'stream',
      },
      {
        title: 'Un catálogo sin muros',
        body: 'Los complementos oficiales y de la comunidad se integran en una sola interfaz. Películas, series, canales en directo, subtítulos y tu biblioteca: todo se busca a la vez, no app por app.',
        resource: 'catalog',
      },
      {
        title: 'Todas tus pantallas',
        body: 'Windows, macOS, Linux, Android, iOS, Android TV, smart TV de Samsung y LG, además de un reproductor web completo. Empieza en el tren y termina en el sofá.',
        resource: 'meta',
      },
    ],
  },

  how: {
    eyebrow: 'Cómo funciona',
    title: 'De la descarga al play en cuatro pasos',
    lead: 'La mayoría está viendo algo a los cinco minutos de instalarlo. No hay que crear ninguna cuenta ni configurar nada para empezar.',
    steps: [
      {
        number: '01',
        title: 'Instala Stremio',
        body: 'Descarga la versión de tu plataforma. Ocupa un par de megas y no hace falta cuenta para empezar a explorar.',
      },
      {
        number: '02',
        title: 'Añade tus complementos',
        body: 'Abre el catálogo de complementos y activa las fuentes que quieras. Cada una se añade con un clic y se quita igual de rápido.',
      },
      {
        number: '03',
        title: 'Crea tu biblioteca',
        body: 'Sigue una serie y Stremio recuerda por dónde ibas, marca los episodios nuevos y sincroniza ese progreso entre tus dispositivos.',
      },
      {
        number: '04',
        title: 'Dale al play',
        body: 'Una sola búsqueda cubre todas las fuentes que tengas activadas. Elige el stream, elige subtítulos y a ver — hasta en 4K si la fuente lo permite.',
      },
    ],
    noteTitle: 'Una nota sobre los complementos.',
    noteBody:
      'Stremio es el reproductor; los complementos son las fuentes. Empieza por el catálogo oficial —cubre metadatos, subtítulos y contenido libre de dominio público— y añade solo fuentes de la comunidad que reconozcas y en las que confíes.',
  },

  compare: {
    eyebrow: 'Cara a cara',
    title: 'Cómo se compara',
    lead: 'Netflix y Disney+ son servicios muy cuidados y con contenido original realmente bueno. La diferencia está en lo que renuncias a cambio, y en cuánto de eso cubre una sola app gratuita.',
    feature: 'Característica',
    freePill: 'Gratis',
    yes: 'Sí',
    no: 'No',
    rows: [
      {
        label: 'Precio mensual',
        note: 'Planes individuales estándar, precios de EE. UU. según lo anunciado en 2025.',
        stremio: 'Gratis',
        netflix: 'Desde 7,99 $',
        disney: 'Desde 9,99 $',
      },
      {
        label: 'Catálogo que controlas tú',
        note: 'Si puedes añadir o quitar fuentes de contenido por tu cuenta.',
        stremio: true,
        netflix: false,
        disney: false,
      },
      { label: 'Búsqueda en todas las fuentes', stremio: true, netflix: false, disney: false },
      { label: 'Escritorio, móvil, TV y web', stremio: true, netflix: true, disney: true },
      {
        label: 'Ver sin conexión',
        stremio: 'Con complementos',
        netflix: 'Títulos concretos',
        disney: 'Títulos concretos',
      },
      {
        label: 'Los títulos desaparecen sin avisar',
        note: 'En las grandes plataformas caducan las licencias; tus complementos son tuyos.',
        stremio: false,
        netflix: true,
        disney: true,
      },
      {
        label: 'Sin anuncios de serie',
        note: 'Los planes de entrada de ambos servicios incluyen anuncios.',
        stremio: true,
        netflix: false,
        disney: false,
      },
      { label: 'Código abierto', stremio: true, netflix: false, disney: false },
    ],
    tableCaption:
      'Comparativa de Stremio, Netflix y Disney+ en precio, control del catálogo, disponibilidad por plataforma y visionado sin conexión.',
    scrollHint: 'Desliza la tabla en horizontal para ver todas las columnas.',
    caption:
      'Los precios corresponden a los planes individuales estándar anunciados en EE. UU. y varían según la región. Netflix y Disney+ son marcas de sus respectivos propietarios; esta página es una demo de portfolio independiente y no está afiliada a ninguna de ellas.',
  },

  testimonials: {
    eyebrow: 'Testimonios',
    title: 'Gente que dejó de hacer malabares con apps',
    lead: 'Unas palabras del tipo de persona que antes llevaba una hoja de cálculo con qué suscripción tenía qué serie.',
    rating: 'Valoración de 5 sobre 5',
    items: [
      {
        quote:
          'Pagaba tres servicios y aun así no encontraba ni la mitad de lo que quería ver. Ahora hay un solo icono en la tele y la factura mensual me ha bajado unos cuarenta euros.',
        name: 'Marta Ibáñez',
        context: 'Pasó de tres suscripciones a una sola app',
        initials: 'MI',
      },
      {
        quote:
          'Lo que me convenció fue la sincronización de la biblioteca. Empiezo un episodio en el portátil a mediodía y el móvil sabe exactamente dónde lo dejé. Eso era justo lo que le reconocía a las grandes plataformas.',
        name: 'Daniel Okafor',
        context: 'Usa Stremio en portátil, móvil y Android TV',
        initials: 'DO',
      },
      {
        quote:
          'Configurar los complementos me llevó unos cinco minutos y no soy especialmente técnica. La interfaz se ve mejor que la de la mayoría de apps de pago que he usado, la verdad.',
        name: 'Priya Raghunathan',
        context: 'Primera vez, instalado en menos de 10 minutos',
        initials: 'PR',
      },
      {
        quote:
          'Donde gana sin hacer ruido es en los subtítulos. Todos los idiomas que necesito, sincronización ajustable, y recuerda mi preferencia por serie en vez de preguntarme cada vez.',
        name: 'Lukas Brenner',
        context: 'Ve sobre todo series en versión original',
        initials: 'LB',
      },
      {
        quote:
          'Lo instalé en la smart TV de mis padres en una visita de fin de semana y desde entonces no he recibido ni una llamada de soporte. Para esa casa, es el mayor elogio que le puedo hacer a un software.',
        name: 'Sofía Marín',
        context: 'Lo instaló para su familia en una smart TV',
        initials: 'SM',
      },
    ],
  },

  faq: {
    eyebrow: 'Preguntas frecuentes',
    title: 'Preguntas que merece la pena hacerse',
    lead: 'Las respuestas honestas, incluida la de la legalidad que la mayoría de páginas se salta.',
    supportPre: '¿Aún tienes dudas? La ',
    supportLink: 'web oficial de Stremio',
    supportPost: ' tiene toda la documentación y el soporte de la comunidad.',
    items: [
      {
        question: '¿Qué es exactamente Stremio?',
        answer:
          'Stremio es una aplicación gratuita de centro multimedia. Por sí sola es una interfaz: una biblioteca cuidada, un reproductor, gestión de subtítulos y sincronización del progreso. El contenido llega a través de complementos que tú eliges e instalas, y eso es lo que permite que una sola app cubra películas, series, canales en directo y tu colección personal a la vez.',
      },
      {
        question: '¿Es legal?',
        answer:
          'La aplicación Stremio en sí es software legítimo y de código abierto, y los complementos oficiales distribuyen contenido con licencia o de dominio público. Como cualquiera puede publicar un complemento de la comunidad, la legalidad de lo que veas depende por completo de los complementos que instales. Quédate con fuentes oficiales y conocidas, y respeta la ley de propiedad intelectual de tu país.',
      },
      {
        question: '¿Con qué complementos empiezo?',
        answer:
          'Empieza por los que vienen en el catálogo oficial: Cinemeta para los metadatos de películas y series, OpenSubtitles para los subtítulos, y los complementos de dominio público y canales en directo. Con eso basta para ver cómo funciona la app antes de explorar el catálogo más amplio de la comunidad.',
      },
      {
        question: '¿Funcionará en mi dispositivo?',
        answer:
          'Casi con toda seguridad. Hay versiones nativas para Windows, macOS, Linux, Android, iOS y Android TV, apps para smart TV de Samsung y LG, y un reproductor web que funciona en cualquier navegador moderno. También puedes enviar contenido desde la app móvil a un Chromecast.',
      },
      {
        question: '¿Necesito una cuenta?',
        answer:
          'Para ver, no. Puedes instalar Stremio y empezar a explorar directamente. Crear una cuenta gratuita es opcional y solo sirve para que tu biblioteca, tu progreso y tus complementos te sigan de un dispositivo a otro.',
      },
      {
        question: '¿De verdad no cuesta nada?',
        answer:
          'La aplicación es gratuita y de código abierto, sin plan de pago ni anuncios en la interfaz. Algunos complementos de terceros se conectan a servicios que cobran aparte —un proveedor debrid, por ejemplo—, pero son totalmente opcionales y nada del Stremio base está detrás de un muro de pago.',
      },
    ],
  },

  finalCta: {
    eyebrow: 'Empieza esta noche',
    title: 'Tu próxima película está a una descarga',
    sub: 'La casa media paga servicios de streaming que apenas abre. Instala Stremio, dedica cinco minutos a configurarlo y comprueba cuánto de eso sigues necesitando el mes que viene.',
    cta: 'Consigue Stremio gratis',
    reassurances: ['Sin tarjeta', 'Sin cuenta', 'Se instala en menos de un minuto'],
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
      { href: '#features', label: 'Ventajas' },
      { href: '#how-it-works', label: 'Cómo funciona' },
      { href: '#compare', label: 'Comparativa' },
      { href: '#faq', label: 'Preguntas' },
    ],
    disclaimerStrong: 'Esto es una demo de portfolio, no una web oficial de Stremio.',
    disclaimerBody:
      ' Se ha creado como ejercicio de diseño front-end y no tiene ninguna afiliación con Stremio ni cuenta con su respaldo. Los testimonios de esta página son ficticios y sirven de ilustración. Netflix y Disney+ son marcas de sus respectivos propietarios y se mencionan aquí solo a efectos de comparación. Las carátulas las sirve Cinemeta, el complemento público de metadatos de Stremio, y siguen siendo propiedad de sus respectivos titulares de derechos. Para el producto real, visita ',
    downloadLabel: 'Descargar',
    copyright: 'Diseño y desarrollo © {year} — proyecto de demostración.',
  },
}
