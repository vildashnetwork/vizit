@echo off
setlocal enabledelayedexpansion

set MAX_ATTEMPTS=%1
if "%MAX_ATTEMPTS%"=="" set MAX_ATTEMPTS=0
set INITIAL_BACKOFF=%2
if "%INITIAL_BACKOFF%"=="" set INITIAL_BACKOFF=5

set PROJECT_DIR=%~dp0
set LOGFILE=%PROJECT_DIR%npm-install.log
set CACHE_DIR=%PROJECT_DIR%\.npm-cache

if not exist "%LOGFILE%" echo --- npm install log started at %date% %time%> "%LOGFILE%"

echo Project: %PROJECT_DIR%
echo Log: %LOGFILE%
echo Max attempts: %MAX_ATTEMPTS% (0 = infinite)
echo Initial backoff: %INITIAL_BACKOFF% seconds
echo.

:: configure npm cache (best effort)
call npm config set cache "%CACHE_DIR%" >> "%LOGFILE%" 2>&1

set attempt=1
set backoff=%INITIAL_BACKOFF%

:LOOP_INSTALL
echo Attempt %attempt%: Running npm install --legacy-peer-deps ...
echo ----------------------------- >> "%LOGFILE%"
echo Attempt %attempt% started at %date% %time% >> "%LOGFILE%"

:: Run npm via PowerShell so we can Tee output to console and file, preserving interactive output better
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "npm install --legacy-peer-deps --no-audit --no-fund 2>&1 | Tee-Object -FilePath '%LOGFILE%'; exit $LASTEXITCODE"

set exitCode=%ERRORLEVEL%

if "%exitCode%"=="0" (
  echo.
  echo ✅ npm install succeeded on attempt %attempt%.
  echo Completed at %date% %time% >> "%LOGFILE%"
  goto END_SUCCESS
)

:: get last part of log to check for network errors
powershell -NoProfile -Command "Get-Content -Path '%LOGFILE%' -Tail 200 -Raw" > "%TEMP%\lastnpmlog.txt" 2>nul
set /p lastLog=<"%TEMP%\lastnpmlog.txt"

echo Last exit code: %exitCode% >> "%LOGFILE%"
echo Checking log for network errors ... >> "%LOGFILE%"

echo %lastLog% | findstr /i "ECONNRESET ETIMEDOUT EAI_AGAIN network read ECONNREFUSED ENOTFOUND" >nul
if %ERRORLEVEL%==0 (
  echo Network-like error detected (exit code %exitCode%). Will wait for connectivity and retry. >> "%LOGFILE%"
  echo.
  echo [Warning] Network error detected. Will wait and retry (backoff %backoff% seconds)...
) else (
  echo Non-network failure detected. See last lines of %LOGFILE% for details.
  echo ----- Last 60 lines of log: -----
  powershell -NoProfile -Command "Get-Content -Path '%LOGFILE%' -Tail 60"
  echo.
  echo If you want help diagnosing, copy the last lines above and paste them here.
  goto END_FAIL
)

:WAIT_FOR_NET
echo Checking connectivity by pinging 8.8.8.8 ...
ping -n 1 8.8.8.8 >nul
if %ERRORLEVEL%==0 (
  echo Network reachable. Stabilizing for %backoff% seconds...
  set /a t=%backoff%
  :COUNTDOWN_STAB
  if %t% LEQ 0 goto AFTER_STAB
  <nul set /p =.
  timeout /t 1 >nul
  set /a t-=1
  goto COUNTDOWN_STAB
  :AFTER_STAB
  echo.
) else (
  echo No network. Will wait %backoff% seconds and retry connectivity check...
  set /a wait=%backoff%
  set /a w=%wait%
  :COUNTDOWN
  if %w% LEQ 0 goto CHECKPING
  <nul set /p =.
  timeout /t 1 >nul
  set /a w-=1
  goto COUNTDOWN
  :CHECKPING
  ping -n 1 8.8.8.8 >nul
  if %ERRORLEVEL%==0 (
    echo Network came back.
  ) else (
    echo Still offline. Doubling backoff and retrying connectivity checks...
    set /a backoff=backoff*2
    if %backoff% GTR 300 set backoff=300
    goto WAIT_FOR_NET
  )
)

set /a attempt+=1
if %MAX_ATTEMPTS% NEQ 0 (
  if %attempt% GTR %MAX_ATTEMPTS% (
    echo Reached maximum attempts (%MAX_ATTEMPTS%). Exiting. >> "%LOGFILE%"
    echo Reached maximum attempts (%MAX_ATTEMPTS%). Exiting.
    goto END_FAIL
  )
)

echo Retrying npm install (attempt %attempt%) ... >> "%LOGFILE%"
timeout /t 1 >nul
goto LOOP_INSTALL

:END_SUCCESS
echo Success. Log is at %LOGFILE%.
exit /b 0

:END_FAIL
echo Failed. Check %LOGFILE% for details.
exit /b 1
