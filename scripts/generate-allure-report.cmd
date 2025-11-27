@echo off
SET RESULTS=allure-results
SET REPORT=allure-report

REM Check Allure CLI
where allure >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Allure CLI not found.
    exit /b 1
)

REM Check if results exist
IF NOT EXIST %RESULTS% (
    echo ❌ No allure-results found. Run tests first!
    exit /b 1
)

REM Delete old report folder to prevent stale content
IF EXIST %REPORT% rmdir /s /q %REPORT%

echo 🔄 Generating Allure report...
allure generate %RESULTS% -o %REPORT% --clean

echo 🚀 Opening Allure report...
allure open %REPORT%
