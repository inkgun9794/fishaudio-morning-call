// 녹화 렌더에 필요한 agg 바이너리를 내려받는다 (저장소에는 넣지 않는다)
// 사용법: npm run setup
import { mkdir, writeFile, stat } from 'node:fs/promises';

const VER = 'v1.9.0';
const target = process.platform === 'win32' ? 'x86_64-pc-windows-msvc.exe'
  : process.platform === 'darwin' ? (process.arch === 'arm64' ? 'aarch64-apple-darwin' : 'x86_64-apple-darwin')
  : 'x86_64-unknown-linux-gnu';
const out = process.platform === 'win32' ? 'tools/agg.exe' : 'tools/agg';

if (await stat(out).catch(() => null)) { console.log(`이미 있음: ${out}`); process.exit(0); }

const url = `https://github.com/asciinema/agg/releases/download/${VER}/agg-${target}`;
console.log(`내려받는 중: ${url}`);
const res = await fetch(url, { redirect: 'follow' });
if (!res.ok) { console.error(`실패 ${res.status}`); process.exit(1); }
await mkdir('tools', { recursive: true });
await writeFile(out, Buffer.from(await res.arrayBuffer()), { mode: 0o755 });
console.log(`완료: ${out}`);
console.log('ffmpeg도 필요합니다 —  winget install Gyan.FFmpeg');
