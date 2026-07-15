export type DigestArticle = {
  title: string;
  link: string;
  source: string;
  category: string;
  date: string;
  description: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  "nhs-digital-health": "NHS & Digital Health",
  "social-care-tech": "Social Care Tech",
  "policy-regulation": "Policy & Regulation",
  "research-innovation": "Research & Innovation",
  "startups-funding": "Startups & Funding",
  world: "World",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function unsubscribeFooter(unsubscribeUrl: string): { html: string; text: string } {
  return {
    html: `<p style="margin-top:24px;padding-top:16px;border-top:1px solid #e2e5ea;font-size:12px;color:#6b7280">
      <a href="${unsubscribeUrl}" style="color:#6b7280">Unsubscribe</a>
    </p>`,
    text: `\n\nUnsubscribe: ${unsubscribeUrl}`,
  };
}

export function welcomeEmail(unsubscribeUrl: string) {
  const footer = unsubscribeFooter(unsubscribeUrl);
  const subject = "You're subscribed to CareZeno";
  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#12161c">
      <h1 style="font-size:20px;margin-bottom:8px">
        Care<span style="color:#00a876">Zeno</span>
      </h1>
      <p>Thanks for registering. You'll get an email digest whenever there's fresh AI-in-health-and-social-care news — new NHS digital health, social care tech, policy, research, startup and world coverage.</p>
      ${footer.html}
    </div>`;
  const text = `Thanks for registering. You'll get an email digest whenever there's fresh AI-in-health-and-social-care news.${footer.text}`;
  return { subject, html, text };
}

export function digestEmail(siteUrl: string, unsubscribeUrl: string, articles: DigestArticle[]) {
  const footer = unsubscribeFooter(unsubscribeUrl);
  const subject =
    articles.length === 1
      ? `CareZeno: ${articles[0].title}`
      : `CareZeno: ${articles.length} new stories in AI health & social care`;

  const byCategory = new Map<string, DigestArticle[]>();
  for (const a of articles) {
    if (!byCategory.has(a.category)) byCategory.set(a.category, []);
    byCategory.get(a.category)!.push(a);
  }

  const sectionsHtml = [...byCategory.entries()]
    .map(([category, items]) => {
      const label = CATEGORY_LABELS[category] || category;
      const itemsHtml = items
        .map(
          (a) => `
        <li style="margin-bottom:12px">
          <a href="${a.link}" style="color:#12161c;font-weight:600;text-decoration:none">${escapeHtml(a.title)}</a>
          <div style="font-size:12px;color:#6b7280">${escapeHtml(a.source)}</div>
          ${a.description ? `<div style="font-size:13px;color:#374151;margin-top:2px">${escapeHtml(a.description)}</div>` : ""}
        </li>`
        )
        .join("");
      return `
        <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.04em;color:#00a876;margin:20px 0 8px">${label}</h2>
        <ul style="list-style:none;padding:0;margin:0">${itemsHtml}</ul>`;
    })
    .join("");

  const sectionsText = [...byCategory.entries()]
    .map(([category, items]) => {
      const label = CATEGORY_LABELS[category] || category;
      const lines = items.map((a) => `- ${a.title} (${a.source}) ${a.link}`).join("\n");
      return `${label}\n${lines}`;
    })
    .join("\n\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;margin:0 auto;color:#12161c">
      <h1 style="font-size:20px;margin-bottom:4px">
        Care<span style="color:#00a876">Zeno</span>
      </h1>
      <p style="color:#6b7280;font-size:13px;margin-top:0">Your AI in health &amp; social care digest</p>
      ${sectionsHtml}
      <p style="margin-top:20px"><a href="${siteUrl}" style="color:#00a876">See all headlines &rarr;</a></p>
      ${footer.html}
    </div>`;
  const text = `Your AI in health & social care digest\n\n${sectionsText}\n\nSee all headlines: ${siteUrl}${footer.text}`;

  return { subject, html, text };
}
