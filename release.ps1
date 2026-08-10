[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$')]
    [string]$Version,

    [switch]$Prerelease,
    [switch]$Draft,
    [switch]$DryRun,
    [switch]$SkipWebsitePublish,
    [switch]$WebsiteOnly,
    [string]$WebsiteUrl,
    [string]$WebsiteToken,
    [string]$ReleaseNotesPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

function Write-Step([string]$Message) {
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Require-Command([string]$Name) {
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Required command '$Name' was not found in PATH."
    }
}

function Load-DotEnv([string]$Path) {
    if (-not (Test-Path $Path)) { return }
    foreach ($line in Get-Content $Path) {
        $trimmed = $line.Trim()
        if (-not $trimmed -or $trimmed.StartsWith('#')) { continue }
        $parts = $trimmed -split '=', 2
        if ($parts.Count -ne 2) { continue }
        $name = $parts[0].Trim()
        $value = $parts[1].Trim()
        if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
            $value = $value.Substring(1, $value.Length - 2)
        }
        if ($name -and -not [Environment]::GetEnvironmentVariable($name, 'Process')) {
            [Environment]::SetEnvironmentVariable($name, $value, 'Process')
        }
    }
}

function Invoke-Native([string]$Command, [string[]]$Arguments) {
    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$Command failed with exit code $LASTEXITCODE."
    }
}

function Get-Config {
    $path = Join-Path $ProjectRoot 'release.config.json'
    if (-not (Test-Path $path)) { throw 'release.config.json is missing.' }
    return Get-Content $path -Raw | ConvertFrom-Json
}

function Get-ReleaseNotes([string]$ExplicitPath) {
    $path = if ($ExplicitPath) { $ExplicitPath } else { "RELEASE-NOTES-$Version.md" }
    if (-not [System.IO.Path]::IsPathRooted($path)) { $path = Join-Path $ProjectRoot $path }
    if (-not (Test-Path $path)) {
        throw "Release notes are required. Create RELEASE-NOTES-$Version.md or pass -ReleaseNotesPath."
    }
    return (Resolve-Path $path).Path
}

function Assert-GitReady($Config) {
    Require-Command 'git'
    Require-Command 'gh'

    $inside = (& git rev-parse --is-inside-work-tree 2>$null).Trim()
    if ($inside -ne 'true') { throw 'This folder is not a Git repository.' }

    $branch = (& git branch --show-current).Trim()
    if ($branch -ne $Config.branch) {
        throw "Release must run from branch '$($Config.branch)'; current branch is '$branch'."
    }

    $status = & git status --porcelain
    if ($status) { throw 'Git working tree is not clean. Commit or stash changes before releasing.' }

    Invoke-Native 'git' @('fetch', 'origin', $Config.branch)
    $counts = (& git rev-list --left-right --count "HEAD...origin/$($Config.branch)").Trim() -split '\s+'
    if ($counts.Count -ge 2) {
        $ahead = [int]$counts[0]
        $behind = [int]$counts[1]
        if ($behind -gt 0) { throw "Local '$($Config.branch)' is behind origin by $behind commit(s). Pull first." }
        if ($ahead -gt 0) { throw "Local '$($Config.branch)' is ahead of origin by $ahead commit(s). Push first." }
    }

    $expected = "https://github.com/$($Config.repositoryOwner)/$($Config.repositoryName)"
    $remote = (& git remote get-url origin).Trim()
    if ($remote -notmatch [regex]::Escape("$($Config.repositoryOwner)/$($Config.repositoryName)")) {
        throw "origin does not point to expected repository $expected. Current origin: $remote"
    }

    Invoke-Native 'gh' @('auth', 'status')
}

function Update-VersionFiles($Config) {
    $manifestFile = Join-Path $ProjectRoot $Config.manifestPath
    $manifest = Get-Content $manifestFile -Raw | ConvertFrom-Json
    $manifest.version = $Version
    $manifest.url = "https://github.com/$($Config.repositoryOwner)/$($Config.repositoryName)"
    $manifest.manifest = "https://raw.githubusercontent.com/$($Config.repositoryOwner)/$($Config.repositoryName)/$($Config.branch)/module.json"
    $manifest.download = "https://github.com/$($Config.repositoryOwner)/$($Config.repositoryName)/releases/download/v$Version/$($Config.assetName)"
    $manifest | ConvertTo-Json -Depth 100 | Set-Content $manifestFile -Encoding utf8

    if ($Config.packageJsonPath) {
        $packageFile = Join-Path $ProjectRoot $Config.packageJsonPath
        if (Test-Path $packageFile) {
            $package = Get-Content $packageFile -Raw | ConvertFrom-Json
            $package.version = $Version
            $package | ConvertTo-Json -Depth 100 | Set-Content $packageFile -Encoding utf8
        }
    }
}

