@echo off
for /F "tokens=4*" %%a in ('netsh interface show interface ^| more +2') do C:\Windows\System32\netsh.exe interface set interface name="%%a %%b" admin = disabled
for /F "tokens=4*" %%a in ('netsh interface show interface ^| more +2') do C:\Windows\System32\netsh.exe interface set interface name="%%a%%b" admin = disabled

reg add HKLM\SYSTEM\CurrentControlSet\Services\UsbStor /v "Start" /t REG_DWORD /d "4" /f

echo Successfully blocked Internet connections and all USB drives.

pause