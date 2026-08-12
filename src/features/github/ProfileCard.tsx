import type { GitHubProfile } from "./types";

interface ProfileCardProps {
  profile: GitHubProfile;
}

function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <article>
      <img
        src={profile.avatarUrl}
        alt={`${profile.login}'s avatar`}
        width={120}
        height={120}
      />

      <h2>{profile.name ?? profile.login}</h2>
      <p>@{profile.login}</p>

      {profile.bio && <p>{profile.bio}</p>}

      <p>Account type: {profile.accountType}</p>

      {profile.location && <p>Location: {profile.location}</p>}
      {profile.company && <p>Company: {profile.company}</p>}

      <p>Repositories: {profile.publicRepositoryCount}</p>
      <p>Followers: {profile.followerCount}</p>
      <p>Following: {profile.followingCount}</p>

      {profile.blog && (
        <p>
          Website:{" "}
          <a href={profile.blog} target="_blank" rel="noreferrer">
            {profile.blog}
          </a>
        </p>
      )}

      <p>
        Joined:{" "}
        {new Date(profile.createdAt).toLocaleDateString("en-SE")}
      </p>

      <a href={profile.htmlUrl} target="_blank" rel="noreferrer">
        View GitHub profile
      </a>
    </article>
  );
}

export default ProfileCard;