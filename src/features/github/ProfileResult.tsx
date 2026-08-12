import { assertNever } from "../../shared/assertNever";
import type { GitHubProfileState } from "./githubProfileState";
import ProfileCard from "./ProfileCard";
import RepositoryList from "./RepositoryList";

interface ProfileResultProps {
  state: GitHubProfileState;
}

function ProfileResult({
  state,
}: ProfileResultProps) {
  switch (state.status) {
    case "idle":
      return <p>Enter a GitHub username to begin.</p>;

    case "loading":
      return (
        <p role="status">
          Loading GitHub profile...
        </p>
      );

    case "error":
      return <p role="alert">{state.message}</p>;

    case "success":
      return (
        <>
          <ProfileCard profile={state.profile} />

          <RepositoryList
            repositories={state.repositories}
          />
        </>
      );

    default:
      return assertNever(state);
  }
}

export default ProfileResult;