@echo off
setlocal
cd /d "%~dp0"
echo ==========================================
echo        IPO REALITY LAB - LOCAL SERVER
echo ==========================================
echo.
where py >nul 2>nul
if %errorlevel%==0 (
    py -3 serve_local.py
    goto :end
)
where python >nul 2>nul
if %errorlevel%==0 (
    python serve_local.py
    goto :end
)
echo Python 3 was not found.
echo Install Python 3.10 or newer from https://www.python.org/downloads/
echo During installation, select "Add Python to PATH".
pause
:end
endlocal
