import { BehaviorState } from "./types";

export const DEFAULT_SCORING_WEIGHTS = {
  homepage_viewed: 1,
  job_search: 5,
  category_selected: 10,
  job_viewed: 10,
  apply_clicked: 20,
} as const;

export const SUPPORTED_CATEGORIES = {
  AI_ENGINEER: "AI Engineer",
  FRONTEND_DEVELOPER: "Frontend Developer",
  BACKEND_DEVELOPER: "Backend Developer",
  FULL_STACK_DEVELOPER: "Full Stack Developer",
} as const;

export const CATEGORY_TO_STATE_KEY: Record<
  string,
  keyof Omit<BehaviorState, "totalInteractions" | "lastInteraction" | "lastUpdated">
> = {
  [SUPPORTED_CATEGORIES.AI_ENGINEER]: "aiEngineer",
  [SUPPORTED_CATEGORIES.FRONTEND_DEVELOPER]: "frontendDeveloper",
  [SUPPORTED_CATEGORIES.BACKEND_DEVELOPER]: "backendDeveloper",
  [SUPPORTED_CATEGORIES.FULL_STACK_DEVELOPER]: "fullStackDeveloper",
};

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  [SUPPORTED_CATEGORIES.AI_ENGINEER]: [
    "ai",
    "machine learning",
    "deep learning",
    "nlp",
    "llm",
    "pytorch",
    "tensorflow",
    "openai",
    "artificial intelligence",
    "model",
    "prompt engineering",
    "langchain",
    "huggingface",
    "computer vision",
    "data science",
    "data scientist",
  ],
  [SUPPORTED_CATEGORIES.FRONTEND_DEVELOPER]: [
    "frontend",
    "front-end",
    "react",
    "vue",
    "angular",
    "css",
    "html",
    "javascript",
    "typescript",
    "ui",
    "ux",
    "tailwind",
    "sass",
    "next.js",
    "nextjs",
    "web developer",
  ],
  [SUPPORTED_CATEGORIES.BACKEND_DEVELOPER]: [
    "backend",
    "back-end",
    "node",
    "django",
    "flask",
    "springboot",
    "java",
    "golang",
    "python",
    "postgres",
    "sql",
    "mongodb",
    "database",
    "api",
    "aws",
    "docker",
    "kubernetes",
    "devops",
    "server",
    "graphql",
    "redis",
    "microservices",
  ],
  [SUPPORTED_CATEGORIES.FULL_STACK_DEVELOPER]: [
    "full stack",
    "fullstack",
    "full-stack",
    "mern",
    "next.js",
    "nextjs",
    "software engineer",
  ],
};

/**
 * Maps input text (job category, title, skills, search query) to a supported candidate role category
 * using configurable keyword mapping scores.
 */
export function matchCategory(text: string): string | null {
  const normalized = text.toLowerCase().trim();
  if (!normalized) return null;

  let bestCategory: string | null = null;
  let maxScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        // Reward exact match or word-boundary matches
        if (normalized === keyword) {
          score += 5;
        } else if (
          new RegExp(`\\b${keyword}\\b`, "i").test(normalized) ||
          normalized.startsWith(keyword + " ") ||
          normalized.endsWith(" " + keyword)
        ) {
          score += 3;
        } else {
          score += 1;
        }
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}
