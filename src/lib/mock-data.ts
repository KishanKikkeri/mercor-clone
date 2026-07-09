import type { Category, Company, Job, GlobalSettings } from "./types";

export const categories: Category[] = [
  {
    id: "1",
    name: "Engineering",
    slug: "engineering",
    shortDescription: "Build scalable software products and solve complex technical problems.",
    icon: "⚙️",
    featured: true,
    jobCount: 3,
  },
  {
    id: "2",
    name: "AI & Machine Learning",
    slug: "ai-machine-learning",
    shortDescription: "Push the frontier of intelligent systems and applied research.",
    icon: "🧠",
    featured: true,
    jobCount: 2,
  },
  {
    id: "3",
    name: "Design",
    slug: "design",
    shortDescription: "Craft delightful, human-centered product experiences.",
    icon: "🎨",
    featured: true,
    jobCount: 1,
  },
  {
    id: "4",
    name: "Product",
    slug: "product",
    shortDescription: "Shape strategy and lead cross-functional teams that ship.",
    icon: "🚀",
    featured: true,
    jobCount: 1,
  },
  {
    id: "5",
    name: "Marketing",
    slug: "marketing",
    shortDescription: "Tell compelling stories and grow global audiences.",
    icon: "📣",
    featured: false,
    jobCount: 1,
  },
];

export const companies: Company[] = [
  {
    id: "1",
    name: "Northwind Labs",
    slug: "northwind-labs",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Northwind&backgroundColor=1e293b",
    description:
      "Northwind Labs builds the developer platform powering the next generation of AI applications.",
    industry: "Developer Tools",
    website: "https://example.com/northwind",
    headquarters: "San Francisco, CA",
  },
  {
    id: "2",
    name: "Lumen AI",
    slug: "lumen-ai",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Lumen&backgroundColor=1e293b",
    description:
      "Lumen AI is an applied research lab building foundation models that reason with real-world data.",
    industry: "Artificial Intelligence",
    website: "https://example.com/lumen",
    headquarters: "New York, NY",
  },
  {
    id: "3",
    name: "Halcyon",
    slug: "halcyon",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Halcyon&backgroundColor=1e293b",
    description:
      "Halcyon designs financial products used by millions of people across Europe and Latin America.",
    industry: "Fintech",
    website: "https://example.com/halcyon",
    headquarters: "Remote — Global",
  },
];

const [cEng, cAI, cDesign, cProduct, cMarketing] = categories;
const [northwind, lumen, halcyon] = companies;

