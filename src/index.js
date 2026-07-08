import { collectAll } from "./collect.js";
import { filterNew } from "./cache.js";
import { translateBatch } from "./translate.js";
import { sendDigest } from "./mail.js";

async function main() {
  console.log("[1/4] 수집 시작...");
  const raw = await collectAll();
  console.log(`  → ${raw.length}건 수집`);

  console.log("[2/4] 중복 제거...");
  const fresh = filterNew(raw);
  console.log(`  → 신규 ${fresh.length}건`);

  if (fresh.length === 0) {
    console.log("신규 기사 없음. 종료.");
    return;
  }

  console.log("[3/4] 번역·요약·태깅...");
  const translated = await translateBatch(fresh);

  console.log("[4/4] 메일 발송...");
  await sendDigest(translated);
}

main().catch((err) => {
  console.error("파이프라인 실패:", err);
  process.exit(1);
});
