import { Icons } from "@/components/icons";

type LocalizedText = {
  en: string;
  fr: string;
};

export const DATA = {
  name: "Léo Mathurin",
  initials: "LM",
  url: "https://leo-mathurin.vercel.app/",
  location: "Lyon, FR",
  locationLink: "https://www.google.com/maps/place/lyon",
  description: {
    en: "Cybersecurity Engineer who secures systems from the outside in. I love protecting data and building innovative security solutions. Certified in Cybersecurity by ISC2.",
    fr: "Passionné par la cybersécurité, j'aime relever les défis liés à la protection des données et concevoir des solutions innovantes. Certifié ISC2 CC, je mets mes compétences au service de la sécurité informatique."
  },
  summary: {
    en: "After diving deep into security projects and seeing how vulnerable systems can be, I knew cybersecurity was my calling. [Currently pursuing my Master's in Information Systems Architecture at Epitech](/#education), I'm actively seeking a work-study position in cybersecurity. [I've built security-focused projects from VPN servers to LLM interfaces](/#projects), [developed business solutions at Verylingua](/#work), and [earned my ISC2 CC certification](/#education). I bring hands-on experience with Linux administration, Python automation, and a continuous drive to learn.",
    fr: "Après avoir exploré plusieurs projets de sécurité et découvert à quel point les systèmes peuvent être vulnérables, j'ai su que la cybersécurité était faite pour moi. [Actuellement en Master Architecture des Systèmes d'Information à Epitech](/#education), je suis à la recherche d'une alternance en cybersécurité. [J'ai travaillé sur divers projets, allant de la mise en place de serveurs VPN à la création d'interfaces LLM](/#projects), [en passant par le développement de solutions commerciales chez Verylingua](/#work). Mon expérience couvre l'administration Linux, l'automatisation en Python et une curiosité constante pour les nouvelles technologies. Toujours prêt à apprendre et à innover, je suis motivé à renforcer la sécurité des infrastructures et à anticiper les menaces."
  },
  avatarUrl: "/me1.png",
  skills: [
    { en: "SOC Operations", fr: "Opérations SOC" },
    { en: "EDR Management", fr: "Gestion EDR" },
    { en: "VPN Configuration", fr: "Configuration VPN" },
    { en: "Linux Administration", fr: "Administration Linux" },
    { en: "Active Directory", fr: "Active Directory" },
    { en: "Threat Detection", fr: "Détection de Menaces" },
    { en: "Python", fr: "Python" },
    { en: "Docker", fr: "Docker" },
    { en: "React", fr: "React" },
    { en: "Next.js", fr: "Next.js" },
  ],
  navbar: [
    { href: "/", icon: Icons.home, label: "Home" },
    { href: "/blog", icon: Icons.notebook, label: "Blog" },
  ],
  contact: {
    email: "leo.mathurin@epitech.eu",
    tel: "+33 6 13 87 78 73",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/leo-mathurin/",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/leo-mathurin/",
        icon: Icons.linkedin,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:leo.mathurin@epitech.eu",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "MGM Solutions",
      href: "https://mgmsolutions.fr",
      badges: [],
      location: "Bron, FR",
      title: {
        en: "SOC Cybersecurity Analyst (Work-Study)",
        fr: "Analyste Cybersécurité SOC (Alternance)"
      },
      logoUrl: "/mgm.png",
      start: "January 2025",
      end: "February 2025",
      description: {
        en: "Monitored information systems and performed SOC analysis. Implemented threat remediation through EDR and vulnerability analysis. Automated SOC processes using Python scripts.",
        fr: "Surveillance des systèmes d'information et analyse SOC. Mise en œuvre de solutions de remédiation via EDR et analyse de vulnérabilités. Automatisation des processus SOC avec des scripts Python."
      },
    },
    {
      company: "Verylingua",
      href: "https://verylingua.com",
      badges: [],
      location: "Lyon, FR",
      title: {
        en: "Business Development & Web Intern",
        fr: "Stagiaire Développement Commercial & Web"
      },
      logoUrl: "/verylingua.png",
      start: "January 2024",
      end: "July 2024",
      description: {
        en: "Developed and maintained e-commerce website using Shopify Liquid. Created visual content for the website using Photoshop. Optimized UX/UI on the online platform.",
        fr: "Développement et maintenance de site e-commerce avec Shopify Liquid. Création de contenu visuel pour le site web avec Photoshop. Optimisation de l'UX/UI sur la plateforme en ligne."
      },
    },
  ],
  education: [
    {
      school: "Epitech",
      href: "https://epitech.eu",
      degree: {
        en: "Pre-MSc Information Systems Architecture (RNCP Level 7)",
        fr: "Pré-MSc Architecture des Systèmes d'Information (RNCP Niveau 7)"
      },
      logoUrl: "/epitech.png",
      start: "2024",
      end: "2027",
    },
    {
      school: "Epitech Digital",
      href: "https://epitech.digital/",
      degree: {
        en: "Master of Science in Business & Technology",
        fr: "Master of Science en Business & Technologie"
      },
      logoUrl: "/epitech-digital.png",
      start: "2022",
      end: "2024",
    },
    {
      school: "ISC2",
      href: "https://isc2.org",
      degree: {
        en: "Certified in Cybersecurity (CC)",
        fr: "Certified in Cybersecurity (CC)"
      },
      logoUrl: "/isc2.png",
      start: "",
      end: "2024",
    },
    {
      school: "Microsoft",
      href: "https://www.linkedin.com/learning/paths/career-essentials-in-cybersecurity-by-microsoft-and-linkedin",
      degree: {
        en: "Career Essentials in Cybersecurity",
        fr: "Career Essentials in Cybersecurity"
      },
      logoUrl: "/microsoft.png",
      start: "",
      end: "2024",
    },
    {
      school: "Lycée Parc Chabrières",
      href: "https://www.parc-chabrieres.fr/",
      degree: {
        en: "Baccalauréat with Honors",
        fr: "Baccalauréat avec Mention"
      },
      logoUrl: "/chabrieres.png",
      start: "",
      end: "2022",
    },
  ],
  projects: [
    {
      title: {
        en: "Oracle VM Minecraft Server",
        fr: "Serveur Minecraft sur Oracle VM"
      },
      href: "/blog/oracle-vm-minecraft-server",
      dates: "April 2024",
      active: true,
      description: {
        en: "Set up a Minecraft server on Oracle Cloud's Always Free VM tier. Configured CLI-only remote access via SSH, automated backups to Amazon S3 with cron jobs, implemented port forwarding, and maintained server uptime using Tmux for persistent sessions despite connection drops.",
        fr: "Configuration d'un serveur Minecraft sur Oracle Cloud (offre gratuite). Mise en place d'accès SSH, sauvegardes automatisées vers AWS S3, redirection de ports et utilisation de Tmux pour des sessions persistantes."
      },
      technologies: [
        { en: "Linux Administration", fr: "Administration Linux" },
        { en: "Oracle Cloud", fr: "Oracle Cloud" },
        { en: "AWS S3", fr: "AWS S3" },
        { en: "Bash Scripting", fr: "Scripts Bash" },
        { en: "SSH Configuration", fr: "Configuration SSH" },
        { en: "Tmux", fr: "Tmux" },
        { en: "Cron Jobs", fr: "Tâches Cron" },
        { en: "Networking", fr: "Réseaux" },
      ],
      links: [
        {
          type: {
            en: "Blog Post",
            fr: "Article de Blog"
          },
          href: "/blog/oracle-vm-minecraft-server",
          icon: <Icons.arrowRight className="size-3" />,
        }
      ],
      image: "/project-minecraft.png",
      video: "",
    },
    {
      title: {
        en: "Remote Ad Blocker via DNS",
        fr: "Bloqueur de Publicités à Distance via DNS"
      },
      href: "/blog/remote-ad-blocker-dns-vpn",
      dates: "September 2023",
      active: true,
      description: {
        en: "Set up a Raspberry Pi with AdGuard Home and WireGuard to block ads network-wide via DNS filtering and enable secure remote access. Modified router DNS/DHCP settings with custom solutions to maintain TV services while protecting all devices.",
        fr: "Mise en place d'un Raspberry Pi avec AdGuard Home et WireGuard pour le blocage des publicités et l'accès à distance. Configuration personnalisée du DNS/DHCP pour compatibilité avec les services TV."
      },
      technologies: [
        { en: "Raspberry Pi", fr: "Raspberry Pi" },
        { en: "AdGuard Home", fr: "AdGuard Home" },
        { en: "WireGuard VPN", fr: "VPN WireGuard" },
        { en: "DNS Configuration", fr: "Configuration DNS" },
        { en: "Network Security", fr: "Sécurité Réseau" },
        { en: "Linux", fr: "Linux" },
      ],
      links: [
        {
          type: {
            en: "Blog Post",
            fr: "Article de Blog"
          },
          href: "/blog/remote-ad-blocker-dns-vpn",
          icon: <Icons.arrowRight className="size-3" />,
        }
      ],
      image: "/project-adguard.png",
      video: "",
    },
    {
      title: {
        en: "Simple Password Cracker",
        fr: "Craqueur de Mot de Passe Simple"
      },
      href: "https://github.com/leo-mathurin/simple-password-cracker",
      dates: "February 2025",
      active: true,
      description: {
        en: "Developed a Python-based CLI tool for password cracking using dictionary and brute-force attacks. Features include cracking common hash types (MD5, SHA-1, SHA-256), progress tracking, online dictionary downloads, hash generation, and custom dictionary support.",
        fr: "Développement d'un outil CLI en Python pour le craquage de mots de passe par dictionnaire et force brute. Supporte les principaux algorithmes de hachage, avec suivi de progression et téléchargement de dictionnaires."
      },
      technologies: [
        { en: "Python", fr: "Python" },
        { en: "Cryptography", fr: "Cryptographie" },
        { en: "CLI Development", fr: "Développement CLI" },
        { en: "Dictionary Attacks", fr: "Attaques par Dictionnaire" },
        { en: "Hash Algorithms", fr: "Algorithmes de Hachage" },
        { en: "Network Programming", fr: "Programmation Réseau" },
      ],
      links: [
        {
          type: {
            en: "Source",
            fr: "Code Source"
          },
          href: "https://github.com/leo-mathurin/simple-password-cracker",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/project-password-cracker.png",
      video: "",
    },
  ],
  hackathons: [
    {
      title: "Hack Western 5",
      dates: "November 23rd - 25th, 2018",
      location: "London, Ontario",
      description:
        "Developed a mobile application which delivered bedtime stories to children using augmented reality.",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-western.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [],
    },
    {
      title: "Hack The North",
      dates: "September 14th - 16th, 2018",
      location: "Waterloo, Ontario",
      description:
        "Developed a mobile application which delivers university campus wide events in real time to all students.",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-the-north.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [],
    },
    {
      title: "FirstNet Public Safety Hackathon",
      dates: "March 23rd - 24th, 2018",
      location: "San Francisco, California",
      description:
        "Developed a mobile application which communcicates a victims medical data from inside an ambulance to doctors at hospital.",
      icon: "public",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/firstnet.png",
      links: [],
    },
    {
      title: "DeveloperWeek Hackathon",
      dates: "February 3rd - 4th, 2018",
      location: "San Francisco, California",
      description:
        "Developed a web application which aggregates social media data regarding cryptocurrencies and predicts future prices.",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/developer-week.jpg",
      links: [
        {
          title: "Github",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/cryptotrends/cryptotrends",
        },
      ],
    },
    {
      title: "HackDavis",
      dates: "January 20th - 21st, 2018",
      location: "Davis, California",
      description:
        "Developed a mobile application which allocates a daily carbon emission allowance to users to move towards a sustainable environment.",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-davis.png",
      win: "Best Data Hack",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2018/white.svg",
      links: [
        {
          title: "Devpost",
          icon: <Icons.globe className="h-4 w-4" />,
          href: "https://devpost.com/software/my6footprint",
        },
        {
          title: "ML",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/Wallet6/my6footprint-machine-learning",
        },
        {
          title: "iOS",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/Wallet6/CarbonWallet",
        },
        {
          title: "Server",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/Wallet6/wallet6-server",
        },
      ],
    },
    {
      title: "ETH Waterloo",
      dates: "October 13th - 15th, 2017",
      location: "Waterloo, Ontario",
      description:
        "Developed a blockchain application for doctors and pharmacists to perform trustless transactions and prevent overdosage in patients.",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/eth-waterloo.png",
      links: [
        {
          title: "Organization",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/ethdocnet",
        },
      ],
    },
    {
      title: "Hack The North",
      dates: "September 15th - 17th, 2017",
      location: "Waterloo, Ontario",
      description:
        "Developed a virtual reality application allowing users to see themselves in third person.",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-the-north.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg",
      links: [
        {
          title: "Streamer Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/justinmichaud/htn2017",
        },
        {
          title: "Client Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/dillionverma/RTSPClient",
        },
      ],
    },
    {
      title: "Hack The 6ix",
      dates: "August 26th - 27th, 2017",
      location: "Toronto, Ontario",
      description:
        "Developed an open platform for people shipping items to same place to combine shipping costs and save money.",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-the-6ix.jpg",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg",
      links: [
        {
          title: "Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/ShareShip/ShareShip",
        },
        {
          title: "Site",
          icon: <Icons.globe className="h-4 w-4" />,
          href: "https://share-ship.herokuapp.com/",
        },
      ],
    },
    {
      title: "Stupid Hack Toronto",
      dates: "July 23rd, 2017",
      location: "Toronto, Ontario",
      description:
        "Developed a chrome extension which tracks which facebook profiles you have visited and immediately texts your girlfriend if you visited another girls page.",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/stupid-hackathon.png",
      links: [
        {
          title: "Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/nsagirlfriend/nsagirlfriend",
        },
      ],
    },
    {
      title: "Global AI Hackathon - Toronto",
      dates: "June 23rd - 25th, 2017",
      location: "Toronto, Ontario",
      description:
        "Developed a python library which can be imported to any python game and change difficulty of the game based on real time emotion of player. Uses OpenCV and webcam for facial recognition, and a custom Machine Learning Model trained on a [Kaggle Emotion Dataset](https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/leaderboard) using [Tensorflow](https://www.tensorflow.org/Tensorflow) and [Keras](https://keras.io/). This project recieved 1st place prize at the Global AI Hackathon - Toronto and was also invited to demo at [NextAI Canada](https://www.nextcanada.com/next-ai).",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/global-ai-hackathon.jpg",
      win: "1st Place Winner",
      links: [
        {
          title: "Article",
          icon: <Icons.globe className="h-4 w-4" />,
          href: "https://syncedreview.com/2017/06/26/global-ai-hackathon-in-toronto/",
        },
        {
          title: "Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/TinySamosas/",
        },
      ],
    },
    {
      title: "McGill AI for Social Innovation Hackathon",
      dates: "June 17th - 18th, 2017",
      location: "Montreal, Quebec",
      description:
        "Developed realtime facial microexpression analyzer using AI",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/ai-for-social-good.jpg",
      links: [],
    },
    {
      title: "Open Source Circular Economy Days Hackathon",
      dates: "June 10th, 2017",
      location: "Toronto, Ontario",
      description:
        "Developed a custom admin interface for food waste startup <a href='http://genecis.co/'>Genecis</a> to manage their data and provide analytics.",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/open-source-circular-economy-days.jpg",
      win: "1st Place Winner",
      links: [
        {
          title: "Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/dillionverma/genecis",
        },
      ],
    },
    {
      title: "Make School's Student App Competition 2017",
      dates: "May 19th - 21st, 2017",
      location: "International",
      description: "Improved PocketDoc and submitted to online competition",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/make-school-hackathon.png",
      win: "Top 10 Finalist | Honourable Mention",
      links: [
        {
          title: "Medium Article",
          icon: <Icons.globe className="h-4 w-4" />,
          href: "https://medium.com/make-school/the-winners-of-make-schools-student-app-competition-2017-a6b0e72f190a",
        },
        {
          title: "Devpost",
          icon: <Icons.globe className="h-4 w-4" />,
          href: "https://devpost.com/software/pocketdoc-react-native",
        },
        {
          title: "YouTube",
          icon: <Icons.youtube className="h-4 w-4" />,
          href: "https://www.youtube.com/watch?v=XwFdn5Rmx68",
        },
        {
          title: "Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/dillionverma/pocketdoc-react-native",
        },
      ],
    },
    {
      title: "HackMining",
      dates: "May 12th - 14th, 2017",
      location: "Toronto, Ontario",
      description: "Developed neural network to optimize a mining process",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-mining.png",
      links: [],
    },
    {
      title: "Waterloo Equithon",
      dates: "May 5th - 7th, 2017",
      location: "Waterloo, Ontario",
      description:
        "Developed Pocketdoc, an app in which you take a picture of a physical wound, and the app returns common solutions or cures to the injuries or diseases.",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/waterloo-equithon.png",
      links: [
        {
          title: "Devpost",
          icon: <Icons.globe className="h-4 w-4" />,
          href: "https://devpost.com/software/pocketdoc-react-native",
        },
        {
          title: "YouTube",
          icon: <Icons.youtube className="h-4 w-4" />,
          href: "https://www.youtube.com/watch?v=XwFdn5Rmx68",
        },
        {
          title: "Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/dillionverma/pocketdoc-react-native",
        },
      ],
    },
    {
      title: "SpaceApps Waterloo",
      dates: "April 28th - 30th, 2017",
      location: "Waterloo, Ontario",
      description:
        "Developed Earthwatch, a web application which allows users in a plane to virtually see important points of interest about the world below them. They can even choose to fly away from their route and then fly back if they choose. Special thanks to CesiumJS for providing open source world and plane models.",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/space-apps.png",
      links: [
        {
          title: "Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/dillionverma/earthwatch",
        },
      ],
    },
    {
      title: "MHacks 9",
      dates: "March 24th - 26th, 2017",
      location: "Ann Arbor, Michigan",
      description:
        "Developed Super Graphic Air Traffic, a VR website made to introduce people to the world of air traffic controlling. This project was built completely using THREE.js as well as a node backend server.",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/mhacks-9.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg",
      links: [
        {
          title: "Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/dillionverma/threejs-planes",
        },
      ],
    },
    {
      title: "StartHacks I",
      dates: "March 4th - 5th, 2017",
      location: "Waterloo, Ontario",
      description:
        "Developed at StartHacks 2017, Recipic is a mobile app which allows you to take pictures of ingredients around your house, and it will recognize those ingredients using ClarifAI image recognition API and return possible recipes to make. Recipic recieved 1st place at the hackathon for best pitch and hack.",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/starthacks.png",
      win: "1st Place Winner",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg",
      links: [
        {
          title: "Source (Mobile)",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/mattBlackDesign/recipic-ionic",
        },
        {
          title: "Source (Server)",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/mattBlackDesign/recipic-rails",
        },
      ],
    },
    {
      title: "QHacks II",
      dates: "February 3rd - 5th, 2017",
      location: "Kingston, Ontario",
      description:
        "Developed a mobile game which enables city-wide manhunt with random lobbies",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/qhacks.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg",
      links: [
        {
          title: "Source (Mobile)",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/dillionverma/human-huntr-react-native",
        },
        {
          title: "Source (API)",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/mattBlackDesign/human-huntr-rails",
        },
      ],
    },
    {
      title: "Terrible Hacks V",
      dates: "November 26th, 2016",
      location: "Waterloo, Ontario",
      description:
        "Developed a mock of Windows 11 with interesting notifications and functionality",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/terrible-hacks-v.png",
      links: [
        {
          title: "Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/justinmichaud/TerribleHacks2016-Windows11",
        },
      ],
    },
    {
      title: "Portal Hackathon",
      dates: "October 29, 2016",
      location: "Kingston, Ontario",
      description:
        "Developed an internal widget for uploading assignments using Waterloo's portal app",
      image:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/portal-hackathon.png",
      links: [
        {
          title: "Source",
          icon: <Icons.github className="h-4 w-4" />,
          href: "https://github.com/UWPortalSDK/crowmark",
        },
      ],
    },
  ],
} as const;
