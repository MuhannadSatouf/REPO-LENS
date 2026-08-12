import type { GitHubProfile, GitHubRepository } from "../types";
import type { GitHubProfileResponse, GitHubRepositoriesResponse, GitHubRepositoryResponse } from "./githubSchemas";

export function mapGitHubProfile(
  response: GitHubProfileResponse
): GitHubProfile {
  return {
    id: response.id,
    login: response.login,
    name: response.name,
    avatarUrl: response.avatar_url,
    htmlUrl: response.html_url,
    bio: response.bio,
    company: response.company,
    location: response.location,
    blog: response.blog || null,
    publicRepositoryCount: response.public_repos,
    followerCount: response.followers,
    followingCount: response.following,
    accountType: response.type,
    createdAt: response.created_at,
  };
}

export function mapGitHubRepository(
  response: GitHubRepositoryResponse,
): GitHubRepository {
  return {
    id: response.id,
    name: response.name,
    fullName: response.full_name,
    description: response.description,
    htmlUrl: response.html_url,
    language: response.language,
    starCount: response.stargazers_count,
    forkCount: response.forks_count,
    isFork: response.fork,
    isArchived: response.archived,
    updatedAt: response.updated_at,
  };
}

export function mapGitHubRepositories(responses: GitHubRepositoriesResponse): GitHubRepository[] {
  //rememeber :) map() transforms every array item into a new item:
  return responses.map(mapGitHubRepository);
}