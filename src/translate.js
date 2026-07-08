import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CATEGORIES = [
  "마케팅", "티켓팅", "매출·스폰서십", "커뮤니티", "유스",
  "구단운영·인사", "선수단 운영", "기타",
];

export async function translateAndTag(item) {
  const prompt = `다음은 해외 축구 구단의 보도자료 제목이다. 이를 바탕으로 아래 JSON 형식으로만 답하라.

구단/소스: ${item.source}
리그: ${item.league}
원문 제목: ${item.title}
URL: ${item.url}

{
  "title_ko": "한글로 자연스럽게 번역한 제목",
  "summary_ko": "3줄 이내 한글 핵심 요약 (제목 정보만으로 추정 가능한 범위에서, 과도한 추측 금지)",
  "category": "${CATEGORIES.join(" | ")} 중 하나"
}`;

  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 400,
    messages: [{ role: "user", content: prompt }],
  });

  const text = res.content.find((b) => b.type === "text")?.text || "{}";
  const clean = text.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(clean);
    return { ...item, ...parsed };
  } catch {
    return { ...item, title_ko: item.title, summary_ko: "", category: "기타" };
  }
}

export async function translateBatch(items) {
  const out = [];
  for (const item of items) {
    out.push(await translateAndTag(item));
    await new Promise((r) => setTimeout(r, 300));
  }
  return out;
}
