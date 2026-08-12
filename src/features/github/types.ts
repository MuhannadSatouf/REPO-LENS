export type GitHubAccountType = "User" | "Organization" | "Bot";

export interface GitHubProfile {
    readonly id: number;
    login: string;
    name: string | null;
    avatarUrl: string;
    htmlUrl: string;
    bio: string | null;
    company: string | null;
    location: string | null;
    blog: string | null;
    publicRepositoryCount: number;
    followerCount: number;
    followingCount: number;
    accountType: GitHubAccountType;
    createdAt: string;
}

export interface GitHubRepository {
    readonly id: number;
    name: string;
    fullName: string;
    description: string | null;
    htmlUrl: string;
    language: string | null;
    starCount: number;
    forkCount: number;
    isFork: boolean;
    isArchived: boolean;
    updatedAt: string;
}