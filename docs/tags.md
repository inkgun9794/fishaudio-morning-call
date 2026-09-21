# Emotion Tag 팔레트

대사 앞에 `[ ]`로 넣는다. 태그는 **뒤따르는 대사 전체**에 걸린다.
겹쳐 쓸 수 있다 — `[whispering][soft tone]`.
S2 계열(`s2.1-pro`, `s2.1-pro-free`)은 대괄호, S1은 소괄호를 쓴다.

## 기본 감정

| 태그 | 느낌 | 태그 | 느낌 |
|---|---|---|---|
| `happy` | 기쁨 | `sad` | 슬픔 |
| `angry` | 화남 | `excited` | 신남 |
| `calm` | 차분 | `nervous` | 긴장 |
| `confident` | 자신감 | `surprised` | 놀람 |
| `satisfied` | 만족 | `delighted` | 아주 기쁨 |
| `scared` | 겁먹음 | `worried` | 걱정 |
| `upset` | 속상 | `frustrated` | 답답 |
| `depressed` | 침울 | `empathetic` | 공감 |
| `embarrassed` | 민망 | `disgusted` | 역겨움 |
| `moved` | 뭉클 | `proud` | 뿌듯 |
| `relaxed` | 느긋 | `grateful` | 고마움 |
| `curious` | 궁금 | `sarcastic` | **비꼼** |

## 고급 감정

| 태그 | 느낌 | 태그 | 느낌 |
|---|---|---|---|
| `disdainful` | 깔봄 | `unhappy` | 언짢음 |
| `anxious` | 불안 | `hysterical` | 발작적 |
| `indifferent` | **무관심·시큰둥** | `uncertain` | 확신 없음 |
| `doubtful` | 의심 | `confused` | 혼란 |
| `disappointed` | 실망 | `regretful` | 후회 |
| `guilty` | 죄책감 | `ashamed` | 부끄러움 |
| `jealous` | 질투 | `envious` | 부러움 |
| `hopeful` | 희망 | `optimistic` | 낙관 |
| `pessimistic` | 비관 | `nostalgic` | 그리움 |
| `lonely` | 외로움 | `bored` | 지루함 |
| `contemptuous` | 경멸 | `sympathetic` | 측은 |
| `compassionate` | 연민 | `determined` | 단호 |
| `resigned` | **체념** | | |

## 톤 (모닝콜에서 제일 많이 쓴다)

| 태그 | 느낌 |
|---|---|
| `whispering` | **속삭임** — 1단계 필수 |
| `soft tone` | 부드럽게 |
| `in a hurry tone` | 다급하게 |
| `shouting` | **외침** — 3단계 |
| `screaming` | 비명에 가까운 고함 |
| `emphasis` | 특정 부분 강조 |

## 소리 효과

`laughing` 웃음 · `chuckling` 킥킥 · `sobbing` 흐느낌 · `crying loudly` 통곡
`sighing` **한숨** · `groaning` 끙 · `panting` 헐떡임 · `gasping` 헉
`yawning` **하품** · `snoring` 코골이 · `clear throat` 헛기침

## 사이 띄우기

`[break]` 짧은 쉼 · `[long-break]` 긴 쉼

## 자연어 지시

고정 목록에 없어도 된다. 그냥 한국어로 써도 먹힌다.

```
[퇴근하고 10시간째 한숨도 못 잔 사람의 다 쉰 목소리]
[새벽 4시에 잠꼬대하듯 웅얼거리는 목소리]
[코가 완전히 막힌 감기 환자 목소리]
```

## 모닝콜용 조합 추천

| 단계 | 조합 |
|---|---|
| 1차 달콤 | `[whispering][soft tone]` |
| 1차 다정 | `[soft tone][calm]` |
| 2차 슬슬 | `[sighing][worried]` |
| 2차 짜증 | `[unhappy][in a hurry tone]` |
| 3차 버럭 | `[shouting][angry]` |
| 3차 절규 | `[screaming][in a hurry tone]` |
| 마무리 비꼼 | `[sarcastic][chuckling]` |
| 마무리 체념 | `[resigned][sighing]` |

전체 목록: <https://docs.fish.audio/developer-guide/core-features/emotions>
