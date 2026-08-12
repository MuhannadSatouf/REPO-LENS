import ProfileResult from "./features/github/ProfileResult";
import { useGitHubProfile } from "./features/github/useGitHubProfile";
import SearchForm from "./features/search/SearchForm";

function App() {
  const {
    state,
    search,
    isLoading,
  } = useGitHubProfile();

  return (
    <main>
      <h1>RepoLens</h1>

      <p>
        Analyze and compare GitHub developer portfolios
      </p>

      <SearchForm
        onSearch={search}
        isLoading={isLoading}
      />

      <ProfileResult state={state} />
    </main>
  );
}

export default App;