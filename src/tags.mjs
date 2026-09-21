// 한글 태그 ↔ Fish Audio 태그 사전. 서버·웹 UI·CLI가 전부 이 파일 하나만 본다.
// 사전에 없는 한글은 그대로 내보낸다 — Fish Audio가 자연어 연기 지시를 받아주기 때문에
// "[밤새 울어서 목이 다 쉰]" 같은 것도 그냥 동작한다.

export const GROUPS = [
  {
    name: '모닝콜',
    hint: '자주 쓰는 조합',
    items: [
      ['달래듯',     ['whispering', 'soft tone']],
      ['다정하게',   ['soft tone', 'calm']],
      ['슬슬 지쳐',  ['sighing', 'worried']],
      ['짜증내며',   ['unhappy', 'in a hurry tone']],
      ['버럭',       ['shouting', 'angry']],
      ['악을 쓰며',  ['screaming', 'in a hurry tone']],
      ['비꼬며',     ['sarcastic', 'chuckling']],
      ['체념하며',   ['resigned', 'sighing']],
    ],
  },
  {
    name: '톤',
    items: [
      ['속삭이며', ['whispering']],
      ['부드럽게', ['soft tone']],
      ['다급하게', ['in a hurry tone']],
      ['소리치며', ['shouting']],
      ['고함치며', ['screaming']],
      ['힘주어',   ['emphasis']],
    ],
  },
  {
    name: '감정',
    items: [
      ['기쁘게',     ['happy']],       ['신나서',     ['excited']],
      ['무척 기뻐',  ['delighted']],   ['뿌듯하게',   ['proud']],
      ['고마워하며', ['grateful']],    ['흡족하게',   ['satisfied']],
      ['차분하게',   ['calm']],        ['느긋하게',   ['relaxed']],
      ['화내며',     ['angry']],       ['언짢게',     ['unhappy']],
      ['답답해하며', ['frustrated']],  ['속상해하며', ['upset']],
      ['슬퍼하며',   ['sad']],         ['침울하게',   ['depressed']],
      ['외롭게',     ['lonely']],      ['실망해서',   ['disappointed']],
      ['걱정하며',   ['worried']],     ['불안해하며', ['anxious']],
      ['긴장해서',   ['nervous']],     ['겁먹고',     ['scared']],
      ['놀라서',     ['surprised']],   ['헷갈려하며', ['confused']],
      ['의심하며',   ['doubtful']],    ['궁금해하며', ['curious']],
      ['비꼬며',     ['sarcastic']],   ['시큰둥하게', ['indifferent']],
      ['깔보며',     ['disdainful']],  ['경멸하며',   ['contemptuous']],
      ['지루해하며', ['bored']],       ['체념하며',   ['resigned']],
      ['단호하게',   ['determined']],  ['자신있게',   ['confident']],
      ['민망해하며', ['embarrassed']], ['부끄러워하며', ['ashamed']],
      ['죄책감에',   ['guilty']],      ['후회하며',   ['regretful']],
      ['그리워하며', ['nostalgic']],   ['뭉클하게',   ['moved']],
      ['공감하며',   ['empathetic']],  ['안쓰러워하며', ['sympathetic']],
      ['희망차게',   ['hopeful']],     ['질투하며',   ['jealous']],
    ],
  },
  {
    name: '소리',
    items: [
      ['한숨쉬며',   ['sighing']],     ['하품하며',   ['yawning']],
      ['웃으며',     ['laughing']],    ['킥킥대며',   ['chuckling']],
      ['흐느끼며',   ['sobbing']],     ['엉엉 울며',  ['crying loudly']],
      ['헛기침하며', ['clear throat']],['헉 하고',    ['gasping']],
      ['헐떡이며',   ['panting']],     ['끙 앓으며',  ['groaning']],
      ['코를 골며',  ['snoring']],
    ],
  },
  {
    name: '사이',
    items: [
      ['짧은 쉼', ['break']],
      ['긴 쉼',   ['long-break']],
    ],
  },
];

/** 한글 라벨 -> Fish Audio 태그 배열 */
export const KO_TO_EN = Object.fromEntries(
  GROUPS.flatMap((g) => g.items).map(([ko, en]) => [ko, en]),
);

/** 한글 태그 하나를 "[a][b]" 로 편다. 사전에 없으면 자연어 지시로 그대로 통과. */
export function renderTag(ko) {
  const en = KO_TO_EN[ko];
  return en ? en.map((t) => `[${t}]`).join('') : `[${ko}]`;
}

/** 태그 배열 + 대사 -> Fish Audio에 보낼 최종 문자열 */
export function compose(tags = [], text = '') {
  const head = (tags || []).map(renderTag).join('');
  const body = (text || '').trim();
  return head ? `${head} ${body}` : body;
}

/**
 * 예전 형식({text:"[shouting][angry] 야!!"})을 {tags, text}로 뜯어낸다.
 * 영어 태그는 알아보는 만큼 한글로 되돌리고, 모르는 건 그대로 둔다.
 */
const EN_TO_KO = (() => {
  const m = {};
  for (const g of GROUPS) for (const [ko, en] of g.items) if (en.length === 1) m[en[0]] = ko;
  return m;
})();

export function parseLegacy(text = '') {
  const head = (text.match(/^(\[[^\]]+\])+/) || [''])[0];
  const body = text.slice(head.length).trim();
  const tags = (head.match(/\[([^\]]+)\]/g) || []).map((t) => {
    const inner = t.slice(1, -1);
    return EN_TO_KO[inner] || inner;
  });
  return { tags, text: body };
}

/** 저장된 stage가 새 형식이든 옛 형식이든 {tags, text}로 맞춰준다. */
export function normalize(stage) {
  if (Array.isArray(stage.tags)) return { at: stage.at, tags: stage.tags, text: stage.text || '' };
  const { tags, text } = parseLegacy(stage.text || '');
  return { at: stage.at, tags, text };
}
