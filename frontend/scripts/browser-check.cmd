@echo off
setlocal
rem Stable browser-QA entry point. No installs or machine settings changes.
where node.exe >nul 2>nul
if errorlevel 1 goto portable
node.exe "%~dp0browser-check.mjs"
exit /b %errorlevel%
:portable
if not exist "%TEMP%\tpe-runtime\node-v24.22.2-win-x64\node.exe" goto missing
"%TEMP%\tpe-runtime\node-v24.22.2-win-x64\node.exe" "%~dp0browser-check.mjs"
exit /b %errorlevel%
:missing
echo Install Node.js 24 LTS and reopen your terminal, then run this command again.
exit /b 1
