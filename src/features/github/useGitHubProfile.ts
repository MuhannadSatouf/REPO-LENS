import {
    useCallback,
    useEffect,
    useReducer,
    useRef,
  } from "react";
  import {
    getGitHubProfile,
    getGitHubRepositories,
  } from "./api/githubClient";
  import { getErrorMessage } from "./getErrorMessage";
  import {
    githubProfileReducer,
    initialGitHubProfileState,
  } from "./githubProfileReducer";
  import type { GitHubProfileState } from "./githubProfileState";
  
  interface UseGitHubProfileResult {
    state: GitHubProfileState;
    search: (username: string) => Promise<void>;
    isLoading: boolean;
  }
  
  export function useGitHubProfile():
    UseGitHubProfileResult {
    const [state, dispatch] = useReducer(
      githubProfileReducer,
      initialGitHubProfileState,
    );
  
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
  
        dispatch({
          type: "searchStarted",
        });
  
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
  
          dispatch({
            type: "searchSucceeded",
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
  
          dispatch({
            type: "searchFailed",
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