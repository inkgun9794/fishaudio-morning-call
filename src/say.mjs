// 한 줄 빠른 확인 — 쓰고 바로 듣는다
// 사용법: npm run say -- "[shouting][angry] 일어나!!"
import { spawn } from 'node:child_process';
import { ttsToFile } from './fish.mjs';

const text = process.argv.slice(2).join(' ');
if (!text) { console.error('사용법: npm run say -- "[shouting] 일어나!!"'); process.exit(1); }

const out = 'out/say/last.mp3';
const { bytes } = await ttsToFile(text, out);
console.log(`\x1b[32m✓\x1b[0m ${out} · ${(bytes / 1024).toFixed(0)}KB`);

// 바로 재생 (Windows)
if (process.platform === 'win32') {
  spawn('powershell', ['-NoProfile', '-c',
    `$p=New-Object -ComObject WMPlayer.OCX; $p.URL='${process.cwd()}\${out.replace(/\//g, '\')}'; $p.controls.play(); Start-Sleep -Seconds 12`],
    { stdio: 'ignore', detached: true }).unref();
}
