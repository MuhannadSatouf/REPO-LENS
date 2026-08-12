import {
  type FormEvent,
  useState,
} from "react";

type SearchFormProps = {
  onSearch: (username: string) => Promise<void>;
  isLoading: boolean;
};

function SearchForm({
  onSearch,
  isLoading,
}: SearchFormProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      return;
    }

    void onSearch(trimmedUsername);
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isLoading}
    >
      <label htmlFor="github-username">
        GitHub username
      </label>

      <input
        id="github-username"
        type="text"
        placeholder="Enter a username"
        value={username}
        onChange={(event) =>
          setUsername(event.currentTarget.value)
        }
      />

      <button type="submit">
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

export default SearchForm;