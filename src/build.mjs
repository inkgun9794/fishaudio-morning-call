// 내가 쓴 대사+태그 -> 음성
// 사용법: npm run build -- 평일아침
//        npm run build            (목록)
import { readFile, readdir } from 'node:fs/promises';
import { ttsToFile } from './fish.mjs';

const C = { dim:'\x1b[2m', b:'\x1b[1m', g:'\x1b[32m', y:'\x1b[33m', m:'\x1b[35m', r:'\x1b[31m', x:'\x1b[0m' };
const name = process.argv[2];

if (!name) {
  const files = (await readdir('calls').catch(() => [])).filter((f) => f.endsWith('.json'));
  console.log(`\n${C.b}  내 모닝콜${C.x}\n`);
  for (const f of files) console.log(`  ${C.y}${f.replace('.json', '')}${C.x}`);
  console.log(`\n${C.dim}  npm run build -- ${files[0]?.replace('.json', '') || '이름'}${C.x}`);
  console.log(`${C.dim}  태그 목록은 docs/tags.md${C.x}\n`);
  process.exit(0);
}

const call = JSON.parse(await readFile(`calls/${name}.json`, 'utf8'));
console.log(`\n${C.b}  ${call.title || name}${C.x}`);
console.log(`${C.dim}  ${process.env.FISH_MODEL} · ${(process.env.FISH_REFERENCE_ID || '기본').slice(0, 8)}${C.x}\n`);

let ok = 0;
for (const s of call.stages) {
  const tag = (s.text.match(/^(\[[^\]]+\])+/) || [''])[0];
  const body = s.text.slice(tag.length).trim();
  const file = `out/${name}/${(s.at || String(ok + 1)).replace(':', '')}.mp3`;

  console.log(`  ${C.y}${s.at || ok + 1}${C.x}`);
  console.log(`  ${C.m}${tag}${C.x}`);
  console.log(`  ${body}`);
  try {
    const r = await ttsToFile(s.text, file);
    ok++;
    console.log(`  ${C.g}✓${C.x} ${C.dim}${file} · ${(r.bytes / 1024).toFixed(0)}KB${C.x}\n`);
  } catch (e) {
    console.log(`  ${C.r}✗ ${e.message.slice(0, 54)}${C.x}\n`);
    process.exitCode = 1;
  }
}
console.log(`${C.b}  ${ok}/${call.stages.length} 완성${C.x} ${C.dim}· out/${name}/${C.x}\n`);
