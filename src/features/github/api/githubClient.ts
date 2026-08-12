import type {
    GitHubProfile,
    GitHubRepository,
  } from "../types";
  import { GitHubApiError } from "./GitHubApiError";
  import {
    mapGitHubProfile,
    mapGitHubRepositories,
  } from "./githubMappers";
  import {
    githubProfileResponseSchema,
    githubRepositoriesResponseSchema,
  } from "./githubSchemas";

const GITHUB_API_URL = "https://api.github.com";

export async function getGitHubProfile(username: string, signal: AbortSignal): Promise<GitHubProfile> {
    const normalizedUsername = username.trim();

    if (!normalizedUsername) {
        throw new Error("A GitHub username is required.");
    }

    const response = await fetch(
        `${GITHUB_API_URL}/users/${encodeURIComponent(normalizedUsername)}`,
        {
            signal,
            headers: {
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2026-03-10",
            },
        },
    );

    if (!response.ok) {
        if (response.status === 404) {
            throw new GitHubApiError("GitHub user not found.", 404);
        }
        if (response.status === 403 || response.status === 429) {
            throw new GitHubApiError(
                "GitHub API rate limit reached. Try again later.",
                response.status,
            );
        }
        throw new GitHubApiError(
            `GitHub request failed with status ${response.status}.`,
            response.status,
        );
    }
    const json: unknown = await response.json();
    const parseResult = githubProfileResponseSchema.safeParse(json);

    if (!parseResult.success) {
        console.error(parseResult.error);
        throw new Error("Github returned an unexpected response.");
    }

    return mapGitHubProfile(parseResult.data);
}

export async function getGitHubRepositories(userName: string, signal: AbortSignal): Promise<GitHubRepository[]> {
    const normalizedUsername = userName.trim();

    if (!normalizedUsername) {
        throw new Error("A GitHub username is required.");
    }

    const response = await fetch(
        `${GITHUB_API_URL}/users/${encodeURIComponent(
            normalizedUsername,
        )}/repos?type=owner&sort=updated&direction=desc&per_page=100`,
        {
            signal,
            headers: {
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2026-03-10",
            },
        },
    );

    if (!response.ok) {
        if (response.status === 404) {
            throw new GitHubApiError("GitHub user not found.", 404);
        }
        if (response.status === 403 || response.status === 429) {
            throw new GitHubApiError("GitHub API rate limit reached. Try again later.",
                response.status);
        }
        throw new GitHubApiError(
            `GitHub repository request failed with status ${response.status}.`,
            response.status,
        );
    }

    const json: unknown = await response.json();
    const parseResult = githubRepositoriesResponseSchema.safeParse(json);

    if (!parseResult.success) {
        console.error(parseResult.error);

        throw new Error(
            "GitHub returned an unexpected repository response.",
        );
    }

    return mapGitHubRepositories(parseResult.data)
}