export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  createdAt: string;
  permissions: string[];
}

export interface Project {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  objectives: string[];
  techStack: string[];
  status: "ACTIVE" | "COMPLETED" | "PLANNED";
  bannerURL: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  bannerURL: string;
  isPublished: boolean;
  author: User;
  createdAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  bannerURL?: string;
  referenceURLs?: string[];
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  order: number;
}

export interface Submission {
  id: string;
  userId?: string;
  projectId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: "CONTACT" | "PROJECT_INTEREST";
  isRead: boolean;
  createdAt: string;
}

export const ALL_PERMISSIONS = [
  // project
  "project.viewAll",
  "project.create",
  "project.update",
  "project.delete",

  // blog
  "blog.viewAll",
  "blog.create",
  "blog.update",
  "blog.delete",

  // news
  "news.viewAll",
  "news.create",
  "news.update",
  "news.delete",

  // service
  "service.viewAll",
  "service.create",
  "service.update",
  "service.delete",

  // user
  "user.viewAll",
  "user.create",
  "user.update",
  "user.delete",

  // submission
  "submission.view",
  "submission.update",
];
