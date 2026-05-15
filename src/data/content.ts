export type LocalizedString = { en: string; it: string };
export type LocalizedArray = { en: string[]; it: string[] };

export interface Experience {
  id: string;
  company: string;
  url?: string;
  role: LocalizedString;
  period: LocalizedString;
  location: string;
  description: LocalizedArray;
}

export interface Education {
  id: string;
  school: string;
  degree: LocalizedString;
  year: string;
  location: string;
}

export interface Certification {
  id: string;
  vendor: string;
  name: string;
  status: 'completed' | 'in-progress' | 'planned';
  year?: string;
  folder?: string;
}

export interface Project {
  id: string;
  name: string;
  description: LocalizedString;
  technologies: string[];
  url?: string;
  github?: string;
  imageUrl?: string;
}

export interface PortfolioData {
  settings?: {
    showExperience?: boolean;
    showEducation?: boolean;
    showCertifications?: boolean;
    showProjects?: boolean;
    showSkills?: boolean;
  };
  profile: {
    name: string;
    title: LocalizedString;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    website: string;
    photoUrl: string;
    cvItUrl: string;
    cvEnUrl: string;
  };
  summary: LocalizedString;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  certificationStatuses?: string[];
  projects: Project[];
  skills: {
    id?: string;
    category: LocalizedString;
    description?: LocalizedString;
    icon?: string;
    items: string[];
  }[];
  languages: {
    name: LocalizedString;
    level: string;
  }[];
}

