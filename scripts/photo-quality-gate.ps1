#Requires -Version 5.1
<#
  photo-quality-gate.ps1

  Screens candidate coach photos against the 16:9 CoachPhoto banner size so that
  low-resolution downloads never reach the site.

  Why this exists
  ---------------
  The coach banner renders at roughly 400x225 CSS px inside a 3-column grid.
  On a 2x/retina display that needs ~800x450 real pixels, and we want headroom
  for HiDPI phones, so anything under ~500px on the short side looks visibly
  soft once it is stretched into the banner.

  Usage
  -----
    powershell -ExecutionPolicy Bypass -File scripts\photo-quality-gate.ps1
    powershell -ExecutionPolicy Bypass -File scripts\photo-quality-gate.ps1 -MinShortSide 675

  Tiers
  -----
    USE  -> landscape, aspect between 1.3 and 2.6, short side >= MinShortSide
    MAYBE-> landscape and usable aspect, but under the bar
    SKIP -> portrait, square, too-wide, or thumbnail-sized
#>

[CmdletBinding()]
param(
  [string]$Path,
  # 450 = 2x retina. 560 = comfortable. 675 = 3x, phone + HiDPI headroom.
  [int]$MinShortSide = 560,
  [double]$MinAspect = 1.3,
  [double]$MaxAspect = 2.6,
  [switch]$IncludeSkip
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# $PSScriptRoot is not populated while param defaults are being bound in PS 5.1,
# so resolve the default folder after binding instead.
if (-not $Path) {
  $scriptRoot = $PSScriptRoot
  if (-not $scriptRoot) { $scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path }
  $Path = Join-Path (Split-Path -Parent $scriptRoot) 'unused-photos'
}

if (-not (Test-Path -LiteralPath $Path)) {
  Write-Output "No such folder: $Path"
  exit 1
}

$files = @(Get-ChildItem -LiteralPath $Path -File |
  Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp|avif)$' })

if ($files.Count -eq 0) {
  Write-Output "No images in $Path"
  exit 0
}

$rows = foreach ($f in $files) {
  try {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $w = $img.Width; $h = $img.Height; $img.Dispose()
    if ($w -le 0 -or $h -le 0) { continue }
    $short = [Math]::Min($w, $h)
    $aspect = [Math]::Round($w / $h, 2)
    $landscape = ($h -gt 0 -and $w -gt $h -and $aspect -ge $MinAspect -and $aspect -le $MaxAspect)

    $tier = if ($landscape -and $short -ge $MinShortSide) { 'USE' }
            elseif ($landscape) { 'MAYBE' }
            else { 'SKIP' }

    [PSCustomObject]@{
      Tier     = $tier
      Name     = $f.Name
      W        = $w
      H        = $h
      Short    = $short
      Aspect   = $aspect
      MP       = [Math]::Round(($w * $h) / 1000000, 2)
      Written  = $f.LastWriteTime.ToString('MM-dd HH:mm:ss')
    }
  } catch {
    [PSCustomObject]@{ Tier='SKIP'; Name=$f.Name; W='?'; H='?'; Short='?'; Aspect='?'
                     MP='?'; Written=$f.LastWriteTime.ToString('MM-dd HH:mm:ss') }
  }
}

$rank = @{ 'USE' = 0; 'MAYBE' = 1; 'SKIP' = 2 }
$rows = $rows | Sort-Object @{ Expression = { $rank[$_.Tier] } }, @{ Expression = { [int]$_.Short }; Descending = $true }

$use   = @($rows | Where-Object Tier -eq 'USE')
$maybe = @($rows | Where-Object Tier -eq 'MAYBE')
$skip  = @($rows | Where-Object Tier -eq 'SKIP')

Write-Output ("Scanned {0} image(s) in {1}" -f $rows.Count, $Path)
Write-Output ("Bar: landscape, aspect {0}-{1}, short side >= {2}px" -f $MinAspect, $MaxAspect, $MinShortSide)
Write-Output ''

function Show-Table($items, $label) {
  if ($items.Count -eq 0) { return }
  Write-Output "=== $label ($($items.Count)) ==="
  $items | Format-Table Tier, Name, W, H, Short, Aspect, MP, Written -AutoSize | Out-String | Write-Output
}

Show-Table $use   'USE - clears the bar'
Show-Table $maybe 'MAYBE - landscape but under the bar'
if ($IncludeSkip) { Show-Table $skip 'SKIP - portrait / thumbnail / bad aspect' }

$shortfall = 3 - $use.Count
Write-Output ("Clears bar: {0}   Maybes: {1}   Skipped: {2}" -f $use.Count, $maybe.Count, $skip.Count)
if ($shortfall -gt 0) {
  Write-Output ("Need {0} more USE-grade photo(s) to cover all three coach classes." -f $shortfall)
} else {
  Write-Output 'Enough USE-grade photos to cover all three coach classes.'
}