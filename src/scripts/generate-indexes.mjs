import fg from "fast-glob";
import { stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import dayjs from "dayjs";
import mime from "mime-types";
import { filesize } from "filesize";

const ROOT = join(process.cwd(), "public/media");

const normalize = (p) => p.replace(/\/$/, "");

async function buildIndex() {
  const entries = await fg("**/*", {
    cwd: ROOT,
    dot: false,
    onlyFiles: false,
    markDirectories: true
  });

  const folders = new Map();

  for (const entry of entries) {
    const clean = normalize(entry);
    const full = join(ROOT, clean);
    const info = await stat(full);

    const parent = dirname(clean);
    if (!folders.has(parent)) folders.set(parent, []);

    const name = clean.split("/").pop();

    folders.get(parent).push({
      name,
      path: clean,
      type: info.isDirectory() ? "directory" : "file",
      size: info.isDirectory() ? null : filesize(info.size),
      mtime: dayjs(info.mtime).format("YYYY-MM-DD HH:mm"),
      mime: info.isDirectory() ? null : mime.lookup(clean) || "application/octet-stream"
    });
  }

  for (const [folder, items] of folders.entries()) {
    const outPath = join(ROOT, folder, "index.json");
    await writeFile(outPath, JSON.stringify(items, null, 2));
  }
}

buildIndex();
