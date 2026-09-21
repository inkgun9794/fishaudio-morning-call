// .cast -> gif(agg) -> mp4(ffmpeg, 릴스용 1080x1920 세로)
// 사용법: node src/render.mjs escalation
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const name = process.argv[2];
if (!name) { console.error('사용법: node src/render.mjs <녹화이름>   (out/rec/<이름>.cast)'); process.exit(1); }

const cast = `out/rec/${name}.cast`;
const gif  = `out/rec/${name}.gif`;
const mp4  = `out/rec/${name}.mp4`;
if (!existsSync(cast)) { console.error(`${cast} 없음. 먼저 npm run rec -- ... 를 실행하세요.`); process.exit(1); }

const agg = process.platform === 'win32' ? 'tools/agg.exe' : 'agg';
const run = (bin, a) => {
  const r = spawnSync(bin, a, { stdio: 'inherit' });
  if (r.error || r.status !== 0) { console.error(`\n${bin} 실패`); process.exit(1); }
};

console.log(`\n1/2  ${cast} -> ${gif}`);
run(agg, [
  '--theme', 'asciinema', '--font-size', '20', '--line-height', '1.4',
  '--speed', '1.0', '--idle-time-limit', '2', '--fps-cap', '30',
  cast, gif,
]);

console.log(`\n2/2  ${gif} -> ${mp4}  (1080x1920 세로)`);
run('ffmpeg', [
  '-y', '-i', gif,
  // 가로 터미널을 1080 폭에 맞추고, 위아래를 배경색으로 채워 세로 프레임을 만든다
  '-vf', 'scale=1080:-2:flags=lanczos,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=0x121314,format=yuv420p',
  '-r', '30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-movflags', '+faststart',
  mp4,
]);

console.log(`\n완료 → ${mp4}`);
