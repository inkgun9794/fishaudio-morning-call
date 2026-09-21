// 사용법: npm run call -- <preset>        (예: npm run call -- escalation)
//        npm run call -- --list
import { readFile } from 'node:fs/promises';
import { ttsToFile } from './fish.mjs';

const C = { dim:'\x1b[2m', b:'\x1b[1m', g:'\x1b[32m', y:'\x1b[33m', c:'\x1b[36m', m:'\x1b[35m', r:'\x1b[31m', x:'\x1b[0m' };
const WIDTH = 54;   // 세로 영상에서 읽히는 폭. record.mjs의 COLS와 맞춰둔다.

// 한글·이모지는 두 칸을 먹는다. 폭 기준으로 줄바꿈해야 영상에서 안 삐져나온다.
const cw = (ch) => (/[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹯＀-｠￠-￦]/.test(ch) ? 2 : 1);
function wrap(text, width, indent = '  ') {
  const out = [];
  let line = '', w = 0;
  for (const word of text.split(' ')) {
    const ww = [...word].reduce((a, ch) => a + cw(ch), 0);
    if (w && w + 1 + ww > width) { out.push(indent + line); line = word; w = ww; }
    else { line = line ? `${line} ${word}` : word; w += (w ? 1 : 0) + ww; }
  }
  if (line) out.push(indent + line);
  return out;
}

const data = JSON.parse(await readFile(new URL('../presets/morning-calls.json', import.meta.url), 'utf8'));
const arg = process.argv[2];

if (!arg || arg === '--list') {
  console.log(`\n${C.b}  모닝콜 프리셋${C.x}\n`);
  for (const [key, p] of Object.entries(data.presets)) {
    console.log(`  ${C.c}${key}${C.x}`);
    console.log(`  ${C.dim}${p.title}${C.x}\n`);
  }
  console.log(`${C.dim}  npm run call -- escalation${C.x}\n`);
  process.exit(0);
}

const preset = data.presets[arg];
if (!preset) {
  console.error(`${C.r}  '${arg}' 프리셋 없음.${C.x} ${C.dim}npm run call -- --list${C.x}`);
  process.exit(1);
}

console.log(`\n${C.b}  ${preset.title}${C.x}`);
console.log(`${C.dim}  ${process.env.FISH_MODEL || 's2.1-pro'} · ${process.env.FISH_VOICE_NAME || process.env.FISH_REFERENCE_ID?.slice(0, 8) || '기본 보이스'}${C.x}\n`);

let total = 0, ok = 0;
for (const line of preset.lines) {
  const out = `out/${arg}/${line.id}.mp3`;
  const tag = (line.text.match(/^(\[[^\]]+\])+/) || [''])[0];
  const body = line.text.slice(tag.length).trim();

  console.log(`  ${C.y}${line.label || line.id}${C.x}`);
  for (const l of wrap(tag, WIDTH)) console.log(`${C.m}${l}${C.x}`);
  for (const l of wrap(body, WIDTH)) console.log(l);

  const t0 = Date.now();
  try {
    const { bytes } = await ttsToFile(line.text, out);
    total += bytes; ok++;
    console.log(`  ${C.g}✓${C.x} ${C.dim}${(bytes / 1024).toFixed(0)}KB · ${((Date.now() - t0) / 1000).toFixed(1)}s${C.x}\n`);
  } catch (e) {
    console.log(`  ${C.r}✗ ${e.message.slice(0, WIDTH)}${C.x}\n`);
    process.exitCode = 1;
  }
}
console.log(`${C.b}  ${ok}/${preset.lines.length} 완성${C.x} ${C.dim}· out/${arg}/ · ${(total / 1024).toFixed(0)}KB${C.x}\n`);
