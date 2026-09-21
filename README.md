# 모닝콜 스튜디오

대사 앞에 `[ ]`로 연기 지시를 넣으면, 같은 문장이 완전히 다른 사람이 된다.

```
[whispering][soft tone]  일어나. 벌써 일곱 시야.
[shouting][angry]        일어나. 벌써 일곱 시야.
[밤새 울다가 목이 다 쉰 사람]  일어나. 벌써 일곱 시야.
```

세 줄 다 같은 문장이고, 같은 보이스 모델이다. 바뀐 건 대괄호 안뿐.

개인용 로컬 도구다. 배포용 아님.

## 시작하기

```bash
cp .env.example .env    # FISH_API_KEY 채우기
npm start               # http://localhost:5173
```

브라우저에서 대사를 쓰고, 오른쪽 팔레트에서 태그를 눌러 넣고, 바로 미리듣는다.
`전체 굽기`를 누르면 `out/<이름>/`에 mp3가 떨어진다.

Node 20+ 만 있으면 된다. 외부 의존성 없음 (`--env-file`, 내장 `fetch`).
서버는 `127.0.0.1`에만 바인딩하고, API 키는 브라우저로 나가지 않는다.

> **크레딧.** Fish Audio는 지갑이 둘이다. 웹앱의 *플랫폼 크레딧*과 API의 *API 크레딧*은
> 별개라, 웹에 잔액이 남아도 API는 402를 뱉는다. 다만 **`s2.1-pro-free`는 API 크레딧 0에서도
> 호출된다** — 기본값이 그거다.

## 내 목소리 넣기

```bash
npm run clone -- --latest "내 목소리"     # 가장 최근 녹음을 찾아서 업로드
npm run clone -- samples/x.m4a "내 목소리"
```

녹음은 **최소 10초, 1~2분이 최적**. [`samples/대본.md`](samples/대본.md)에 대본이 있다.
속삭임부터 외침까지 폭을 넣어 읽어야 극단적인 태그에서 안 무너진다.

만들어진 `reference_id`는 `.env`의 `FISH_REFERENCE_ID`에 넣거나, 웹 UI 우상단에서 고른다.

## Emotion Tag

- S2 계열(`s2.1-pro-free`, `s2.1-pro`)은 **대괄호**, S1은 소괄호
- 태그는 **뒤따르는 대사 전체**에 걸린다. 문장 맨 앞이 가장 잘 먹는다
- 겹쳐 쓸 수 있다 — `[whispering][soft tone]`
- 고정 태그(감정 49종·톤 6종·효과음 11종) 말고 **자연어 서술**도 된다
- 83개 이상 언어

전체 팔레트는 [`docs/tags.md`](docs/tags.md).

## 과정 녹화

작업 터미널을 세로 영상으로 뽑는다. PTY가 필요 없어서 Windows에서도 돈다.

```bash
npm run setup                  # agg 바이너리 (최초 1회)
npm run rec -- voices          # out/rec/voices.cast
npm run render voices          # -> .gif -> .mp4 (1080x1920)
```

ffmpeg가 필요하다 — `winget install Gyan.FFmpeg`

## 그 밖의 명령

```bash
npm run say -- "[shouting] 일어나!!"   # 한 줄 굽고 바로 재생
npm run build -- 평일아침              # 웹 UI 없이 파일에서 굽기
npm run voices                        # 내 보이스 모델 목록
```

## MCP

[`.mcp.json`](.mcp.json)에 Fish Audio 공식 문서 MCP가 붙어 있다.
에이전트가 최신 태그 목록·엔드포인트·레이트리밋을 직접 조회한다. API 키는 이 연결로 안 오간다.

## 구조

```
server/index.mjs   로컬 서버 (API 키는 여기서만)
web/index.html     UI
src/fish.mjs       Fish Audio REST 클라이언트
src/clone.mjs      녹음 -> 보이스 모델
src/record.mjs     터미널 -> asciicast
src/render.mjs     asciicast -> mp4
calls/             내가 쓴 대사 (웹 UI에서 저장됨)
out/               결과물 (gitignore)
```
