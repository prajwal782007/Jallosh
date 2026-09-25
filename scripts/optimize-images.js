import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '../assets/navigation-original');
const DEST_DIR = path.join(__dirname, '../public/navigation-optimized');

const QUALITY = 80;
const MAX_WIDTH = 1600;

async function ensureDir(dirPath) {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
}

async function processDirectory(currentDir) {
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        const relativePath = path.relative(SOURCE_DIR, fullPath);
        const destPath = path.join(DEST_DIR, relativePath);

        if (entry.isDirectory()) {
            await ensureDir(destPath);
            const stats = await processDirectory(fullPath);
            totalOriginalSize += stats.totalOriginalSize;
            totalOptimizedSize += stats.totalOptimizedSize;
        } else if (entry.isFile() && /\.(jpe?g|png)$/i.test(entry.name)) {
            const originalStats = await fs.stat(fullPath);
            totalOriginalSize += originalStats.size;

            const parsedPath = path.parse(destPath);
            const optimizedDestPath = path.join(parsedPath.dir, parsedPath.name + '.webp');

            const image = sharp(fullPath);
            const metadata = await image.metadata();

            let sharpInstance = image.rotate();
            if (metadata.width > MAX_WIDTH || metadata.height > MAX_WIDTH) {
                // Resize based on the longest edge to handle portrait images properly
                sharpInstance = sharpInstance.resize({
                    width: MAX_WIDTH,
                    height: MAX_WIDTH,
                    fit: 'inside',
                    withoutEnlargement: true
                });
            }

            await sharpInstance.webp({ quality: QUALITY }).toFile(optimizedDestPath);

            const optimizedStats = await fs.stat(optimizedDestPath);
            totalOptimizedSize += optimizedStats.size;

            console.log(`${entry.name}`);
            console.log(`Original: ${(originalStats.size / 1024 / 1024).toFixed(2)} MB`);
            console.log(`Optimized: ${(optimizedStats.size / 1024).toFixed(2)} KB`);
            const reduction = ((originalStats.size - optimizedStats.size) / originalStats.size * 100).toFixed(1);
            console.log(`Reduction: ${reduction}%\n`);
        }
    }

    return { totalOriginalSize, totalOptimizedSize };
}

async function main() {
    console.log('Optimizing navigation images...\n');
    await ensureDir(DEST_DIR);
    const { totalOriginalSize, totalOptimizedSize } = await processDirectory(SOURCE_DIR);

    const reduction = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
    
    console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total reduction: ${reduction}%`);
}

main().catch(console.error);
