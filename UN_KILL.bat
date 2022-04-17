@echo off
for /F "tokens=4*" %%a in ('netsh interface show interface ^| more +2') do C:\Windows\System32\netsh.exe interface set interface name="%%a %%b" admin = enabled
for /F "tokens=4*" %%a in ('netsh interface show interface ^| more +2') do C:\Windows\System32\netsh.exe interface set interface name="%%a%%b" admin = enabled

reg add HKLM\SYSTEM\CurrentControlSet\Services\UsbStor /v "Start" /t REG_DWORD /d "3" /f

echo Successfully unblocked Internet connection and all USB devices.

pause