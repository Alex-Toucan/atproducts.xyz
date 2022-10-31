# By installing this file you agree that most of my code is very buggy and needs to be worked on.

import os
import sys
from pathlib import Path
INSTALL_DIR = '/usr/bin/'
os.system(f'sudo git clone https://github.com/Discordmodsbers/BxPP {INSTALL_DIR}')
os.system('sudo echo alias BxPP="python3 /usr/bin/BxPP/BxPP.py" >> /etc/skel/.bashrc ')
os.system('sudo source /etc/skel/.bashrc ')

os.system('clear')

