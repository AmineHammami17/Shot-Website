import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIRS = [
  path.resolve(process.cwd(), 'public/images'),
  path.resolve(process.cwd(), 'src/assets'),
];
const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(fullPath);
      return [fullPath];
    }),
  );
  return files.flat();
};

const toWebp = async (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) return null;

  const outPath = filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  await sharp(filePath)
    .webp({ quality: 75, effort: 6 })
    .toFile(outPath);

  return { input: filePath, output: outPath };
};

const run = async () => {
  const directoryChecks = await Promise.all(
    SOURCE_DIRS.map(async (dir) => ({
      dir,
      exists: await fs
        .stat(dir)
        .then((stat) => stat.isDirectory())
        .catch(() => false),
    })),
  );

  const existingDirs = directoryChecks.filter((entry) => entry.exists).map((entry) => entry.dir);
  if (!existingDirs.length) {
    console.warn('No image directories found; skipping WebP conversion.');
    return;
  }

  const nested = await Promise.all(existingDirs.map((dir) => walk(dir)));
  const files = nested.flat();
  const results = await Promise.all(files.map((filePath) => toWebp(filePath)));
  const converted = results.filter(Boolean);

  console.log(`Converted ${converted.length} image(s) to WebP.`);
};

run().catch((error) => {
  console.error('WebP conversion failed:', error);
  process.exit(1);
});
