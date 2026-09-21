# 감정형 모닝콜 — Fish Audio Emotion Tags

대사는 그대로 두고 **대괄호 안만 바꿔서** 달콤하게도, 버럭 화내면서도 깨우는 모닝콜을 굽는다.

```
[whispering][soft tone] 일어나. 벌써 일곱 시야.
[shouting][angry]       일어나. 벌써 일곱 시야.
[밤새 울다가 목이 다 쉰 사람] 일어나. 벌써 일곱 시야.
```

세 줄 다 같은 문장이고, 같은 보이스 모델이다.

## 시작하기

```bash
cp .env.example .env    # FISH_API_KEY 채우기
npm run voices          # 내 보이스 모델 ID 확인 -> .env의 FISH_REFERENCE_ID
npm run call -- --list  # 프리셋 목록
npm run call -- escalation
npm run ab              # 태그만 바꾼 A/B 소재
```

Node 20+ 만 있으면 된다. 외부 의존성 없음 (`--env-file`, 내장 `fetch` 사용).

> **크레딧 주의.** Fish Audio는 지갑이 둘로 나뉜다. 웹앱에서 쓰는 *플랫폼 크레딧*과
> API/MCP에서 쓰는 *API 크레딧*은 별개라, 웹에 잔액이 남아 있어도 API는 402를 뱉는다.
> <https://fish.audio/app/developers> 에서 API 크레딧을 따로 충전해야 한다.

크레딧 없이 레이아웃·녹화만 확인하려면 `FISH_DRY_RUN=1`을 붙이면 된다. 호출 없이 무음 파일을 만든다.

## 과정 녹화

작업하는 터미널을 그대로 세로 영상으로 뽑는다. PTY가 필요 없어서 Windows에서도 돈다.

```bash
npm run rec -- call escalation   # out/rec/call-escalation.cast
npm run render call-escalation   # -> .gif -> .mp4 (1080x1920)
```

`src/record.mjs`가 asciicast v2를 직접 쓰고, `tools/agg.exe`가 GIF로,
ffmpeg가 릴스 규격 mp4로 굽는다. 명령어는 한 글자씩 타이핑되는 연출이 들어간다.

## 프리셋

| 키 | 내용 |
|---|---|
| `escalation` | 1분마다 인내심이 사라지는 3단계 모닝콜 |
| `sweet` | 속삭이며 달콤하게 |
| `angry` | 엄마 버럭 → 체념 |
| `butler` | AI 집사 브리핑 (감정을 *없애는* 것도 태그) |
| `natural-language` | 고정 태그 목록에 없는 자연어 연기 지시 실험 |

대사는 [`presets/morning-calls.json`](presets/morning-calls.json)에서 고친다.

## Emotion Tag 규칙

- S2 계열(`s2.1-pro`, `s2-pro`)은 **대괄호** `[happy]`, S1은 괄호 `(happy)`.
- 태그는 **뒤따르는 대사 전체**에 걸린다. 문장 맨 앞이 가장 잘 먹는다.
- 겹쳐 쓸 수 있다: `[whispering][soft tone]`
- 고정 태그(감정 49종, 톤 6종, 효과음 11종) 외에 **자연어 서술**도 된다 — `[새벽 4시에 잠꼬대하듯 웅얼거리는 목소리]`
- 83개 이상 언어에서 동작한다.

전체 태그 목록: <https://docs.fish.audio/developer-guide/core-features/emotions>

## MCP

[`.mcp.json`](.mcp.json)에 Fish Audio 공식 문서 MCP가 붙어 있다. 에이전트가 최신 태그 목록·엔드포인트·레이트리밋을 직접 조회한다. API 키는 이 연결로 오가지 않는다.

```json
{ "mcpServers": { "fish-audio": { "type": "http", "url": "https://docs.fish.audio/mcp" } } }
```

## 구조

```
src/fish.mjs        Fish Audio REST 클라이언트 (TTS / 모델 목록)
src/generate.mjs    프리셋 → mp3
src/ab-demo.mjs     태그만 바꾼 A/B 굽기
src/voices.mjs      내 보이스 모델 ID 조회
presets/            대사와 태그
out/                결과물 (gitignore)
```
