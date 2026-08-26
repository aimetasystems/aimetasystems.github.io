/* Latest News renderer: latest three valid entries only. */
(function () {
  "use strict";
  function path(file) { return `${window.AIMSite.root}${file}`; }
  function esc(value) { return window.AIMSite.escapeHtml(value || ""); }
  function dateLabel(value) {
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(date);
  }
  async function init() {
    const mount = document.querySelector("[data-latest-news]");
    if (!mount) return;
    try {
      const response = await fetch(path("data/news.json"), { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const entries = (Array.isArray(data) ? data : []).filter((item) => item && item.title && item.date).sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 3);
      if (!entries.length) {
        mount.innerHTML = '<p class="no-content">Latest news will be posted here.</p>';
        return;
      }
      mount.innerHTML = entries.map((item) => {
        const body = `<h3>${esc(item.title)}</h3>${item.summary ? `<p>${esc(item.summary)}</p>` : ""}`;
        return `<article class="news-item"><time class="news-date" datetime="${esc(item.date)}">${esc(dateLabel(item.date))}</time><div>${item.url ? `<a href="${esc(item.url)}" ${item.url.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}>${body}</a>` : body}</div></article>`;
      }).join("");
    } catch (error) {
      mount.innerHTML = '<p class="no-content">News data could not be loaded. Please run the site through a local web server.</p>';
      console.warn("AIM Lab news data error:", error);
    }
  }
  init();
}());
