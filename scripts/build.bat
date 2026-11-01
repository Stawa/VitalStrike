@echo off
setlocal
cd /d "%~dp0.."

call "%cd%\gradlew.bat" build %*
if errorlevel 1 (
  echo.
  echo Build failed.
  exit /b 1
)

echo.
echo Built:
dir /b build\libs\VitalStrike-*.jar
echo in %cd%\build\libs
