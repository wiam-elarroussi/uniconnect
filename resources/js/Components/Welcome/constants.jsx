// resources/js/Components/Welcome/constants.jsx

// ── Icônes ─────────────────────────────────────────────────────────────────
export const IconShield  = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>);
export const IconUsers   = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
export const IconBrain   = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.14L9.5 2Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.14L14.5 2Z"/></svg>);
export const IconLeaf    = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>);
export const IconStar    = () => (<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>);
export const IconArrow   = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>);
export const IconCheck   = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>);
export const IconZap     = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>);
export const IconLock    = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
export const IconBell    = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path strokeLinecap="round" strokeLinejoin="round" d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>);

// ── Données ─────────────────────────────────────────────────────────────────
export const FEATURES = [
  {
    icon: <IconUsers />,
    color: 'blue',
    title: 'Entraide Académique',
    desc: "Posez vos questions, partagez vos ressources et progressez ensemble. La communauté SupMTI au bout des doigts.",
    badge: 'Social Learning',
  },
  {
    icon: <IconShield />,
    color: 'emerald',
    title: 'Éthique & Sécurisé',
    desc: "Privacy by Design, chiffrement HTTPS et droit à l'oubli. Vos données restent les vôtres.",
    badge: 'RGPD Compliant',
  },
  {
    icon: <IconBrain />,
    color: 'indigo',
    title: 'Intelligence Collective',
    desc: "Pas d'algorithme addictif. Un flux classé par pertinence académique, pas par engagement maximal.",
    badge: 'Anti-Dopamine Loop',
  },
  {
    icon: <IconLeaf />,
    color: 'emerald',
    title: 'Éco-Conçu',
    desc: "Optimisé pour les connexions faibles et les vieux appareils. La technologie au service de tous.",
    badge: 'Low-Tech Friendly',
  },
  {
    icon: <IconBell />,
    color: 'blue',
    title: 'Droit à la Déconnexion',
    desc: "Mode Focus et mise en sommeil automatique des notifs après les cours. Votre sommeil compte.",
    badge: 'Bien-être Mental',
  },
  {
    icon: <IconLock />,
    color: 'indigo',
    title: 'Accès Exclusif',
    desc: "Réservé aux étudiant·e·s SupMTI via email institutionnel. Une communauté de confiance.",
    badge: 'Vérification @supmti.ma',
  },
];

export const STATS = [
  { value: '500+', label: 'Étudiants SupMTI' },
  { value: '3',    label: 'Piliers Éthiques' },
  { value: '0',    label: 'Publicités' },
  { value: '100%', label: 'Open & Éthique' },
];

export const TESTIMONIALS = [
  { name: 'Yasmine B.',  role: 'Génie Informatique · 3A',    text: "L'interface est d'une fluidité incroyable. J'ai pu trouver un binôme pour mon projet Oracle en quelques minutes grâce au flux par pertinence.", avatar: 'YB' },
  { name: 'Omar E.',     role: 'Génie Civil · 1A',           text: "Le Mode Focus est une révolution pour mes révisions. Savoir que les notifications s'arrêtent pour respecter mon sommeil change tout.", avatar: 'OE' },
  { name: 'Salma R.',    role: 'Management Industriel · 2A', text: "Enfin un espace sécurisé où l'on n'est pas bombardé de publicités. La transparence sur l'utilisation de nos données me rassure énormément.", avatar: 'SR' },
  { name: 'Mehdi A.',    role: 'Systèmes Embarqués · 3A',    text: "La section ressources est une mine d'or. J'y ai trouvé des traces d'exécution sur les algorithmes de routage qui m'ont sauvé pour mes exams.", avatar: 'MA' },
  { name: 'Anas K.',     role: 'Génie Logiciel · 2A',        text: "Le concept de Justice Algorithmique est génial. On sent que la plateforme est conçue pour notre bien-être, pas pour nous rendre accros.", avatar: 'AK' },
  { name: 'Houda T.',    role: 'Réseaux & Télécoms · 1A',    text: "L'inscription via l'email SupMTI garantit une communauté de confiance. C'est propre, efficace et vraiment utile au quotidien.", avatar: 'HT' },
];

export const PILIERS = [
  {
    emoji: '🤝', title: 'People', subtitle: 'Social', color: '#2563EB',
    points: ["Briser l'isolement académique", "Communication prof-étudiant fluide", "Protection anti-harcèlement IA", "Accessibilité universelle (malvoyants, TDAH)"],
  },
  {
    emoji: '🌿', title: 'Planet', subtitle: 'Environnement', color: '#10B981',
    points: ["Éco-conception logicielle", "Charge serveur minimisée", "Optimisé Low-Tech & vieux appareils", "Consommation énergétique réduite"],
  },
  {
    emoji: '📈', title: 'Profit', subtitle: 'Économique', color: '#4F46E5',
    points: ["Hausse du taux de réussite SupMTI", "Meilleure rétention des étudiants", "Coût serveur mutualisé nul", "Modèle sans publicité viable"],
  },
];

export const ETAPES = [
  { step: '01', title: 'Cadrage',      desc: "Identification du besoin réel d'entraide à SupMTI via interviews étudiantes.",                            side: 'left' },
  { step: '02', title: 'Recherche',    desc: "Étude bibliographique IEEE & Google Scholar sur le Social Learning et la Tech Éthique.",                  side: 'right' },
  { step: '03', title: 'Faisabilité',  desc: "Analyse des coûts serveur, risques éthiques et cadre légal RGPD / loi marocaine.",                       side: 'left' },
  { step: '04', title: 'Prototypage',  desc: "Création du MVP avec React (Front), Laravel (Back), SQL Server (BDD).",                                   side: 'right' },
  { step: '05', title: 'Tests',        desc: "Tests utilisateurs avec un panel d'étudiants et enseignants SupMTI.",                                      side: 'left' },
  { step: '06', title: 'Soutenance',   desc: "Rapport final PIDR et présentation devant le jury académique.",                                            side: 'right' },
];

export const TICKER_TAGS = [
  "Privacy by Design", "Droit à l'Oubli", "Éco-Conçu",
  "Zéro Publicité", "Anti-Manipulation", "Algorithme Transparent",
  "Exclusif SupMTI", "Open Source",
];