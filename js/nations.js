/* =============================================================
   APT ATLAS — 国家・地域分析セクション（担当プレフィックス: nat-）
   window.APT_RELATIONS / window.APT_DATA から動的生成する。
   - 国別バーチャート（stats.byCountry）
   - 国別プロファイルカード（insights.regional）
   - 地域と標的の相関考察
   バニラ JS / 'use strict' / IIFE。ライブラリ禁止。
   ============================================================= */
(function () {
  "use strict";

  var section = document.getElementById("nations");
  if (!section) return;

  var REL = window.APT_RELATIONS;
  var DATA = window.APT_DATA;
  if (!REL || !DATA) return;

  /* ---------- 国コードのマッピング（tokens.css の .cc-* と data-country） ---------- */
  var COUNTRY_CODE = {
    "中国": "CN",
    "イラン": "IR",
    "北朝鮮": "KP",
    "ロシア": "RU",
    "ベトナム": "VN",
    "未公表": "UN"
  };

  /* 表示順（多い順を担保しつつ、同数でも安定させる固定序列） */
  var COUNTRY_ORDER = ["中国", "イラン", "北朝鮮", "ロシア", "ベトナム", "未公表"];

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* prefers-reduced-motion を尊重（実行中の切替も購読して追従） */
  var motionMql = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  var prefersReduced = motionMql ? motionMql.matches : false;
  if (motionMql) {
    var onMotionChange = function (e) {
      prefersReduced = e.matches;
      if (e.matches) settleCounts();  /* 有効化されたら全カウントを最終値へ即時確定 */
    };
    if (typeof motionMql.addEventListener === "function") {
      motionMql.addEventListener("change", onMotionChange);
    } else if (typeof motionMql.addListener === "function") {
      motionMql.addListener(onMotionChange);
    }
  }

  /* まだ確定していないカウント要素を最終値へ即時確定する（reduced-motion 用） */
  function settleCounts() {
    var els = section.querySelectorAll(".nat-bar-count b[data-count]");
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = els[i].getAttribute("data-count");
    }
  }

  function ccClass(country) {
    var code = COUNTRY_CODE[country] || "UN";
    return "cc-" + code.toLowerCase();
  }

  /* data.js から country -> [group,...] のインデックスを作る */
  function buildGroupsByCountry() {
    var map = {};
    var groups = (DATA && DATA.groups) || [];
    for (var i = 0; i < groups.length; i++) {
      var g = groups[i];
      var c = g.country;
      if (!map[c]) map[c] = [];
      map[c].push(g);
    }
    return map;
  }
  var GROUPS_BY_COUNTRY = buildGroupsByCountry();

  /* insights.regional を国名でひけるように */
  function regionalByCountry() {
    var map = {};
    var arr = (REL.insights && REL.insights.regional) || [];
    for (var i = 0; i < arr.length; i++) map[arr[i].country] = arr[i];
    return map;
  }
  var REGIONAL = regionalByCountry();

  /* ============================================================
     1) 国別グループ数バーチャート
     ============================================================ */
  function renderBars() {
    var host = section.querySelector("[data-bars]");
    if (!host) return;

    var byCountry = (REL.stats && REL.stats.byCountry) || {};
    var total = (REL.stats && REL.stats.totalGroups) || 0;

    /* total フォールバック（stats に無ければ合算） */
    if (!total) {
      total = 0;
      for (var k in byCountry) if (byCountry.hasOwnProperty(k)) total += byCountry[k];
    }
    /* 総数表示を同期 */
    var totalEls = section.querySelectorAll("[data-total]");
    for (var t = 0; t < totalEls.length; t++) totalEls[t].textContent = total;

    /* 最大件数（バー幅の基準）を求める */
    var max = 0;
    for (var c in byCountry) {
      if (byCountry.hasOwnProperty(c) && byCountry[c] > max) max = byCountry[c];
    }
    if (max <= 0) max = 1;

    /* 表示順を決定: 既知の序列に含まれる国を先に、未知は後ろに件数降順で */
    var countries = Object.keys(byCountry);
    countries.sort(function (a, b) {
      var ia = COUNTRY_ORDER.indexOf(a);
      var ib = COUNTRY_ORDER.indexOf(b);
      if (ia === -1) ia = 999;
      if (ib === -1) ib = 999;
      if (ia !== ib) return ia - ib;
      return byCountry[b] - byCountry[a];
    });

    var html = "";
    for (var i = 0; i < countries.length; i++) {
      var country = countries[i];
      var count = byCountry[country];
      var code = COUNTRY_CODE[country] || "UN";
      var widthPct = Math.round((count / max) * 1000) / 10;   /* 最大国を100%とした相対幅 */
      var sharePct = Math.round((count / total) * 1000) / 10;  /* 全体に占める割合 */
      var isLead = count === max;

      /* カウントアップの初期表示: モーション有効時は 0 から。無効時は最終値を即出す。
         data-count に最終値を保持し、バー伸長（900ms）と同期して数える。 */
      var shown = prefersReduced ? count : 0;

      html +=
        '<li class="nat-bar ' + ccClass(country) + (isLead ? " is-lead" : "") + '"' +
          ' data-country="' + esc(code) + '"' +
          ' style="--bar-w:' + widthPct + '%; --reveal-delay:' + Math.min(i, 6) * 60 + 'ms">' +
          '<span class="nat-bar-name">' +
            '<span class="nat-bar-dot" aria-hidden="true"></span>' +
            esc(country) +
          '</span>' +
          '<span class="nat-bar-track" role="img"' +
            ' aria-label="' + esc(country) + ' ' + count + '組織 全体の約' + sharePct + 'パーセント">' +
            '<span class="nat-bar-fill"></span>' +
          '</span>' +
          '<span class="nat-bar-count">' +
            '<b data-count="' + count + '">' + shown + '</b> 組織' +
            '<span class="nat-bar-pct">' + sharePct + '%</span>' +
          '</span>' +
        '</li>';
    }
    host.innerHTML = html;

    /* バーが可視化（.nat-chart.is-visible）した瞬間に、CSS のバー伸長と
       同じ 900ms・同じイージングで数値をカウントアップする。 */
    armBarCounts(host);
  }

  /* ------- バー数値カウントアップ（バー伸長と同期） ------- */
  /* CSS の transition と同じ cubic-bezier(0.16,1,0.3,1) を数式で近似（ease-out cubic）。 */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function runCount(el, target) {
    if (el.getAttribute("data-counting") === "1") return;
    el.setAttribute("data-counting", "1");
    var duration = 900;  /* バー伸長 900ms と一致 */
    var start = null;
    function frame(now) {
      if (prefersReduced) { el.textContent = String(target); return; }
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      el.textContent = String(Math.round(easeOutCubic(t) * target));
      if (t < 1) {
        window.requestAnimationFrame(frame);
      } else {
        el.textContent = String(target);
      }
    }
    window.requestAnimationFrame(frame);
  }

  function startCounts(host) {
    var els = host.querySelectorAll(".nat-bar-count b[data-count]");
    for (var i = 0; i < els.length; i++) {
      runCount(els[i], parseInt(els[i].getAttribute("data-count"), 10) || 0);
    }
  }

  /* .nat-chart に .is-visible が付いた瞬間を検知してカウント開始。
     main.js の IntersectionObserver が data-reveal に付与する契約に乗る。 */
  function armBarCounts(host) {
    if (prefersReduced) return;  /* 既に最終値表示。何もしない */

    var chart = host.closest ? host.closest(".nat-chart") : null;
    if (!chart) { startCounts(host); return; }

    if (chart.classList.contains("is-visible")) {
      startCounts(host);
      return;
    }

    /* class 変化を監視（main.js が .is-visible を付けたら発火、一度きり） */
    if ("MutationObserver" in window) {
      var mo = new MutationObserver(function () {
        if (chart.classList.contains("is-visible")) {
          mo.disconnect();
          startCounts(host);
        }
      });
      mo.observe(chart, { attributes: true, attributeFilter: ["class"] });
    } else {
      /* フォールバック: 監視不可なら即開始 */
      startCounts(host);
    }
  }

  /* ============================================================
     2) 国別プロファイルカード（insights.regional）
     代表グループチップは data.js の実在グループから採る。
     ============================================================ */

  /* 各国の代表グループを選定（highlights等に依存せず data.js の実在IDから） */
  function pickReps(country, maxN) {
    var groups = GROUPS_BY_COUNTRY[country] || [];
    /* num 昇順（図録番号の若い＝古い＝代表的なものを優先）で安定選択 */
    var sorted = groups.slice().sort(function (a, b) {
      return (a.num || 0) - (b.num || 0);
    });
    /* ただし中国は数が多いので、著名度の高い代表を優先表示 */
    var PREFERRED = {
      "中国": ["APT1", "APT40", "APT41", "APT31", "APT10"],
      "イラン": ["APT33", "APT34", "APT35", "APT39"],
      "北朝鮮": ["APT38", "APT45", "APT37"],
      "ロシア": ["APT28", "APT29"],
      "ベトナム": ["APT32"],
      "未公表": ["APT5"]
    };
    var byId = {};
    for (var i = 0; i < groups.length; i++) byId[groups[i].id] = groups[i];

    var out = [];
    var pref = PREFERRED[country] || [];
    for (var p = 0; p < pref.length && out.length < maxN; p++) {
      if (byId[pref[p]]) out.push(byId[pref[p]]);
    }
    /* 足りなければ番号順で補完 */
    for (var s = 0; s < sorted.length && out.length < maxN; s++) {
      if (out.indexOf(sorted[s]) === -1) out.push(sorted[s]);
    }
    return out;
  }

  function chipHtml(group, code) {
    var alias = (group.aliases && group.aliases.length) ? group.aliases[0] : "";
    var aria = group.id + " の詳細を開く";
    return (
      '<button type="button" class="nat-chip ' + "cc-" + code.toLowerCase() + '"' +
        ' data-open="' + esc(group.id) + '"' +
        ' aria-label="' + esc(aria) + '"' +
        (alias ? ' title="' + esc(alias) + '"' : "") + '>' +
        '<span class="nat-chip-dot" aria-hidden="true"></span>' +
        esc(group.id) +
      '</button>'
    );
  }

  function renderProfiles() {
    var host = section.querySelector("[data-profiles]");
    if (!host) return;

    var byCountry = (REL.stats && REL.stats.byCountry) || {};
    var regional = (REL.insights && REL.insights.regional) || [];

    var html = "";
    for (var i = 0; i < regional.length; i++) {
      var r = regional[i];
      var country = r.country;
      var code = COUNTRY_CODE[country] || "UN";
      var count = byCountry[country] != null ? byCountry[country] : (GROUPS_BY_COUNTRY[country] || []).length;

      /* ハイライト */
      var hlHtml = "";
      var hls = r.highlights || [];
      for (var h = 0; h < hls.length; h++) {
        hlHtml += '<li class="nat-card-hl">' + esc(hls[h]) + "</li>";
      }

      /* 代表グループチップ */
      var reps = pickReps(country, 5);
      var chips = "";
      for (var c = 0; c < reps.length; c++) chips += chipHtml(reps[c], code);

      var delay = Math.min(i, 6) * 70;

      html +=
        '<article class="nat-card ' + ccClass(country) + '"' +
          ' data-country="' + esc(code) + '"' +
          ' data-reveal style="--reveal-delay:' + delay + 'ms">' +

          '<div class="nat-card-top">' +
            '<span class="nat-card-nation">' +
              '<span class="nat-card-dot" aria-hidden="true"></span>' +
              '<span class="nat-card-country">' + esc(country) + '</span>' +
            '</span>' +
            '<span class="nat-card-count">' +
              '<span class="nat-card-num">' + count + '</span>' +
              '<span class="nat-card-num-label">組織</span>' +
            '</span>' +
          '</div>' +

          '<h4 class="nat-card-headline">' + esc(r.title) + '</h4>' +
          '<p class="nat-card-body">' + esc(r.body) + '</p>' +

          (hlHtml ? '<ul class="nat-card-highlights" role="list">' + hlHtml + '</ul>' : "") +

          (chips
            ? '<div class="nat-card-reps">' +
                '<span class="nat-card-reps-label label">代表グループ</span>' +
                '<div class="nat-chips">' + chips + '</div>' +
              '</div>'
            : "") +

        '</article>';
    }
    host.innerHTML = html;
  }

  /* ============================================================
     3) 地域と標的の関係（相関考察）
     国 → 標的傾向 のエレガントな対応。表ではなく編纂的な行組み。
     内容は insights.regional / overview の分析に沿って要約。
     ============================================================ */
  function renderNexus() {
    var host = section.querySelector("[data-nexus]");
    if (!host) return;

    var byCountry = (REL.stats && REL.stats.byCountry) || {};

    /* 標的傾向の対応（分析文と整合。キーワードタグ + 一文の考察） */
    var NEXUS = [
      {
        country: "中国",
        tags: ["グローバル", "知的財産", "戦略産業"],
        desc: "最大勢力として全世界を射程に置き、政府・軍事に加え航空宇宙・通信・ハイテクの技術情報を広く収集する。産業競争力の強化と安全保障が動機の両輪。"
      },
      {
        country: "イラン",
        tags: ["中東集中", "通信", "エネルギー"],
        desc: "活動が中東域内に強く集中し、通信・エネルギー・航空宇宙という戦略産業を共通の標的とする。凝ったソーシャル・エンジニアリングで補う。"
      },
      {
        country: "北朝鮮",
        tags: ["金融", "破壊的", "政策反映"],
        desc: "諜報と外貨獲得の二重の使命を負い、金融機関を標的とする。政策変化に応じて医療・農業へ標的を移す「政策反映型」の性格が際立つ。"
      },
      {
        country: "ロシア",
        tags: ["政府・軍事", "西欧・NATO", "少数精鋭"],
        desc: "少数ながら高度な技術を備え、西欧・NATO関連の政府・軍事機関という地政学的に機微な標的へ絞り込む。検知回避の巧みさが特徴。"
      },
      {
        country: "ベトナム",
        tags: ["投資企業", "経済保護"],
        desc: "自国へ投資・進出する外国企業を狙い、国内市場での競争力保護に近い経済的動機を持つ単独グループ。"
      },
      {
        country: "未公表",
        tags: ["通信インフラ", "アジア"],
        desc: "帰属は公表されないが、アジアの通信・衛星通信インフラへの関心から、傍受能力の獲得という国家的関心がうかがえる。"
      }
    ];

    var html = "";
    for (var i = 0; i < NEXUS.length; i++) {
      var n = NEXUS[i];
      var code = COUNTRY_CODE[n.country] || "UN";
      var count = byCountry[n.country] != null ? byCountry[n.country] : (GROUPS_BY_COUNTRY[n.country] || []).length;

      var tags = "";
      for (var tI = 0; tI < n.tags.length; tI++) {
        tags += '<span class="nat-nexus-tag">' + esc(n.tags[tI]) + "</span>";
      }

      html +=
        '<li class="nat-nexus-row ' + ccClass(n.country) + '"' +
          ' data-country="' + esc(code) + '"' +
          ' data-reveal style="--reveal-delay:' + Math.min(i, 6) * 60 + 'ms">' +

          '<div class="nat-nexus-country">' +
            '<span class="nat-nexus-name">' +
              '<span class="nat-nexus-dot" aria-hidden="true"></span>' +
              esc(n.country) +
            '</span>' +
            '<span class="nat-nexus-n">' + count + ' 組織</span>' +
          '</div>' +

          '<div class="nat-nexus-target">' +
            '<div class="nat-nexus-tags">' +
              '<span class="nat-nexus-arrow" aria-hidden="true">→</span>' +
              tags +
            '</div>' +
            '<p class="nat-nexus-desc">' + esc(n.desc) + '</p>' +
          '</div>' +

        '</li>';
    }
    host.innerHTML = html;
  }

  /* ============================================================
     チップクリック → apt:open（explorer.js が listen）
     イベント委譲で card / nexus 内のチップをまとめて処理。
     ============================================================ */
  function wireChips() {
    section.addEventListener("click", function (ev) {
      var btn = ev.target.closest ? ev.target.closest("[data-open]") : null;
      if (!btn || !section.contains(btn)) return;
      var id = btn.getAttribute("data-open");
      if (!id) return;
      window.dispatchEvent(new CustomEvent("apt:open", { detail: { id: id } }));
    });
    /* キーボード: button 要素なので Enter/Space はネイティブに click 発火 */
  }

  /* ============================================================
     動的に差し込んだ [data-reveal] 要素を main.js の
     IntersectionObserver に登録する（window.APT.observeReveals）。
     - main.js は DOMContentLoaded 時点の要素しか監視しないため、
       ここで生成した .nat-card / .nat-nexus-row を明示登録する。
     - main.js 未ロードの場合に備えて短時間リトライし、
       最終フォールバックとして即時表示（要素が隠れたままにならない保険）。
     ============================================================ */
  function registerReveals(retries) {
    if (window.APT && typeof window.APT.observeReveals === "function") {
      window.APT.observeReveals(section);
      return;
    }
    if (retries > 0) {
      window.setTimeout(function () { registerReveals(retries - 1); }, 80);
      return;
    }
    /* フォールバック: main.js が来なければ最終状態で表示 */
    var els = section.querySelectorAll("[data-reveal]");
    for (var i = 0; i < els.length; i++) els[i].classList.add("is-visible");
  }

  /* ---------- 初期化 ---------- */
  function init() {
    renderBars();
    renderProfiles();
    renderNexus();
    wireChips();
    registerReveals(12); /* 最大 ~1s リトライ */
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
