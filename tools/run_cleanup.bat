@echo off
setlocal EnableDelayedExpansion

REM DeenSprouts Cleanup Runner (v1201)
REM Run this .BAT from your project root or double-click it (it runs relative to script folder)

REM Move to project root (parent of tools folder)
pushd "%~dp0.."

echo ----------------------------------------------------
echo DeenSprouts Cleanup Pack v1201
echo - Remove "Sign up" links/buttons
echo - Relabel "Log in" to "Log in/Sign up" (anchors/buttons only)
echo - Clean footer to "© DeenSprouts"
echo - Create .bak backups next to changed files
echo ----------------------------------------------------
echo.

powershell -ExecutionPolicy Bypass -File "tools\cleanup_site.ps1" -Root "."
set ERR=%ERRORLEVEL%

echo.
if %ERR% NEQ 0 (
  echo Finished with errors. Check messages above.
) else (
  echo Finished successfully.
)
echo Backups created next to each modified file with .bak extension.
echo.

popd
endlocal
pause