export const jobs: Job[] = [
  {
    id: "1",
    title: "Senior Full-Stack Engineer",
    slug: "senior-full-stack-engineer",
    shortDescription: "Lead product-facing features across our web platform and API.",
    company: northwind,
    category: cEng,
    location: "San Francisco, CA",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Senior Level",
    salaryText: "$180k – $230k · Equity",
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS"],
    aboutTheRole:
      "You'll partner with product and design to build the core surfaces of our developer platform, from onboarding to billing and observability. Expect to own features end-to-end and make architectural decisions that scale.",
    responsibilities: [
      "Design and ship user-facing features across the stack.",
      "Own reliability, performance, and quality of the systems you build.",
      "Collaborate closely with design and product on customer discovery.",
      "Mentor engineers and raise the bar on code quality.",
    ],
    requirements: [
      "5+ years of full-stack product engineering experience.",
      "Deep expertise in TypeScript and modern React.",
      "Strong grasp of relational database design.",
      "Experience shipping to production in a fast-moving environment.",
    ],
    preferredQualifications: [
      "Experience with developer-facing products.",
      "Contributions to open-source projects.",
      "Familiarity with distributed systems.",
    ],
    status: "Open",
    featured: true,
  },
  {
    id: "2",
    title: "Infrastructure Engineer",
    slug: "infrastructure-engineer",
    shortDescription: "Build the platform our engineers rely on every day.",
    company: northwind,
    category: cEng,
    location: "Remote — Americas",
    workType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    salaryText: "$150k – $190k",
    skills: ["Kubernetes", "Terraform", "Go", "AWS", "Observability"],
    aboutTheRole:
      "Own the systems that run our platform in production — from CI/CD to Kubernetes and observability. You'll shape the standards our engineers follow.",
    responsibilities: [
      "Operate and evolve our Kubernetes-based infrastructure.",
      "Improve deploy velocity and developer experience.",
      "Design incident response and reliability practices.",
    ],
    requirements: [
      "3+ years running production infrastructure.",
      "Fluency with Kubernetes and Terraform.",
      "Comfort programming in Go or a similar systems language.",
    ],
    preferredQualifications: [
      "Experience with multi-region architectures.",
      "Background in SRE or platform teams.",
    ],
    status: "Open",
    featured: true,
  },
  {
    id: "3",
    title: "Frontend Engineer, Growth",
    slug: "frontend-engineer-growth",
    shortDescription: "Ship experiments that shape how developers discover us.",
    company: halcyon,
    category: cEng,
    location: "Remote — Global",
    workType: "Remote",
    employmentType: "Contract",
    experienceLevel: "Mid Level",
    salaryText: "$110 – $140 / hour",
    skills: ["Next.js", "TypeScript", "A/B Testing", "Analytics"],
    aboutTheRole:
      "Join our growth pod to design, build, and measure experiments across our marketing surfaces and onboarding.",
    responsibilities: [
      "Build and instrument high-quality marketing pages.",
      "Design experiments and analyze results.",
      "Collaborate with brand and content on new campaigns.",
    ],
    requirements: [
      "3+ years shipping production frontend.",
      "Strong CSS and accessibility fundamentals.",
      "Experience with experimentation tooling.",
    ],
    preferredQualifications: ["Prior growth or marketing engineering experience."],
    status: "Open",
    featured: false,
  },
  {
    id: "4",
    title: "Applied ML Researcher",
    slug: "applied-ml-researcher",
    shortDescription: "Translate frontier research into production model systems.",
    company: lumen,
    category: cAI,
    location: "New York, NY",
    workType: "On-site",
    employmentType: "Full-time",
    experienceLevel: "Senior Level",
    salaryText: "$220k – $310k · Equity",
    skills: ["PyTorch", "LLMs", "Distributed Training", "Python"],
    aboutTheRole:
      "Work at the intersection of research and product. You'll design experiments, train models, and ship them into real user workflows.",
    responsibilities: [
      "Prototype and evaluate novel model architectures.",
      "Own end-to-end training and evaluation pipelines.",
      "Partner with product to launch model-driven features.",
    ],
    requirements: [
      "MS or PhD in a related field, or equivalent experience.",
      "Strong publications or shipped ML systems.",
      "Deep familiarity with modern LLM training.",
    ],
    preferredQualifications: ["Experience with RLHF or evaluation frameworks."],
    status: "Open",
    featured: true,
  },
  {
    id: "5",
    title: "ML Engineer, Evaluation",
    slug: "ml-engineer-evaluation",
    shortDescription: "Design the evaluation systems our models are measured against.",
    company: lumen,
    category: cAI,
    location: "Remote — US",
    workType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Mid Level",
    salaryText: "$170k – $220k",
    skills: ["Python", "Evaluation", "LLMs", "Data Pipelines"],
    aboutTheRole:
      "Own the evaluation stack that keeps our models honest — from dataset curation to automated scoring and human review.",
    responsibilities: [
      "Build robust benchmarks and evaluation pipelines.",
      "Partner with research on model quality goals.",
      "Design human-in-the-loop review tooling.",
    ],
    requirements: [
      "3+ years of ML or data engineering.",
      "Comfort with modern Python data tools.",
    ],
    preferredQualifications: ["Prior evaluation or trust-and-safety experience."],
    status: "Open",
    featured: false,
  },
  {
    id: "6",
    title: "Product Designer",
    slug: "product-designer",
    shortDescription: "Design the surfaces developers use every day.",
    company: northwind,
    category: cDesign,
    location: "San Francisco, CA",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Senior Level",
    salaryText: "$160k – $200k · Equity",
    skills: ["Figma", "Prototyping", "Design Systems", "UX Research"],
    aboutTheRole:
      "Lead design for our core product surfaces. You'll own end-to-end design from research through polish.",
    responsibilities: [
      "Own design for major product areas.",
      "Extend and maintain our design system.",
      "Drive research and usability studies.",
    ],
    requirements: [
      "5+ years designing complex products.",
      "Strong portfolio of shipped work.",
    ],
    preferredQualifications: ["Experience with developer or technical products."],
    status: "Open",
    featured: true,
  },
  {
    id: "7",
    title: "Product Manager, Platform",
    slug: "product-manager-platform",
    shortDescription: "Shape the roadmap for our developer platform.",
    company: northwind,
    category: cProduct,
    location: "San Francisco, CA",
    workType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Lead",
    salaryText: "$200k – $260k · Equity",
    skills: ["Product Strategy", "APIs", "Developer Tools"],
    aboutTheRole:
      "Own the platform roadmap. You'll partner with engineering and design to make our platform the default choice for builders.",
    responsibilities: [
      "Set and communicate the platform roadmap.",
      "Run customer discovery with developers.",
      "Define success metrics and drive delivery.",
    ],
    requirements: [
      "6+ years of product management, ideally in developer tools.",
      "Strong technical fluency.",
    ],
    preferredQualifications: ["Prior engineering background."],
    status: "Open",
    featured: false,
  },
  {
    id: "8",
    title: "Content Marketing Lead",
    slug: "content-marketing-lead",
    shortDescription: "Own the voice of our brand across long-form and social.",
    company: halcyon,
    category: cMarketing,
    location: "Remote — Global",
    workType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Senior Level",
    salaryText: "$140k – $180k",
    skills: ["Content Strategy", "SEO", "Editorial", "Brand"],
    aboutTheRole:
      "Define and execute our content strategy. You'll build a small team and ship stories that shape the category.",
    responsibilities: [
      "Own editorial calendar and quality.",
      "Grow organic traffic and brand awareness.",
      "Partner with product marketing on launches.",
    ],
    requirements: [
      "5+ years leading content in a technical or fintech brand.",
      "Strong writing samples.",
    ],
    preferredQualifications: ["Prior experience building a content team from scratch."],
    status: "Open",
    featured: false,
  },
];

