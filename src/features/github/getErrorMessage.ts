import { GitHubApiError } from "./api/GitHubApiError";

export function getErrorMessage(error: unknown): string {
  if (error instanceof GitHubApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}