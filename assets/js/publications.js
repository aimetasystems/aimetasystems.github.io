/* CV-style publication rendering. Data is manually transcribed from the supplied CV only. */
(function () {
  "use strict";

  function path(file) {
    return `${window.AIMSite.root}${file}`;
  }

  function dataPath(file) {
    const separator = file.includes("?") ? "&" : "?";
    return `${path(file)}${separator}v=20260803-2042`;
  }

  function escape(value) {
    return window.AIMSite.escapeHtml(String(value || ""));
  }

  function doiUrl(doi) {
    if (!doi) return "";
    return /^https?:\/\//i.test(doi) ? doi : `https://doi.org/${doi}`;
  }

  function authorMarkup(authors) {
    const escaped = escape(authors);
    return escaped.replace(/\b(?:Jaebum Noh|J\.\s*Noh|Noh,\s*J\.)/g, (name) => `<strong>${name}</strong>`);
  }

  function details(entry) {
    const venue = entry.journal || entry.venue;
    const issue = entry.volume && entry.issue ? `${entry.volume}(${entry.issue})` : (entry.volume || entry.issue || "");
    const dateIncludesYear = entry.date && String(entry.date).includes(String(entry.year));
    const parts = [
      venue ? `<em>${escape(venue)}</em>` : "",
      issue,
      entry.pages || "",
      entry.date || "",
      dateIncludesYear ? "" : (entry.year || "")
    ].filter(Boolean);
    return parts.join(", ");
  }

  function titleMarkup(entry) {
    const title = `“${escape(entry.title)}”`;
    const url = doiUrl(entry.doi) || entry.url;
    return url ? `<a class="publication-cv__title" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${title}</a>` : `<span class="publication-cv__title">${title}</span>`;
  }

  function entryMarkup(entry, number) {
    const doi = entry.doi ? `<a class="publication-cv__doi" href="${escape(doiUrl(entry.doi))}" target="_blank" rel="noopener noreferrer">DOI: ${escape(entry.doi)}</a>` : "";
    const ifMetric = entry.impactFactor ? `<span>[IF: ${escape(entry.impactFactor)}]</span>` : "";
    const jcr = entry.jcr ? `<span>(JCR 상위 ${escape(entry.jcr.percent)}% in ${escape(entry.jcr.field)})</span>` : "";
    const citation = [authorMarkup(entry.authors), titleMarkup(entry), details(entry), doi, ifMetric, jcr]
      .filter(Boolean)
      .join(", ");
    const note = entry.note ? `<p class="publication-cv__note">${escape(entry.note)}</p>` : "";
    return `<li class="publication-cv__entry"><span class="publication-cv__number">${number}.</span><span class="publication-cv__citation">${citation}</span>${note}</li>`;
  }

  function sorted(entries) {
    return [...entries].sort((a, b) => Number(b.year || 0) - Number(a.year || 0) || Number(b.order || 0) - Number(a.order || 0));
  }

  function categoryMarkup(category) {
    const entries = sorted(category.entries || []);
    if (!entries.length) return "";
    return `<section class="publication-cv__section" aria-labelledby="${escape(category.id)}-heading">
      <h2 id="${escape(category.id)}-heading">${escape(category.title)}</h2>
      <ol class="publication-cv__list">${entries.map((entry, index) => entryMarkup(entry, index + 1)).join("")}</ol>
    </section>`;
  }

  async function init() {
    const mount = document.querySelector("[data-publication-cv]");
    if (!mount) return;
    try {
      const response = await fetch(dataPath("data/publications.json"), { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const categories = Array.isArray(data.categories) ? data.categories : [];
      mount.innerHTML = categories.map(categoryMarkup).join("") || '<p class="no-content">No verified publication entries are available yet.</p>';
      const notes = Array.isArray(data.notes) ? data.notes.filter(Boolean) : [];
      const notesMount = document.querySelector("[data-publication-notes]");
      if (notesMount && notes.length) notesMount.innerHTML = notes.map((note) => `<p>${escape(note)}</p>`).join("");
    } catch (error) {
      mount.innerHTML = '<p class="no-content">Publication data could not be loaded. Please run the site through a local web server.</p>';
      console.warn("AIM Lab publication data error:", error);
    }
  }

  init();
}());
