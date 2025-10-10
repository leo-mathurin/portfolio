import { Icons } from "@/components/icons";

export const DATA = {
  name: "Léo Mathurin",
  initials: "LM",
  url: "https://leo-mathurin.vercel.app/",
  location: "Lyon, FR",
  locationLink: "https://www.google.com/maps/place/lyon",
  description: {
    en: "Tech-savvy creator and adventurer at heart, crafting impactful solutions while exploring the world. At 21, I combine creativity with fresh perspectives, bringing energy and imagination to every project. Master's student at Epitech with an eye for design.",
    fr: "Créateur passionné de tech et aventurier dans l'âme, je développe des solutions créatives tout en explorant le monde. À 21 ans, j'allie imagination et perspectives nouvelles, apportant énergie et dynamisme à chaque projet. Étudiant en Master à Epitech.",
  },
  summary: {
    en: "[Studying Information Systems at Epitech](/#education), I blend technical skills with creative energy to build meaningful projects. From [crafting user experiences](/#projects) to [developing business solutions](/#work), I bring fresh ideas and enthusiasm to every challenge. Beyond coding, I'm a 21-year-old who loves sports, discovering new places, and sharing moments with friends - bringing this same passion for exploration to my work.",
    fr: "[Étudiant en Systèmes d'Information à Epitech](/#education), je mêle compétences techniques et énergie créative pour construire des projets qui ont du sens. De la [création d'expériences utilisateur](/#projects) au [développement de solutions business](/#work), j'apporte des idées nouvelles et de l'enthousiasme à chaque défi. Au-delà du code, j'ai 21 ans et j'aime le sport, découvrir de nouveaux endroits et partager des moments entre amis - apportant cette même passion pour l'exploration à mon travail.",
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
    tel: "",
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
      company: "BPCE",
      href: "",
      badges: [],
      location: "Paris, FR",
      title: {
        en: "Data Scientist",
        fr: "Data Scientist",
      },
      logoUrl: "/bpce.jpg",
      start: "September 2025",
      end: "Current",
      description: {
        en: "Data scientist role focusing on audit processes, artificial intelligence implementations, and data analysis. Working on AI-driven solutions for financial data processing and developing automated audit tools to enhance operational efficiency.",
        fr: "Poste de data scientist axé sur les processus d'audit, l'implémentation d'intelligence artificielle et l'analyse de données. Travail sur des solutions IA pour le traitement de données financières et développement d'outils d'audit automatisés pour améliorer l'efficacité opérationnelle.",
      },
    },
    {
      company: "Freelance",
      href: "",
      badges: [],
      location: "Lyon, FR",
      title: {
        en: "Developer - Family Application Project",
        fr: "Développeur - Projet d'application familiale",
      },
      logoUrl: "",
      start: "March 2025",
      end: "September 2025",
      description: {
        en: "Deployed multi-environment cloud infrastructure. Automated scraping for event detection. Developed web interfaces and React applications. Building an innovative application for parents to discover, organize and participate in activities for their children, featuring a mobile app, professional dashboard for event organizers, and showcase website.",
        fr: "Déploiement d'infrastructure cloud multi-environnements. Automatisation du scraping pour la détection d'événements. Développement d'interfaces Web et Application en React. Développement d'une application innovante dédiée aux parents pour découvrir, organiser et participer à des activités adaptées à leurs enfants, comprenant une application mobile, un espace professionnel pour les organisateurs, et un site vitrine.",
      },
    },
    {
      company: "MGM Solutions",
      href: "https://mgmsolutions.fr",
      badges: [],
      location: "Bron, FR",
      title: {
        en: "SOC Cybersecurity Analyst (Work-Study)",
        fr: "Analyste Cybersécurité SOC (Alternance)",
      },
      logoUrl: "/mgm.png",
      start: "January 2025",
      end: "February 2025",
      description: {
        en: "Monitored information systems and performed SOC analysis. Implemented threat remediation through EDR and vulnerability analysis. Automated SOC processes using Python scripts.",
        fr: "Surveillance des systèmes d'information et analyse SOC. Mise en œuvre de solutions de remédiation via EDR et analyse de vulnérabilités. Automatisation des processus SOC avec des scripts Python.",
      },
    },
    {
      company: "Verylingua",
      href: "https://verylingua.com",
      badges: [],
      location: "Lyon, FR",
      title: {
        en: "Business Development & Web Intern",
        fr: "Stagiaire Développement Commercial & Web",
      },
      logoUrl: "/verylingua.png",
      start: "January 2024",
      end: "July 2024",
      description: {
        en: "Developed and maintained e-commerce website using Shopify Liquid. Created visual content for the website using Photoshop. Optimized UX/UI on the online platform.",
        fr: "Développement et maintenance de site e-commerce avec Shopify Liquid. Création de contenu visuel pour le site web avec Photoshop. Optimisation de l'UX/UI sur la plateforme en ligne.",
      },
    },
  ],
  education: [
    {
      school: "Epitech",
      href: "https://epitech.eu",
      degree: {
        en: "Pre-MSc Information Systems Architecture (RNCP Level 7)",
        fr: "Pré-MSc Architecture des Systèmes d'Information (RNCP Niveau 7)",
      },
      logoUrl: "/epitech.png",
      start: "2024",
      end: "2027",
    },
    {
      school: "ISC2",
      href: "https://www.credly.com/badges/231bd667-4afd-4c14-bfac-4da0ffad3074/public_url",
      degree: {
        en: "Certified in Cybersecurity (CC)",
        fr: "Certified in Cybersecurity (CC)",
      },
      logoUrl: "/isc2.png",
      start: "",
      end: "2024",
    },
    {
      school: "Epitech Digital",
      href: "https://epitech.digital/",
      degree: {
        en: "Master of Science in Business & Technology",
        fr: "Master of Science en Business & Technologie",
      },
      logoUrl: "/epitech-digital.png",
      start: "2022",
      end: "2024",
    },
    {
      school: "Microsoft",
      href: "https://www.linkedin.com/learning/certificates/02fc5ab24c07e8c7bdcfa24264e4bc96d4e47fabbbd331d9cca7df1257237bf5",
      degree: {
        en: "Career Essentials in Cybersecurity",
        fr: "Career Essentials in Cybersecurity",
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
        fr: "Baccalauréat avec Mention",
      },
      logoUrl: "/chabrieres.png",
      start: "",
      end: "2022",
    },
  ],
  projects: [
    {
      title: {
        en: "Stremlist: IMDb Watchlist Integration for Stremio",
        fr: "Stremlist: Intégration des Listes IMDb pour Stremio",
      },
      href: "https://stremlist.com",
      dates: "March 2025",
      active: true,
      newWindow: true,
      description: {
        en: "Bridge between IMDb watchlists and Stremio, deployed on Oracle Linux VPS. Built with Docker containers and bash automation scripts. Privacy-focused design with simple user onboarding, attracting +800 users within first week of launch.",
        fr: "Pont entre liste de favoris IMDb et Stremio, déployé sur VPS Oracle Linux. Développé avec des conteneurs Docker et scripts d'automatisation. Conception axée sur la confidentialité avec intégration simplifiée, attirant +800 utilisateurs en une semaine.",
      },
      technologies: [
        { en: "API Integration", fr: "Intégration API" },
        { en: "Web Development", fr: "Développement Web" },
        { en: "Docker", fr: "Docker" },
        { en: "Oracle Linux VPS", fr: "VPS Oracle Linux" },
        { en: "Bash Scripting", fr: "Scripts Bash" },
        { en: "Stremio Add-on SDK", fr: "SDK Add-on Stremio" },
        { en: "API Integration", fr: "Intégration API" },
      ],
      links: [
        {
          type: {
            en: "Website",
            fr: "Site Web",
          },
          href: "https://stremlist.com",
          icon: <Icons.globe className="size-3" />,
          newWindow: true,
        },
      ],
      image: "/stremlist.png",
      video: "",
    },
    {
      title: {
        en: "Oracle VM Minecraft Server",
        fr: "Serveur Minecraft sur Oracle VM",
      },
      href: "/blog/oracle-vm-minecraft-server",
      dates: "April 2024",
      active: true,
      description: {
        en: "Set up a Minecraft server on Oracle Cloud's Always Free VM tier. Configured CLI-only remote access via SSH, automated backups to Amazon S3 with cron jobs, implemented port forwarding, and maintained server uptime using Tmux for persistent sessions despite connection drops.",
        fr: "Configuration d'un serveur Minecraft sur Oracle Cloud (offre gratuite). Mise en place d'accès SSH, sauvegardes automatisées vers AWS S3, redirection de ports et utilisation de Tmux pour des sessions persistantes.",
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
            fr: "Article de Blog",
          },
          href: "/blog/oracle-vm-minecraft-server",
          icon: <Icons.arrowRight className="size-3" />,
        },
      ],
      image: "/project-minecraft.png",
      video: "",
    },
    {
      title: {
        en: "Remote Ad Blocker via DNS",
        fr: "Bloqueur de Publicités à Distance via DNS",
      },
      href: "/blog/remote-ad-blocker-dns-vpn",
      dates: "September 2023",
      active: true,
      description: {
        en: "Set up a Raspberry Pi with AdGuard Home and WireGuard to block ads network-wide via DNS filtering and enable secure remote access. Modified router DNS/DHCP settings with custom solutions to maintain TV services while protecting all devices.",
        fr: "Mise en place d'un Raspberry Pi avec AdGuard Home et WireGuard pour le blocage des publicités et l'accès à distance. Configuration personnalisée du DNS/DHCP pour compatibilité avec les services TV.",
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
            fr: "Article de Blog",
          },
          href: "/blog/remote-ad-blocker-dns-vpn",
          icon: <Icons.arrowRight className="size-3" />,
        },
      ],
      image: "/project-adguard.png",
      video: "",
    },
    {
      title: {
        en: "Simple Password Cracker",
        fr: "Craqueur de Mot de Passe Simple",
      },
      href: "https://github.com/leo-mathurin/simple-password-cracker",
      dates: "February 2025",
      active: true,
      description: {
        en: "Developed a Python-based CLI tool for password cracking using dictionary and brute-force attacks. Features include cracking common hash types (MD5, SHA-1, SHA-256), progress tracking, online dictionary downloads, hash generation, and custom dictionary support.",
        fr: "Développement d'un outil CLI en Python pour le craquage de mots de passe par dictionnaire et force brute. Supporte les principaux algorithmes de hachage, avec suivi de progression et téléchargement de dictionnaires.",
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
            fr: "Code Source",
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
      title: {
        en: "AWS GameDay - Ippon Technologies Lyon",
        fr: "AWS GameDay - Ippon Technologies Lyon",
      },
      dates: {
        en: "October 2025",
        fr: "Octobre 2025",
      },
      location: {
        en: "Lyon, France",
        fr: "Lyon, France",
      },
      description: {
        en: "We were a licorne selling business simulating real traffic surges. Our AWS stack had to scale to a moving and increasing request load. I led capacity scaling strategies using services like Application Load Balancer, Auto Scaling, CloudWatch metrics/alarms, and subnet/network adjustments. Among 20 teams across France, we finished first place with two of my Epitech teammates - a thrilling experience.",
        fr: "Nous étions une entreprise de vente de licornes simulant de véritables pics de trafic. Notre stack AWS devait scaler face à un volume de requêtes croissant et mouvant. J’ai piloté des stratégies de capacité avec des services comme Load Balancer, Auto Scaling et des ajustements de sous-réseaux. Parmi 20 équipes à travers la France, nous avons décroché la première place avec deux camarades d’Epitech.",
      },
      image: "/gameday-unicorn-logo.png",
      links: [],
    },
  ],
} as const;
