# Cumulative CHANGELOG.md helper for the Morelord release workflow.
# Dot-sourced by ../release.ps1. Running this file directly refreshes ./CHANGELOG.md.
# The root release script removes this file from the staged module because scripts/
# is packaged and release.ps1 must not ship inside the module zip.
# In-Foundry viewers such as Big Bad Module Manager read the packaged CHANGELOG.md.

function Get-ChangelogModuleTitle {
    param([Parameter(Mandatory = $true)][string]$Root)

    $ManifestPath = Join-Path $Root 'module.json'
    if (-not (Test-Path -LiteralPath $ManifestPath -PathType Leaf)) {
        throw "module.json was not found at '$ManifestPath'."
    }
    $Manifest = [System.IO.File]::ReadAllText($ManifestPath) | ConvertFrom-Json
    $Title = [string]$Manifest.title
    if ([string]::IsNullOrWhiteSpace($Title)) {
        throw 'module.json title is required to build CHANGELOG.md.'
    }
    return $Title.Trim()
}

function Format-ChangelogText {
    param([Parameter(Mandatory = $true)][AllowEmptyString()][string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) { return '' }
    $RawLines = [regex]::Split($Text, "\r?\n")
    $Cleaned = New-Object System.Collections.Generic.List[string]
    foreach ($Line in $RawLines) {
        if ($Line -match '^#{1,6}\s' -and $Cleaned.Count -gt 0 -and -not [string]::IsNullOrWhiteSpace($Cleaned[$Cleaned.Count - 1])) {
            $Cleaned.Add('')
        }
        $Cleaned.Add($Line)
        if ($Line -match '^#{1,6}\s') { $Cleaned.Add('') }
    }
    $Spaced = New-Object System.Collections.Generic.List[string]
    foreach ($Line in $Cleaned) {
        if ($Spaced.Count -eq 0 -and [string]::IsNullOrWhiteSpace($Line)) { continue }
        if ([string]::IsNullOrWhiteSpace($Line) -and $Spaced.Count -gt 0 -and [string]::IsNullOrWhiteSpace($Spaced[$Spaced.Count - 1])) { continue }
        $Spaced.Add($Line)
    }
    while ($Spaced.Count -gt 0 -and [string]::IsNullOrWhiteSpace($Spaced[$Spaced.Count - 1])) {
        $Spaced.RemoveAt($Spaced.Count - 1)
    }
    if ($Spaced.Count -eq 0) { return '' }
    return ($Spaced -join "`n")
}

function Get-ReleaseNoteChangelogBody {
    param([Parameter(Mandatory = $true)][string]$Path)

    $UserFacing = @{
        'added' = $true
        'new' = $true
        'features' = $true
        'feature' = $true
        'improvements' = $true
        'improvement' = $true
        'improved' = $true
        'changed' = $true
        'changes' = $true
        'fixed' = $true
        'fixes' = $true
        'bug fixes' = $true
        'bugfixes' = $true
        'breaking' = $true
        'breaking changes' = $true
        'security' = $true
        'documentation' = $true
        'removed' = $true
        'deprecated' = $true
    }
    $InternalHeading = @{
        'verification' = $true
        'validation' = $true
        'testing' = $true
        'tests' = $true
        'internal' = $true
        'notes' = $true
        'note' = $true
        'compatibility' = $true
        'compatibility and verification' = $true
    }

    $Encoding = New-Object System.Text.UTF8Encoding($false)
    $RawLines = [System.IO.File]::ReadAllLines($Path, $Encoding)
    $Preface = New-Object System.Collections.Generic.List[string]
    $Body = New-Object System.Collections.Generic.List[string]
    $Mode = 'seek'
    $SawWhatChanged = $false

    foreach ($RawLine in $RawLines) {
        $Line = $RawLine.TrimEnd()
        if ($Line -match '^\s*(-{3,}|\*{3,}|_{3,})\s*$') { continue }
        if ($Line -match '^#(?!#)\s+') { continue }

        if ($Line -match '^##(?!#)\s*(.+)$') {
            $Heading = $Matches[1].Trim()
            $Key = $Heading.ToLowerInvariant()
            if ($Key -eq 'what changed') {
                $SawWhatChanged = $true
                $Mode = 'what'
                continue
            }
            if ($SawWhatChanged -or $Mode -eq 'what' -or $Mode -eq 'skip3') {
                $Mode = 'skip'
                continue
            }
            if ($UserFacing.ContainsKey($Key)) {
                $Mode = 'legacy'
                $Body.Add("### $Heading")
                continue
            }
            $Mode = 'skip'
            continue
        }

        if ($Mode -eq 'seek') {
            if ($Line -match '^(\s*)[-*+]\s+(.*)$') {
                $Preface.Add("$($Matches[1])- $($Matches[2])")
            }
            continue
        }

        if ($Mode -eq 'skip') { continue }

        if ($Line -match '^###(?!#)\s*(.+)$') {
            $Heading = $Matches[1].Trim()
            $Key = $Heading.ToLowerInvariant()
            if ($InternalHeading.ContainsKey($Key)) {
                $Mode = 'skip3'
                continue
            }
            if ($Mode -eq 'skip3') { $Mode = 'what' }
            $Line = "### $Heading"
        }
        elseif ($Mode -eq 'skip3') { continue }

        if ($Line -match '^(\s*)[-*+]\s+(.*)$') {
            $Body.Add("$($Matches[1])- $($Matches[2])")
            continue
        }
        if ($Line -match '^(#{1,6})([^#\s].*)$') {
            $Body.Add("$($Matches[1]) $($Matches[2].Trim())")
            continue
        }
        $Body.Add($Line)
    }

    $Combined = New-Object System.Collections.Generic.List[string]
    if (-not $SawWhatChanged) {
        foreach ($Item in $Preface) { $Combined.Add($Item) }
    }
    foreach ($Item in $Body) { $Combined.Add($Item) }
    return (Format-ChangelogText -Text ($Combined -join "`n"))
}

function New-ChangelogMarkdown {
    param([Parameter(Mandatory = $true)][string]$Root)

    $Title = Get-ChangelogModuleTitle -Root $Root
    $NotesDir = Join-Path $Root 'release-notes'
    if (-not (Test-Path -LiteralPath $NotesDir -PathType Container)) {
        throw "release-notes directory was not found at '$NotesDir'."
    }

    $Entries = New-Object System.Collections.Generic.List[object]
    foreach ($File in Get-ChildItem -LiteralPath $NotesDir -Filter 'RELEASE-NOTES-*.md' -File) {
        if ($File.Name -match '^RELEASE-NOTES-(\d+\.\d+\.\d+)\.md$') {
            $Entries.Add([pscustomobject]@{
                Label = $Matches[1]
                Version = [version]$Matches[1]
                Path = $File.FullName
            })
        }
    }
    $Sorted = @($Entries.ToArray() | Sort-Object -Property Version -Descending)
    if ($Sorted.Count -eq 0) {
        throw 'No release-notes/RELEASE-NOTES-<version>.md files were found.'
    }

    $Chunks = New-Object System.Collections.Generic.List[string]
    $Chunks.Add("# $Title Changelog")
    $Chunks.Add('')
    foreach ($Entry in $Sorted) {
        $Chunks.Add("## $($Entry.Label)")
        $Chunks.Add('')
        $Body = (Get-ReleaseNoteChangelogBody -Path $Entry.Path).Trim()
        if (-not [string]::IsNullOrWhiteSpace($Body)) {
            $Chunks.Add($Body)
            $Chunks.Add('')
        }
    }

    $Text = (($Chunks -join "`n").TrimEnd()) + "`n"
    $Text = [regex]::Replace($Text, "(\r?\n){3,}", "`n`n")
    if ($Text -match '(?m)^\s*(-{3,}|\*{3,}|_{3,})\s*$') {
        throw 'Generated CHANGELOG.md contains a horizontal rule.'
    }
    if ($Text -match '(?m)^#{1,6}[^#\s]') {
        throw 'Generated CHANGELOG.md has a heading without a space after #.'
    }
    if ($Text -match '(?m)^\s*[*+]\s+') {
        throw 'Generated CHANGELOG.md must use "- " bullets.'
    }
    return $Text
}

function Update-Changelog {
    param(
        [Parameter(Mandatory = $true)][string]$Root,
        [switch]$Preview,
        [string]$Text
    )

    if ([string]::IsNullOrEmpty($Text)) {
        $Text = New-ChangelogMarkdown -Root $Root
    }
    $Path = Join-Path $Root 'CHANGELOG.md'
    if (Test-Path -LiteralPath $Path -PathType Leaf) {
        $Existing = [System.IO.File]::ReadAllText($Path)
        if ($Existing -eq $Text) { return $false }
    }
    if ($Preview) { return $true }

    $Encoding = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Text, $Encoding)
    return $true
}

function Write-Changelog {
    param(
        [Parameter(Mandatory = $true)][string]$Root,
        [switch]$Preview
    )
    Update-Changelog -Root $Root -Preview:$Preview
}

if ($MyInvocation.InvocationName -ne '.') {
    $ErrorActionPreference = 'Stop'
    $ChangelogRoot = Split-Path -Parent $PSScriptRoot
    $ValidateOnly = $args -contains '-ValidateOnly'
    $Changed = Update-Changelog -Root $ChangelogRoot
    if ($Changed) {
        Write-Host 'Updated CHANGELOG.md.'
    }
    else {
        Write-Host 'CHANGELOG.md is already up to date.'
    }
    if ($ValidateOnly -or $args.Count -eq 0) { exit 0 }
    Write-Host 'CHANGELOG.md was refreshed. Publish the module with ..\release.ps1.'
    exit 0
}
