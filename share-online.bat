@echo off
title THEDA E-Commerce - Share Online
cd /d "%~dp0"

echo ========================================================
echo   THEDA E-Commerce - Quick Online Sharing (Cloudflare)
echo ========================================================
echo.

echo [1/2] Starting server...
start "THEDA Next.js Server" cmd /k "npm run start"

echo [2/2] Waiting for local server to be ready...
timeout /t 3 /nobreak >nul

echo Starting Cloudflare Tunnel...
echo.
echo ********************************************************
echo  มองหาลิงก์ https://xxxx.trycloudflare.com ด้านล่างนี้
echo  แล้ว Copy ส่งให้ทุกคนเปิดดูได้ทันทีครับ!
echo  (ปิดหน้าต่างนี้เมื่อต้องการหยุดแชร์)
echo ********************************************************
echo.

"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:3000
pause