export const initialData: PortfolioData = {
  settings: {
    showExperience: true,
    showEducation: true,
    showCertifications: true,
    showProjects: true,
    showSkills: true,
  },
  profile: {
    name: "Angelo Brambilla",
    title: {
      en: "Creative and Innovative Web Developer",
      it: "Sviluppatore Web Creativo e Innovativo"
    },
    email: "angelo.brambilla@angihomelab.com",
    phone: "+39 333 1254084",
    linkedin: "https://www.linkedin.com/in/angelo-brambilla",
    github: "https://github.com/Angelo-builds",
    website: "https://angihomelab.com",
    photoUrl: "/images/profile.jpg",
    cvItUrl: "/cv-it.pdf",
    cvEnUrl: "/cv-en.pdf"
  },
  summary: {
    en: "IT professional with a solid background in programming, networking, and systems administration. Experienced in virtualization, self-hosting, and open-source solutions, with growing expertise in DevOps practices, Kubernetes, and cloud technologies. Skilled in multiple programming languages and operating systems, and currently enhancing knowledge in Large Language Models (LLMs) and AI applications.",
    it: "Professionista IT con una solida esperienza in programmazione, networking e amministrazione di sistemi. Esperto in virtualizzazione, self-hosting e soluzioni open-source, con competenze in crescita in pratiche DevOps, Kubernetes e tecnologie cloud. Competente in vari linguaggi di programmazione e sistemi operativi, attualmente in ampliamento delle conoscenze su Large Language Models (LLM) e applicazioni AI."
  },
  experience: [
    {
      id: "exp-1",
      company: "Opiquad Spa",
      url: "https://www.opiquad.it/",
      role: { en: "TLC Provisioning Specialist", it: "Specialista Provisioning TLC" },
      period: { en: "February 2024 - Present", it: "Febbraio 2024 - Presente" },
      location: "Merate (LC) - Italy",
      description: {
        en: [
          "Provisioned and activated 1,000+ FTTC/FTTH lines, VoIP numbers, and virtual PBX systems, managing migrations and number porting for residential and business clients.",
          "Resolved provisioning issues and escalations with technical teams, consistently meeting standard SLAs."
        ],
        it: [
          "Provisioning e attivazione di oltre 1.000 linee FTTC/FTTH, numerazioni VoIP e sistemi PBX virtuali, gestendo migrazioni e portabilità per clienti business e residenziali.",
          "Risoluzione di problematiche di provisioning ed escalation con i team tecnici, garantendo il rispetto degli SLA."
        ]
      }
    },
    {
      id: "exp-2",
      company: "MediaWorld - Media Market SPA",
      role: { en: "Sales assistant", it: "Addetto alle vendite" },
      period: { en: "July 2023 - December 2023", it: "Luglio 2023 - Dicembre 2023" },
      location: "Lecco (LC), Italy",
      description: {
        en: [
          "Providing product information and tailored advice based on customer needs.",
          "Assisting customers, offering post-sale support and ensuring customer satisfaction."
        ],
        it: [
          "Fornitura di informazioni sui prodotti e consulenza personalizzata in base alle esigenze del cliente.",
          "Assistenza clienti, supporto post-vendita e garanzia della soddisfazione del cliente."
        ]
      }
    }
  ],
  education: [
    {
      id: "edu-1",
      school: "I. I. S. ANTONIO BADONI",
      degree: { 
        en: "High School Diploma - Technical Institute, Information Technology and Telecommunications",
        it: "Diploma di Istruzione Superiore \u2013 Istituto Tecnico, Informatica e Telecomunicazioni"
      },
      year: "2022",
      location: "Lecco (LC), Italy"
    }
  ],
  certifications: [
    {
      id: "cert-1",
      vendor: "Udemy",
      name: "From DevOps to Platform Engineering: Master Backstage & IDPs",
      status: "completed",
      year: "2025"
    },
    {
      id: "cert-2",
      vendor: "Udemy",
      name: "Certified Kubernetes Administrator (CKA) with Practice Test",
      status: "in-progress"
    },
    {
      id: "cert-3",
      vendor: "Udemy",
      name: "DevOps Projects | Real Time DevOps & GitOps Projects",
      status: "in-progress"
    },
    {
      id: "cert-4",
      vendor: "Udemy",
      name: "Decoding DevOps - From Basics to Advanced Projects with AI",
      status: "in-progress"
    },
    {
      id: "cert-5",
      vendor: "Udemy",
      name: "Automation with n8n: Zero to Hero",
      status: "in-progress"
    },
    {
      id: "cert-6",
      vendor: "Udemy",
      name: "AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents",
      status: "in-progress"
    }
  ],
  certificationStatuses: ['in-progress', 'completed', 'planned'],
  projects: [
    {
      id: "proj-1",
      name: "Angi Homelab",
      description: {
        en: "Personal self-hosted infrastructure and homelab featuring Proxmox, LXC, and Docker.",
        it: "Infrastruttura self-hosted personale basata su Proxmox, LXC e Docker."
      },
      technologies: ["Proxmox", "LXC", "Nginx", "Docker Compose"],
      url: "https://angihomelab.com",
    },
    {
      id: "proj-2",
      name: "Portfolio Website",
      description: {
        en: "Modern and interactive portfolio website featuring dark mode, i18n, and drag-and-drop admin capabilities.",
        it: "Sito portfolio moderno interattivo con dark mode, supporto multilingua e area admin con drag-and-drop."
      },
      technologies: ["React", "Tailwind CSS", "Zustand", "Vite"],
      github: "https://github.com/Angelo-builds",
    }
  ],
  skills: [
    {
      id: "skill-1",
      category: { en: "Cloud & DevOps", it: "Cloud e DevOps" },
      description: { en: "Implementation of integration and continuous deployment pipelines.", it: "Implementazione di pipeline di integrazione e delivery continua." },
      icon: "code",
      items: ["Kubernetes", "Proxmox", "Docker", "Cloud Computing"]
    },
    {
      id: "skill-2",
      category: { en: "Self-Hosted & Homelab", it: "Soluzioni Self-Hosted & Homelab" },
      description: { en: "Hands-on experience with self-hosted platforms and personal test environments.", it: "Esperienza pratica con piattaforme self-hosted e ambienti per test personali." },
      icon: "server",
      items: ["Nextcloud", "LXC", "Nginx", "Debian"]
    },
    {
      id: "skill-3",
      category: { en: "Automation & Scripting", it: "Automazione e Scripting" },
      description: { en: "Automating workflows, configuration management, and pipelines.", it: "Automazione di workflow, configuration management e pipeline." },
      icon: "wrench",
      items: ["Bash", "Python", "CI/CD", "GitHub Actions", "GitOps", "Argo CD", "Pipelines"]
    }
  ],
  languages: [
    {
      name: { en: "Italian", it: "Italiano" },
      level: "Mother tongue"
    },
    {
      name: { en: "English", it: "Inglese" },
      level: "B2"
    }
  ]
};
