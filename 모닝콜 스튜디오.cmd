@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 모닝콜 스튜디오
node --env-file=.env server/index.mjs
if errorlevel 1 pause
