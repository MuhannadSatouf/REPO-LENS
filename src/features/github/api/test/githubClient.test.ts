import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  getGitHubProfile,
  getGitHubRepositories,
} from "../githubClient";
import { GitHubApiError } from "../GitHubApiError";
import type {
  GitHubProfileResponse,
  GitHubRepositoriesResponse,
} from "../githubSchemas";

const profileResponseFixture = {
  id: 583231,
  login: "octocat",
  name: "The Octocat",
  avatar_url: "https://avatars.githubusercontent.com/u/583231",
  html_url: "https://github.com/octocat",
  bio: "GitHub mascot",
  company: null,
  location: null,
  blog: "",
  public_repos: 8,
  followers: 100,
  following: 20,
  type: "User",
  created_at: "2011-01-25T18:44:36Z",
} satisfies GitHubProfileResponse;

const repositoriesResponseFixture = [
  {
    id: 1,
    name: "repo-lens",
    full_name: "octocat/repo-lens",
    description: "Analyze GitHub portfolios",
    html_url: "https://github.com/octocat/repo-lens",
    language: "TypeScript",
    stargazers_count: 42,
    forks_count: 10,
    fork: false,
    archived: false,
    updated_at: "2026-08-01T12:00:00Z",
  },
] satisfies GitHubRepositoriesResponse;

function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("getGitHubProfile", () => {
  it("returns a mapped profile for a valid response", async () => {
    fetchMock.mockResolvedValue(createJsonResponse(profileResponseFixture));

    const result = await getGitHubProfile("octocat", new AbortController().signal);

    expect(result).toEqual({
      id: 583231,
      login: "octocat",
      name: "The Octocat",
      avatarUrl: "https://avatars.githubusercontent.com/u/583231",
      htmlUrl: "https://github.com/octocat",
      bio: "GitHub mascot",
      company: null,
      location: null,
      blog: null,
      publicRepositoryCount: 8,
      followerCount: 100,
      followingCount: 20,
      accountType: "User",
      createdAt: "2011-01-25T18:44:36Z",
    });
  });

  it("sends the correct profile request", async () => {
    fetchMock.mockResolvedValue(createJsonResponse(profileResponseFixture));
    const controller = new AbortController();

    await getGitHubProfile("octocat", controller.signal);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/users/octocat",
      {
        signal: controller.signal,
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2026-03-10",
        },
      },
    );
  });

  it("trims and encodes the username", async () => {
    fetchMock.mockResolvedValue(createJsonResponse(profileResponseFixture));

    await getGitHubProfile("  octo/cat  ", new AbortController().signal);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/users/octo%2Fcat",
      expect.any(Object),
    );
  });

  it("rejects an empty username without calling fetch", async () => {
    await expect(
      getGitHubProfile("   ", new AbortController().signal),
    ).rejects.toThrow("A GitHub username is required.");

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws GitHubApiError when the user is not found", async () => {
    fetchMock.mockResolvedValue(createJsonResponse({ message: "Not Found" }, 404));

    const request = getGitHubProfile("missing-user", new AbortController().signal);

    await expect(request).rejects.toBeInstanceOf(GitHubApiError);
    await expect(request).rejects.toThrow("GitHub user not found.");
  });

  it.each([403, 429])("reports rate limiting for HTTP %i", async (status) => {
    fetchMock.mockResolvedValue(createJsonResponse({ message: "Rate limited" }, status));

    await expect(
      getGitHubProfile("octocat", new AbortController().signal),
    ).rejects.toThrow("GitHub API rate limit reached. Try again later.");
  });

  it("reports unexpected profile HTTP failures", async () => {
    fetchMock.mockResolvedValue(createJsonResponse({ message: "Server Error" }, 500));

    await expect(
      getGitHubProfile("octocat", new AbortController().signal),
    ).rejects.toThrow("GitHub request failed with status 500.");
  });

  it("preserves network failures", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(
      getGitHubProfile("octocat", new AbortController().signal),
    ).rejects.toThrow("Failed to fetch");
  });

  it("rejects a profile that does not match the schema", async () => {
    fetchMock.mockResolvedValue(createJsonResponse({ unexpected: true }));
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(
      getGitHubProfile("octocat", new AbortController().signal),
    ).rejects.toThrow("Github returned an unexpected response.");

    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});

describe("getGitHubRepositories", () => {
  it("returns mapped repositories for a valid response", async () => {
    fetchMock.mockResolvedValue(createJsonResponse(repositoriesResponseFixture));

    const result = await getGitHubRepositories("octocat", new AbortController().signal);

    expect(result).toEqual([
      {
        id: 1,
        name: "repo-lens",
        fullName: "octocat/repo-lens",
        description: "Analyze GitHub portfolios",
        htmlUrl: "https://github.com/octocat/repo-lens",
        language: "TypeScript",
        starCount: 42,
        forkCount: 10,
        isFork: false,
        isArchived: false,
        updatedAt: "2026-08-01T12:00:00Z",
      },
    ]);
  });

  it("sends the correct repository request", async () => {
    fetchMock.mockResolvedValue(createJsonResponse([]));
    const controller = new AbortController();

    await getGitHubRepositories("octocat", controller.signal);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/users/octocat/repos?type=owner&sort=updated&direction=desc&per_page=100",
      {
        signal: controller.signal,
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2026-03-10",
        },
      },
    );
  });

  it("returns an empty array when the user has no repositories", async () => {
    fetchMock.mockResolvedValue(createJsonResponse([]));

    await expect(
      getGitHubRepositories("octocat", new AbortController().signal),
    ).resolves.toEqual([]);
  });

  it("rejects an invalid repository response", async () => {
    fetchMock.mockResolvedValue(createJsonResponse({ repositories: [] }));
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(
      getGitHubRepositories("octocat", new AbortController().signal),
    ).rejects.toThrow("GitHub returned an unexpected repository response.");

    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("rejects an empty username without calling fetch", async () => {
    await expect(
      getGitHubRepositories("   ", new AbortController().signal),
    ).rejects.toThrow("A GitHub username is required.");

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports a missing user for repository requests", async () => {
    fetchMock.mockResolvedValue(createJsonResponse({ message: "Not Found" }, 404));

    await expect(
      getGitHubRepositories("missing-user", new AbortController().signal),
    ).rejects.toThrow("GitHub user not found.");
  });

  it.each([403, 429])("reports repository rate limiting for HTTP %i", async (status) => {
    fetchMock.mockResolvedValue(createJsonResponse({ message: "Rate limited" }, status));

    await expect(
      getGitHubRepositories("octocat", new AbortController().signal),
    ).rejects.toThrow("GitHub API rate limit reached. Try again later.");
  });

  it("reports unexpected repository HTTP failures", async () => {
    fetchMock.mockResolvedValue(createJsonResponse({ message: "Server Error" }, 500));

    await expect(
      getGitHubRepositories("octocat", new AbortController().signal),
    ).rejects.toThrow("GitHub repository request failed with status 500.");
  });
});
