import type { GitHubProfile, GitHubRepository } from "./types";

/*
Note to rememeber for me :) :
This is what called a discriminated union
The status property is the discriminator.
Every union member contains a shared property: status
But each member has a different literal value:
"idle"
"loading"
"success"
"error"
*/

export type GitHubProfileState =
    {
        status: "idle";
    }
    | {
        status: "loading";
    }
    | {
        status: "success";
        profile: GitHubProfile;
        repositories: GitHubRepository[];
    }
    | {
        status: "error";
        message: string;
    };