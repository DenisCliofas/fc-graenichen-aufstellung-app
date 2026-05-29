@echo off
cd /d "%~dp0"
echo Starting FC Graenichen Roster...
start /b npm run dev
timeout /t 4 /nobreak >nul
start http://localhost:5173
echo Server running at http://localhost:5173
echo Close this window to stop the server.
pause
