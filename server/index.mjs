// 로컬 전용 모닝콜 스튜디오 서버. 의존성 없음. 127.0.0.1에만 바인딩한다.
// 실행: npm start
import { createServer } from 'node:http';
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { tts, listModels, ttsToFile } from '../src/fish.mjs';

const PORT = Number(process.env.PORT || 5173);
const MIME = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8' };

const json = (res, code, data) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
};
const body = (req) => new Promise((resolve, reject) => {
  let b = ''; req.on('data', (c) => { b += c; if (b.length > 5e6) req.destroy(); });
  req.on('end', () => { try { resolve(b ? JSON.parse(b) : {}); } catch (e) { reject(e); } });
});

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;

  try {
    // ── 보이스 목록 ──
    if (p === '/api/voices') {
      const data = await listModels({ self: true, pageSize: 50 });
      const items = (data.items || data.data || []).map((m) => ({
        id: m._id || m.id, title: m.title || m.name || '(이름 없음)', languages: m.languages || [],
      }));
      return json(res, 200, { items, current: process.env.FISH_REFERENCE_ID || '' });
    }

    // ── 한 줄 미리듣기: mp3 바이트를 그대로 돌려준다 ──
    if (p === '/api/tts' && req.method === 'POST') {
      const { text, referenceId } = await body(req);
      if (!text?.trim()) return json(res, 400, { error: '대사가 비어 있습니다.' });
      const audio = await tts(text, { referenceId: referenceId || undefined });
      res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Content-Length': audio.length });
      return res.end(audio);
    }

    // ── 저장된 모닝콜 목록 ──
    if (p === '/api/calls' && req.method === 'GET') {
      const files = (await readdir('calls').catch(() => [])).filter((f) => f.endsWith('.json'));
      const items = [];
      for (const f of files) {
        const c = JSON.parse(await readFile(join('calls', f), 'utf8'));
        items.push({ name: f.replace('.json', ''), title: c.title || f, stages: c.stages?.length || 0 });
      }
      return json(res, 200, { items });
    }

    // ── 불러오기 / 저장 ──
    if (p.startsWith('/api/calls/')) {
      const name = decodeURIComponent(p.slice('/api/calls/'.length));
      if (!name || /[\/:*?"<>|]/.test(name)) return json(res, 400, { error: '이름에 쓸 수 없는 문자가 있습니다.' });
      if (req.method === 'GET') {
        const c = JSON.parse(await readFile(`calls/${name}.json`, 'utf8'));
        return json(res, 200, c);
      }
      if (req.method === 'PUT') {
        const c = await body(req);
        await mkdir('calls', { recursive: true });
        await writeFile(`calls/${name}.json`, JSON.stringify(c, null, 2) + '\n', 'utf8');
        return json(res, 200, { ok: true });
      }
    }

    // ── 전체 굽기: 파일로 저장 ──
    if (p === '/api/build' && req.method === 'POST') {
      const { name, stages, referenceId } = await body(req);
      const results = [];
      for (const [i, s] of stages.entries()) {
        const file = `out/${name}/${(s.at || String(i + 1)).replace(':', '')}.mp3`;
        try {
          const r = await ttsToFile(s.text, file, { referenceId: referenceId || undefined });
          results.push({ at: s.at, file, bytes: r.bytes, ok: true });
        } catch (e) {
          results.push({ at: s.at, error: e.message, ok: false });
        }
      }
      return json(res, 200, { results, dir: `out/${name}` });
    }

    // ── 결과 폴더 열기 ──
    if (p === '/api/reveal' && req.method === 'POST') {
      const { dir } = await body(req);
      if (process.platform === 'win32') spawn('explorer.exe', [resolve(dir)], { detached: true }).unref();
      return json(res, 200, { ok: true });
    }

    // ── 정적 파일 ──
    const file = p === '/' ? 'index.html' : p.replace(/^\/+/, '');
    if (file.includes('..')) return json(res, 400, { error: 'bad path' });
    const buf = await readFile(join('web', file));
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(buf);
  } catch (e) {
    if (e.code === 'ENOENT') return json(res, 404, { error: 'not found' });
    console.error(e);
    json(res, 500, { error: e.message });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\n  모닝콜 스튜디오  \x1b[36mhttp://localhost:${PORT}\x1b[0m`);
  console.log(`  \x1b[2m보이스 ${(process.env.FISH_REFERENCE_ID || '기본').slice(0, 8)} · ${process.env.FISH_MODEL}\x1b[0m\n`);
});
