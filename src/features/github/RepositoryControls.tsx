import type { ChangeEvent } from "react";
import {
  isRepositorySort,
  repositorySortOptions,
  type RepositorySort,
} from "./repositorySorting";

interface RepositoryControlsProps {
  sort: RepositorySort;
  showForks: boolean;
  showArchived: boolean;
  onSortChange: (sort: RepositorySort) => void;
  onShowForksChange: (show: boolean) => void;
  onShowArchivedChange: (show: boolean) => void;
}

function RepositoryControls({
  sort,
  showForks,
  showArchived,
  onSortChange,
  onShowForksChange,
  onShowArchivedChange,
}: RepositoryControlsProps) {
  const handleSortChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    const value = event.currentTarget.value;

    if (isRepositorySort(value)) {
      onSortChange(value);
    }
  };

  const handleShowForksChange = ( event: ChangeEvent<HTMLInputElement> ): void => { onShowForksChange(event.currentTarget.checked); };

  const handleShowArchivedChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    onShowArchivedChange(event.currentTarget.checked);
  };

  return (
    <fieldset>
      <legend>Repository controls</legend>

      <div>
        <label htmlFor="repository-sort">
          Sort repositories
        </label>

        <select
          id="repository-sort"
          value={sort}
          onChange={handleSortChange}
        >
          {repositorySortOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <label>
        <input
          type="checkbox"
          checked={showForks}
          onChange={handleShowForksChange}
        />
        Show forks
      </label>

      <label>
        <input
          type="checkbox"
          checked={showArchived}
          onChange={handleShowArchivedChange}
        />
        Show archived repositories
      </label>
    </fieldset>
  );
}

export default RepositoryControls;