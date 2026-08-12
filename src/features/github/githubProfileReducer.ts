import { assertNever } from "../../shared/assertNever";
import type {
  GitHubProfile,
  GitHubRepository,
} from "./types";
import type { GitHubProfileState } from "./githubProfileState";

export type GitHubProfileAction =
  | {
      type: "searchStarted";
    }
  | {
      type: "searchSucceeded";
      profile: GitHubProfile;
      repositories: GitHubRepository[];
    }
  | {
      type: "searchFailed";
      message: string;
    };

export const initialGitHubProfileState:
  GitHubProfileState = {
    status: "idle",
  };

export function githubProfileReducer(
  state: GitHubProfileState,
  action: GitHubProfileAction,
): GitHubProfileState {
  switch (action.type) {
    case "searchStarted":
      return {
        status: "loading",
      };

    case "searchSucceeded":
      if (state.status !== "loading") {
        return state;
      }

      return {
        status: "success",
        profile: action.profile,
        repositories: action.repositories,
      };

    case "searchFailed":
      if (state.status !== "loading") {
        return state;
      }

      return {
        status: "error",
        message: action.message,
      };

    default:
      return assertNever(action);
  }
}

/*
 Request workflow
    ↓ dispatches event
Reducer
    ↓ calculates state
React
    ↓ renders interface
 */