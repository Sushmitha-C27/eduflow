export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface VideoItem {
  id: string;
  sectionId: string;
  title: string;
  orderIndex: number;
  isCompleted: boolean;
  locked: boolean;
  durationSeconds?: number;
  youtubeUrl?: string;
  youtubeId?: string;
}

export interface Section {
  id: string;
  subjectId: string;
  title: string;
  orderIndex: number;
  videos: VideoItem[];
}

export interface Subject {
  id: string;
  title: string;
  slug: string;
  description: string;
  isPublished: boolean;
  totalVideos?: number;
  completedVideos?: number;
  percentComplete?: number;
  category?: string;
  level?: string;
  durationLabel?: string;
  lessonCount?: number;
}

export interface VideoDetail extends VideoItem {
  description: string;
  youtubeUrl: string;
  youtubeId: string;
  sectionTitle: string;
  subjectId: string;
  subjectTitle: string;
  previousVideoId: string | null;
  nextVideoId: string | null;
  unlockReason?: string;
}

export interface VideoProgress {
  lastPositionSeconds: number;
  isCompleted: boolean;
}

export interface SubjectProgress {
  totalVideos: number;
  completedVideos: number;
  percentComplete: number;
  lastVideoId?: string;
  lastPositionSeconds?: number;
}

export interface SubjectTree {
  id: string;
  title: string;
  sections: Section[];
}

