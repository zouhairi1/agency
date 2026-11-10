// Seed content for PocketBase. French = main fields, English = *_en.
// Projects are EXAMPLE projects (concepts) to show the kind of work, replace them with real case studies.

export const services = [
  {
    slug: 'sites-applications-web', order: 1,
    title: 'Sites & applications web', title_en: 'Websites & web apps',
    outcome: 'Des sites rapides et des plateformes évolutives que vos clients adorent.', outcome_en: 'Fast websites and scalable platforms your customers love.',
    capabilities: ['Astro', 'Next.js', 'CMS', 'API', 'SEO'],
  },
  {
    slug: 'applications-mobiles', order: 2,
    title: 'Applications mobiles', title_en: 'Mobile apps',
    outcome: 'Des apps iOS & Android au ressenti natif, publiées sur les stores.', outcome_en: 'Native-feeling iOS & Android apps, shipped to the stores.',
    capabilities: ['React Native', 'Expo', 'Notifications', 'Mode hors-ligne'],
  },
  {
    slug: 'design-ux-ui', order: 3,
    title: 'Design produit & UX/UI', title_en: 'Product & UX/UI design',
    outcome: 'Des interfaces claires qui convertissent.', outcome_en: 'Clear interfaces that convert.',
    capabilities: ['Design system', 'Prototypage', 'Tests utilisateurs', 'Figma'],
  },
  {
    slug: 'ia-automatisation', order: 4,
    title: 'IA & automatisation', title_en: 'AI & automation',
    outcome: 'Des assistants intelligents et des processus automatisés.', outcome_en: 'Smart assistants and automated workflows.',
    capabilities: ['Chatbots', 'Agents IA', 'Recherche intelligente', 'Automatisation'],
  },
  {
    slug: 'branding-creatif', order: 5,
    title: 'Branding & expériences créatives', title_en: 'Branding & creative experiences',
    outcome: 'Une identité forte et des sites qui marquent les esprits.', outcome_en: 'A strong identity and memorable websites.',
    capabilities: ['Identité visuelle', 'Motion design', 'WebGL / 3D'],
  },
];

export const estimatorOptions = [
  ['project_type', 1, 2, 'Landing page', 'Landing page', 'Une page de conversion', 'A single conversion page'],
  ['project_type', 2, 5, 'Site vitrine', 'Marketing website', 'Site multi-pages avec CMS', 'Multi-page site with CMS'],
  ['project_type', 3, 8, 'E-commerce', 'E-commerce', 'Boutique en ligne & paiements', 'Online store & payments'],
  ['project_type', 4, 10, 'Application web / SaaS', 'Web app / SaaS', 'Plateforme avec comptes utilisateurs', 'Platform with user accounts'],
  ['project_type', 5, 12, 'Application mobile', 'Mobile app', 'iOS & Android', 'iOS & Android'],
  ['feature', 1, 1, 'Multilingue', 'Multilingual', 'FR / EN / AR', 'FR / EN / AR'],
  ['feature', 2, 2, 'Comptes & connexion', 'Accounts & login', 'Inscription, rôles, espace client', 'Sign-up, roles, client area'],
  ['feature', 3, 2, 'Paiement en ligne', 'Online payments', 'CMI, Stripe, PayPal…', 'Stripe, PayPal, CMI…'],
  ['feature', 4, 3, 'Back-office', 'Admin dashboard', 'Gestion des données & statistiques', 'Data management & analytics'],
  ['feature', 5, 2, 'Intégrations', 'Integrations', 'CRM, ERP, API tierces', 'CRM, ERP, third-party APIs'],
  ['feature', 6, 3, 'Fonctionnalités IA', 'AI features', 'Chatbot, recherche, automatisation', 'Chatbot, search, automation'],
  ['feature', 7, 2, 'Animations & 3D', 'Motion & 3D', 'Expérience premium WebGL', 'Premium WebGL experience'],
].map(([group, order, base_weeks, label, label_en, description, description_en]) => ({
  key: `${group}-${order}`, group, order, base_weeks, label, label_en, description, description_en, multiplier: 1,
}));

const p = (html) => html.trim().split(/\n\s*\n/).map((para) => `<p>${para.trim()}</p>`).join('');

