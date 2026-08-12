import { useState } from "react";
import RepositoryCard from "./RepositoryCard";
import RepositoryControls from "./RepositoryControls";
import {
    sortRepositories,
    type RepositorySort,
} from "./repositorySorting";
import type { GitHubRepository } from "./types";

interface RepositoryListProps {
    repositories: readonly GitHubRepository[];
}

/*
A useful rule is: If a value can be calculated from existing props or state during rendering, 
it usually should not become additional state. 
that why I do not have filteredRepositories, visibleRepositories and totalStars
 
repositories + filters + sorting choice
               ↓
      visibleRepositories
               ↓
          totalStars
*/

function RepositoryList({
    repositories,
}: RepositoryListProps) {
    const [sort, setSort] =
        useState<RepositorySort>("updated");

    const [showForks, setShowForks] = useState(true);
    const [showArchived, setShowArchived] = useState(true);

    const filteredRepositories = repositories.filter(
        (repository) => {
            if (!showForks && repository.isFork) {
                return false;
            }

            if (!showArchived && repository.isArchived) {
                return false;
            }

            return true;
        },
    );

    const visibleRepositories = sortRepositories(
        filteredRepositories,
        sort,
    );

    const totalStars = visibleRepositories.reduce(
        (total, repository) =>
            total + repository.starCount,
        0,
    );

    return (
        <section>
            <h2>Repositories</h2>

            <p>
                Showing {visibleRepositories.length} of{" "}
                {repositories.length} repositories
            </p>

            <p>
                Total stars in displayed repositories:{" "}
                {totalStars}
            </p>

            <RepositoryControls
                sort={sort}
                showForks={showForks}
                showArchived={showArchived}
                onSortChange={setSort}
                onShowForksChange={setShowForks}
                onShowArchivedChange={setShowArchived}
            />

            {visibleRepositories.length === 0 ? (
                <p>No repositories match the selected filters.</p>
            ) : (
                <div>
                    {visibleRepositories.map((repository) => (
                        <RepositoryCard
                            key={repository.id}
                            repository={repository}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default RepositoryList;