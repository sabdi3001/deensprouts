# tools\patch_nav.ps1
Param(
  [string[]] $Files = @("index.html","video.html","contact.html","policy.html","upload.html","auth.html"),
  [string]   $ScriptPath = "js/nav.login-upload-guard.v1107.js",
  [switch]   $Preview
)
$include = "<script src=""$ScriptPath?v=1107""></script>"
$esc = [regex]::Escape($include)
foreach($f in $Files){
  if(-not (Test-Path $f)){ Write-Host "Skip (not found): $f"; continue }
  $html = Get-Content $f -Raw
  if($html -match $esc){ Write-Host "Already patched: $f"; continue }
  if($Preview){ Write-Host "Would patch: $f"; continue }
  Copy-Item $f "$f.bak" -Force
  $patched = $html -replace '</body>', ($include + "`r`n</body>")
  if($patched -eq $html){
    # no </body> found, append safely
    $patched = $html + "`r`n" + $include + "`r`n"
  }
  Set-Content -Path $f -Value $patched -Encoding UTF8
  Write-Host "Patched: $f"
}
