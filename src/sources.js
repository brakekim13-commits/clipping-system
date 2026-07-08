// 클리핑 소스 정의
// - portal: 리그 통합 뉴스 포털 (1순위 소스, 관리 지점 최소화)
// - clubs: 리그 포털에 안 걸리는 구단 자체 발표 보완용 (2순위, 개별 RSS/뉴스룸)
//
// ⚠️ 실제 배포 전 확인 필요:
//   포털 페이지 상당수가 JS 렌더링(SPA) 구조라 단순 fetch로는 기사 목록이 안 잡힘.
//   Playwright로 브라우저 렌더링 후 DOM에서 기사 목록을 읽어야 함.
//   selector는 사이트 구조 변경 시 깨질 수 있으니 Phase1에서 반드시 실물 확인·보정할 것.

export const PORTALS = [
  {
    league: "EPL",
    name: "Premier League",
    url: "https://www.premierleague.com/en/news",
    listSelector: "a[href*='/en/news/']",
  },
  {
    league: "챔피언십",
    name: "EFL",
    url: "https://www.efl.com/news/",
    listSelector: "a[href*='/news/']",
  },
  {
    league: "J1J2J3",
    name: "J.League",
    url: "https://www.jleague.jp/news/",
    listSelector: "a[href*='/news/article/']",
  },
];

export const CLUB_FEEDS = [
  // { league: "EPL", club: "Arsenal", rss: "https://www.arsenal.com/rss.xml" },
];
