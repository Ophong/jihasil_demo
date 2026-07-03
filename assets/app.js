(() => {
  "use strict";

  const demoData = Object.freeze({
    generatedAt: "2026-03-27T09:00:00+09:00",
    members: [
      {
        id: "demo-ari",
        name: "Ari",
        role: "Variety stream",
        status: "live",
        title: "Evening co-op room",
        category: "Games",
        viewers: 1284,
        startedAt: "2026-03-27T07:42:00+09:00",
        accent: "mint",
      },
      {
        id: "demo-lumi",
        name: "Lumi",
        role: "Talk and music",
        status: "offline",
        title: "Last checked 12 minutes ago",
        category: "Offline",
        viewers: 0,
        startedAt: null,
        accent: "sky",
      },
      {
        id: "demo-nara",
        name: "Nara",
        role: "Cafe broadcast",
        status: "live",
        title: "Cafe desk build log",
        category: "IRL",
        viewers: 842,
        startedAt: "2026-03-27T08:18:00+09:00",
        accent: "coral",
      },
      {
        id: "demo-sion",
        name: "Sion",
        role: "Late-night radio",
        status: "offline",
        title: "Waiting for next schedule",
        category: "Offline",
        viewers: 0,
        startedAt: null,
        accent: "violet",
      },
    ],
    schedule: [
      { time: "20:00", member: "Ari", label: "Co-op highlight review", state: "confirmed" },
      { time: "21:30", member: "Nara", label: "Cafe Q&A archive", state: "draft" },
      { time: "23:00", member: "Sion", label: "Radio recap", state: "confirmed" },
    ],
    ops: [
      "DigitalOcean cron runner was removed from the public build.",
      "Supabase service role access is not required in demo mode.",
      "All displayed records are local, anonymized, and deterministic.",
      "The UI keeps the original data contract shape for portfolio review.",
    ],
    caseStudy: [
      {
        title: "Problem",
        body: "Fans needed one fast screen for four live states, recent activity, and schedule context without opening each channel.",
      },
      {
        title: "Architecture",
        body: "The private build used a Python collector, Supabase persistence, and a Next.js dashboard. This demo preserves the interface while replacing runtime dependencies with local sample data.",
      },
      {
        title: "Cost control",
        body: "The portfolio build avoids always-on VPS resources, cron jobs, and external API calls. It can be hosted as static files on GitHub Pages, Cloudflare Pages, or Vercel Hobby.",
      },
    ],
    security: [
      "No environment variables or credential placeholders are required.",
      "No Supabase service role key, API key, OAuth secret, deploy key, or server IP is included.",
      "No external scripts, fonts, images, analytics, or API requests are loaded.",
      "Content is rendered with DOM text nodes instead of HTML string injection.",
      "A restrictive Content Security Policy is declared in index.html.",
      "Sample people, channels, timestamps, and metrics are fictional.",
    ],
  });

  const state = {
    view: "board",
    filter: "all",
  };

  const selectors = {
    metrics: document.querySelector("#metric-grid"),
    workspaceTitle: document.querySelector("#workspace-title"),
    workspace: document.querySelector("#workspace-content"),
    caseGrid: document.querySelector("#case-grid"),
    securityList: document.querySelector("#security-list"),
    refreshButton: document.querySelector("#sample-refresh"),
    refreshNote: document.querySelector("#refresh-note"),
    viewButtons: Array.from(document.querySelectorAll("[data-view]")),
    filterButtons: Array.from(document.querySelectorAll("[data-filter]")),
  };

  function createElement(tagName, options = {}, children = []) {
    const node = document.createElement(tagName);

    if (options.className) {
      node.className = options.className;
    }

    if (options.text !== undefined) {
      node.textContent = options.text;
    }

    if (options.attrs) {
      for (const [name, value] of Object.entries(options.attrs)) {
        node.setAttribute(name, String(value));
      }
    }

    for (const child of children) {
      node.append(child);
    }

    return node;
  }

  function replaceChildren(parent, children) {
    parent.replaceChildren(...children);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("ko-KR").format(value);
  }

  function formatTime(isoString) {
    if (!isoString) {
      return "scheduled";
    }

    return new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Seoul",
    }).format(new Date(isoString));
  }

  function statusText(status) {
    return status === "live" ? "LIVE" : "OFFLINE";
  }

  function renderMetrics() {
    const liveCount = demoData.members.filter((member) => member.status === "live").length;
    const totalViewers = demoData.members.reduce((sum, member) => sum + member.viewers, 0);
    const metrics = [
      ["Members", demoData.members.length],
      ["Live now", liveCount],
      ["Sample viewers", formatNumber(totalViewers)],
      ["Network calls", 0],
    ];

    replaceChildren(
      selectors.metrics,
      metrics.map(([label, value]) =>
        createElement("article", { className: "metric-card" }, [
          createElement("span", { text: label }),
          createElement("strong", { text: String(value) }),
        ]),
      ),
    );
  }

  function renderMemberCard(member) {
    const initials = member.name.slice(0, 2).toUpperCase();
    const metaText =
      member.status === "live"
        ? `${member.category} / ${formatNumber(member.viewers)} viewers / since ${formatTime(member.startedAt)}`
        : member.title;

    return createElement("article", { className: `member-card accent-${member.accent}` }, [
      createElement("div", { className: "avatar", text: initials, attrs: { "aria-hidden": "true" } }),
      createElement("div", { className: "member-copy" }, [
        createElement("div", { className: "member-heading" }, [
          createElement("div", {}, [
            createElement("h3", { text: member.name }),
            createElement("p", { text: member.role }),
          ]),
          createElement("span", { className: `status-pill status-${member.status}`, text: statusText(member.status) }),
        ]),
        createElement("p", { className: "member-title", text: member.status === "live" ? member.title : "Offline" }),
        createElement("p", { className: "member-meta", text: metaText }),
      ]),
    ]);
  }

  function filteredMembers() {
    if (state.filter === "all") {
      return demoData.members;
    }

    return demoData.members.filter((member) => member.status === state.filter);
  }

  function renderBoard() {
    selectors.workspaceTitle.textContent = "Live board";
    const members = filteredMembers();
    const emptyState = createElement("div", { className: "empty-state" }, [
      createElement("h3", { text: "No members in this filter" }),
      createElement("p", { text: "The demo data is intentionally small and deterministic." }),
    ]);

    replaceChildren(selectors.workspace, [
      createElement("div", { className: "member-grid" }, members.length ? members.map(renderMemberCard) : [emptyState]),
    ]);
  }

  function renderSchedule() {
    selectors.workspaceTitle.textContent = "Schedule";
    replaceChildren(selectors.workspace, [
      createElement(
        "div",
        { className: "schedule-list" },
        demoData.schedule.map((item) =>
          createElement("article", { className: "schedule-row" }, [
            createElement("time", { text: item.time }),
            createElement("div", {}, [
              createElement("h3", { text: item.label }),
              createElement("p", { text: `${item.member} / ${item.state}` }),
            ]),
            createElement("span", { text: item.state === "confirmed" ? "ready" : "draft" }),
          ]),
        ),
      ),
    ]);
  }

  function renderOps() {
    selectors.workspaceTitle.textContent = "Ops notes";
    replaceChildren(selectors.workspace, [
      createElement(
        "div",
        { className: "ops-list" },
        demoData.ops.map((item, index) =>
          createElement("article", { className: "ops-row" }, [
            createElement("span", { text: `0${index + 1}` }),
            createElement("p", { text: item }),
          ]),
        ),
      ),
    ]);
  }

  function renderWorkspace() {
    if (state.view === "schedule") {
      renderSchedule();
    } else if (state.view === "ops") {
      renderOps();
    } else {
      renderBoard();
    }
  }

  function renderCaseStudy() {
    replaceChildren(
      selectors.caseGrid,
      demoData.caseStudy.map((item) =>
        createElement("article", { className: "case-card" }, [
          createElement("h3", { text: item.title }),
          createElement("p", { text: item.body }),
        ]),
      ),
    );
  }

  function renderSecurity() {
    replaceChildren(
      selectors.securityList,
      demoData.security.map((item) =>
        createElement("article", { className: "security-row" }, [
          createElement("span", { className: "check-mark", text: "OK", attrs: { "aria-hidden": "true" } }),
          createElement("p", { text: item }),
        ]),
      ),
    );
  }

  function syncControls() {
    for (const button of selectors.viewButtons) {
      button.classList.toggle("is-active", button.dataset.view === state.view);
    }

    for (const button of selectors.filterButtons) {
      button.classList.toggle("is-selected", button.dataset.filter === state.filter);
      button.disabled = state.view !== "board";
    }
  }

  function render() {
    syncControls();
    renderMetrics();
    renderWorkspace();
    renderCaseStudy();
    renderSecurity();
  }

  for (const button of selectors.viewButtons) {
    button.addEventListener("click", () => {
      state.view = button.dataset.view || "board";
      render();
    });
  }

  for (const button of selectors.filterButtons) {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter || "all";
      render();
    });
  }

  selectors.refreshButton.addEventListener("click", () => {
    const refreshedAt = new Intl.DateTimeFormat("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Seoul",
    }).format(new Date());

    selectors.refreshNote.textContent = `샘플 UI만 ${refreshedAt}에 다시 렌더링했습니다. 외부 요청은 발생하지 않았습니다.`;
    render();
  });

  render();
})();

