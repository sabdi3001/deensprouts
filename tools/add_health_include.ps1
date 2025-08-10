Param(
  [string[]]$Files = @("index.html","video.html"),
  [string]$ScriptPath = "js/ds-health.v1202.js"
)
$include = "<script src=""$ScriptPath?v=1202""></script>"
$esc = [regex]::Escape($include)
foreach($f in $Files){
  if(-not (Test-Path $f)){ Write-Host "Skip (not found): $f"; continue }
  $html = Get-Content $f -Raw
  if($html -match $esc){ Write-Host "Already patched: $f"; continue }
  Copy-Item $f "$f.bak" -Force
  $patched = $html -replace '</body>', ($include + "`r`n</body>")
  if($patched -eq $html){ $patched = $html + "`r`n" + $include + "`r`n" }
  Set-Content -Path $f -Value $patched -Encoding UTF8
  Write-Host "Patched (health): $f"
}