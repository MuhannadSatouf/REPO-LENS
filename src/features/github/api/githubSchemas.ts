import { z } from "zod";

export const githubProfileResponseSchema = z.object({
    id: z.number().int(),
    login: z.string(),
    name: z.string().nullable(),
    avatar_url: z.url(),
    html_url: z.url(),
    bio: z.string().nullable(),
    company: z.string().nullable(),
    location: z.string().nullable(),
    blog: z.string(),
    public_repos: z.number().int().nonnegative(),
    followers: z.number().int().nonnegative(),
    following: z.number().int().nonnegative(),
    type: z.enum(["User", "Organization", "Bot"]),
    created_at: z.string(),
});

export const githubRepositoryResponseSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    full_name: z.string(),
    description: z.string().nullable(),
    html_url: z.string().url(),
    language: z.string().nullable(),
    stargazers_count: z.number().int().nonnegative(),
    forks_count: z.number().int().nonnegative(),
    fork: z.boolean(),
    archived: z.boolean(),
    updated_at: z.string(),
})

export const githubRepositoriesResponseSchema = z.array(githubRepositoryResponseSchema);

export type GitHubRepositoryResponse = z.infer<
    typeof githubRepositoryResponseSchema>;

export type GitHubRepositoriesResponse = z.infer<
    typeof githubRepositoriesResponseSchema
>;
export type GitHubProfileResponse = z.infer<
    typeof githubProfileResponseSchema
>;