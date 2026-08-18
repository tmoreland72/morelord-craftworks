param(
    [string]$Video = (Join-Path $PSScriptRoot "MorelordCraftworks-Demo-Branded-v1.mp4"),
    [string]$Music = (Join-Path $PSScriptRoot "music\TownTheme.mp3"),
    [string]$Output = (Join-Path $PSScriptRoot "MorelordCraftworks-Demo-Branded-TownTheme-v1.mp4")
)

$ErrorActionPreference = "Stop"
$ffmpeg = (Get-Command ffmpeg -ErrorAction Stop).Source
$duration = [double](& ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 $Video)
$fadeOut = [Math]::Max(0, $duration - 6)
$filter = "[1:a]aloop=loop=-1:size=2147483647,atrim=0:${duration},volume=0.34," +
    "afade=t=in:st=0:d=3,afade=t=out:st=${fadeOut}:d=6[music]"
& $ffmpeg -hide_banner -loglevel warning -y -i $Video -i $Music -filter_complex $filter `
    -map 0:v:0 -map "[music]" -c:v copy -c:a aac -b:a 192k -ac 2 -ar 48000 `
    -shortest -movflags +faststart $Output
if ($LASTEXITCODE -ne 0) { throw "FFmpeg failed with exit code $LASTEXITCODE." }
Write-Host "Created $Output"
