[CmdletBinding()]
param(
    [switch]$Mirror,
    [switch]$SkipGitHub
)

$ErrorActionPreference = 'Stop'
$giteeUrl = 'https://gitee.com/liminjunjun/personal_-digital_-world.git'

function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)

    & git @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "git $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }
}

$repositoryRoot = (& git rev-parse --show-toplevel 2>$null)
if ($LASTEXITCODE -ne 0 -or -not $repositoryRoot) {
    throw 'Run this script from inside the Git repository.'
}

Set-Location $repositoryRoot

$remoteNames = @(& git remote)
if ($remoteNames -notcontains 'origin') {
    throw "Missing GitHub remote 'origin'."
}
if ($remoteNames -notcontains 'gitee') {
    Invoke-Git remote add gitee $giteeUrl
}

$branch = (& git branch --show-current)
if (-not $branch) {
    throw 'Detached HEAD is not supported. Check out a branch first.'
}

if (-not $SkipGitHub) {
    Write-Host "Pushing '$branch' and tags to GitHub..."
    Invoke-Git push origin $branch
    Invoke-Git push origin --tags
}

if ($Mirror) {
    Write-Host 'Fetching all GitHub branches and tags...'
    Invoke-Git fetch origin '+refs/heads/*:refs/remotes/origin/*' '+refs/tags/*:refs/tags/*' --prune
    Write-Host 'Synchronizing all GitHub branches and tags to Gitee...'
    Invoke-Git push gitee --force 'refs/remotes/origin/*:refs/heads/*'
    Invoke-Git push gitee --force 'refs/tags/*:refs/tags/*'
}
else {
    Write-Host "Pushing '$branch' and tags to Gitee..."
    Invoke-Git push gitee $branch
    Invoke-Git push gitee --tags
}

Write-Host 'GitHub -> Gitee synchronization completed.' -ForegroundColor Green
