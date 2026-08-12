import type { GitHubRepository } from "./types";

interface RepositoryCardProps {
    repository: GitHubRepository
}

function RepositoryCard({ repository }: RepositoryCardProps) {
    return (
        <article>
            <h3>
                <a
                    href={repository.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    {repository.name}
                </a>
            </h3>

            <p>{repository.fullName}</p>

            {repository.description && (
                <p>{repository.description}</p>
            )}

            <dl>
                <div>
                    <dt>Language</dt>
                    <dd>{repository.language ?? "Not specified"}</dd>
                </div>

                <div>
                    <dt>Stars</dt>
                    <dd>{repository.starCount}</dd>
                </div>

                <div>
                    <dt>Forks</dt>
                    <dd>{repository.forkCount}</dd>
                </div>

                <div>
                    <dt>Updated</dt>
                    <dd>
                        {new Date(repository.updatedAt).toLocaleDateString(
                            "en-SE",
                        )}
                    </dd>
                </div>
            </dl>

            {repository.isFork && <p>Forked repository</p>}
            {repository.isArchived && <p>Archived repository</p>}
        </article>
    );
}

export default RepositoryCard;