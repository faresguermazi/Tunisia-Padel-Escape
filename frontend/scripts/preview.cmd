@echo off
setlocal
cd /d "%~dp0.."
where node.exe >nul 2>nul
if errorlevel 1 goto portable
node.exe node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173 --strictPort
exit /b %errorlevel%
:portable
if not exist "%TEMP%\tpe-runtime\node-v24.22.2-win-x64\node.exe" goto missing
"%TEMP%\tpe-runtime\node-v24.22.2-win-x64\node.exe" node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173 --strictPort
exit /b %errorlevel%
:missing
echo Install Node.js 24 LTS and reopen your terminal, then run this command again.
exit /b 1
