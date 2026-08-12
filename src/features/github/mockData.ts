import type { GitHubProfile, GitHubRepository } from "./types";

export const mockProfile = {
  id: 583231,
  login: "octocat",
  name: "The Octocat",
  avatarUrl: "https://github.com/images/error/octocat_happy.gif",
  htmlUrl: "https://github.com/octocat",
  bio: "GitHub's mascot and example account.",
  company: "GitHub",
  location: "San Francisco",
  blog: "https://github.blog",
  publicRepositoryCount: 8,
  followerCount: 19182,
  followingCount: 9,
  accountType: "User",
  createdAt: "2011-01-25T18:44:36Z",
} satisfies GitHubProfile;

export const mockRepositories = [
  {
    id: 1296269,
    name: "Hello-World",
    fullName: "octocat/Hello-World",
    description: "My first repository on GitHub.",
    htmlUrl: "https://github.com/octocat/Hello-World",
    language: "TypeScript",
    starCount: 2500,
    forkCount: 2100,
    isFork: false,
    isArchived: false,
    updatedAt: "2026-07-20T10:00:00Z",
  },
  {
    id: 1300192,
    name: "Spoon-Knife",
    fullName: "octocat/Spoon-Knife",
    description: null,
    htmlUrl: "https://github.com/octocat/Spoon-Knife",
    language: null,
    starCount: 13000,
    forkCount: 150000,
    isFork: false,
    isArchived: false,
    updatedAt: "2026-06-10T14:30:00Z",
  },
] satisfies GitHubRepository[];