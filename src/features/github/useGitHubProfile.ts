import {
    useCallback,
    useEffect,
    useRef,
    useState,
  } from "react";
  import {
    getGitHubProfile,
    getGitHubRepositories,
  } from "./api/githubClient";
  import { getErrorMessage } from "./getErrorMessage";
  import type { GitHubProfileState } from "./githubProfileState";
  
  interface UseGitHubProfileResult {
    state: GitHubProfileState;
    search: (username: string) => Promise<void>;
    isLoading: boolean;
  }
  
  export function useGitHubProfile(): UseGitHubProfileResult {
    const [state, setState] =
      useState<GitHubProfileState>({
        status: "idle",
      });
  
    const activeRequestRef =
      useRef<AbortController | null>(null);
  
    useEffect(() => {
      return () => {
        activeRequestRef.current?.abort();
      };
    }, []);
  
    const search = useCallback(
      async (username: string): Promise<void> => {
        activeRequestRef.current?.abort();
  
        const requestController = new AbortController();
        activeRequestRef.current = requestController;
  
        setState({ status: "loading" });
  
        try {
          const [profile, repositories] = await Promise.all([
            getGitHubProfile(
              username,
              requestController.signal,
            ),
            getGitHubRepositories(
              username,
              requestController.signal,
            ),
          ]);
  
          if (
            activeRequestRef.current !== requestController
          ) {
            return;
          }
  
          setState({
            status: "success",
            profile,
            repositories,
          });
        } catch (error: unknown) {
          const wasAlreadyAborted =
            requestController.signal.aborted;
  
          if (!wasAlreadyAborted) {
            requestController.abort();
          }
  
          if (
            wasAlreadyAborted ||
            activeRequestRef.current !== requestController
          ) {
            return;
          }
  
          setState({
            status: "error",
            message: getErrorMessage(error),
          });
        } finally {
          if (
            activeRequestRef.current === requestController
          ) {
            activeRequestRef.current = null;
          }
        }
      },
      [],
    );
  
    const isLoading = state.status === "loading";
  
    return {
      state,
      search,
      isLoading,
    };
  }


  /*
Notes: 
Sequential operations
      
const profile = await getGitHubProfile(username);
const repositories = await getGitHubRepositories(username);

Concurrent operations
we use concurrent execution when the operations are independent:


Promise.all

Promise<GitHubProfile> ───────────────┐
                                      ├── Promise<[profile, repositories]>
Promise<GitHubRepository[]> ──────────┘


Race condition:
Multiple asynchronous operations compete to update the same state, and the result depends on which operation finishes last.


A ref:

Survives between renders.
Stores a mutable value in .current.
Does not trigger a render when changed.
Is suitable for controllers, timers, DOM elements, and similar imperative objects.

*/