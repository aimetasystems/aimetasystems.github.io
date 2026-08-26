/* Member data rendering with image fallbacks and no empty categories. */
(function () {
  "use strict";
  const fallbackImage = "assets/images/placeholders/member-placeholder.svg";
  const categories = [
    ["principalInvestigator", "Principal Investigator", "pi"],
    ["graduateResearchers", "Graduate Researchers", "student"],
    ["undergraduateResearchers", "Undergraduate Researchers", "student"]
  ];
  function path(file) { return `${window.AIMSite.root}${file}`; }
  function esc(value) { return window.AIMSite.escapeHtml(value || ""); }
  function link(url, text) { return url ? `<li><a href="${esc(url)}" ${url.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""}>${text}${url.startsWith("http") ? ' <span aria-hidden="true">↗</span>' : ""}</a></li>` : ""; }
  function detailLink(url, label, value) { return url ? `<li><a href="${esc(url)}"><strong>${esc(label)}:</strong> ${esc(value)}</a></li>` : ""; }
  function photo(member) { return `<img class="member-photo" src="${esc(member.image ? path(member.image) : path(fallbackImage))}" alt="${esc(member.imageAlt || `${member.name || "Sample member"} portrait placeholder`)}" loading="lazy" onerror="this.src='${path(fallbackImage)}'">`; }
  function experienceList(experience) {
    if (!Array.isArray(experience) || !experience.length) return "";
    return `<section class="member-experience" aria-label="Curriculum vitae">
      <ul>${experience.map((entry) => `<li>
        <strong>${esc(entry.title)}</strong>${entry.department ? ` <span class="member-experience__department">[${esc(entry.department)}]</span>` : ""}${entry.institution ? ` <span class="member-experience__institution">${esc(entry.institution)}</span>` : ""}<time>${esc(entry.period)}</time>
      </li>`).join("")}</ul>
    </section>`;
  }
  function piCard(member) {
    const experience = Array.isArray(member.experience) ? experienceList(member.experience) : (member.experience ? `<div class="member-details"><div><h4>Professional Experience</h4><p>${esc(member.experience)}</p></div></div>` : "");
    return `<article class="member-card member-card--pi" data-reveal>
      ${photo(member)}
      <div class="member-body">
        <h3>${esc(member.name)}</h3>
        <p class="member-role">${esc(member.position)}</p>
        <p class="member-affiliation">${esc(member.affiliation)}</p>
        ${member.education ? `<div class="member-details"><div><h4>Education</h4><p>${esc(member.education)}</p></div></div>` : ""}
        ${experience}
        <ul class="member-links member-contact-links">
          ${member.email ? detailLink(`mailto:${member.email}`, "Email", member.email) : ""}
          ${member.telephone ? detailLink(`tel:${member.telephone.replace(/[^+\d]/g, "")}`, "Tel", member.telephone) : ""}
          ${link(member.googleScholar, "Google Scholar")}
          ${link(member.orcid, "ORCID")}
          ${link(member.cv, "CV")}
        </ul>
      </div>
    </article>`;
  }
  function studentCard(member) {
    return `<article class="member-card" data-reveal>
      ${photo(member)}
      <div class="member-body">
        <h3>${esc(member.name)}</h3>
        <p class="member-role">${esc(member.program || member.position)}</p>
        ${member.researchTopic ? `<p class="member-topic">${esc(member.researchTopic)}</p>` : ""}
        ${member.email ? `<ul class="member-links">${link(`mailto:${member.email}`, "Email")}</ul>` : ""}
      </div>
    </article>`;
  }
  async function init() {
    const mount = document.querySelector("[data-members]");
    if (!mount) return;
    try {
      const response = await fetch(path("data/members.json"), { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const sections = categories.map(([key, title, kind]) => {
        const members = Array.isArray(data[key]) ? data[key].filter((member) => member && member.name && !member.sample) : [];
        if (!members.length) return "";
        const content = kind === "pi" ? members.map(piCard).join("") : `<div class="member-grid">${members.map(studentCard).join("")}</div>`;
        return `<section class="member-section"><h2>${title}</h2>${content}</section>`;
      }).filter(Boolean);
      mount.innerHTML = sections.length ? sections.join("") : '<p class="no-content">Member information will be added soon.</p>';
    } catch (error) {
      mount.innerHTML = '<p class="no-content">Member data could not be loaded. Please run the site through a local web server.</p>';
      console.warn("AIM Lab member data error:", error);
    }
  }
  init();
}());
