// 대사는 그대로, 대괄호만 바꿔서 굽는다. 영상용 A/B 소재.
// 사용법: npm run ab
import { readFile } from 'node:fs/promises';
import { ttsToFile } from './fish.mjs';

const C = { dim:'\x1b[2m', b:'\x1b[1m', g:'\x1b[32m', m:'\x1b[35m', r:'\x1b[31m', x:'\x1b[0m' };
const { ab_demo: demo } = JSON.parse(await readFile(new URL('../presets/morning-calls.json', import.meta.url), 'utf8'));

console.log(`\n${C.b}▶ ${demo.title}${C.x}`);
console.log(`${C.dim}  ${demo.hook}${C.x}`);
console.log(`\n  고정 대사: ${C.b}"${demo.line}"${C.x}\n`);

for (const v of demo.variants) {
  const text = v.tag ? `${v.tag} ${demo.line}` : demo.line;
  process.stdout.write(`  ${v.label.padEnd(10)} ${C.m}${v.tag || '(없음)'}${C.x}\n`);
  try {
    const { bytes } = await ttsToFile(text, `out/ab/${v.id}.mp3`);
    console.log(`  ${' '.repeat(10)} ${C.g}✓${C.x} ${C.dim}out/ab/${v.id}.mp3  ${(bytes/1024).toFixed(0)}KB${C.x}\n`);
  } catch (e) {
    console.log(`  ${' '.repeat(10)} ${C.r}✗ ${e.message}${C.x}\n`);
    process.exitCode = 1;
  }
}
