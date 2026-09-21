// 사용법: npm run call -- <preset>        (예: npm run call -- escalation)
//        npm run call -- --list
import { readFile } from 'node:fs/promises';
import { ttsToFile } from './fish.mjs';

const C = { dim:'\x1b[2m', b:'\x1b[1m', g:'\x1b[32m', y:'\x1b[33m', c:'\x1b[36m', m:'\x1b[35m', r:'\x1b[31m', x:'\x1b[0m' };
const data = JSON.parse(await readFile(new URL('../presets/morning-calls.json', import.meta.url), 'utf8'));
const arg = process.argv[2];

if (!arg || arg === '--list') {
  console.log(`\n${C.b}사용 가능한 모닝콜 프리셋${C.x}\n`);
  for (const [key, p] of Object.entries(data.presets)) {
    console.log(`  ${C.c}${key.padEnd(20)}${C.x}${p.title}`);
    console.log(`  ${' '.repeat(20)}${C.dim}${p.hook}${C.x}\n`);
  }
  console.log(`${C.dim}실행: npm run call -- escalation${C.x}\n`);
  process.exit(0);
}

const preset = data.presets[arg];
if (!preset) {
  console.error(`${C.r}'${arg}' 프리셋이 없습니다.${C.x} 목록: npm run call -- --list`);
  process.exit(1);
}

console.log(`\n${C.b}▶ ${preset.title}${C.x}`);
console.log(`${C.dim}  ${preset.hook}${C.x}`);
console.log(`${C.dim}  model=${process.env.FISH_MODEL || 's2.1-pro'}  voice=${process.env.FISH_REFERENCE_ID || '(기본)'}${C.x}\n`);

let total = 0;
for (const line of preset.lines) {
  const out = `out/${arg}/${line.id}.mp3`;
  const tag = (line.text.match(/^(\[[^\]]+\])+/) || [''])[0];
  const body = line.text.slice(tag.length).trim();

  process.stdout.write(`  ${C.y}${(line.label || line.id).padEnd(12)}${C.x}${C.m}${tag}${C.x} ${body}\n`);
  const t0 = Date.now();
  try {
    const { bytes } = await ttsToFile(line.text, out);
    total += bytes;
    console.log(`  ${' '.repeat(12)}${C.g}✓${C.x} ${C.dim}${out}  ${(bytes/1024).toFixed(0)}KB  ${Date.now()-t0}ms${C.x}\n`);
  } catch (e) {
    console.log(`  ${' '.repeat(12)}${C.r}✗ ${e.message}${C.x}\n`);
    process.exitCode = 1;
  }
}
console.log(`${C.b}완료${C.x} ${C.dim}→ out/${arg}/  (총 ${(total/1024).toFixed(0)}KB)${C.x}\n`);
