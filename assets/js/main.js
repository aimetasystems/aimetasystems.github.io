/* Shared navigation, footer, logo fallback, and progressive enhancement. */
(function () {
  "use strict";

  const site = {
    lab: "AIM Lab",
    fullName: "A.I. integrated Metasystems Lab",
    department: "Department of Optical Engineering",
    university: "Kumoh National Institute of Technology",
    email: "jbnoh30@kumoh.ac.kr",
    scholar: "https://scholar.google.com/citations?user=OyESjGYAAAAJ&hl=en",
    github: "https://github.com/aimetasystems"
  };

  const pagePath = location.pathname.replace(/index\.html$/, "").replace(/\/$/, "") || "/";
  const isSubpage = pagePath !== "/";
  const root = isSubpage ? "../" : "";
  const navItems = [
    { href: root || "./", label: "Home", path: "/" },
    { href: `${root}research/`, label: "Research", path: "/research" },
    { href: `${root}members/`, label: "Members", path: "/members" },
    { href: `${root}publications/`, label: "Publications", path: "/publications" },
    { href: `${root}news/`, label: "News", path: "/news" },
    { href: `${root}contact/`, label: "Contact Us", path: "/contact" }
  ];

  function current(path) {
    return pagePath === path ? ' aria-current="page"' : "";
  }

  function renderHeader() {
    const mount = document.querySelector("[data-site-header]");
    if (!mount) return;
    mount.innerHTML = `
      <a class="home-skip-link" href="#main-content">Skip to main content</a>
      <header class="home-header">
        <div class="home-header__inner">
          <a class="brand" href="${root || "./"}" aria-label="${site.lab} home">
            <img class="brand-logo" src="${root}assets/logo/aim-lab-header.svg?v=6" alt="${site.lab} — ${site.fullName}">
          </a>
          <nav class="home-nav" aria-label="Primary navigation">
            ${navItems.map((item) => `<a href="${item.href}"${current(item.path)}>${item.label}</a>`).join("")}
          </nav>
          <details class="home-mobile-nav">
            <summary aria-label="Open navigation menu"><span></span><span></span><span></span></summary>
            <nav aria-label="Mobile primary navigation">
              ${navItems.map((item) => `<a href="${item.href}"${current(item.path)}>${item.label}</a>`).join("")}
            </nav>
          </details>
        </div>
      </header>`;
  }

  function renderFooter() {
    const mount = document.querySelector("[data-site-footer]");
    if (!mount) return;
    const year = new Date().getFullYear();
    mount.innerHTML = `
      <footer class="site-footer">
        <div class="shell footer-simple">
          <div>
            <p class="footer-title">${site.lab}</p>
            <p>${site.department} · ${site.university}</p>
          </div>
          <div class="footer-links-inline">
            <a href="mailto:${site.email}">${site.email}</a>
            <a href="${site.scholar}" target="_blank" rel="noopener noreferrer">Google Scholar</a>
            <span>© ${year} AIM Lab</span>
          </div>
        </div>
      </footer>`;
  }

  function observeReveals() {
    document.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("is-visible"));
  }

  window.AIMSite = { root, site, escapeHtml: (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]) };
  renderHeader();
  renderFooter();
  observeReveals();
}());