export interface AuthTokens {
  accessToken: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export type SubjectVideo = VideoItem;

export interface SubjectSection {
  id: string;
  label: string;
  title: string;
  videos: SubjectVideo[];
}

export const subjects: (Subject & {
  subtitle?: string;
  sections: SubjectSection[];
})[] = [
  // ─── 1. JavaScript Mastery ───────────────────────────────────────────
  {
    id: "javascript-mastery",
    title: "JavaScript Mastery",
    slug: "javascript-mastery",
    description: "Go from zero to confident JavaScript engineer with modern ES6+ patterns, async programming, and real-world projects.",
    isPublished: true,
    totalVideos: 4,
    completedVideos: 1,
    percentComplete: 25,
    category: "Development",
    level: "Beginner → Advanced",
    durationLabel: "6h 30m",
    lessonCount: 4,
    subtitle: "Go from zero to confident JavaScript engineer with modern ES6+ patterns.",
    sections: [
      {
        id: "js-foundations",
        label: "Section I",
        title: "Core Foundations",
        videos: [
          {
            id: "js-full-course",
            sectionId: "js-foundations",
            title: "JavaScript Full Course for Beginners",
            orderIndex: 1,
            isCompleted: true,
            locked: false,
            durationSeconds: 7 * 3600 + 20 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
            youtubeId: "PkZNo7MFNFg",
          },
          {
            id: "js-dom",
            sectionId: "js-foundations",
            title: "JavaScript DOM Manipulation",
            orderIndex: 2,
            isCompleted: false,
            locked: false,
            durationSeconds: 1 * 3600 + 30 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=5fb2aPlgoys",
            youtubeId: "5fb2aPlgoys",
          },
        ],
      },
      {
        id: "js-advanced",
        label: "Section II",
        title: "Advanced Patterns",
        videos: [
          {
            id: "js-async",
            sectionId: "js-advanced",
            title: "Async JavaScript — Promises & Fetch",
            orderIndex: 3,
            isCompleted: false,
            locked: true,
            durationSeconds: 2 * 3600 + 10 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=DHvZLI7Db8E",
            youtubeId: "DHvZLI7Db8E",
          },
          {
            id: "js-projects",
            sectionId: "js-advanced",
            title: "Build 15 JavaScript Projects",
            orderIndex: 4,
            isCompleted: false,
            locked: true,
            durationSeconds: 8 * 3600,
            youtubeUrl: "https://www.youtube.com/watch?v=3PHXvlpOkf4",
            youtubeId: "3PHXvlpOkf4",
          },
        ],
      },
    ],
  },

  // ─── 2. Python for AI & Data ─────────────────────────────────────────
  {
    id: "python-for-ai",
    title: "Python for AI & Data",
    slug: "python-for-ai",
    description: "Master Python for data analysis, machine learning, and AI applications. Build real models from scratch.",
    isPublished: true,
    totalVideos: 4,
    completedVideos: 0,
    percentComplete: 0,
    category: "Data Science",
    level: "Intermediate",
    durationLabel: "8h 15m",
    lessonCount: 4,
    subtitle: "Master Python for data analysis, machine learning, and AI applications.",
    sections: [
      {
        id: "python-basics",
        label: "Section I",
        title: "Python Fundamentals",
        videos: [
          {
            id: "python-full",
            sectionId: "python-basics",
            title: "Python for Beginners — Full Course",
            orderIndex: 1,
            isCompleted: false,
            locked: false,
            durationSeconds: 4 * 3600 + 20 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
            youtubeId: "rfscVS0vtbw",
          },
          {
            id: "python-data",
            sectionId: "python-basics",
            title: "Data Analysis with Python & Pandas",
            orderIndex: 2,
            isCompleted: false,
            locked: true,
            durationSeconds: 2 * 3600 + 5 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=r-uOLxNrNk8",
            youtubeId: "r-uOLxNrNk8",
          },
        ],
      },
      {
        id: "python-ml",
        label: "Section II",
        title: "Machine Learning",
        videos: [
          {
            id: "ml-intro",
            sectionId: "python-ml",
            title: "Machine Learning for Everybody",
            orderIndex: 3,
            isCompleted: false,
            locked: true,
            durationSeconds: 3 * 3600 + 40 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=i_LwzRVP7bg",
            youtubeId: "i_LwzRVP7bg",
          },
          {
            id: "neural-nets",
            sectionId: "python-ml",
            title: "Neural Networks from Scratch",
            orderIndex: 4,
            isCompleted: false,
            locked: true,
            durationSeconds: 4 * 3600,
            youtubeUrl: "https://www.youtube.com/watch?v=Wo5dMEP_BbI",
            youtubeId: "Wo5dMEP_BbI",
          },
        ],
      },
    ],
  },

  // ─── 3. UI/UX Design Systems ─────────────────────────────────────────
  {
    id: "uiux-design-systems",
    title: "UI/UX Design Systems",
    slug: "uiux-design-systems",
    description: "Learn to design beautiful, consistent interfaces using Figma, design tokens, and component-driven systems.",
    isPublished: true,
    totalVideos: 3,
    completedVideos: 0,
    percentComplete: 0,
    category: "Design",
    level: "Beginner",
    durationLabel: "4h 00m",
    lessonCount: 3,
    subtitle: "Design beautiful, consistent interfaces using Figma and component systems.",
    sections: [
      {
        id: "design-fundamentals",
        label: "Section I",
        title: "Design Fundamentals",
        videos: [
          {
            id: "figma-intro",
            sectionId: "design-fundamentals",
            title: "Figma UI Design Tutorial — Full Course",
            orderIndex: 1,
            isCompleted: false,
            locked: false,
            durationSeconds: 2 * 3600 + 30 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=FTFaQWZBqQ8",
            youtubeId: "FTFaQWZBqQ8",
          },
          {
            id: "ux-principles",
            sectionId: "design-fundamentals",
            title: "UX Design Principles & Best Practices",
            orderIndex: 2,
            isCompleted: false,
            locked: true,
            durationSeconds: 1 * 3600 + 20 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=wIuVvCuiJhU",
            youtubeId: "wIuVvCuiJhU",
          },
          {
            id: "design-systems",
            sectionId: "design-fundamentals",
            title: "Building a Design System from Scratch",
            orderIndex: 3,
            isCompleted: false,
            locked: true,
            durationSeconds: 1 * 3600 + 10 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=Dtd8G1bsZkE",
            youtubeId: "Dtd8G1bsZkE",
          },
        ],
      },
    ],
  },

  // ─── 4. React & Next.js ──────────────────────────────────────────────
  {
    id: "react-nextjs",
    title: "React & Next.js",
    slug: "react-nextjs",
    description: "Build production-grade web applications with React 18, Next.js 14, and modern full-stack patterns.",
    isPublished: true,
    totalVideos: 4,
    completedVideos: 0,
    percentComplete: 0,
    category: "Development",
    level: "Intermediate",
    durationLabel: "10h 00m",
    lessonCount: 4,
    subtitle: "Build production-grade apps with React 18 and Next.js 14.",
    sections: [
      {
        id: "react-core",
        label: "Section I",
        title: "React Core",
        videos: [
          {
            id: "react-full",
            sectionId: "react-core",
            title: "React JS Full Course for Beginners",
            orderIndex: 1,
            isCompleted: false,
            locked: false,
            durationSeconds: 9 * 3600 + 8 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
            youtubeId: "bMknfKXIFA8",
          },
          {
            id: "react-hooks",
            sectionId: "react-core",
            title: "React Hooks — Complete Guide",
            orderIndex: 2,
            isCompleted: false,
            locked: true,
            durationSeconds: 1 * 3600 + 40 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=f687hBjwFcM",
            youtubeId: "f687hBjwFcM",
          },
        ],
      },
      {
        id: "nextjs-core",
        label: "Section II",
        title: "Next.js Mastery",
        videos: [
          {
            id: "nextjs-full",
            sectionId: "nextjs-core",
            title: "Next.js 14 Full Course",
            orderIndex: 3,
            isCompleted: false,
            locked: true,
            durationSeconds: 4 * 3600 + 30 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=ZVnjOPwW4ZA",
            youtubeId: "ZVnjOPwW4ZA",
          },
          {
            id: "nextjs-project",
            sectionId: "nextjs-core",
            title: "Build a Full Stack App with Next.js",
            orderIndex: 4,
            isCompleted: false,
            locked: true,
            durationSeconds: 5 * 3600,
            youtubeUrl: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
            youtubeId: "wm5gMKuwSYk",
          },
        ],
      },
    ],
  },

  // ─── 5. Cloud & DevOps ───────────────────────────────────────────────
  {
    id: "cloud-devops",
    title: "Cloud & DevOps Essentials",
    slug: "cloud-devops",
    description: "Master AWS, Docker, CI/CD pipelines, and modern deployment practices used by top engineering teams.",
    isPublished: true,
    totalVideos: 3,
    completedVideos: 0,
    percentComplete: 0,
    category: "Infrastructure",
    level: "Intermediate",
    durationLabel: "5h 45m",
    lessonCount: 3,
    subtitle: "Master AWS, Docker, and CI/CD pipelines used by top engineering teams.",
    sections: [
      {
        id: "devops-core",
        label: "Section I",
        title: "DevOps Foundations",
        videos: [
          {
            id: "docker-full",
            sectionId: "devops-core",
            title: "Docker for Beginners — Full Course",
            orderIndex: 1,
            isCompleted: false,
            locked: false,
            durationSeconds: 2 * 3600 + 10 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=fqMOX6JJhGo",
            youtubeId: "fqMOX6JJhGo",
          },
          {
            id: "aws-intro",
            sectionId: "devops-core",
            title: "AWS Cloud Practitioner Full Course",
            orderIndex: 2,
            isCompleted: false,
            locked: true,
            durationSeconds: 3 * 3600 + 35 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=SOTamWNgDKc",
            youtubeId: "SOTamWNgDKc",
          },
          {
            id: "cicd-pipeline",
            sectionId: "devops-core",
            title: "CI/CD Pipeline with GitHub Actions",
            orderIndex: 3,
            isCompleted: false,
            locked: true,
            durationSeconds: 1 * 3600 + 20 * 60,
            youtubeUrl: "https://www.youtube.com/watch?v=R8_veQiYBjI",
            youtubeId: "R8_veQiYBjI",
          },
        ],
      },
    ],
  },
];