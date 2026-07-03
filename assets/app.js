(function () {
  const MEMBER_LABELS = {
    bbungchi: "연토리뿡치",
    cocomizzang: "코코미짱",
    inorisama: "마왕이노리!",
    aengduwoo: "우앵두!",
  };

  const page = document.body.dataset.page || "home";
  const apiBase = resolveApiBase();

  const api = {
    liveStatus: `${apiBase}/api/live-status`,
    schedule: `${apiBase}/api/schedule?days=21`,
    posts: `${apiBase}/api/posts?source=naver_cafe&limit=12`,
    recapPosts: `${apiBase}/api/posts?source=naver_cafe&limit=30`,
    recentSummaries: `${apiBase}/api/summaries/recent?range=7d&limit=6`,
    todaySummaries: `${apiBase}/api/summaries/recent?range=24h&limit=20`,
    topClips: `${apiBase}/api/clips/top?days=7&limit=20`,
  };

  if (page === "home") {
    void renderHome();
    return;
  }

  if (page === "recap") {
    void renderRecap();
    return;
  }

  if (page === "clips") {
    void renderClips();
  }

  async function renderHome() {
    try {
      const [liveRows, scheduleEntries, posts, summariesPayload] = await Promise.all([
        fetchJson(api.liveStatus),
        fetchJson(api.schedule),
        fetchJson(api.posts),
        fetchJson(api.recentSummaries),
      ]);

      renderUpdatedAt(liveRows);
      renderLiveRows(liveRows);
      renderSchedule(scheduleEntries);
      renderPosts(posts, document.querySelector("[data-post-grid]"));
      renderSummaries((summariesPayload && summariesPayload.items) || [], document.querySelector("[data-summary-grid]"));
    } catch (error) {
      renderError(document.querySelector("[data-live-grid]"), error);
      renderError(document.querySelector("[data-schedule-list]"), error);
      renderError(document.querySelector("[data-post-grid]"), error);
      renderError(document.querySelector("[data-summary-grid]"), error);
    }
  }

  async function renderRecap() {
    const sessionGrid = document.querySelector("[data-recap-session-grid]");
    const postGrid = document.querySelector("[data-recap-post-grid]");

    try {
      const [summariesPayload, posts] = await Promise.all([
        fetchJson(api.todaySummaries),
        fetchJson(api.recapPosts),
      ]);

      const summaries = ((summariesPayload && summariesPayload.items) || []).filter(function (item) {
        return isTodayKst(item.started_at);
      });
      const todayPosts = posts.filter(function (item) {
        return isTodayKst(item.published_at || item.fetched_at);
      });

      const sessionCount = document.querySelector("[data-recap-session-count]");
      const postCount = document.querySelector("[data-recap-post-count]");
      if (sessionCount) sessionCount.textContent = String(summaries.length);
      if (postCount) postCount.textContent = String(todayPosts.length);

      renderSummaries(summaries, sessionGrid);
      renderPosts(todayPosts, postGrid);
    } catch (error) {
      renderError(sessionGrid, error);
      renderError(postGrid, error);
    }
  }

  async function renderClips() {
    const clipGrid = document.querySelector("[data-clip-grid]");

    try {
      const payload = await fetchJson(api.topClips);
      const items = (payload && payload.items) || [];
      const range = document.querySelector("[data-clip-range]");
      if (range) {
        range.textContent = [payload.startDateKst, payload.endDateKst].filter(Boolean).join(" ~ ");
      }

      if (!clipGrid) {
        return;
      }

      if (!items.length) {
        clipGrid.innerHTML = '<div class="empty-card">최근 7일 클립이 없습니다.</div>';
        return;
      }

      clipGrid.innerHTML = items.map(renderClipCard).join("");
    } catch (error) {
      renderError(clipGrid, error);
    }
  }

  function renderUpdatedAt(rows) {
    const node = document.querySelector("[data-updated-label]");
    if (!node) {
      return;
    }

    const latest = rows.reduce(function (best, row) {
      if (!best) {
        return row.updated_at;
      }
      return Date.parse(row.updated_at) > Date.parse(best) ? row.updated_at : best;
    }, null);

    node.textContent = latest ? formatRelativeTime(latest) + " (" + formatKstDateTime(latest) + ")" : "데이터 없음";
  }

  function renderLiveRows(rows) {
    const grid = document.querySelector("[data-live-grid]");
    const count = document.querySelector("[data-live-count]");
    if (!grid) {
      return;
    }

    if (count) {
      count.textContent = rows.filter(function (row) { return row.is_live; }).length + " live";
    }

    if (!rows.length) {
      grid.innerHTML = '<div class="empty-card">라이브 상태 데이터가 없습니다.</div>';
      return;
    }

    grid.innerHTML = rows.map(renderLiveCard).join("");
  }

  function renderSchedule(entries) {
    const list = document.querySelector("[data-schedule-list]");
    const count = document.querySelector("[data-schedule-count]");
    if (!list) {
      return;
    }

    if (count) {
      count.textContent = entries.length + " entries";
    }

    if (!entries.length) {
      list.innerHTML = '<div class="empty-card">공개 일정이 없습니다.</div>';
      return;
    }

    list.innerHTML = entries.slice(0, 8).map(renderScheduleCard).join("");
  }

  function renderPosts(posts, container) {
    if (!container) {
      return;
    }

    const cafePosts = (posts || []).filter(function (post) {
      return post && post.source === "naver_cafe";
    });

    if (!cafePosts.length) {
      container.innerHTML = '<div class="empty-card">표시할 글이 없습니다.</div>';
      return;
    }

    container.innerHTML = cafePosts.map(renderPostCard).join("");
  }

  function renderSummaries(items, container) {
    if (!container) {
      return;
    }

    if (!items || !items.length) {
      container.innerHTML = '<div class="empty-card">표시할 방송 요약이 없습니다.</div>';
      return;
    }

    container.innerHTML = items.map(renderSummaryCard).join("");
  }

  function renderLiveCard(row) {
    return [
      '<article class="live-card">',
      '  <div class="live-card-top">',
      renderAvatar(row.profile_image, displayName(row.member_id, row.member_name)),
      '    <div>',
      '      <p class="member-name">' + escapeHtml(displayName(row.member_id, row.member_name)) + '</p>',
      '      <p class="member-title">' + escapeHtml(row.title || (row.is_live ? "방송 중" : "오프라인")) + '</p>',
      "    </div>",
      '    <span class="status-pill ' + (row.is_live ? "is-live" : "is-offline") + '">' + (row.is_live ? "방송 중" : "방송 종료") + "</span>",
      "  </div>",
      '  <div class="metric-list">',
      renderMetric("카테고리", row.category || "-"),
      renderMetric("시청자", formatCount(row.viewer_count)),
      renderMetric("업데이트", formatRelativeTime(row.updated_at)),
      "  </div>",
      row.stream_url ? '  <a class="inline-link" href="' + escapeAttribute(row.stream_url) + '" target="_blank" rel="noreferrer">SOOP 바로가기</a>' : "",
      "</article>",
    ].join("");
  }

  function renderScheduleCard(entry) {
    return [
      '<article class="schedule-card">',
      '  <span class="schedule-day">' + escapeHtml(formatKstDay(entry.starts_at)) + "</span>",
      '  <div class="schedule-meta">',
      "    <div>",
      '      <h3>' + escapeHtml(entry.title) + "</h3>",
      '      <p class="schedule-sub">' + escapeHtml(displayName(entry.member_id, entry.member_name)) + " · " + escapeHtml(formatKstDateTime(entry.starts_at, true)) + "</p>",
      entry.details ? '      <p class="schedule-sub">' + escapeHtml(entry.details) + "</p>" : "",
      "    </div>",
      '    <span class="status-pill ' + scheduleClass(entry.status) + '">' + escapeHtml(scheduleLabel(entry.status)) + "</span>",
      "  </div>",
      "</article>",
    ].join("");
  }

  function renderPostCard(post) {
    return [
      '<article class="post-card">',
      '  <p class="eyebrow">Naver Cafe</p>',
      '  <h3>' + escapeHtml(post.title) + "</h3>",
      '  <p class="post-sub">' + escapeHtml(formatKstDateTime(post.published_at || post.fetched_at)) + " · " + escapeHtml(post.writer || "작성자 미상") + "</p>",
      '  <a class="inline-link" href="' + escapeAttribute(post.url) + '" target="_blank" rel="noreferrer">원문 보기</a>',
      "</article>",
    ].join("");
  }

  function renderSummaryCard(item) {
    return [
      '<article class="summary-card">',
      '  <p class="eyebrow">Broadcast</p>',
      '  <h3>' + escapeHtml(item.session_title || "제목 없음") + "</h3>",
      '  <p class="summary-sub">' + escapeHtml(displayName(item.member_id, item.member_name)) + " · " + escapeHtml(formatKstDateTime(item.started_at)) + "</p>",
      '  <p class="summary-sub">' + escapeHtml(item.session_category || "카테고리 미상") + " · " + escapeHtml(item.short_summary || "") + "</p>",
      '  <div class="metric-list">',
      renderMetric("최고 시청자", formatCount(item.peak_viewers)),
      renderMetric("타이틀 변경", String(item.title_change_count || 0)),
      renderMetric("카테고리 변경", String(item.category_change_count || 0)),
      "  </div>",
      item.source_url ? '  <a class="inline-link" href="' + escapeAttribute(item.source_url) + '" target="_blank" rel="noreferrer">방송 보기</a>' : "",
      "</article>",
    ].join("");
  }

  function renderClipCard(item) {
    return [
      '<article class="clip-card">',
      '  <div class="clip-thumb">' + (item.thumb_url ? '<img src="' + escapeAttribute(item.thumb_url) + '" alt="' + escapeAttribute(item.title) + '" />' : "") + "</div>",
      '  <h3>' + escapeHtml(item.title) + "</h3>",
      '  <p class="clip-sub">' + escapeHtml(displayName(item.member_id)) + " · " + escapeHtml(formatKstDateTime(item.created_at || item.fetched_at, true)) + "</p>",
      '  <div class="metric-list">',
      renderMetric("조회수", formatCount(item.view_count)),
      renderMetric("좋아요", formatCount(item.like_count)),
      "  </div>",
      '  <a class="inline-link" href="' + escapeAttribute(item.soop_url) + '" target="_blank" rel="noreferrer">클립 열기</a>',
      "</article>",
    ].join("");
  }

  function renderMetric(label, value) {
    return '<div class="metric-row"><span>' + escapeHtml(label) + '</span><strong>' + escapeHtml(value) + "</strong></div>";
  }

  function renderAvatar(imageUrl, label) {
    if (imageUrl) {
      return '<img class="avatar" src="' + escapeAttribute(imageUrl) + '" alt="' + escapeAttribute(label) + '" />';
    }

    return '<span class="avatar-fallback">' + escapeHtml((label || "?").slice(0, 1)) + "</span>";
  }

  function renderError(container, error) {
    if (!container) {
      return;
    }

    const message = error instanceof Error ? error.message : "unknown error";
    container.innerHTML = '<div class="message-card is-error">데이터를 불러오지 못했습니다. ' + escapeHtml(message) + "</div>";
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("API " + response.status);
    }
    return response.json();
  }

  function resolveApiBase() {
    const params = new URLSearchParams(window.location.search);
    const queryBase = params.get("apiBase");
    if (queryBase) {
      return queryBase.replace(/\/$/, "");
    }

    if (window.JIHASIL_API_BASE) {
      return String(window.JIHASIL_API_BASE).replace(/\/$/, "");
    }

    return new URL(".", window.location.href).href.replace(/\/$/, "");
  }

  function displayName(memberId, fallback) {
    return MEMBER_LABELS[memberId] || fallback || memberId || "멤버";
  }

  function formatCount(value) {
    if (typeof value !== "number") {
      return "-";
    }
    return value.toLocaleString("ko-KR");
  }

  function formatRelativeTime(value) {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
      return "시간 정보 없음";
    }

    const diffMinutes = Math.max(0, Math.floor((Date.now() - parsed) / 60000));
    if (diffMinutes < 1) {
      return "방금 전";
    }
    if (diffMinutes < 60) {
      return diffMinutes + "분 전";
    }
    const hours = Math.floor(diffMinutes / 60);
    const remain = diffMinutes % 60;
    if (remain === 0) {
      return hours + "시간 전";
    }
    return hours + "시간 " + remain + "분 전";
  }

  function formatKstDateTime(value, compact) {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
      return "-";
    }

    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      weekday: compact ? undefined : "short",
    }).format(new Date(parsed));
  }

  function formatKstDay(value) {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
      return "-";
    }

    return new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      month: "long",
      day: "numeric",
      weekday: "short",
    }).format(new Date(parsed));
  }

  function isTodayKst(value) {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
      return false;
    }

    return kstDateKey(parsed) === kstDateKey(Date.now());
  }

  function kstDateKey(value) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  }

  function scheduleLabel(status) {
    if (status === "scheduled") return "확정";
    if (status === "tentative") return "조율 중";
    if (status === "cancelled") return "취소";
    return status || "-";
  }

  function scheduleClass(status) {
    if (status === "scheduled") return "is-scheduled";
    if (status === "tentative") return "is-tentative";
    if (status === "cancelled") return "is-cancelled";
    return "";
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value);
  }
})();
