const fs = require("fs");
const path = require("path");
const axios = require("axios");
const puppeteer = require("puppeteer");

const startUrl = process.argv[2];
if (!startUrl) {
    console.log("Usage: node grab.js <url>");
    process.exit(1);
}

async function saveFile(url) {
    try {
        const u = new URL(url);
        let filePath = path.join("downloaded", u.hostname, u.pathname);

        if (filePath.endsWith(path.sep)) {
            filePath = path.join(filePath, "index.html");
        }

        if (fs.existsSync(filePath)) return;

        const res = await axios.get(url, { responseType: "arraybuffer" });

        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, res.data);

        console.log("Saved:", filePath);
    } catch (err) {
        console.log("Failed:", url, err.message);
    }
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on("requestfinished", async (req) => {
        const url = req.url();
        if (url.startsWith("http")) {
            saveFile(url);
        }
    });

    console.log("Loading:", startUrl);
    await page.goto(startUrl, { waitUntil: "networkidle2" });

    console.log("Waiting for remaining requests...");
    await new Promise(r => setTimeout(r, 3000));

    await browser.close();
    console.log("Done.");
})();
