import type { SiteService, TradeId } from './types';

export type IconName =
  | 'droplet'
  | 'zap'
  | 'thermometer'
  | 'layers'
  | 'home'
  | 'tool'
  | 'brush'
  | 'grid'
  | 'square'
  | 'sun'
  | 'wrench';

export type Trade = {
  id: TradeId;
  label: string;
  /** Nom de l'activité, ex. « Plomberie » */
  activity: string;
  icon: IconName;
  schemaType: string;
  palettes: string[];
  services: SiteService[];
  taglines: string[];
  abouts: string[];
};

const T = (t: Trade) => t;

export const TRADES: Record<TradeId, Trade> = {
  plombier: T({
    id: 'plombier',
    label: 'Plombier',
    activity: 'Plomberie',
    icon: 'droplet',
    schemaType: 'Plumber',
    palettes: ['bleu-eau', 'bleu-chantier', 'nuit-cuivre', 'beton-corail'],
    services: [
      { title: 'Dépannage et fuites', description: 'Recherche et réparation de fuites, débouchage, intervention rapide.' },
      { title: 'Salle de bain', description: 'Création et rénovation complète : douche, baignoire, meuble vasque.' },
      { title: 'Chauffe-eau', description: 'Installation, remplacement et entretien de ballons et chauffe-eau.' },
      { title: 'Sanitaires', description: 'Pose de WC, robinetterie, évacuations et raccordements.' },
    ],
    taglines: [
      'Votre plombier à {city}, rapide et soigné',
      'Fuites, salles de bain, chauffe-eau : on s’occupe de tout',
      'Une plomberie bien faite, du premier coup',
    ],
    abouts: [
      '{name} intervient à {city} et dans les environs pour tous vos travaux de plomberie. Dépannage, rénovation ou installation neuve : un travail propre, des délais tenus et des devis clairs.',
      'Plombier installé à {city}, {name} accompagne particuliers et professionnels pour leurs installations sanitaires. Chaque chantier est suivi de A à Z, avec un seul interlocuteur.',
    ],
  }),
  electricien: T({
    id: 'electricien',
    label: 'Électricien',
    activity: 'Électricité',
    icon: 'zap',
    schemaType: 'Electrician',
    palettes: ['electrique', 'anthracite-jaune', 'bleu-chantier', 'nuit-cuivre'],
    services: [
      { title: 'Mise aux normes', description: 'Tableau électrique, diagnostic et mise en conformité NF C 15-100.' },
      { title: 'Rénovation électrique', description: 'Remplacement complet ou partiel de votre installation.' },
      { title: 'Éclairage', description: 'Éclairage intérieur et extérieur, spots, LED, variateurs.' },
      { title: 'Dépannage', description: 'Panne, disjoncteur qui saute, prise défectueuse : intervention rapide.' },
    ],
    taglines: [
      'Votre électricien à {city}, en toute sécurité',
      'Installations électriques sûres et aux normes',
      'Du tableau électrique à l’éclairage, un travail net',
    ],
    abouts: [
      '{name} réalise vos travaux d’électricité à {city} et alentour : mise aux normes, rénovation, dépannage. Des installations sûres, conformes et pensées pour durer.',
      'Électricien à {city}, {name} intervient chez les particuliers comme chez les professionnels. Conseils honnêtes, devis détaillé et chantier laissé propre.',
    ],
  }),
  chauffagiste: T({
    id: 'chauffagiste',
    label: 'Chauffagiste',
    activity: 'Chauffage',
    icon: 'thermometer',
    schemaType: 'HVACBusiness',
    palettes: ['rouge-tuile', 'nuit-cuivre', 'bleu-chantier', 'orange-securite'],
    services: [
      { title: 'Pompe à chaleur', description: 'Étude, installation et mise en service de pompes à chaleur.' },
      { title: 'Chaudière', description: 'Remplacement, installation et dépannage de chaudières.' },
      { title: 'Entretien annuel', description: 'Contrat d’entretien et attestation obligatoire.' },
      { title: 'Radiateurs', description: 'Pose, désembouage et équilibrage de vos radiateurs.' },
    ],
    taglines: [
      'Chauffage et pompe à chaleur à {city}',
      'Un intérieur chaud, une facture maîtrisée',
      'Votre chauffagiste de confiance à {city}',
    ],
    abouts: [
      '{name} installe et entretient vos équipements de chauffage à {city} et dans les environs. Conseils sur les aides disponibles, installation soignée et suivi dans la durée.',
      'Chauffagiste à {city}, {name} vous aide à choisir la solution la plus adaptée à votre logement et à votre budget, puis s’occupe de tout.',
    ],
  }),
  macon: T({
    id: 'macon',
    label: 'Maçon',
    activity: 'Maçonnerie',
    icon: 'layers',
    schemaType: 'GeneralContractor',
    palettes: ['brique', 'beton-corail', 'sable-olive', 'anthracite-jaune'],
    services: [
      { title: 'Extension et agrandissement', description: 'Gagnez de l’espace avec une extension sur mesure.' },
      { title: 'Rénovation', description: 'Ouverture de murs porteurs, reprise de structure, enduits.' },
      { title: 'Dalles et fondations', description: 'Terrasses, dalles béton, fondations et terrassement.' },
      { title: 'Murs et clôtures', description: 'Murs de clôture, murets, parpaings et pierre.' },
    ],
    taglines: [
      'Maçonnerie solide et durable à {city}',
      'Construire et rénover, dans les règles de l’art',
      'Vos travaux de maçonnerie, du devis à la finition',
    ],
    abouts: [
      '{name} réalise vos travaux de maçonnerie à {city} : extension, rénovation, dalle, murs. Des ouvrages solides, des délais respectés et un chantier propre.',
      'Maçon à {city}, {name} met son savoir-faire au service de vos projets, des petits travaux aux constructions plus importantes.',
    ],
  }),
  couvreur: T({
    id: 'couvreur',
    label: 'Couvreur',
    activity: 'Couverture',
    icon: 'home',
    schemaType: 'RoofingContractor',
    palettes: ['rouge-tuile', 'anthracite-jaune', 'brique', 'bleu-chantier'],
    services: [
      { title: 'Réfection de toiture', description: 'Remplacement complet de tuiles, ardoises et liteaux.' },
      { title: 'Réparation et fuites', description: 'Recherche de fuites, tuiles cassées, faîtage.' },
      { title: 'Zinguerie', description: 'Gouttières, chéneaux, descentes et habillages.' },
      { title: 'Démoussage', description: 'Nettoyage et traitement hydrofuge de votre toiture.' },
    ],
    taglines: [
      'Votre toiture entre de bonnes mains à {city}',
      'Couverture, zinguerie et réparation de toiture',
      'Un toit sain pour une maison protégée',
    ],
    abouts: [
      '{name} prend soin de votre toiture à {city} et alentour : réfection, réparation, zinguerie et démoussage. Diagnostic gratuit et devis détaillé.',
      'Couvreur à {city}, {name} intervient sur tous types de toitures, avec des matériaux de qualité et un travail garanti.',
    ],
  }),
  menuisier: T({
    id: 'menuisier',
    label: 'Menuisier',
    activity: 'Menuiserie',
    icon: 'tool',
    schemaType: 'HomeAndConstructionBusiness',
    palettes: ['sable-olive', 'brique', 'vert-ardoise', 'nuit-cuivre'],
    services: [
      { title: 'Fenêtres et portes', description: 'Pose de fenêtres, portes d’entrée et baies vitrées.' },
      { title: 'Agencement sur mesure', description: 'Placards, dressings, bibliothèques et meubles.' },
      { title: 'Escaliers', description: 'Fabrication et pose d’escaliers bois.' },
      { title: 'Terrasses bois', description: 'Terrasses, pergolas et bardages.' },
    ],
    taglines: [
      'Menuiserie sur mesure à {city}',
      'Le bois travaillé avec précision',
      'Fenêtres, agencement, escaliers : du sur-mesure',
    ],
    abouts: [
      '{name} conçoit et pose vos menuiseries à {city} : fenêtres, portes, agencements sur mesure. Des finitions soignées et des matériaux choisis avec vous.',
      'Menuisier à {city}, {name} réalise des ouvrages sur mesure, pensés pour votre intérieur et votre usage.',
    ],
  }),
  peintre: T({
    id: 'peintre',
    label: 'Peintre',
    activity: 'Peinture',
    icon: 'brush',
    schemaType: 'HousePainter',
    palettes: ['beton-corail', 'vert-ardoise', 'electrique', 'sable-olive'],
    services: [
      { title: 'Peinture intérieure', description: 'Murs, plafonds et boiseries, finitions impeccables.' },
      { title: 'Ravalement de façade', description: 'Nettoyage, réparation et peinture de façades.' },
      { title: 'Papier peint et revêtements', description: 'Pose de papiers peints, toiles et revêtements muraux.' },
      { title: 'Décoration', description: 'Conseils couleurs et effets décoratifs.' },
    ],
    taglines: [
      'Peinture intérieure et façades à {city}',
      'Des finitions nettes, des couleurs qui vous ressemblent',
      'Votre peintre en bâtiment à {city}',
    ],
    abouts: [
      '{name} réalise vos travaux de peinture à {city} et dans les environs : intérieurs, façades, revêtements. Protection des lieux, finitions soignées et chantier rendu propre.',
      'Peintre en bâtiment à {city}, {name} vous conseille sur les teintes et les finitions, puis réalise un travail net et durable.',
    ],
  }),
  carreleur: T({
    id: 'carreleur',
    label: 'Carreleur',
    activity: 'Carrelage',
    icon: 'grid',
    schemaType: 'HomeAndConstructionBusiness',
    palettes: ['beton-corail', 'bleu-eau', 'sable-olive', 'anthracite-jaune'],
    services: [
      { title: 'Carrelage sol', description: 'Pose de carrelage, grands formats et carreaux de ciment.' },
      { title: 'Faïence et crédence', description: 'Salles de bain, cuisines et crédences.' },
      { title: 'Douche à l’italienne', description: 'Création de douches de plain-pied étanches.' },
      { title: 'Terrasses', description: 'Carrelage extérieur sur plots ou chape.' },
    ],
    taglines: [
      'Carrelage et faïence à {city}',
      'Des sols et des murs posés au millimètre',
      'Votre carreleur pour des finitions parfaites',
    ],
    abouts: [
      '{name} pose vos carrelages à {city} : sols, faïences, douches à l’italienne et terrasses. Préparation des supports, pose précise et joints impeccables.',
      'Carreleur à {city}, {name} vous accompagne dans le choix des matériaux et réalise une pose durable.',
    ],
  }),
  plaquiste: T({
    id: 'plaquiste',
    label: 'Plaquiste',
    activity: 'Plâtrerie et isolation',
    icon: 'square',
    schemaType: 'HomeAndConstructionBusiness',
    palettes: ['bleu-chantier', 'beton-corail', 'electrique', 'vert-ardoise'],
    services: [
      { title: 'Cloisons', description: 'Création et modification de cloisons en plaques de plâtre.' },
      { title: 'Isolation', description: 'Isolation des murs, combles et plafonds.' },
      { title: 'Faux plafonds', description: 'Plafonds suspendus, spots intégrés, acoustique.' },
      { title: 'Bandes et enduits', description: 'Finitions prêtes à peindre.' },
    ],
    taglines: [
      'Plâtrerie et isolation à {city}',
      'Cloisons, isolation, faux plafonds : un travail net',
      'Mieux isolé, mieux aménagé',
    ],
    abouts: [
      '{name} réalise vos cloisons, isolations et faux plafonds à {city}. Des finitions prêtes à peindre et des conseils pour améliorer le confort de votre logement.',
      'Plaquiste à {city}, {name} transforme vos espaces avec des aménagements propres et bien isolés.',
    ],
  }),
  paysagiste: T({
    id: 'paysagiste',
    label: 'Paysagiste',
    activity: 'Aménagement paysager',
    icon: 'sun',
    schemaType: 'HomeAndConstructionBusiness',
    palettes: ['vert-ardoise', 'foret-sombre', 'sable-olive', 'bleu-eau'],
    services: [
      { title: 'Création de jardin', description: 'Conception et aménagement de votre extérieur.' },
      { title: 'Entretien', description: 'Tonte, taille de haies, désherbage et ramassage.' },
      { title: 'Terrasses et allées', description: 'Dallage, pavage, bois et gravier.' },
      { title: 'Élagage', description: 'Taille et abattage d’arbres en sécurité.' },
    ],
    taglines: [
      'Votre jardin entre de bonnes mains à {city}',
      'Création et entretien d’espaces verts',
      'Des extérieurs beaux toute l’année',
    ],
    abouts: [
      '{name} crée et entretient vos espaces verts à {city} et dans les environs. Du simple entretien à l’aménagement complet, un travail soigné et régulier.',
      'Paysagiste à {city}, {name} imagine des jardins à votre image, faciles à vivre et à entretenir.',
    ],
  }),
  multiservice: T({
    id: 'multiservice',
    label: 'Artisan multiservice',
    activity: 'Rénovation et petits travaux',
    icon: 'wrench',
    schemaType: 'HomeAndConstructionBusiness',
    palettes: ['orange-securite', 'bleu-chantier', 'anthracite-jaune', 'vert-ardoise'],
    services: [
      { title: 'Petits travaux', description: 'Montage, fixation, réparations du quotidien.' },
      { title: 'Rénovation intérieure', description: 'Peinture, sols, cloisons : un seul interlocuteur.' },
      { title: 'Plomberie et électricité', description: 'Interventions courantes et remplacements.' },
      { title: 'Extérieur', description: 'Clôtures, terrasses, entretien.' },
    ],
    taglines: [
      'Tous vos petits travaux à {city}',
      'Un seul artisan pour toute votre maison',
      'Rénovation et dépannage, sans prise de tête',
    ],
    abouts: [
      '{name} vous aide pour tous vos travaux à {city} : rénovation, réparations, aménagements. Un seul interlocuteur, réactif et soigneux.',
      'Artisan multiservice à {city}, {name} intervient rapidement pour les petits comme les plus gros chantiers.',
    ],
  }),
};

export const TRADE_IDS = Object.keys(TRADES) as TradeId[];

export const isTradeId = (v: unknown): v is TradeId => typeof v === 'string' && v in TRADES;