function New-ReleaseArchive($Config) {
    $releaseDir = Join-Path $ProjectRoot 'release'
    $stageDir = Join-Path $releaseDir $Config.moduleId
    $zipPath = Join-Path $releaseDir $Config.assetName

    if (Test-Path $releaseDir) { Remove-Item $releaseDir -Recurse -Force }
    New-Item -ItemType Directory -Path $stageDir -Force | Out-Null

    $excludeRoots = @('.git', '.github', 'node_modules', 'release', '.vscode', '.idea', 'coverage', 'build', 'dist', 'tools')
    $excludeFiles = @('.env', 'release.ps1', 'release.config.json', 'package-lock.json', 'npm-debug.log')

    foreach ($item in Get-ChildItem -Force $ProjectRoot) {
        if ($excludeRoots -contains $item.Name) { continue }
        if ($excludeFiles -contains $item.Name) { continue }
        if ($item.Name -like '*.zip') { continue }
        if ($item.Name -like 'RELEASE-NOTES-*.md') { continue }
        Copy-Item $item.FullName -Destination $stageDir -Recurse -Force
    }

    Compress-Archive -Path (Join-Path $stageDir '*') -DestinationPath $zipPath -Force
    return $zipPath
}

function Publish-WebsiteRelease($Config, [string]$NotesPath) {
    if ($SkipWebsitePublish) { return }

    Load-DotEnv (Join-Path $ProjectRoot '.env')
    $token = if ($WebsiteToken) { $WebsiteToken } elseif ($env:RELEASE_PUBLISH_TOKEN) { $env:RELEASE_PUBLISH_TOKEN } else { $null }
    if (-not $token) {
        throw 'RELEASE_PUBLISH_TOKEN is not set. Add it to .env, set the environment variable, pass -WebsiteToken, or use -SkipWebsitePublish.'
    }

    $baseUrl = if ($WebsiteUrl) { $WebsiteUrl.TrimEnd('/') } else { $Config.websiteReleaseUrl.TrimEnd('/') }
    $notes = Get-Content $NotesPath -Raw
    $releaseUrl = "https://github.com/$($Config.repositoryOwner)/$($Config.repositoryName)/releases/tag/v$Version"
    $manifestUrl = "https://raw.githubusercontent.com/$($Config.repositoryOwner)/$($Config.repositoryName)/$($Config.branch)/module.json"
    $downloadUrl = "https://github.com/$($Config.repositoryOwner)/$($Config.repositoryName)/releases/download/v$Version/$($Config.assetName)"

    $payload = @{
        productSlug = $Config.moduleId
        productName = $Config.moduleTitle
        version = $Version
        releaseNotes = $notes
        releaseUrl = $releaseUrl
        manifestUrl = $manifestUrl
        downloadUrl = $downloadUrl
        prerelease = [bool]$Prerelease
    } | ConvertTo-Json -Depth 20

    Write-Step "Publishing $($Config.moduleTitle) v$Version to $baseUrl"
    if ($DryRun) {
        Write-Host '[DryRun] Website publication skipped.' -ForegroundColor Yellow
        return
    }

    $headers = @{ Authorization = "Bearer $token"; 'X-Release-Token' = $token }
    try {
        Invoke-RestMethod -Method Post -Uri $baseUrl -Headers $headers -ContentType 'application/json' -Body $payload | Out-Null
    }
    catch {
        $detail = $_.ErrorDetails.Message
        if (-not $detail) { $detail = $_.Exception.Message }
        throw "Website release publication failed: $detail"
    }
}

$config = Get-Config
$notesPath = Get-ReleaseNotes $ReleaseNotesPath

if ($WebsiteOnly) {
    Publish-WebsiteRelease $config $notesPath
    Write-Host "`nWebsite release publication complete." -ForegroundColor Green
    exit 0
}

Assert-GitReady $config

Write-Step "Preparing $($config.moduleTitle) v$Version"
if ($DryRun) {
    Write-Host '[DryRun] Version files, commit, tag, archive, and GitHub release will not be changed.' -ForegroundColor Yellow
}
else {
    Update-VersionFiles $config
}

Write-Step 'Running project validation'
Require-Command 'node'
if (Test-Path (Join-Path $ProjectRoot 'package.json')) {
    Require-Command 'npm'
    Invoke-Native 'npm' @('run', 'check')
    Invoke-Native 'npm' @('run', 'build')
}

$zipPath = $null
if (-not $DryRun) {
    Write-Step 'Creating release archive'
    $zipPath = New-ReleaseArchive $config
    Write-Host "Created $zipPath"

    Write-Step 'Committing release metadata'
    Invoke-Native 'git' @('add', $config.manifestPath, $config.packageJsonPath, (Split-Path $notesPath -Leaf))
    Invoke-Native 'git' @('commit', '-m', "Release $Version")
    Invoke-Native 'git' @('push', 'origin', $config.branch)

    $tag = "v$Version"
    Invoke-Native 'git' @('tag', '-a', $tag, '-m', "$($config.moduleTitle) $Version")
    Invoke-Native 'git' @('push', 'origin', $tag)

    Write-Step 'Creating GitHub release'
    $ghArgs = @('release', 'create', $tag, $zipPath, '--repo', "$($config.repositoryOwner)/$($config.repositoryName)", '--title', "$($config.moduleTitle) $Version", '--notes-file', $notesPath)
    if ($Prerelease) { $ghArgs += '--prerelease' }
    if ($Draft) { $ghArgs += '--draft' }
    Invoke-Native 'gh' $ghArgs
}

Publish-WebsiteRelease $config $notesPath

Write-Host "`nRelease v$Version complete." -ForegroundColor Green
Write-Host "Foundry manifest: https://raw.githubusercontent.com/$($config.repositoryOwner)/$($config.repositoryName)/$($config.branch)/module.json"
