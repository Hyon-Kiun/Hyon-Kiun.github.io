// ==========================================================
// 全ページ共通のヘッダー・フッターを描画します。
// ナビゲーションを追加・変更したい場合は NAV_ITEMS を書き換えてください。
// ==========================================================
const NAV_ITEMS = [
  { href: "index.html", label: "トップページ" },
  { href: "profile.html", label: "プロフィール" },
  { href: "research.html", label: "研究" },
  { href: "activity.html", label: "活動" },
  { href: "seminar.html", label: "ゼミ" },
  { href: "access.html", label: "アクセス", cta: true }
];

function renderHeader() {
  const current = location.pathname.split("/").pop() || "index.html";
  const navHtml = NAV_ITEMS.map((item) => {
    const classes = [];
    if (item.href === current) classes.push("active");
    if (item.cta) classes.push("nav-cta");
    const classAttr = classes.length ? ` class="${classes.join(" ")}"` : "";
    return `<li><a href="${item.href}"${classAttr}>${item.label}</a></li>`;
  }).join("");

  const headerEl = document.getElementById("site-header");
  if (!headerEl) return;
  headerEl.innerHTML = `
    <div class="header-inner">
      <a class="brand" href="index.html">${SITE_CONFIG.personName}</a>
      <button class="nav-toggle" aria-label="メニューを開く" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <nav class="site-nav">
        <ul>${navHtml}</ul>
      </nav>
    </div>
  `;

  const toggleBtn = headerEl.querySelector(".nav-toggle");
  const nav = headerEl.querySelector(".site-nav");
  toggleBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });
}

function renderFooter() {
  const footerEl = document.getElementById("site-footer");
  if (!footerEl) return;
  const year = new Date().getFullYear();
  footerEl.innerHTML = `
    <div class="footer-inner">
      <p>&copy; ${year} ${SITE_CONFIG.personName}</p>
      <p><a href="mailto:${SITE_CONFIG.email}">${SITE_CONFIG.email}</a></p>
    </div>
  `;
}

// 活動一覧を描画します。limitを指定すると新しい順に指定件数だけ表示します(トップページ用)。
function renderActivityList(containerId, limit) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = limit ? ACTIVITY_ITEMS.slice(0, limit) : ACTIVITY_ITEMS;

  if (items.length === 0) {
    container.innerHTML = `<p class="empty">まだ活動記録がありません。</p>`;
    return;
  }

  container.innerHTML = items
    .map(
      (item) => `
    <li class="news-item reveal">
      <div class="news-meta">
        <span class="news-date">${item.date}</span>
        <span class="news-category">${item.category}</span>
      </div>
      <div class="news-body">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </div>
    </li>
  `
    )
    .join("");
}

// 研究テーマ・業績一覧を描画します。
function renderResearch(themesId, pubsId) {
  const themesEl = document.getElementById(themesId);
  if (themesEl) {
    themesEl.innerHTML = RESEARCH_THEMES.map(
      (t) => `
      <div class="research-theme reveal">
        <h3>${t.title}</h3>
        <p>${t.body}</p>
      </div>
    `
    ).join("");
  }

  const pubsEl = document.getElementById(pubsId);
  if (pubsEl) {
    pubsEl.innerHTML = PUBLICATIONS.map(
      (p) => `
      <li class="pub-item reveal">
        <span class="pub-year">${p.year}</span>
        <span class="pub-type">${p.type}</span>
        <span class="pub-text">${p.text}</span>
      </li>
    `
    ).join("");
  }
}

// 画面内に入った .reveal 要素に is-visible を付けてふわっと表示します。
function setupScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (items.length === 0) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();

  if (typeof ACTIVITY_ITEMS !== "undefined") {
    renderActivityList("activity-list-full");
    renderActivityList("activity-list-preview", 3);
  }
  if (typeof RESEARCH_THEMES !== "undefined") {
    renderResearch("research-themes", "publications-list");
  }

  setupScrollReveal();
});
