import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const [, , inputPath, slug] = process.argv;

if (!inputPath || !slug) {
  console.error("Usage: node scripts/convert-blog-image.mjs <input-image> <post-slug>");
  process.exit(1);
}

const outDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../public/blog/images"
);
const dest = path.join(outDir, `${slug}.webp`);

await sharp(inputPath).webp({ quality: 82 }).toFile(dest);

console.log(`Converted to ${dest}`);
console.log(`Set coverImage: /blog/images/${slug}.webp in the post's frontmatter.`);
