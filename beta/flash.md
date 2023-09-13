### [DOWNLOAD ORIGINAL VERSION](https://archive.org/details/Bobsaver)

Getting this version of the screensaver to run isn't that complicated, but getting it to act like one is a pretty lengthy task for a screensaver IMO.

To get it to actually run, you'll first need to download and run [this registry file](https://www.screensaversplanet.com/files/help/ScreensaversPlanet_Flash_Fix.reg). You will get a warning upon running it, however I can assure you it's safe. [Here is a VirusTotal scan for the file if you don't believe me.](https://www.virustotal.com/#/file/84532c37fba28264d9a73cb86cf92a524732e2d0b189cd4cd30c84c1e4db1e84/detection)

After that you should be able to click on it and it will exactly as shown above, but what about getting it to automatically run as a screensaver? Windows doesn't allow you to run .exe files as savers anymore, so you will have to do a bit of extra set up. Before anything, you'll need a constistant place to save all these files. I recommend "C:\Windows\System32" because that's where all the screensavers are normally stored.

First, you'll need to download [Screen Launcher](http://www.softpedia.com/get/Desktop-Enhancements/Screensavers/Screen-Launcher.shtml). Yes, it's Softpedia, but if you have an ad-blocker you should be able to download it as expected. Save it to a place on your computer, then right click it and select "Install". After that, you can double click it and the program will pop up. Click "Browse..." and navigate it to where you saved the screensaver (e.g. "C:\Windows\System32\Bobsaver.exe"). After that, move Screen Launcher into "C:\Windows\System32" and you should now be able to select as a screensaver. If you're on Windows 10, see [here](http://www.thewindowsclub.com/customize-screensaver-settings-windows-10) on how to change your screensaver.

Now the screensaver works, but there's still a problem: it doesn't exit as it should. You can't move your mouse to exit it like normal. Instead you have to press "esc", which doesn't exit the program but minimizes it. We can't do anything about the mouse, but what we can do is make it so that the esc key exists the program completely. Download [AutoHotKey](https://autohotkey.com/download/) and install it. Once it's installed, create a new file titled "bobsav.ahk", then put [this code in there.](https://pastebin.com/raw/N5KVkDNZ) Create a shortcut for the file, then move it here:

> C:\Users\Owner\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup

What the script will do is bind the "esc" key to the "alt+f4" key, but only when the screensaver is running. Just double click the file and it should start running. You can now experience the screensaver as it was meant to be seen. The only remaining problem is after awhile the saver will loop back to the "Catch Spongebob" splash. AFAIK that's how it was programmed, and if not then I don't know how/bother to fix it.

**edit: as i'm now figuring out myself, the screensaver will eventually freeze after a while. I can't do anything about this either, this is inevitable due to the fact that it's a twenty year old program. this hopefully shouldn’t be much of a problem; in fact in most cases you just need to hit “enter” to fox it.**
