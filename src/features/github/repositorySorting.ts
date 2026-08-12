import { assertNever } from "../../shared/assertNever";
import type { GitHubRepository } from "./types";

export const repositorySortOptions = [
    {
        value: "updated",
        label: "Recently updated",
    },
    {
        value: "stars",
        label: "Most stars",
    },
    {
        value: "name",
        label: "Name",
    },
] as const;

//as const TypeScript preserves the literal values and treats the structure as read-only.

export type RepositorySort =
    (typeof repositorySortOptions)[number]["value"];

export function isRepositorySort(
    value: string,
): value is RepositorySort {
    return repositorySortOptions.some(
        (option) => option.value === value,
    );
}

/*
This is called a type predicate.: "value is RepositorySort"  It tells TypeScript:
If this function returns true, then value has been verified as a RepositorySort.
*/

//some() checks whether at least one array element satisfies the condition.


export function sortRepositories(
    repositories: readonly GitHubRepository[],
    sort: RepositorySort,
  ): GitHubRepository[] {
    const copiedRepositories = [...repositories];
  
    switch (sort) {
      case "stars":
        return copiedRepositories.sort(
          (first, second) =>
            second.starCount - first.starCount,
        );
  
      case "name":
        return copiedRepositories.sort(
          (first, second) =>
            first.name.localeCompare(second.name),
        );
  
      case "updated":
        return copiedRepositories.sort(
          (first, second) =>
            new Date(second.updatedAt).getTime() -
            new Date(first.updatedAt).getTime(),
        );
  
      default:
        return assertNever(sort);
    }
  }