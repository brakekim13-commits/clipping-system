# 해외 리그 BP 클리핑 시스템 (v0.1 프로토타입)

EPL·챔피언십·J1·J2·J3 구단 보도자료를 매일 수집 → 한글 번역/요약 → 지메일 발송.

## ⚠️ 시작 전 꼭 읽어주세요 (현재 상태)

이 코드는 **설계·골격 코드**입니다. 다음 이유로 그대로 돌리면 바로 동작하지 않을 수 있습니다.

1. **selector 미검증** — `src/sources.js`의 `listSelector`는 실제 premierleague.com / efl.com / jleague.jp 페이지 구조를 보고 작성한 게 아니라 추정치입니다. 이 저장소를 만든 환경은 해당 사이트에 네트워크 접근이 막혀 있어 실물 DOM을 확인하지 못했습니다. **Phase 1 착수 시 각 포털을 직접 열어 기사 리스트의 실제 HTML 구조를 확인하고 selector를 보정해야 합니다.**
2. **CLUB_FEEDS 비어있음** — 104개 구단 RSS 주소는 아직 채워지지 않았습니다. 설계안 로드맵대로 Phase 1(EPL+J1 40개)부터 순차 등록을 권장합니다.
3. 기사 본문은 스크래핑하지 않고 **제목만으로 번역·요약**합니다(저작권 리스크 최소화). 요약 정확도를 높이려면 추후 본문 일부(리드 문단)까지 확장하는 방안을 검토할 수 있습니다.

## 준비물 (시작 전 3가지)

| 항목 | 방법 |
|---|---|
| Anthropic API Key | [console.anthropic.com](https://console.anthropic.com)에서 발급 |
| Gmail 앱 비밀번호 | 사용하실 Gmail 계정 → Google 계정 관리 → 보안 → 2단계 인증 활성화 → "앱 비밀번호" 생성 (일반 로그인 비밀번호 아님) |
| 수신 이메일 | 브리핑을 받을 주소 (발송 계정과 같아도, 달라도 무방) |

## 설치

```bash
npm install
npx playwright install --with-deps chromium
```

## 로컬 테스트 실행

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
export GMAIL_USER="보낼계정@gmail.com"
export GMAIL_APP_PASSWORD="앱비밀번호16자리"
export RECIPIENT_EMAIL="받을계정@gmail.com"
npm start
```

## GitHub Actions로 매일 자동 실행

1. 이 폴더를 GitHub 저장소에 push (private 저장소 권장 — 이메일 주소 등 노출 방지)
2. 저장소 **Settings → Secrets and variables → Actions**에서 아래 4개 등록
   - `ANTHROPIC_API_KEY`
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `RECIPIENT_EMAIL`
3. `.github/workflows/daily-clipping.yml`이 매일 KST 08:00에 자동 실행됨
   (`workflow_dispatch`로 Actions 탭에서 수동 실행도 가능 — 처음엔 이걸로 테스트 권장)

## 확장 로드맵

- [ ] Phase 1: `sources.js`의 3개 포털 selector 실물 검증
- [ ] Phase 1: EPL 20개 + J1 20개 구단 RSS/뉴스룸 URL을 `CLUB_FEEDS`에 등록
- [ ] Phase 2: 챔피언십 24개 + J2·J3 40개 추가, 전체 104개 구단 커버리지
- [ ] Phase 3: 분기 1회 selector 헬스체크, 신규 승강 구단 리스트 갱신
