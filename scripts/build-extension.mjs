import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const dist = path.join(rootDir, 'dist');

// Remove dist anterior se existir
if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}

// Cria diretório dist
fs.mkdirSync(dist);

console.log('📦 Iniciando build da extensão...');

// Copia manifest.json
const manifestSrc = path.join(rootDir, 'manifest.json');
const manifestDest = path.join(dist, 'manifest.json');
fs.copyFileSync(manifestSrc, manifestDest);
console.log('✓ manifest.json copiado');

// Copia pasta src/
const srcDir = path.join(rootDir, 'src');
const srcDest = path.join(dist, 'src');
if (fs.existsSync(srcDir)) {
  fs.cpSync(srcDir, srcDest, { recursive: true });
  console.log('✓ src/ copiado');
}

// Copia pasta icons/
const iconsDir = path.join(rootDir, 'icons');
const iconsDest = path.join(dist, 'icons');
if (fs.existsSync(iconsDir)) {
  fs.cpSync(iconsDir, iconsDest, { recursive: true });
  console.log('✓ icons/ copiado');
}

// Gera ZIP da extensão
console.log('📦 Gerando extension.zip...');
const zipPath = path.join(dist, 'extension.zip');
const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`✓ extension.zip criado (${archive.pointer()} bytes)`);
  console.log('✅ Build concluído com sucesso!');
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);

// Adiciona todos os arquivos do dist (exceto o próprio zip)
archive.file(manifestDest, { name: 'manifest.json' });
archive.directory(srcDest, 'src');
archive.directory(iconsDest, 'icons');

await archive.finalize();