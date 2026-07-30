# GitHub -> Gitee synchronization

GitHub is the source of truth for this project:

`https://github.com/3201841319lmj-svg/-Personal_Digital_World-`

Committed branches, tags, files, and history are synchronized to:

`https://gitee.com/liminjunjun/personal_-digital_-world`

The GitHub Actions repository secret `GITEE_TOKEN` supplies Gitee write access.
Never commit that token or place it in a remote URL.

## Automatic synchronization

`.github/workflows/sync-gitee.yml` runs after every GitHub branch or tag push.
It also reflects force pushes and branch/tag deletions.

Run the workflow manually to synchronize every GitHub branch and tag. On its
first manual run, the previous Gitee `main` is preserved as:

`backup/openclaw-frontend-before-personal-world`

The backup branch is intentionally not part of the Personal Digital World
source repository and is not removed by full synchronization.

## Local PowerShell script

For normal daily use:

```powershell
.\scripts\sync-gitee.ps1
```

For all GitHub branches and tags:

```powershell
.\scripts\sync-gitee.ps1 -Mirror
```

If GitHub is already current and only Gitee needs repair:

```powershell
.\scripts\sync-gitee.ps1 -Mirror -SkipGitHub
```

Uncommitted files are not synchronized by Git.
