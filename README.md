# 모닝콜 스튜디오

대사 앞에 `[ ]`로 연기 지시를 넣으면, 같은 문장이 완전히 다른 사람이 된다.

```
[whispering][soft tone]  일어나. 벌써 일곱 시야.
[shouting][angry]        일어나. 벌써 일곱 시야.
[밤새 울다가 목이 다 쉰 사람]  일어나. 벌써 일곱 시야.
```

세 줄 다 같은 문장이고, 같은 보이스 모델이다. 바뀐 건 대괄호 안뿐.

**각자 자기 컴퓨터에서, 자기 API 키로 돌리는 도구다.** 공용 서버 같은 건 없다.
서버는 `127.0.0.1`에만 바인딩하고, 키는 브라우저로 나가지 않는다.

## 시작하기

```bash
cp .env.example .env    # FISH_API_KEY 채우기
npm start               # http://localhost:5173 이 자동으로 열린다
```

터미널이 귀찮으면 더블클릭해도 된다 — Windows는 `모닝콜 스튜디오.cmd`,
macOS는 `모닝콜 스튜디오.command` (처음 한 번은 우클릭 → 열기).

브라우저에서 대사를 쓰고, 오른쪽 팔레트에서 태그를 눌러 넣고, 바로 미리듣는다.
`전체 굽기`를 누르면 `out/<이름>/`에 mp3가 떨어진다.

Node 20+ 만 있으면 된다. 외부 의존성 없음 (`--env-file`, 내장 `fetch`).
서버는 `127.0.0.1`에만 바인딩하고, API 키는 브라우저로 나가지 않는다.

> **크레딧.** Fish Audio는 지갑이 둘이다. 웹앱의 *플랫폼 크레딧*과 API의 *API 크레딧*은
> 별개라, 웹에 잔액이 남아도 API는 402를 뱉는다. 다만 **`s2.1-pro-free`는 API 크레딧 0에서도
> 호출된다** — 기본값이 그거다.

## 다른 컴퓨터에서 이어서 하기

코드와 `calls/`(내가 쓴 대사)는 git으로 따라온다. **`.env`는 안 따라온다** — 키가 들어 있어서 일부러 막아놨다.

```bash
git clone https://github.com/inkgun9794/fishaudio-morning-call.git
cd fishaudio-morning-call
cp .env.example .env     # FISH_API_KEY 붙여넣기
npm start
```

보이스 모델(클론)은 **Fish Audio 서버에 있으니까** 어느 컴퓨터에서든 그대로 쓸 수 있다.
`.env`의 `FISH_REFERENCE_ID`를 비워둬도 되고, 웹 UI 우상단 드롭다운에서 고르면 된다.
ID를 확인하려면 `npm run voices`.

따라오지 않는 것: `.env` · `samples/`(녹음 원본) · `out/`(결과물) · `tools/`(`npm run setup`으로 다시 받는다)

## 내 목소리 넣기

> **본인 목소리이거나, 동의를 받은 목소리만 올리세요.**
> 남의 목소리를 동의 없이 복제하는 건 대부분의 나라에서 문제가 되고,
> Fish Audio 약관도 이를 금지합니다. 클론은 당신의 API 키와 계정으로 기록됩니다.

웹 UI 오른쪽 위 **목소리 추가**에서 바로 된다.

- **● 녹음** — 브라우저에서 바로 녹음한다 (webm/opus로 올라간다. Fish Audio가 그대로 받는다)
- **파일 선택** — 이미 있는 녹음 파일을 올린다

길이를 자동으로 재서 10초 미만이면 경고한다. 만들어지면 우상단 드롭다운에 바로 뜨고,
`×` 버튼으로 지울 수도 있다.

터미널이 편하면:

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

ffmpeg가 필요하다 — Windows `winget install Gyan.FFmpeg` / macOS `brew install ffmpeg`

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

## API 키

[fish.audio/go-api](https://fish.audio/go-api/)에서 각자 발급받아 `.env`에 넣는다.
이 저장소에는 키가 들어 있지 않고, `.env`는 `.gitignore`에 걸려 있다.

기본 모델 `s2.1-pro-free`는 API 크레딧 0에서도 호출된다. 다만 **동시 요청 수 제한**이
결제액 기준으로 걸린다 (Starter 5 / Elevated 15 / High Volume 50). 여러 명이 한 키를
나눠 쓰면 금방 막히니, 각자 발급받는 편이 낫다.

## 라이선스

[MIT](LICENSE). 있는 그대로 제공되며 어떤 보증도 없다.
이 도구로 만든 결과물과 그 사용에 대한 책임은 사용하는 사람에게 있다.
