import fs from 'node:fs';
import path from 'node:path';
import chokidar from 'chokidar';
import { minify } from 'html-minifier-terser';

const SRC = path.resolve(__dirname, '../src/loading/template.html');
const DEST = path.resolve(__dirname, '../src/loading/template.ts');

async function minifyHtml() {
  if (!fs.existsSync(SRC)) {
    throw new Error(`${SRC} is not found`);
  }

  const html = fs.readFileSync(SRC, 'utf8');
  const minifiedHtml = await minify(html, {
    minifyCSS: true,
    minifyJS: true,
    collapseWhitespace: true,
    removeComments: false,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  });

  fs.writeFileSync(DEST, `export default \`${minifiedHtml}\`;\n`, { encoding: 'utf8' });

  console.log('minified template.html successfully!');
}

if (process.env.WATCH) {
  chokidar.watch(SRC).on('change', async () => {
    await minifyHtml();
  });
}

minifyHtml();
