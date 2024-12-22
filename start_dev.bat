@echo off
setlocal EnableDelayedExpansion

:: Set default port to 3000 if not provided
if "%PORT%"=="" set PORT=3000

:start
cls
echo [Command Menu]
echo r = restart server
echo t = run test suite
echo c = clear screen
echo enter = show menu
echo x = exit
echo.

:: Function to check and kill process on port
echo Checking for existing process on port %PORT%...

:: Find PID using netstat and kill it
for /f "tokens=5" %%a in ('netstat -ano ^| findstr /r ":%PORT% "') do (
    echo Killing process on port %PORT%
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 2 /nobreak >nul
)

:: Verify port is free
for /f "tokens=5" %%a in ('netstat -aon ^| find ":%PORT% "') do (
    if not "%%a"=="" (
        echo Warning: Port %PORT% is still in use. Unable to start server.
        exit /b 1
    )
)

echo Confirmed: Port %PORT% is free

:: Start Next.js server
echo Starting Next.js on port %PORT%...
npm run dev -- -p %PORT%

:: Interactive command handling
cmd /k "(for /l %%i in () do (set /p input= && if /i "!input!"=="" (cls && echo [Command Menu] && echo r = restart server && echo t = run test suite && echo c = clear screen && echo enter = show menu && echo x = exit) else if /i "!input!"=="r" (cls && npm run dev -- -p %PORT%) else if /i "!input!"=="t" (npm test) else if /i "!input!"=="c" (cls) else if /i "!input!"=="x" exit))"

endlocal