export const projects = [
  {
    slug: 'riad-booking', order: 1, featured: true, category: ['web', 'design'], year: 2026, industry: 'Hôtellerie',
    client: 'Riad à Marrakech (concept)',
    title: 'Réservation directe pour un riad', title_en: 'Direct booking for a riad',
    summary: 'Un site immersif et multilingue pour réserver sans commission.', summary_en: 'An immersive, multilingual site to book without commission.',
    stack: ['Astro', 'PocketBase', 'Stripe', 'FR / EN / AR'],
    challenge: p(`Les maisons d’hôtes dépendent souvent des plateformes de réservation et de leurs commissions. L’objectif : un site qui donne envie dès la première seconde et qui pousse à réserver en direct.`),
    challenge_en: p(`Guest houses often depend on booking platforms and their commissions. The goal: a site that sparks desire from the first second and drives direct bookings.`),
    approach: p(`Photographie plein écran, parcours de réservation en trois étapes, calendrier de disponibilités en temps réel et paiement en ligne. Le site est disponible en français, anglais et arabe.`),
    approach_en: p(`Full-screen photography, a three-step booking flow, real-time availability and online payment. The site is available in French, English and Arabic.`),
    colors: ['#c2410c', '#1c1917'],
  },
  {
    slug: 'artisanat-ecommerce', order: 2, featured: true, category: ['web'], year: 2026, industry: 'E-commerce',
    client: 'Coopérative d’artisans (concept)',
    title: 'E-commerce d’artisanat marocain', title_en: 'Moroccan craft e-commerce',
    summary: 'Une boutique en ligne qui vend au Maroc et à l’export.', summary_en: 'An online store selling in Morocco and abroad.',
    stack: ['Next.js', 'PocketBase', 'CMI', 'Stripe'],
    challenge: p(`Rendre visible le savoir-faire d’artisans et vendre à la fois aux clients marocains (paiement CMI, livraison locale) et internationaux (paiement par carte, expédition à l’étranger).`),
    challenge_en: p(`Showcase artisans’ craftsmanship and sell to both Moroccan customers (CMI payment, local delivery) and international ones (card payment, worldwide shipping).`),
    approach: p(`Fiches produits centrées sur l’histoire de chaque artisan, double tunnel de paiement selon le pays, gestion des stocks simple depuis un back-office.`),
    approach_en: p(`Product pages centred on each artisan’s story, a payment flow adapted to the customer’s country and simple stock management from an admin panel.`),
    colors: ['#0f766e', '#0b1514'],
  },
  {
    slug: 'app-rendez-vous-medical', order: 3, featured: true, category: ['mobile', 'design'], year: 2026, industry: 'Santé',
    client: 'Réseau de cliniques (concept)',
    title: 'App de prise de rendez-vous médicaux', title_en: 'Medical appointment app',
    summary: 'Réserver un médecin en moins d’une minute, rappels inclus.', summary_en: 'Book a doctor in under a minute, reminders included.',
    stack: ['React Native', 'Expo', 'PocketBase', 'Notifications'],
    challenge: p(`Les patients perdent du temps au téléphone et oublient leurs rendez-vous. Les secrétariats sont saturés.`),
    challenge_en: p(`Patients waste time on the phone and forget appointments. Front desks are overloaded.`),
    approach: p(`Une app iOS & Android avec recherche par spécialité et par ville, réservation en trois touches, rappels automatiques et un tableau de bord pour les cliniques.`),
    approach_en: p(`An iOS & Android app with search by specialty and city, three-tap booking, automatic reminders and a dashboard for clinics.`),
    colors: ['#2563eb', '#0b1020'],
  },
  {
    slug: 'saas-logistique', order: 4, featured: true, category: ['web', 'design'], year: 2025, industry: 'Logistique',
    client: 'Société de transport (concept)',
    title: 'Tableau de bord logistique', title_en: 'Logistics dashboard',
    summary: 'Suivre flotte, livraisons et performances en temps réel.', summary_en: 'Track fleet, deliveries and performance in real time.',
    stack: ['React', 'Go', 'PocketBase', 'Cartographie'],
    challenge: p(`Les informations sur les livraisons étaient dispersées entre tableurs, appels et messages WhatsApp.`),
    challenge_en: p(`Delivery information was scattered across spreadsheets, calls and WhatsApp messages.`),
    approach: p(`Une plateforme unique : carte en temps réel, statut de chaque livraison, alertes automatiques et rapports exportables.`),
    approach_en: p(`A single platform: live map, status for every delivery, automatic alerts and exportable reports.`),
    colors: ['#7c3aed', '#100b1a'],
  },
  {
    slug: 'plateforme-e-learning', order: 5, featured: false, category: ['web'], year: 2025, industry: 'Éducation',
    client: 'Centre de formation (concept)',
    title: 'Plateforme de formation en ligne', title_en: 'Online learning platform',
    summary: 'Cours vidéo, quiz et certificats, sur ordinateur comme sur mobile.', summary_en: 'Video courses, quizzes and certificates, on desktop and mobile.',
    stack: ['Astro', 'React', 'PocketBase', 'Vidéo'],
    challenge: p(`Proposer des formations à distance accessibles, même avec une connexion lente.`),
    challenge_en: p(`Deliver accessible remote training, even on slow connections.`),
    approach: p(`Lecteur vidéo adaptatif, progression sauvegardée, quiz interactifs et génération automatique de certificats.`),
    approach_en: p(`Adaptive video player, saved progress, interactive quizzes and automatic certificate generation.`),
    colors: ['#ca8a04', '#17140a'],
  },
  {
    slug: 'assistant-ia-immobilier', order: 6, featured: false, category: ['ai'], year: 2026, industry: 'Immobilier',
    client: 'Agence immobilière (concept)',
    title: 'Assistant IA pour l’immobilier', title_en: 'AI assistant for real estate',
    summary: 'Un assistant qui répond aux acheteurs 24h/24 et qualifie les demandes.', summary_en: 'An assistant that answers buyers 24/7 and qualifies requests.',
    stack: ['IA / LLM', 'WhatsApp API', 'Go', 'PocketBase'],
    challenge: p(`Les agents passent beaucoup de temps à répondre aux mêmes questions, souvent en dehors des heures de bureau.`),
    challenge_en: p(`Agents spend a lot of time answering the same questions, often outside office hours.`),
    approach: p(`Un assistant connecté au catalogue de biens, disponible sur le site et sur WhatsApp, qui répond en français, en arabe et en anglais puis transmet les demandes qualifiées à l’équipe.`),
    approach_en: p(`An assistant connected to the property catalogue, available on the website and WhatsApp, answering in French, Arabic and English, then passing qualified leads to the team.`),
    colors: ['#4f46e5', '#0d0b1f'],
  },
  // ---- More examples so every /work filter has projects ----
  {
    slug: 'app-livraison-repas', order: 7, featured: false, category: ['mobile'], year: 2026, industry: 'Restauration',
    client: 'Réseau de restaurants (concept)',
    title: 'App de livraison de repas', title_en: 'Food delivery app',
    summary: 'Commander, payer et suivre son livreur en temps réel.', summary_en: 'Order, pay and track your courier in real time.',
    stack: ['React Native', 'Expo', 'Go', 'Cartographie'],
    challenge: p(`Les restaurants perdaient des marges sur les plateformes de livraison et ne connaissaient pas leurs clients.`),
    challenge_en: p(`Restaurants were losing margins on delivery platforms and didn’t know their customers.`),
    approach: p(`Une app à la marque du restaurant : menu, panier, paiement en ligne ou à la livraison, suivi du livreur sur carte et programme de fidélité.`),
    approach_en: p(`A restaurant-branded app: menu, basket, online or cash-on-delivery payment, live courier tracking and a loyalty programme.`),
    colors: ['#ea580c', '#1a0f08'],
  },
  {
    slug: 'app-sport-coaching', order: 8, featured: false, category: ['mobile', 'design'], year: 2025, industry: 'Sport & bien-être',
    client: 'Salle de sport (concept)',
    title: 'App de coaching sportif', title_en: 'Fitness coaching app',
    summary: 'Programmes personnalisés, réservation de cours et suivi des progrès.', summary_en: 'Personal programmes, class booking and progress tracking.',
    stack: ['React Native', 'PocketBase', 'Notifications', 'Apple Health'],
    challenge: p(`Les membres abandonnaient leur abonnement faute de suivi entre deux séances.`),
    challenge_en: p(`Members were dropping their subscription for lack of follow-up between sessions.`),
    approach: p(`Une app qui propose un programme adapté à chaque membre, permet de réserver les cours collectifs et visualise les progrès semaine après semaine.`),
    approach_en: p(`An app offering a programme tailored to each member, class booking and week-by-week progress charts.`),
    colors: ['#db2777', '#1a0811'],
  },
  {
    slug: 'refonte-app-bancaire', order: 9, featured: false, category: ['design'], year: 2026, industry: 'Fintech',
    client: 'Start-up fintech (concept)',
    title: 'Refonte UX d’une app de paiement', title_en: 'Payment app UX redesign',
    summary: 'Un parcours plus simple pour envoyer de l’argent en trois étapes.', summary_en: 'A simpler flow to send money in three steps.',
    stack: ['Figma', 'Design system', 'Tests utilisateurs', 'Prototype'],
    challenge: p(`L’application était complète mais difficile à comprendre pour les nouveaux utilisateurs.`),
    challenge_en: p(`The app was feature-rich but hard to understand for new users.`),
    approach: p(`Tests avec de vrais utilisateurs, nouvelle architecture de l’information, design system complet et prototype animé prêt pour le développement.`),
    approach_en: p(`Testing with real users, a new information architecture, a full design system and an animated prototype ready for development.`),
    colors: ['#0891b2', '#06161a'],
  },
  {
    slug: 'automatisation-factures-ia', order: 10, featured: false, category: ['ai', 'web'], year: 2026, industry: 'Comptabilité',
    client: 'Cabinet comptable (concept)',
    title: 'Lecture automatique de factures par IA', title_en: 'AI invoice processing',
    summary: 'Des factures scannées transformées en écritures comptables, sans saisie.', summary_en: 'Scanned invoices turned into accounting entries, no typing.',
    stack: ['IA / OCR', 'Go', 'PocketBase', 'Export Excel'],
    challenge: p(`Les collaborateurs passaient des heures à saisir des factures papier et PDF, en français et en arabe.`),
    challenge_en: p(`Staff spent hours typing paper and PDF invoices, in French and Arabic.`),
    approach: p(`Un outil web qui lit les factures (montants, TVA, fournisseurs), propose l’écriture comptable et laisse l’humain valider en un clic.`),
    approach_en: p(`A web tool that reads invoices (amounts, VAT, suppliers), suggests the accounting entry and lets a human approve in one click.`),
    colors: ['#16a34a', '#071208'],
  },
  {
    slug: 'identite-cafe-torrefacteur', order: 11, featured: false, category: ['branding', 'design'], year: 2025, industry: 'Café & torréfaction',
    client: 'Torréfacteur artisanal (concept)',
    title: 'Identité visuelle d’un café torréfacteur', title_en: 'Brand identity for a coffee roaster',
    summary: 'Logo, packaging et site web pour une marque de café de spécialité.', summary_en: 'Logo, packaging and website for a specialty coffee brand.',
    stack: ['Identité visuelle', 'Packaging', 'Astro', 'Motion'],
    challenge: p(`Une nouvelle marque devait se démarquer en boutique comme en ligne, face à des concurrents bien installés.`),
    challenge_en: p(`A new brand had to stand out in store and online against well-established competitors.`),
    approach: p(`Une identité inspirée des motifs géométriques marocains, déclinée sur les sachets, les gobelets et un site vitrine avec boutique.`),
    approach_en: p(`An identity inspired by Moroccan geometric patterns, applied to bags, cups and a showcase website with a shop.`),
    colors: ['#a16207', '#140f05'],
  },
  {
    slug: 'branding-promoteur-immobilier', order: 12, featured: false, category: ['branding', 'web'], year: 2026, industry: 'Immobilier',
    client: 'Promoteur immobilier (concept)',
    title: 'Branding & site d’un programme immobilier', title_en: 'Branding & website for a residential project',
    summary: 'Une marque premium et une visite 3D pour vendre sur plan.', summary_en: 'A premium brand and a 3D tour to sell off-plan.',
    stack: ['Identité visuelle', 'WebGL / 3D', 'Astro', 'CRM'],
    challenge: p(`Vendre des appartements avant leur construction, à des acheteurs au Maroc et dans la diaspora.`),
    challenge_en: p(`Sell apartments before they are built, to buyers in Morocco and in the diaspora abroad.`),
    approach: p(`Nom et identité du programme, site multilingue avec visite 3D des appartements, simulateur de choix d’étage et formulaire relié au CRM des commerciaux.`),
    approach_en: p(`Project name and identity, multilingual website with a 3D apartment tour, floor selector and a form connected to the sales team’s CRM.`),
    colors: ['#7c3aed', '#0f0a1a'],
  },
];

