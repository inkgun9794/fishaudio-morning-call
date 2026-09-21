// 녹음 파일 -> Fish Audio 보이스 모델(클론)
// 사용법: npm run clone -- samples/my.m4a "내 목소리"
import { readFile, stat, readdir } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { homedir } from 'node:os';

// Windows 음성 녹음기 등이 저장하는 곳에서 가장 최근 녹음을 찾는다
async function findLatestRecording() {
  const home = homedir();
  const dirs = ['Documents/Sound recordings', 'Documents/사운드 레코딩', 'Documents/Sound Recordings',
                'Music/Sound recordings', 'Downloads', 'Desktop'].map((d) => join(home, d));
  dirs.push('samples');
  const exts = new Set(['.m4a', '.wav', '.mp3', '.opus']);
  let best = null;
  for (const dir of dirs) {
    const entries = await readdir(dir).catch(() => []);
    for (const name of entries) {
      if (!exts.has(name.slice(name.lastIndexOf('.')).toLowerCase())) continue;
      const full = join(dir, name);
      const st = await stat(full).catch(() => null);
      if (st?.isFile() && (!best || st.mtimeMs > best.mtimeMs)) best = { full, mtimeMs: st.mtimeMs };
    }
  }
  return best?.full || null;
}

const C = { dim:'\x1b[2m', b:'\x1b[1m', g:'\x1b[32m', c:'\x1b[36m', r:'\x1b[31m', x:'\x1b[0m' };
let [file, title = '내 목소리'] = process.argv.slice(2);
if (file === '--latest') {
  file = await findLatestRecording();
  if (!file) { console.error('최근 녹음 파일을 못 찾았습니다. 경로를 직접 지정하세요.'); process.exit(1); }
  console.log(`
  [2m찾음: ${file}[0m`);
}
if (!file) { console.error('사용법: npm run clone -- --latest "내 목소리"   또는   npm run clone -- samples/my.m4a "내 목소리"'); process.exit(1); }

const key = process.env.FISH_API_KEY;
if (!key || key.startsWith('your_')) { console.error('FISH_API_KEY가 .env에 없습니다.'); process.exit(1); }

const info = await stat(file).catch(() => null);
if (!info) { console.error(`${C.r}${file} 없음${C.x}`); process.exit(1); }
console.log(`\n  ${C.b}${title}${C.x}`);
console.log(`  ${C.dim}${basename(file)} · ${(info.size / 1024 / 1024).toFixed(2)}MB${C.x}\n`);

const type = { wav:'audio/wav', mp3:'audio/mpeg', m4a:'audio/mp4', opus:'audio/opus' }[file.split('.').pop().toLowerCase()] || 'application/octet-stream';
const fd = new FormData();
fd.set('type', 'tts');
fd.set('title', title);
fd.set('visibility', 'private');
fd.set('train_mode', 'fast');
fd.set('enhance_audio_quality', 'true');
fd.append('voices', new Blob([await readFile(file)], { type }), basename(file));

process.stdout.write(`  ${C.dim}업로드 중...${C.x}\n`);
const res = await fetch('https://api.fish.audio/model', {
  method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: fd,
});
const text = await res.text();
if (!res.ok) { console.error(`  ${C.r}✗ ${res.status}${C.x} ${text.slice(0, 300)}\n`); process.exit(1); }

const m = JSON.parse(text);
const id = m._id || m.id;
console.log(`  ${C.g}✓${C.x} 생성됨  ${C.c}${id}${C.x}  ${C.dim}state=${m.state || '?'}${C.x}`);
console.log(`\n  ${C.dim}.env 에 넣으세요:${C.x}  FISH_REFERENCE_ID=${id}\n`);
