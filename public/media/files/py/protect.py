import os, subprocess, sys


def get_failed():
    return subprocess.check_output("""grep "Failed password" /var/log/auth.log""", shell=True).decode('utf-8').strip()

print(get_failed())
