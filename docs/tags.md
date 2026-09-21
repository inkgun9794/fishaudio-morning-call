# 연기 지시 (Emotion Tags)

웹 UI에서는 **한글로 고르기만 하면 된다.** 아래 표는 그게 실제로 뭘로 바뀌는지다.
Fish Audio에 보낼 때만 변환되고, 사전은 [`src/tags.mjs`](../src/tags.mjs) 한 곳에만 있다.

```
(버럭)              →  [shouting][angry]
(속삭이며)(부드럽게)  →  [whispering][soft tone]
```

지시는 **뒤따르는 대사 전체**에 걸린다. 여러 개 겹칠 수 있다.

## 모닝콜 조합

자주 쓰는 걸 미리 묶어놨다.

| 한글 | 실제 태그 |
|---|---|
| 달래듯 | `whispering` `soft tone` |
| 다정하게 | `soft tone` `calm` |
| 슬슬 지쳐 | `sighing` `worried` |
| 짜증내며 | `unhappy` `in a hurry tone` |
| 버럭 | `shouting` `angry` |
| 악을 쓰며 | `screaming` `in a hurry tone` |
| 비꼬며 | `sarcastic` `chuckling` |
| 체념하며 | `resigned` `sighing` |

## 톤

속삭이며 `whispering` · 부드럽게 `soft tone` · 다급하게 `in a hurry tone`
소리치며 `shouting` · 고함치며 `screaming` · 힘주어 `emphasis`

## 감정

기쁘게 `happy` · 신나서 `excited` · 무척 기뻐 `delighted` · 뿌듯하게 `proud`
고마워하며 `grateful` · 흡족하게 `satisfied` · 차분하게 `calm` · 느긋하게 `relaxed`
화내며 `angry` · 언짢게 `unhappy` · 답답해하며 `frustrated` · 속상해하며 `upset`
슬퍼하며 `sad` · 침울하게 `depressed` · 외롭게 `lonely` · 실망해서 `disappointed`
걱정하며 `worried` · 불안해하며 `anxious` · 긴장해서 `nervous` · 겁먹고 `scared`
놀라서 `surprised` · 헷갈려하며 `confused` · 의심하며 `doubtful` · 궁금해하며 `curious`
비꼬며 `sarcastic` · 시큰둥하게 `indifferent` · 깔보며 `disdainful` · 경멸하며 `contemptuous`
지루해하며 `bored` · 체념하며 `resigned` · 단호하게 `determined` · 자신있게 `confident`
민망해하며 `embarrassed` · 부끄러워하며 `ashamed` · 죄책감에 `guilty` · 후회하며 `regretful`
그리워하며 `nostalgic` · 뭉클하게 `moved` · 공감하며 `empathetic` · 안쓰러워하며 `sympathetic`
희망차게 `hopeful` · 질투하며 `jealous`

## 소리

한숨쉬며 `sighing` · 하품하며 `yawning` · 웃으며 `laughing` · 킥킥대며 `chuckling`
흐느끼며 `sobbing` · 엉엉 울며 `crying loudly` · 헛기침하며 `clear throat`
헉 하고 `gasping` · 헐떡이며 `panting` · 끙 앓으며 `groaning` · 코를 골며 `snoring`

## 사이

짧은 쉼 `break` · 긴 쉼 `long-break`

## 사전에 없는 말도 된다

Fish Audio는 **자연어 연기 지시**를 받는다. 목록에 없는 한글을 쓰면 변환 없이 그대로 전달된다.

```
(퇴근하고 10시간째 한숨도 못 잔 사람의 다 쉰 목소리)
(새벽 4시에 잠꼬대하듯 웅얼거리는 목소리)
(코가 완전히 막힌 감기 환자 목소리)
```

구체적일수록 잘 먹는다. 팔레트 검색에서 안 나오면 그냥 직접 쓰면 된다.

## 태그 추가하기

[`src/tags.mjs`](../src/tags.mjs)의 `GROUPS`에 한 줄 넣으면 UI·CLI에 동시에 반영된다.

```js
['졸린 듯이', ['yawning', 'soft tone']],
```

원본 태그 목록: <https://docs.fish.audio/developer-guide/core-features/emotions>
