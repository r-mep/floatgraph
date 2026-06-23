(() => {
  // ─── Theme state ─────────────────────────────────────────────
  const osPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  // stored value: "light" | "dark" | null (= follow OS)
  let storedTheme = localStorage.getItem("floatgraph-theme");

  function isCurrentlyDark() {
    if (storedTheme === "dark") return true;
    if (storedTheme === "light") return false;
    return osPrefersDark.matches;
  }

  function applyTheme() {
    const dark = isCurrentlyDark();
    if (storedTheme) {
      document.documentElement.dataset.theme = storedTheme;
    } else {
      delete document.documentElement.dataset.theme;
    }
    const btn = document.getElementById("theme-toggle");
    btn.textContent = dark ? "☀" : "🌙";
    btn.setAttribute(
      "aria-label",
      dark ? ui("themeToggleToLight") : ui("themeToggleToDark")
    );
  }

  document.getElementById("theme-toggle").addEventListener("click", () => {
    storedTheme = isCurrentlyDark() ? "light" : "dark";
    localStorage.setItem("floatgraph-theme", storedTheme);
    applyTheme();
  });

  // Sync when OS preference changes (no manual override)
  osPrefersDark.addEventListener("change", () => {
    if (!storedTheme) applyTheme();
  });

  // ─── Language state ──────────────────────────────────────────
  const SUPPORTED_LANGS = ["ja", "en"];
  const DEFAULT_LANG = navigator.language.startsWith("ja") ? "ja" : "en";

  let currentLang = (() => {
    const stored = localStorage.getItem("floatgraph-lang");
    return SUPPORTED_LANGS.includes(stored) ? stored : DEFAULT_LANG;
  })();

  function t(node, field) {
    const val = node[field];
    if (val && typeof val === "object") return val[currentLang] ?? val.ja ?? val.en ?? "";
    return val ?? "";
  }

  function ui(key) {
    return I18N[currentLang]?.[key] ?? I18N.ja[key] ?? "";
  }

  function applyLang() {
    document.documentElement.lang = currentLang;
    document.getElementById("hint").textContent = ui("hint");
    document.getElementById("panel-close").setAttribute("aria-label", ui("close"));
    document.getElementById("lightbox-close").setAttribute("aria-label", ui("close"));

    const btn = document.getElementById("lang-toggle");
    btn.textContent = ui("langToggleText");
    btn.setAttribute("aria-label", ui("langToggleLabel"));

    // Re-render node labels if sim already ran
    d3.selectAll(".node text").text((d) => t(d, "label"));

    // Re-render open panel if any
    const activeId = document.getElementById("panel").dataset.activeId;
    if (activeId) {
      const node = GRAPH_DATA.nodes.find((n) => n.id === activeId);
      if (node) renderPanel(node);
    }
  }

  document.getElementById("lang-toggle").addEventListener("click", () => {
    currentLang = currentLang === "ja" ? "en" : "ja";
    localStorage.setItem("floatgraph-lang", currentLang);
    applyLang();
  });

  // ─── SVG setup ───────────────────────────────────────────────
  const { nodes, links } = GRAPH_DATA;
  const svg = d3.select("#graph");
  const container = svg.append("g");

  const zoom = d3.zoom()
    .scaleExtent([0.3, 4])
    .on("zoom", (e) => container.attr("transform", e.transform));
  svg.call(zoom);
  svg.on("dblclick.zoom", null);

  // ─── Force simulation ─────────────────────────────────────────
  const sim = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((d) => d.id).distance(160))
    .force("charge", d3.forceManyBody().strength(-280))
    .force("collision", d3.forceCollide(60))
    .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
    .alphaDecay(0.015)
    .velocityDecay(0.4);

  function drift() {
    nodes.forEach((n) => {
      n.vx = (n.vx || 0) + (Math.random() - 0.5) * 0.08;
      n.vy = (n.vy || 0) + (Math.random() - 0.5) * 0.08;
    });
    sim.alpha(Math.max(sim.alpha(), 0.02)).restart();
  }
  setInterval(drift, 2400);

  // ─── Links ───────────────────────────────────────────────────
  const linkEl = container.append("g")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("class", "link");

  // ─── Nodes ───────────────────────────────────────────────────
  const nodeEl = container.append("g")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("class", "node")
    .call(
      d3.drag()
        .on("start", (e, d) => {
          if (!e.active) sim.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on("end", (e, d) => {
          if (!e.active) sim.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
    )
    .on("click", (e, d) => { e.stopPropagation(); openPanel(d); });

  nodeEl.append("circle").attr("r", 18);

  nodeEl.append("text")
    .attr("y", 32)
    .text((d) => t(d, "label"));

  // ─── Tick ────────────────────────────────────────────────────
  sim.on("tick", () => {
    linkEl
      .attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
    nodeEl.attr("transform", (d) => `translate(${d.x},${d.y})`);
  });

  // ─── Panel ───────────────────────────────────────────────────
  const panel = document.getElementById("panel");
  const overlay = document.getElementById("overlay");

  function renderPanel(d) {
    document.getElementById("p-icon").textContent = d.icon || "✦";
    document.getElementById("p-title").textContent = t(d, "label");
    document.getElementById("p-desc").textContent = t(d, "description");

    const grid = document.getElementById("p-photos");
    grid.innerHTML = "";
    const photos = (d.photos || []).slice(0, 3);
    photos.forEach((src) => {
      const img = document.createElement("img");
      img.src = src; img.alt = "";
      img.addEventListener("click", () => openLightbox(src));
      grid.appendChild(img);
    });
    grid.dataset.count = photos.length;
  }

  function openPanel(d) {
    panel.dataset.activeId = d.id;
    renderPanel(d);
    panel.classList.add("open");
    overlay.classList.add("visible");
    document.getElementById("hint").style.opacity = "0";
  }

  function closePanel() {
    panel.classList.remove("open");
    overlay.classList.remove("visible");
    delete panel.dataset.activeId;
  }

  document.getElementById("panel-close").addEventListener("click", closePanel);
  overlay.addEventListener("click", closePanel);
  svg.on("click", closePanel);

  // ─── Lightbox ────────────────────────────────────────────────
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add("open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightboxImg.src = "";
  }

  lightbox.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) closeLightbox();
  });

  // ─── Resize ───────────────────────────────────────────────────
  window.addEventListener("resize", () => {
    sim.force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));
    sim.alpha(0.3).restart();
  });

  // ─── Init ────────────────────────────────────────────────────
  applyTheme();
  applyLang();
})();
