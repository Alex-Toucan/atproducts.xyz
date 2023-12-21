import discord
from discord.ext import commands
from discord.utils import get
import os, asyncio
from datetime import datetime
import string, random
from discord.ext.commands import has_permissions, MissingPermissions
import hashlib, requests, os

cl = discord.Client()
client = commands.Bot(command_prefix="!!")
TOKEN="TOKEN-HERE"

os.system('cls' if os.name == 'nt' else 'clear')
members = 0

tip = ["?rank notifications get pinged for announcements", "Help us by reacting to polls", "The bot is online ~2 h/day", "nasus is not the owner", "the bot is complete spaghetti code"]

try:
    @client.event
    async def on_ready():
        print(f"The Scripting Console [ONLINE]")
        guild_list = client.guilds
        for i in guild_list:
            print(f"Guild ID: {i.id} / Guild Name: {i.name}")
        await client.change_presence(activity=discord.Game(name=''))
    #@client.event
    #async def on_guild_add():
        #guild = ""
        #servers = bot.guilds
        #await client.leave():
        


        await asyncio.sleep(1.2)
        await e1.edit(embed=embed4)
    @client.command()
    @has_permissions(manage_roles=True, ban_members=True)
    async def vipfile(message):
        embed=discord.Embed(color=4214509)
        embed.add_field(name="Vip Role", value=f"Unless you hacked <:hacker:919293586120519801> into Discord, you earned the VIP Role. Let's see what you can do with it.", inline=False)
        embed.add_field(name="Perks", value="• Watch channels as they are being built\n• Private chat and commands channel\n• Use unfinished and private scripts\n• Participate in VIP exclusive giveaways", inline=False)
        embed.add_field(name="Private Scripts", value=f"You can access VIP-exclusive scripts on [our website](https://847442.playcode.io/) with `D%2F-.thkcUA>Jj]` as password!", inline=False)
        embed.set_image(url="https://media.discordapp.net/attachments/628913760760758281/924923180802527242/vip.jpg?width=1440&height=593")
        embed.set_thumbnail(url="https://media.discordapp.net/attachments/892095371717799966/919959143278870588/vibrant.jpg")
        await message.channel.send(embed=embed)

    @client.command()
    async def commands(message):
        embed=discord.Embed(color=4214509)
        embed.add_field(name="Commands", value="**• suggest {suggestion}**\n**• links**\n**• gay**\n**• time**\n**• date {id}**", inline=False)
        embed.set_thumbnail(url="https://media.discordapp.net/attachments/892095371717799966/919959143278870588/vibrant.jpg")
        await message.channel.send(embed=embed)

    @client.command()
    @has_permissions(manage_roles=True, ban_members=True)
    async def started(message):
        embed=discord.Embed(color=4214509)        
        embed.add_field(name="Getting Started", value="This field contains the resources you need to become a programmer! Using these will learn you the basics of Python.", inline=False)
        embed.add_field(name="Courses", value="• Our favorite; [w3schools](https://www.w3schools.com/python/default.asp)\n• [freeCodeCamp](https://www.freecodecamp.org/) - Learn to code for free\n• [CodeAcademy](https://www.codecademy.com/) - Interactive learning\n• Official Python [Documentation](https://docs.python.org/3/)", inline=False)
        embed.add_field(name="Videos", value="• Python for Beginners [Full Course](https://www.youtube.com/watch?v=_uQrJ0TkZlc)\n• freeCodeCamp [Full Beginner Course](https://www.youtube.com/watch?v=rfscVS0vtbw&t=9695s)", inline=False)
        embed.add_field(name="Projects & Practices", value="• [Project Euler](https://projecteuler.net/) - Math Problems\n• [Kindling Projects](https://nedbatchelder.com/text/kindling.html) - Massive List\n• [Build your own](https://github.com/danistefanovic/build-your-own-x) (insert technology here)\n• [PracticePython](https://www.practicepython.org/) - 30 beginner exercises\n• [HackerRank](https://www.hackerrank.com) - Practice coding, interview questions", inline=False)
        embed.set_footer(text="This is for Python only.")
        embed.set_thumbnail(url="https://media.discordapp.net/attachments/892095371717799966/919959143278870588/vibrant.jpg")
        embed.set_image(url="https://media.discordapp.net/attachments/617057336661377055/923690974339801119/getting_start.jpg?width=1442&height=594")
        await message.channel.send(embed=embed)


    @client.command()
    @has_permissions(manage_roles=True, ban_members=True)
    async def order(message):
        embed=discord.Embed(color=4214509)
        embed.add_field(name="Cybersecurity Learning Order", value="""
` 1 ` Start using Kali Linux. Not for using hacking tools but just to get used to it. How to use basic tasks like file operations, searching and installing packages etc. Learn how Virtual Machines work.

` 2 ` Learn & implement data structure & algorithm.  Learn the basics of Python.

` 3 ` Then you need to have a very clear understanding of Computer Networks & Operating system. You need to have a solid understanding of process & memory management in operating system & TCP/IP, DNS, Cryptography, Routing protocols in Computer networks. Take a deep dive into UNIX/Linux.

` 4 ` You need to understand how websites works hence need to understand HTML, JavaScript, CSS, SQL and a server side language.

` 5 ` Now you need to learn about known & common vulnerabilities and attacks like SQL injection, XSS, LFS, RFS, Remote shell, brute-force attack, Reverse TCP payload etc.

` 6 ` Start using some hacking tool like Aircrack-ng, airmon, Metasploit, sqlmap, etc. These tools are preinstalled in Kali Linux.
""", inline=False)
        embed.set_footer(text="This is not only way to learn hacking.")
        #embed.set_image(url="https://media.discordapp.net/attachments/925051035813310514/925051641571463218/links.jpg?width=1440&height=593")
        embed.set_thumbnail(url="https://media.discordapp.net/attachments/892095371717799966/919959143278870588/vibrant.jpg")
        await message.channel.send(embed=embed)         


    @client.command()
    @has_permissions(manage_roles=True, ban_members=True)
    async def databasefile(message):
        embed=discord.Embed(color=4214509)
        embed.add_field(name="About", value="""The Script DataBase is a collection of high-quality code and resources. The channels can also be used for discussions, requests or help.""", inline=False)
        embed.add_field(name="Script DataBase", value="<#919341709207404605>\n<#919231462421700651>\n<#919219611013115914>\n<#919531643285418015>\n<#919531589724155914>\n<#920994922818048020>\n<#919600817365979226>\n<#921062571820318750>\n<#921003780139536386>\n<#919315579381358663>", inline=False)
        embed.add_field(name="Requirements", value="[Python 3.10.1](https://python.org/downloads/)", inline=False)
        embed.set_image(url="https://media.discordapp.net/attachments/925051035813310514/925051642011848714/database.jpg?width=1440&height=593")
        embed.set_thumbnail(url="https://media.discordapp.net/attachments/892095371717799966/919959143278870588/vibrant.jpg")
        await message.channel.send(embed=embed)

    @client.command()
    @has_permissions(manage_roles=True, ban_members=True)
    async def aboutfile(message):
        embed=discord.Embed(color=discord.Colour.from_rgb(54,57,63))
        embed.add_field(name="General Rules", value="""` 1 ` Follow the [Discord Terms](https://discord.com/terms) and [Community Guidelines](https://discord.com/guidelines)
` 2 ` Use common sense\n
` 3 ` No NSFW content
> Content that includes discussions of nudity, sexuality and violence and gore/animal cruelty is also NSFW.
\n` 4 ` No hoisted or special-unicode usernames
` 5 ` Advertising (without permission) is not allowed
` 6 ` Discriminatory jokes are prohibited
` 7 ` Do not post spam, or off-topic & non-English content
` 8 ` No sharing pirated software or games
` 9 ` No doxxing, harassment or encouraging self harm\n
""", inline=False)
        embed.add_field(name="Discord Terms of Service", value="""> **`>>`** You may not develop, distribute, or publicly inform other members of "auto" programs, "macro" programs or other "cheat utility" software program or applications in violation of the applicable license agreements; or
> 
> **`>>`** exploit, distribute or publicly inform other members of any game error, miscue or bug which gives an unintended advantage; violate any applicable laws or regulations; or promote or encourage illegal activity including, but not limited to, hacking, cracking or distribution of compromised accounts, or cheats or hacks for the Service.""", inline=False) 
        #embed.add_field(name="About", value="Vi (pronounced /ˌviːˈaɪ/) is a community for hacking enthusiasts and programmers to share their knowledge. ", inline=False)
        #embed.set_image(url="https://media.discordapp.net/attachments/925051035813310514/925051664069701692/about.jpg?width=1440&height=593")
        embed.set_thumbnail(url="https://media.discordapp.net/attachments/892095371717799966/919959143278870588/vibrant.jpg")
        embed.set_footer(text="We take no responsibility for any damage caused by our server.")

        await message.channel.send(embed=embed)

    @client.command()
    @has_permissions(manage_roles=True, ban_members=True)
    async def resourcesfile(message):
        embed=discord.Embed(color=4214509)
        embed.add_field(name="Practice", value="• [HackTheBox](https://hackthebox.com/), a massive hacking playground, realistic and hard challenges\n• [TryHackMe](https://tryhackme.com), real-world scenarios and courses", inline=False)
        embed.add_field(name="Courses", value="• Hacking [Course](https://www.youtube.com/watch?v=3Kq1MIfTWCE) - Network Penetration Testing\n• Linux for Ethical Hackers (Kali Linux [Tutorial](https://www.youtube.com/watch?v=lZAoFs75_cs))\n• Top 100 Hacking & Security [E-Books](https://github.com/yeahhub/Hacking-Security-Ebooks)\n• Free Download (PDF) IT [E-Books](https://forcoder.su/)", inline=False)
        embed.add_field(name="Tools", value="• Library of tools included in the [Kali Linux](\nhttps://www.kali.org/tools) OS\n• Script DataBase (See category below)", inline=False)
        embed.set_image(url="https://media.discordapp.net/attachments/925051035813310514/925051661674762300/resources.jpg?width=1440&height=593")
        embed.set_thumbnail(url="https://media.discordapp.net/attachments/892095371717799966/919959143278870588/vibrant.jpg")
        await message.channel.send(embed=embed)        

    @client.command()
    @has_permissions(manage_roles=True, ban_members=True)
    async def rolesfile(message):
        embed=discord.Embed(color=4214509,title="Roles")
        embed.add_field(name=" 📣 Announcements ", value="Get notified on new server updates, events & giveaways!")
        embed.add_field(name=" 📊 Polls ", value="For any polls that we host, usually for server changes and opinions")
        embed.add_field(name=" 📨 Updates ", value="Everytime an embed with resources & information gets updated")
        embed.set_image(url="https://media.discordapp.net/attachments/925051035813310514/925054130957983784/roles1.jpg?width=1440&height=593")
        #embed.set_thumbnail(url="https://media.discordapp.net/attachments/892095371717799966/919959143278870588/vibrant.jpg")

        await message.channel.send(embed=embed)

    @client.command()
    @has_permissions(manage_roles=True, ban_members=True)
    async def informationfile(message):
        embed=discord.Embed(color=4214509)
        embed.add_field(name="Types of Hackers", value="\n**• White Hat Hacker**: They are also known as Ethical Hackers or Cybersecurity Experts and they are the one who are authorized and have permission to hack. They help organizations by performing penetration testing and identifying vulnerabilities in their security. They follow rules set by the government.\n**• Black Hat Hacker**: They attempt to gain unauthorized access to systems for money, fame or revenge. They mostly use common hacking practices and can be easily identified because of their malicious actions.\n**• Grey Hat Hacker**: They fall somewhere in the middle. They work with both good or/and bad intentions, it all depends on the hacker.""", inline=False)
        
        embed.add_field(name="DarkWeb Links", value="Use the :onion: [Tor Browser](https://www.torproject.org/), Be aware of scammers!\n**• **[The Hidden Wiki](http://zqktlwiuavvvqqt4ybvgvi7tyo4hjl5xgfuvpdf6otjiycgwqbym2qad.onion/wiki/index.php/Main_Page)\n**• **[Yet Another Hidden Wiki](http://bj5hp4onm4tvpdb5rzf4zsbwoons67jnastvuxefe4s3v7kupjhgh6qd.onion/)\n**• **[OnionLinks](http://jaz45aabn5vkemy4jkg4mi4syheisqn2wn2n4fsuitpccdackjwxplad.onion/)\n**• **[The Original Hidden Wiki](http://xsglq2kdl72b2wmtn5b2b7lodjmemnmcct37owlz5inrhzvyfdnryqid.onion/)\n**• **[Dark Web Pug's Guide](http://qrtitjevs5nxq6jvrnrjyz5dasi3nbzx24mzmfxnuk2dnzhpphcmgoyd.onion/)")
        embed.add_field(name="Install Kali Linux on a Virtual Machine", value="""` 1 ` Download VMware Workstation [here](https://www.vmware.com/products/workstation-player/workstation-player-evaluation.html)\n` 2 ` Download the VMware image for Kali Linux [here](https://www.kali.org/get-kali/#kali-virtual-machines)\n` 3 ` Press on Create a New Virtual Machine\n` 4 ` Select the .iso file and choose Linux > Ubuntu\n` 5 ` Log into Kali Linux with kali as password and username""", inline=False)

        embed.set_thumbnail(url="https://media.discordapp.net/attachments/892095371717799966/919959143278870588/vibrant.jpg")


        await message.channel.send(embed=embed)

except Exception as e:
    print(e)
    pass

client.run(TOKEN)