export const globalSettings: GlobalSettings = {
  logo: "Mercor",
  navLinks: [
    { label: "Home", url: "/" },
    { label: "Jobs", url: "/jobs" },
    { label: "Categories", url: "/categories" },
    { label: "About", url: "/about" },
  ],
  footerDescription:
    "A modern job platform connecting people with work that moves them forward.",
  footerLinks: [
    { label: "Home", url: "/" },
    { label: "Browse Jobs", url: "/jobs" },
    { label: "Categories", url: "/categories" },
    { label: "About", url: "/about" },
  ],
  socialLinks: [
    { platform: "Twitter", url: "https://twitter.com" },
    { platform: "LinkedIn", url: "https://linkedin.com" },
    { platform: "GitHub", url: "https://github.com" },
  ],
  copyrightText: `© 2026 Mercor. All rights reserved.`,
};

export const openJobs = () => jobs.filter((j) => j.status === "Open");
export const featuredJobs = () => openJobs().filter((j) => j.featured);
export const featuredCategories = () => categories.filter((c) => c.featured);
export const jobsByCategorySlug = (slug: string) =>
  openJobs().filter((j) => j.category.slug === slug);
export const jobBySlug = (slug: string) => jobs.find((j) => j.slug === slug);
export const categoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);
export const similarJobs = (jobId: string, categorySlug: string, limit = 3) =>
  openJobs()
    .filter((j) => j.category.slug === categorySlug && j.id !== jobId)
    .slice(0, limit);
