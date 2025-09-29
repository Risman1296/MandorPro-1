// Generate app icons from a source logo using sharp
// Usage: npm run logo:gen [optional: path/to/source]
// Source default: assets/brand/logo.png
const fs = require('fs');
const path = require('path');

async function ensureSharp() {
  try {
    return require('sharp');
  } catch (e) {
    console.error('\nMissing dependency: sharp');
    console.error('Install with: npm i -D sharp');
    process.exit(1);
  }
}

async function main() {
  const sharp = await ensureSharp();
  const root = process.cwd();
  const src = process.argv[2] || path.join(root, 'assets', 'brand', 'logo.png');
  if (!fs.existsSync(src)) {
    console.error(`Source not found: ${src}`);
    console.error('Place your logo at assets/brand/logo.png or pass a custom path.');
    process.exit(1);
  }

  const outIcon = path.join(root, 'assets', 'icon.png');
  const outAdaptive = path.join(root, 'assets', 'adaptive-icon.png');
  const outFavicon = path.join(root, 'assets', 'favicon.png');
  const outSplash = path.join(root, 'assets', 'splash-icon.png');

  // Ensure outputs directory exists
  fs.mkdirSync(path.join(root, 'assets'), { recursive: true });

  // Helper to place the logo nicely on a square canvas
  async function makeSquare(input, size, background = { r: 0, g: 0, b: 0, alpha: 0 }, scale = 0.8) {
    const img = sharp(input).resize(Math.round(size * scale), Math.round(size * scale), { fit: 'inside', withoutEnlargement: true });
    const logoBuf = await img.toBuffer();
    const canvas = sharp({ create: { width: size, height: size, channels: 4, background } });
    // Center composite
    return await canvas
      .composite([{ input: logoBuf, gravity: 'center' }])
      .png()
      .toBuffer();
  }

  // iOS/Android icon 1024x1024
  const iconBuf = await makeSquare(src, 1024, { r: 0, g: 0, b: 0, alpha: 0 }, 0.78);
  await sharp(iconBuf).png().toFile(outIcon);
  console.log('✓ Wrote', path.relative(root, outIcon));

  // Android adaptive foreground (transparent), keep same as icon
  await sharp(iconBuf).png().toFile(outAdaptive);
  console.log('✓ Wrote', path.relative(root, outAdaptive));

  // Web favicon 48x48
  const faviconBuf = await makeSquare(src, 48, { r: 0, g: 0, b: 0, alpha: 0 }, 0.9);
  await sharp(faviconBuf).png().toFile(outFavicon);
  console.log('✓ Wrote', path.relative(root, outFavicon));

  // Splash icon (bigger center image)
  const splashBuf = await makeSquare(src, 512, { r: 0, g: 0, b: 0, alpha: 0 }, 0.95);
  await sharp(splashBuf).png().toFile(outSplash);
  console.log('✓ Wrote', path.relative(root, outSplash));

  console.log('\nAll assets generated. app.json already points to these files.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
