// 터미널 세션을 asciicast v2로 녹화한다. (Windows에서도 동작 — PTY 불필요)
// 사용법: npm run rec -- call escalation
//        npm run rec -- ab
import { spawn } from 'node:child_process';
import { createWriteStream, mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
if (!args.length) {
  console.error('사용법: npm run rec -- call escalation   |   npm run rec -- ab');
  process.exit(1);
}

const script = { call: 'src/generate.mjs', ab: 'src/ab-demo.mjs', voices: 'src/voices.mjs' }[args[0]];
if (!script) { console.error(`알 수 없는 대상: ${args[0]}`); process.exit(1); }

const name = args.join('-');
const COLS = 56, ROWS = 30;
mkdirSync('out/rec', { recursive: true });
const castPath = `out/rec/${name}.cast`;
const cast = createWriteStream(castPath);

cast.write(JSON.stringify({
  version: 2, width: COLS, height: ROWS,
  timestamp: Math.floor(Date.now() / 1000),
  env: { SHELL: 'pwsh', TERM: 'xterm-256color' },
  title: `fish audio · ${name}`,
}) + '\n');

const t0 = Date.now();
const at = () => (Date.now() - t0) / 1000;
const emit = (s) => cast.write(JSON.stringify([at(), 'o', s.replace(/(?<!\r)\n/g, '\r\n')]) + '\n');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 프롬프트에 명령어를 한 글자씩 치는 연출 — 영상에서 "지금 뭘 실행하는지"가 보여야 한다
const cmd = `npm run ${args[0]}${args[1] ? ` -- ${args[1]}` : ''}`;
emit('\x1b[32m❯\x1b[0m ');
for (const ch of cmd) { emit(ch); await sleep(45 + Math.random() * 40); }
await sleep(350);
emit('\n');

const child = spawn(process.execPath, ['--env-file=.env', script, ...args.slice(1)], {
  env: { ...process.env, FORCE_COLOR: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
child.stdout.on('data', (d) => { const s = d.toString(); process.stdout.write(s); emit(s); });
child.stderr.on('data', (d) => { const s = d.toString(); process.stderr.write(s); emit(s); });

const code = await new Promise((r) => child.on('close', r));
await sleep(900);                       // 마지막 프레임이 잘리지 않게 여유
emit('\x1b[32m❯\x1b[0m ');
await new Promise((r) => cast.end(r));

console.log(`\n녹화 완료 → ${castPath}  (${at().toFixed(1)}초, exit ${code})`);
console.log(`렌더:  node src/render.mjs ${name}`);
