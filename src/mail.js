import nodemailer from "nodemailer";

const LEAGUE_ORDER = ["EPL", "챔피언십", "J1J2J3"];
const LEAGUE_LABEL = { EPL: "🇬🇧 EPL", 챔피언십: "🇬🇧 챔피언십", J1J2J3: "🇯🇵 J1·J2·J3" };

function buildHtml(items) {
  const byLeague = {};
  for (const it of items) {
    (byLeague[it.league] ||= []).push(it);
  }

  let html = `<h2>해외 리그 BP 클리핑 브리핑</h2>
<p style="color:#666;font-size:13px;">${new Date().toISOString().slice(0, 10)} · 총 ${items.length}건</p>`;

  for (const league of LEAGUE_ORDER) {
    const list = byLeague[league];
    if (!list || list.length === 0) continue;
    html += `<h3>${LEAGUE_LABEL[league] || league}</h3>`;
    for (const it of list) {
      html += `<p><b>${it.source}</b> — ${it.title_ko}<br>
${it.summary_ko}<br>
<i>카테고리: ${it.category}</i> · <a href="${it.url}">원문</a></p>`;
    }
  }
  return html;
}

export async function sendDigest(items) {
  if (items.length === 0) {
    console.log("[mail] 신규 항목 없음 — 발송 생략");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const today = new Date().toISOString().slice(5, 10).replace("-", "/");
  const counts = LEAGUE_ORDER.map(
    (l) => `${LEAGUE_LABEL[l]?.replace(/^\S+\s/, "") || l} ${items.filter((i) => i.league === l).length}`
  ).join(" · ");

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: `[${today}] 해외 리그 BP 클리핑 — 총 ${items.length}건 (${counts})`,
    html: buildHtml(items),
  });

  console.log(`[mail] 발송 완료: ${items.length}건`);
}
