Param(
  [string]$Root = "."
)

Write-Host "Starting cleanup in: $Root" -ForegroundColor Cyan

# Gather all HTML files
$files = Get-ChildItem -Path $Root -Recurse -Include *.html -File -ErrorAction SilentlyContinue
$opt = [System.Text.RegularExpressions.RegexOptions]::Singleline -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase

# --- Patterns ---

# Remove standalone "Sign up" anchors/buttons (common nav patterns)
$removePatterns = @(
  '<li[^>]*>\s*<a[^>]*id\s*=\s*["'']signupLink["''][^>]*>.*?<\/a>\s*<\/li>',
  '<a[^>]*id\s*=\s*["'']signupLink["''][^>]*>.*?<\/a>',
  '<li[^>]*>\s*<a[^>]*href\s*=\s*["''][^"'']*signup[^"'']*["''][^>]*>.*?<\/a>\s*<\/li>',
  '<a[^>]*href\s*=\s*["''][^"'']*signup[^"'']*["''][^>]*>.*?<\/a>',
  '<button[^>]*id\s*=\s*["'']signupLink["''][^>]*>.*?<\/button>',
  '<button[^>]*>[^<]*sign\s*up[^<]*<\/button>'
)

# Relabel login anchor/button text to "Log in/Sign up" (insides only)
$loginRelabel = @(
  '(<a\b[^>]*>\s*)(?:log\s*in|login)(\s*<\/a>)',
  '(<button\b[^>]*>\s*)(?:log\s*in|login)(\s*<\/button>)'
)

function Clean-FooterText([string]$html) {
  # Remove encoding artifacts
  $html = $html -replace 'Â|�', ''

  # Normalize copyright symbol forms to ©
  $html = $html -replace '&copy;|\(c\)|&#169;|&\#169;', '©'

  # Collapse duplicated ©
  $html = $html -replace '©\s*©', '©'

  # Normalize "© DeenSprouts" phrase (allow minor spacing variations)
  $html = $html -replace '©\s*Deen\s*Sprouts[^<]*', '© DeenSprouts'

  # Trim excessive spaces
  $html = $html -replace '\s{2,}', ' '

  return $html
}

foreach($f in $files){
  try{
    $orig = Get-Content $f.FullName -Raw
    $updated = $orig

    # 1) Remove sign up elements
    foreach($pat in $removePatterns){
      $updated = [regex]::Replace($updated, $pat, '', $opt)
    }
    # remove empty <li> leftovers
    $updated = [regex]::Replace($updated, '<li[^>]*>\s*<\/li>', '', $opt)

    # 2) Relabel login only inside anchors/buttons
    foreach($pat in $loginRelabel){
      $updated = [regex]::Replace($updated, $pat, '$1Log in/Sign up$2', $opt)
    }

    # 3) Footer cleanup
    $updated = Clean-FooterText $updated

    if($updated -ne $orig){
      Copy-Item $f.FullName "$($f.FullName).bak" -Force
      Set-Content -Path $f.FullName -Value $updated -Encoding UTF8
      Write-Host "Patched: $($f.FullName) (backup: $($f.Name).bak)" -ForegroundColor Green
    } else {
      Write-Host "No changes: $($f.FullName)"
    }
  }
  catch{
    Write-Warning "Failed to patch: $($f.FullName) — $($_.Exception.Message)"
  }
}

Write-Host "Done." -ForegroundColor Cyan
