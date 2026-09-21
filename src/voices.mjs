// 내 계정의 보이스 모델 목록 -> .env의 FISH_REFERENCE_ID에 넣을 값 찾기
// 사용법: npm run voices
import { listModels } from './fish.mjs';

const C = { dim:'\x1b[2m', b:'\x1b[1m', c:'\x1b[36m', x:'\x1b[0m' };
const data = await listModels({ self: true, pageSize: 30 });
const items = data.items || data.data || [];

if (!items.length) {
  console.log(`\n${C.dim}내 보이스 모델이 없습니다. fish.audio에서 보이스를 클론하거나 마켓에서 고른 뒤 reference_id를 복사하세요.${C.x}\n`);
} else {
  console.log(`\n${C.b}내 보이스 모델 (${items.length})${C.x}\n`);
  for (const m of items) {
    console.log(`  ${C.c}${m._id || m.id}${C.x}  ${m.title || m.name || ''} ${C.dim}${m.languages?.join(',') || ''}${C.x}`);
  }
  console.log(`\n${C.dim}.env 의 FISH_REFERENCE_ID= 에 위 ID를 넣으세요.${C.x}\n`);
}
