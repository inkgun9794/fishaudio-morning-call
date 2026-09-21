// Fish Audio REST 클라이언트 (의존성 0, Node 내장 fetch 사용)
// docs: https://docs.fish.audio/api-reference/endpoint/openapi-v1/text-to-speech
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const BASE = 'https://api.fish.audio';

function apiKey() {
  const k = process.env.FISH_API_KEY;
  if (!k || k.startsWith('your_')) {
    throw new Error('FISH_API_KEY가 없습니다. .env.example을 .env로 복사하고 키를 넣어주세요.');
  }
  return k;
}

/**
 * 텍스트 -> 음성. text 안에 [happy], [whispering], [화가 머리끝까지 난 목소리] 같은
 * emotion tag를 그대로 넣으면 뒤따르는 대사 전체에 적용된다.
 */
export async function tts(text, opts = {}) {
  const {
    model = process.env.FISH_MODEL || 's2.1-pro',
    referenceId = process.env.FISH_REFERENCE_ID || undefined,
    format = 'mp3',
    mp3Bitrate = 192,
    temperature = 0.75,
    topP = 0.75,
    latency = 'normal',
    prosody,
  } = opts;

  const body = { text, format, mp3_bitrate: mp3Bitrate, temperature, top_p: topP, latency };
  if (referenceId) body.reference_id = referenceId;
  if (prosody) body.prosody = prosody;

  const res = await fetch(`${BASE}/v1/tts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      'Content-Type': 'application/json',
      model,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Fish Audio TTS ${res.status}: ${detail.slice(0, 400)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

export async function ttsToFile(text, outPath, opts = {}) {
  const audio = await tts(text, opts);
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, audio);
  return { path: outPath, bytes: audio.length };
}

/** 내 계정에서 쓸 수 있는 보이스 모델 목록 */
export async function listModels({ self = true, pageSize = 20 } = {}) {
  const qs = new URLSearchParams({ page_size: String(pageSize) });
  if (self) qs.set('self', 'true');
  const res = await fetch(`${BASE}/model?${qs}`, {
    headers: { Authorization: `Bearer ${apiKey()}` },
  });
  if (!res.ok) throw new Error(`Fish Audio /model ${res.status}: ${await res.text()}`);
  return res.json();
}
