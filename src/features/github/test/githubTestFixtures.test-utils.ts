import type {
  GitHubProfile,
  GitHubRepository,
} from "../types";

export const profileFixture: GitHubProfile = {
  name: "octocat",
  avatarUrl: "https://avatars.githubusercontent.com/u/583231",
  bio: "GitHub mascot",
  followerCount: 100,
  followingCount: 20,
  publicRepositoryCount: 8,
  htmlUrl: "https://github.com/octocat",
  company: "comapny",
  accountType: "User",
  createdAt: "2025-01-05",
  location: null,
  id: 1234,
  login: "Muhanand",
  blog: "Blog asdasd",
};

export const repositoryFixture: GitHubRepository = {
  id: 1,
  name: "hello-world",
  fullName: "fulla-name",
  description: "A test repository",
  htmlUrl: "https://github.com/octocat/hello-world",
  starCount: 42,
  forkCount: 10,
  language: "TypeScript",
  updatedAt: "2026-08-01T12:00:00Z",
  isFork: false,
  isArchived: false,
};

export const repositoriesFixture: GitHubRepository[] = [repositoryFixture];