export const posts = [
  {
    slug: 'pourquoi-un-cahier-des-charges', category: 'business', published_at: '2026-10-28 09:00:00.000Z',
    title: 'Pourquoi un cahier des charges change tout pour votre projet web',
    title_en: 'Why a specifications document changes everything for your web project',
    excerpt: 'Un bon cahier des charges, c’est un projet mieux chiffré, livré plus vite et sans mauvaises surprises. Voici comment le préparer.',
    excerpt_en: 'Good specifications mean a better-scoped project, delivered faster and without bad surprises. Here is how to prepare them.',
    colors: ['#4f46e5', '#0d0b1f'],
    body: `
<p>Avant de parler design, technologie ou délais, une question revient toujours : <strong>que doit faire exactement votre site ou votre application ?</strong> Le cahier des charges (CDC) est le document qui répond à cette question. C’est aussi la raison pour laquelle nous ne donnons jamais de prix « au hasard ».</p>
<h2>1. Un prix juste, pas une estimation au doigt mouillé</h2>
<p>Deux « sites e-commerce » peuvent varier du simple au décuple selon le nombre de produits, les moyens de paiement, les langues ou les intégrations. Sans CDC, un devis n’est qu’une supposition. Avec un CDC, chaque fonctionnalité est listée, donc chiffrée précisément.</p>
<h2>2. Moins d’allers-retours, plus de vitesse</h2>
<p>Un projet qui démarre avec des objectifs clairs évite les changements de direction en cours de route. Résultat : des délais tenus et un budget maîtrisé.</p>
<h2>3. Que mettre dans votre cahier des charges ?</h2>
<ul>
<li><strong>Le contexte</strong> : votre entreprise, vos clients, vos concurrents.</li>
<li><strong>Les objectifs</strong> : vendre en ligne, générer des contacts, automatiser une tâche…</li>
<li><strong>Les fonctionnalités</strong> : pages, espace client, paiement, langues (FR / EN / AR).</li>
<li><strong>Les contenus</strong> : textes, photos, vidéos, qui les fournit ?</li>
<li><strong>Les contraintes</strong> : date de lancement, outils existants, hébergement.</li>
<li><strong>Les références</strong> : des sites que vous aimez (et pourquoi).</li>
</ul>
<h2>4. Pas de cahier des charges ? Pas de problème</h2>
<p>Beaucoup de nos clients n’en ont pas au départ. Dans ce cas, nous organisons un rendez-vous de découverte (en personne au Maroc, ou en visio partout ailleurs) et nous le construisons ensemble. C’est la première étape de notre méthode.</p>
<blockquote>Un bon projet commence par une bonne question, pas par un devis.</blockquote>
<p>Vous avez déjà un cahier des charges ? Envoyez-le-nous : nous revenons vers vous sous 24 heures.</p>`,
    body_en: `
<p>Before talking design, technology or timelines, one question always comes first: <strong>what exactly should your website or app do?</strong> A specifications document (in French, a <em>cahier des charges</em> or CDC) answers that question. It is also why we never quote prices “blindly”.</p>
<h2>1. A fair price, not a guess</h2>
<p>Two “e-commerce sites” can differ tenfold depending on the number of products, payment methods, languages or integrations. Without specifications, a quote is only an assumption. With them, every feature is listed and therefore priced accurately.</p>
<h2>2. Fewer back-and-forths, more speed</h2>
<p>A project that starts with clear goals avoids changes of direction along the way. The result: deadlines met and a controlled budget.</p>
<h2>3. What should your specifications include?</h2>
<ul>
<li><strong>Context</strong>: your company, your customers, your competitors.</li>
<li><strong>Goals</strong>: sell online, generate leads, automate a task…</li>
<li><strong>Features</strong>: pages, client area, payments, languages.</li>
<li><strong>Content</strong>: copy, photos, videos, and who provides them.</li>
<li><strong>Constraints</strong>: launch date, existing tools, hosting.</li>
<li><strong>References</strong>: websites you like (and why).</li>
</ul>
<h2>4. No specifications yet? No problem</h2>
<p>Many of our clients don’t have any at the start. In that case we hold a discovery meeting (in person in Morocco, or by video anywhere else) and write them together. It is the first step of our process.</p>
<blockquote>A good project starts with a good question, not with a quote.</blockquote>
<p>Already have specifications? Send them over: we reply within 24 hours.</p>`,
  },
  {
    slug: 'combien-de-temps-pour-creer-un-site-web', category: 'business', published_at: '2026-10-14 09:00:00.000Z',
    title: 'Combien de temps faut-il pour créer un site web professionnel ?',
    title_en: 'How long does it take to build a professional website?',
    excerpt: 'Landing page, site vitrine, e-commerce ou application : des délais réalistes, étape par étape.',
    excerpt_en: 'Landing page, marketing site, e-commerce or app: realistic timelines, step by step.',
    colors: ['#2563eb', '#0b1020'],
    body: `
<p>« Pour quand ce sera prêt ? » C’est l’une des premières questions que l’on nous pose. La réponse dépend surtout du type de projet et de la préparation en amont.</p>
<h2>Les délais typiques</h2>
<ul>
<li><strong>Landing page</strong> : 1 à 3 semaines.</li>
<li><strong>Site vitrine avec CMS</strong> : 4 à 7 semaines.</li>
<li><strong>Site e-commerce</strong> : 7 à 12 semaines.</li>
<li><strong>Application web ou SaaS</strong> : 8 à 16 semaines pour une première version.</li>
<li><strong>Application mobile</strong> : 10 à 18 semaines selon les fonctionnalités.</li>
</ul>
<p>Vous pouvez obtenir une estimation pour votre propre projet avec notre outil d’estimation sur la page d’accueil.</p>
<h2>Ce qui accélère un projet</h2>
<ul>
<li>Un <strong>cahier des charges</strong> clair dès le départ.</li>
<li>Des <strong>contenus prêts</strong> : textes, photos, logo.</li>
<li>Un <strong>interlocuteur unique</strong> côté client, disponible pour valider rapidement.</li>
</ul>
<h2>Ce qui ralentit un projet</h2>
<ul>
<li>Des fonctionnalités ajoutées en cours de route.</li>
<li>Des validations qui prennent plusieurs semaines.</li>
<li>Des contenus livrés à la dernière minute.</li>
</ul>
<h2>Notre façon de travailler</h2>
<p>Nous avançons par sprints d’une semaine, avec une démo à chaque étape. Vous voyez votre site prendre forme en ligne, et vous pouvez réagir tout de suite plutôt qu’à la fin.</p>
<p>Le délai exact (et le prix) est fixé après la lecture de votre cahier des charges ou un premier rendez-vous.</p>`,
    body_en: `
<p>“When will it be ready?” It is one of the first questions we hear. The answer mostly depends on the type of project and how well it is prepared.</p>
<h2>Typical timelines</h2>
<ul>
<li><strong>Landing page</strong>: 1 to 3 weeks.</li>
<li><strong>Marketing website with CMS</strong>: 4 to 7 weeks.</li>
<li><strong>E-commerce website</strong>: 7 to 12 weeks.</li>
<li><strong>Web app or SaaS</strong>: 8 to 16 weeks for a first version.</li>
<li><strong>Mobile app</strong>: 10 to 18 weeks depending on features.</li>
</ul>
<p>You can get an estimate for your own project with the scoping tool on our home page.</p>
<h2>What speeds a project up</h2>
<ul>
<li>Clear <strong>specifications</strong> from day one.</li>
<li><strong>Content ready</strong>: copy, photos, logo.</li>
<li>A <strong>single point of contact</strong> on the client side who can approve quickly.</li>
</ul>
<h2>What slows a project down</h2>
<ul>
<li>Features added along the way.</li>
<li>Approvals that take several weeks.</li>
<li>Content delivered at the last minute.</li>
</ul>
<h2>How we work</h2>
<p>We work in one-week sprints with a demo at each step. You see your site take shape online and can react straight away rather than at the end.</p>
<p>The exact timeline (and the price) is set after we read your specifications or meet you.</p>`,
  },
  {
    slug: 'site-rapide-performance', category: 'engineering', published_at: '2026-09-30 09:00:00.000Z',
    title: 'Site web rapide : pourquoi la performance fait vendre',
    title_en: 'Fast websites: why performance sells',
    excerpt: 'Chaque seconde de chargement compte, surtout sur mobile. Les leviers concrets pour un site rapide.',
    excerpt_en: 'Every second of loading counts, especially on mobile. Concrete levers for a fast website.',
    colors: ['#c2410c', '#1c1917'],
    body: `
<p>Un site magnifique qui met cinq secondes à s’afficher perd une grande partie de ses visiteurs avant même qu’ils ne le voient. Sur mobile, avec une connexion 4G moyenne, l’écart est encore plus marqué.</p>
<h2>Pourquoi la vitesse compte</h2>
<ul>
<li><strong>Les visiteurs restent</strong> : moins d’abandons, plus de pages vues.</li>
<li><strong>Google vous met en avant</strong> : la vitesse (Core Web Vitals) fait partie des critères de classement.</li>
<li><strong>Vous convertissez plus</strong> : un parcours fluide inspire confiance.</li>
</ul>
<h2>Nos leviers concrets</h2>
<h3>1. Envoyer moins de code</h3>
<p>Nous utilisons Astro, qui génère des pages statiques et n’envoie du JavaScript que là où c’est nécessaire (un formulaire, un outil interactif).</p>
<h3>2. Des images optimisées</h3>
<p>Formats modernes (AVIF, WebP), tailles adaptées à chaque écran et chargement différé des images hors écran.</p>
<h3>3. Des animations qui ne ralentissent rien</h3>
<p>Nos animations n’utilisent que les propriétés que le navigateur sait animer sans effort, et s’adaptent aux préférences d’accessibilité de chaque visiteur.</p>
<h3>4. Un hébergement proche de vos visiteurs</h3>
<p>Les pages sont servies depuis un CDN mondial : rapides à Casablanca comme à Paris ou Montréal.</p>
<h2>Mesurer, toujours</h2>
<p>Chaque site que nous livrons vise un score Lighthouse supérieur à 90 sur mobile. Nous mesurons avant la mise en ligne, et après.</p>`,
    body_en: `
<p>A beautiful website that takes five seconds to load loses many of its visitors before they even see it. On mobile, with an average 4G connection, the gap is even wider.</p>
<h2>Why speed matters</h2>
<ul>
<li><strong>Visitors stay</strong>: fewer bounces, more pages viewed.</li>
<li><strong>Google ranks you higher</strong>: speed (Core Web Vitals) is a ranking signal.</li>
<li><strong>You convert more</strong>: a smooth experience builds trust.</li>
</ul>
<h2>Our concrete levers</h2>
<h3>1. Ship less code</h3>
<p>We use Astro, which generates static pages and only sends JavaScript where it is needed (a form, an interactive tool).</p>
<h3>2. Optimised images</h3>
<p>Modern formats (AVIF, WebP), sizes adapted to each screen and lazy loading for off-screen images.</p>
<h3>3. Animations that slow nothing down</h3>
<p>Our animations only use properties the browser can animate effortlessly, and they adapt to each visitor’s accessibility preferences.</p>
<h3>4. Hosting close to your visitors</h3>
<p>Pages are served from a global CDN: fast in Casablanca as well as in Paris or Montreal.</p>
<h2>Always measure</h2>
<p>Every site we deliver targets a Lighthouse score above 90 on mobile. We measure before launch, and after.</p>`,
  },
];
