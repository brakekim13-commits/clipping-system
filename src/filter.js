// 벤치마킹 인사이트 관련성 필터
// Claude API 호출(번역/요약) 전에, 원문 제목만 보고 명백히 인사이트가
// 없는 콘텐츠를 걸러낸다. 규칙 기반이라 비용이 전혀 들지 않는다.
//
// 걸러내는 것: 개별 선수 이적/영입/계약, 라인업, 판타지리그, 방송 편성,
//              뉴스레터 구독 안내 등 '소음성' 콘텐츠
// 남기는 것: 마케팅/스폰서십, 커뮤니티 프로그램, 유스 육성 시스템,
//            구단 운영/조직, 시설/인프라, 매출 전략 등 BP 인사이트

const EXCLUDE_PATTERNS = [
  // 영어 — 이적/계약/라인업
  /\bsigns?\b/i,
  /\bsigning\b/i,
  /\bloan\b/i,
  /\btransfer(s|red)?\b/i,
  /\bjoins?\b/i,
  /\bnew contract\b/i,
  /\bextends? (his |her |their )?contract\b/i,
  /\bstarting xi\b/i,
  /\bline-?up\b/i,
  // 영어 — 방송/판타지/뉴스레터 등 소음성 콘텐츠
  /\bpodcast\b/i,
  /\bfpl\b/i,
  /\bfantasy\b/i,
  /\bnewsletter\b/i,
  /\bsubscribe\b/i,
  /\btv (schedule|coverage|fixtures?)\b/i,
  /\bhighlights\b/i,
  /\bmatch preview\b/i,
  /\bplayer of the month\b/i,

  // 일본어 — 이적/방송/판타지
  /完全移籍/,
  /期限付き移籍/,
  /移籍加入/,
  /が.{0,6}移籍/,
  /放送/,
  /テレビ/,
  /番組/,
];

/** 원문 제목 기준으로 명백한 소음성 콘텐츠를 제거 */
export function filterRelevant(items) {
  return items.filter((item) => {
    const title = item.title || "";
    return !EXCLUDE_PATTERNS.some((re) => re.test(title));
  });
}
