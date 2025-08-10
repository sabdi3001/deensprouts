Param(
  [string]$Root = ".",
  [switch]$DryRun
)

Write-Host "DeenSprouts Cleanup v1202b — Root: $Root  DryRun:$DryRun" -ForegroundColor Cyan

$files = Get-ChildItem -Path $Root -Recurse -Include *.html -File -ErrorAction SilentlyContinue
$opt = [System.Text.RegularExpressions.RegexOptions]::Singleline -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase

# ---- Patterns ----
# Remove standalone "Sign up" anchors/buttons
$removePatterns = @(
  '<li[^>]*>\s*<a[^>]*id\s*=\s*["'']signupLink["''][^>]*>.*?<\/a>\s*<\/li>',
  '<a[^>]*id\s*=\s*["'']signupLink["''][^>]*>.*?<\/a>',
  '<li[^>]*>\s*<a[^>]*href\s*=\s*["''][^"''>]*signup[^"''>]*["''][^>]*>.*?<\/a>\s*<\/li>',
  '<a[^>]*href\s*=\s*["''][^"''>]*signup[^"''>]*["''][^>]*>.*?<\/a>',
  '<button[^>]*id\s*=\s*["'']signupLink["''][^>]*>.*?<\/button>',
  '<button[^>]*>[^<]*sign\s*up[^<]*<\/button>'
)

function Normalize-Text([string]$html) {
  # Strip zero-width / BOM / word-joiners
  $html = $html -replace '[\u200B-\u200D\uFEFF\u2060]', ''
  # nbsp to space
  $html = $html -replace '&nbsp;', ' '
  $html = $html -replace '\u00A0', ' '

  # Mojibake fixes
  $html = $html -replace 'Â', ''
  $html = $html -replace '�', ''
  $html = $html -replace '–', '-'
  $html = $html -replace '—', '-'
  $html = $html -replace '[“”]', '"'
  $html = $html -replace '[‘’]', "'"

  # Collapse repeated spaces/tabs
  $html = $html -replace '[ \t]{2,}', ' '
  return $html
}

function Clean-Footer([string]$html) {
  $html = $html -replace '&copy;|\(c\)|&#169;|&\#169;', '©'
  $html = $html -replace '©\s*©', '©'
  $html = $html -replace '©\s*Deen\s*Sprouts[^<\r\n]*', '© DeenSprouts'
  $html = $html -replace '©\s*Deensprouts[^<\r\n]*', '© DeenSprouts'
  return $html
}

function Relabel-Login([string]$html) {
  # Replace text inside anchors/buttons where it is exactly "Login" or "Log in"
  $html = [regex]::Replace($html, '(<a\b[^>]*>)\s*(?:log\s*in|login)\s*(<\/a>)', '$1Log in/Sign up$2', $opt)
  $html = [regex]::Replace($html, '(<button\b[^>]*>)\s*(?:log\s*in|login)\s*(<\/button>)', '$1Log in/Sign up$2', $opt)

  # Fallback: standalone >Login< or >Log in< text nodes
  $html = [regex]::Replace($html, '>(\s*login\s*)<', '>Log in/Sign up<', $opt)
  $html = [regex]::Replace($html, '>(\s*log\s*in\s*)<', '>Log in/Sign up<', $opt)
  return $html
}

$changed = 0
foreach($f in $files){
  try{
    $orig = Get-Content $f.FullName -Raw
    $updated = $orig

    foreach($pat in $removePatterns){ $updated = [regex]::Replace($updated, $pat, '', $opt) }
    # Clean empty <li> shells
    $updated = [regex]::Replace($updated, '<li[^>]*>\s*<\/li>', '', $opt)

    $updated = Normalize-Text $updated
    $updated = Clean-Footer  $updated
    $updated = Relabel-Login $updated

    if($updated -ne $orig){
      if($DryRun){
        Write-Host "[DRY] Would patch: $($f.FullName)" -ForegroundColor Yellow
      } else {
        Copy-Item $f.FullName "$($f.FullName).bak" -Force
        Set-Content -Path $f.FullName -Value $updated -Encoding UTF8
        Write-Host "Patched: $($f.FullName) (backup: $($f.Name).bak)" -ForegroundColor Green
        $changed++
      }
    } else {
      Write-Host "No changes: $($f.FullName)"
    }
  } catch {
    Write-Warning "Failed to patch: $($f.FullName) — $($_.Exception.Message)"
  }
}

Write-Host "Done. Files changed: $changed" -ForegroundColor Cyan
