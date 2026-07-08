import { collectAll } from "./collect.js";
import { filterRelevant } from "./filter.js";
import { filterNew } from "./cache.js";
import { translateBatch } from "./translate.js";
import { sendDigest } from "./mail.js";

async function main() {
  console.log("[1/5] 수집 시작...");
  const raw = await collectAll();
  console.log(`  → ${raw.length}건 수집`);

  console.log("[2/5] 인사이트 관련성 필터링...");
  const relevant = filterRelevant(raw);
  console.log(`  → ${relevant.length}건 남음 (제외 ${raw.length - relevant.length}건)`);

  console.log("[3/5] 중복 제거...");
  const fresh = filterNew(relevant);
  console.log(`  → 신규 ${fresh.length}건`);

  if (fresh.length === 0) {
    console.log("신규 기사 없음. 종료.");
    return;
  }

  console.log("[4/5] 번역·요약·태깅...");
  const translated = await translateBatch(fresh);

  console.log("[5/5] 메일 발송...");
  await sendDigest(translated);
}

main().catch((err) => {
  console.error("파이프라인 실패:", err);
  process.exit(1);
});
