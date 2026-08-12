import {
  describe,
  expect,
  it,
} from "vitest";
import {
  githubProfileReducer,
  initialGitHubProfileState,
  type GitHubProfileAction,
} from "../githubProfileReducer";
import type { GitHubProfileState } from "../githubProfileState";
import {
  profileFixture,
  repositoriesFixture,
} from "./githubTestFixtures.test-utils";

describe("githubProfileReducer", () => {
  it("starts in the idle state", () => {
    expect(initialGitHubProfileState).toEqual({ status: "idle" });
  });

  it("moves from idle to loading when a search starts", () => {
    const action: GitHubProfileAction = { type: "searchStarted" };

    expect(githubProfileReducer(initialGitHubProfileState, action)).toEqual({
      status: "loading",
    });
  });

  it("moves from loading to success", () => {
    const loadingState: GitHubProfileState = { status: "loading" };
    const action: GitHubProfileAction = {
      type: "searchSucceeded",
      profile: profileFixture,
      repositories: repositoriesFixture,
    };

    expect(githubProfileReducer(loadingState, action)).toEqual({
      status: "success",
      profile: profileFixture,
      repositories: repositoriesFixture,
    });
  });

  it("moves from loading to error", () => {
    const loadingState: GitHubProfileState = { status: "loading" };
    const action: GitHubProfileAction = {
      type: "searchFailed",
      message: "GitHub user not found.",
    };

    expect(githubProfileReducer(loadingState, action)).toEqual({
      status: "error",
      message: "GitHub user not found.",
    });
  });

  it("ignores success when the state is not loading", () => {
    const action: GitHubProfileAction = {
      type: "searchSucceeded",
      profile: profileFixture,
      repositories: repositoriesFixture,
    };

    expect(githubProfileReducer(initialGitHubProfileState, action)).toBe(
      initialGitHubProfileState,
    );
  });

  it("ignores failure when the state is not loading", () => {
    const action: GitHubProfileAction = {
      type: "searchFailed",
      message: "Unexpected error.",
    };

    expect(githubProfileReducer(initialGitHubProfileState, action)).toBe(
      initialGitHubProfileState,
    );
  });
});
