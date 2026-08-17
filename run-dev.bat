@echo off
REM Run NamStudy Prep Admin dev server
REM Kill any existing processes on port 5173
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5173"') do taskkill /pid %%a /f 2>nul || true

REM Start dev server
npm run dev
