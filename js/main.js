/* =============================================================
   APT ATLAS — main.js
   骨格の共通挙動:
     1. スクロール・リビール（[data-reveal] に .is-visible を付与）
     2. ナビのスクロール状態切替（.is-scrolled）
     3. ナビ内アンカーのスムーズスクロール（固定ナビ分オフセット）
     4. ヒーロー統計のカウントアップ（data.js から実値を算出）

   バニラJS（ES2020+）/ 'use strict' + IIFE / ライブラリ禁止。
   prefers-reduced-motion 尊重。
   ============================================================= */
(function () {
  'use strict';

  var motionMql = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;
  var prefersReduced = motionMql ? motionMql.matches : false;

  // OS のモーション設定を実行中に切り替えても JS 挙動が古い判定のままにならないよう、
  // change を購読して prefersReduced を更新する（CSS は @media で即時追従）。
  // reduced-motion が ON になったら、進行中/待機中のカウントアップを最終値へ即時確定する。
  if (motionMql) {
    var onMotionChange = function (e) {
      prefersReduced = e.matches;
      if (e.matches) {
        var nodes = document.querySelectorAll('.hero-index [data-stat]');
        for (var i = 0; i < nodes.length; i++) {
          var to = nodes[i].getAttribute('data-count-to');
          if (to != null) nodes[i].textContent = String(to);
        }
      }
    };
    if (typeof motionMql.addEventListener === 'function') {
      motionMql.addEventListener('change', onMotionChange);
    } else if (typeof motionMql.addListener === 'function') {
      motionMql.addListener(onMotionChange); // 旧 Safari 等
    }
  }

  /* ----------------------------------------------------------
     ユーティリティ
     ---------------------------------------------------------- */
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function onIdle(fn) {
    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(fn);
    } else {
      fn();
    }
  }

  /* ----------------------------------------------------------
     1. スクロール・リビール
        [data-reveal] に IntersectionObserver で .is-visible を付与。
        進入時一度きり。--reveal-delay は CSS 側（style属性）で対応済み。
        後続の各セクションJSが後から差し込む要素にも効くよう、
        グローバルへ登録関数を公開する（window.APT.observeReveals）。
     ---------------------------------------------------------- */
  var revealObserver = null;

  function initReveals() {
    var supportsIO = 'IntersectionObserver' in window;

    if (prefersReduced || !supportsIO) {
      // モーション無効 or 非対応: 最終状態を即時表示（CSS側でも保険）
      revealAllImmediately();
      // それでも後続追加要素に対応できるよう no-op observer を用意
      window.APT = window.APT || {};
      window.APT.observeReveals = function (root) {
        var scope = root || document;
        var els = scope.querySelectorAll('[data-reveal]');
        for (var i = 0; i < els.length; i++) {
          els[i].classList.add('is-visible');
        }
      };
      return;
    }

    revealObserver = new IntersectionObserver(
      function (entries, obs) {
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i];
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target); // 一度きり
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
      }
    );

    observeReveals(document);

    // 後続セクションJSが差し込む要素も監視できるよう公開
    window.APT = window.APT || {};
    window.APT.observeReveals = observeReveals;
  }

  function observeReveals(root) {
    var scope = root || document;
    var els = scope.querySelectorAll('[data-reveal]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (el.classList.contains('is-visible')) continue;
      if (revealObserver) {
        revealObserver.observe(el);
      } else {
        el.classList.add('is-visible');
      }
    }
  }

  function revealAllImmediately() {
    var els = document.querySelectorAll('[data-reveal]');
    for (var i = 0; i < els.length; i++) {
      els[i].classList.add('is-visible');
    }
  }

  /* ----------------------------------------------------------
     2. ナビのスクロール状態切替 ＋ スクロール進捗バー
        - 少しでもスクロールしたら .is-scrolled でガラス背景を出す。
        - 上端の朱ヘアライン（#scroll-progress）の scaleX を更新する。
        単一の scroll リスナ＋rAF スロットルで両方を賄う（過剰なリスナを避ける）。
     ---------------------------------------------------------- */
  function initNavScroll() {
    var nav = document.getElementById('nav');
    var progressRoot = document.getElementById('scroll-progress');
    var progressBar = progressRoot
      ? progressRoot.querySelector('.scroll-progress-bar')
      : null;

    if (!nav && !progressBar) return;

    var threshold = 8;
    var ticking = false;

    function update() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;

      if (nav) {
        if (y > threshold) {
          nav.classList.add('is-scrolled');
        } else {
          nav.classList.remove('is-scrolled');
        }
      }

      if (progressBar) {
        var doc = document.documentElement;
        // スクロール可能量（0 のときは 0 除算を避ける）
        var scrollable = (doc.scrollHeight || 0) - window.innerHeight;
        var ratio = scrollable > 0 ? y / scrollable : 0;
        if (ratio < 0) ratio = 0;
        else if (ratio > 1) ratio = 1;
        // CSS 変数経由で transform: scaleX を駆動（transition なしで即時追従）
        progressBar.style.setProperty('--progress', ratio.toFixed(4));
      }

      // ナビ現在地（scroll-spy）も同じ rAF フレームで更新する（追加リスナ不要）
      if (window.APT && typeof window.APT.updateNavCurrent === 'function') {
        window.APT.updateNavCurrent();
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // レイアウト変化（フォント読込・画像・回転）でも進捗率が狂わないよう resize も購読
    window.addEventListener('resize', onScroll, { passive: true });
    update(); // 初期状態（リロード時に途中位置でも正しく）
  }

  /* ----------------------------------------------------------
     2b. ナビ現在地表示（.is-current）
        各セクションのスクロール位置に応じ、対応するナビリンクへ
        .is-current を付与する。スクロール位置ベースの scroll-spy：
        判定線（ナビ直下）を最後に跨いだセクションを現在地とする。
        IntersectionObserver の帯配置に依存せず、遅延・取りこぼしがない。
        更新は共有 scroll ハンドラ（initNavScroll）から駆動する。
        window.APT.updateNavCurrent() を公開し、scroll/resize で呼ぶ。
     ---------------------------------------------------------- */
  function initNavCurrent() {
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.nav-link[href^="#"]')
    );
    if (!links.length) return;

    // href の id → { link, section } の対応を、存在するセクションのみで作る。
    var items = [];
    for (var i = 0; i < links.length; i++) {
      var id = links[i].getAttribute('href').slice(1);
      var sec = id ? document.getElementById(id) : null;
      if (sec) items.push({ id: id, link: links[i], section: sec });
    }
    if (!items.length) return;

    var activeId = undefined; // 直近適用済み（無駄な DOM 書換えを避ける）

    function setCurrent(id) {
      if (id === activeId) return;
      activeId = id;
      for (var k = 0; k < items.length; k++) {
        if (items[k].id === id) items[k].link.classList.add('is-current');
        else items[k].link.classList.remove('is-current');
      }
    }

    function update() {
      // 判定線：viewport 上端から「ナビ高 + 少し」下。ここを最後に上へ抜けた
      // （top <= line）セクションを現在地とする。どれも未達なら現在地なし
      // （＝ヒーロー最上部）で全解除。
      var nav = document.getElementById('nav');
      var navH = nav ? nav.getBoundingClientRect().height : 68;
      var line = navH + Math.round(window.innerHeight * 0.18);

      var currentId = null;
      for (var k = 0; k < items.length; k++) {
        // getBoundingClientRect().top は viewport 相対（scroll に追従）
        if (items[k].section.getBoundingClientRect().top <= line) {
          currentId = items[k].id; // ドキュメント順で最後に条件を満たしたもの
        }
      }
      setCurrent(currentId);
    }

    // 共有 scroll ハンドラから呼べるよう公開
    window.APT = window.APT || {};
    window.APT.updateNavCurrent = update;

    update(); // 初期状態
  }

  /* ----------------------------------------------------------
     3. ナビ内アンカーのスムーズスクロール
        CSS scroll-behavior に委ねつつ、reduced-motion では即時。
        scroll-padding-top（base.css）で固定ナビ分を吸収済み。
     ---------------------------------------------------------- */
  function initAnchorScroll() {
    var links = document.querySelectorAll('a[href^="#"]');

    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#') return;

        var target = document.getElementById(href.slice(1));
        if (!target) return;

        e.preventDefault();

        target.scrollIntoView({
          behavior: prefersReduced ? 'auto' : 'smooth',
          block: 'start'
        });

        // フォーカスを移して支援技術・キーボード操作の文脈も移動させる
        if (typeof target.focus === 'function') {
          var hadTabindex = target.hasAttribute('tabindex');
          if (!hadTabindex) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          if (!hadTabindex) {
            target.addEventListener(
              'blur',
              function () {
                this.removeAttribute('tabindex');
              },
              { once: true }
            );
          }
        }
      });
    }
  }

  /* ----------------------------------------------------------
     4. ヒーロー統計のカウントアップ
        値は data.js（window.APT_DATA.groups）から実際に集計する。
        HTMLのハードコード値はフォールバック。ズレたら実データを優先。
        国別内訳から「最大勢力」の件数も算出する。
     ---------------------------------------------------------- */
  function computeHeroStats() {
    var stats = { groups: 39, countries: 6, topCountry: 28, topCountryName: '中国' };

    var data = window.APT_DATA;
    if (!data || !Array.isArray(data.groups) || data.groups.length === 0) {
      return stats;
    }

    var groups = data.groups;
    stats.groups = groups.length;

    // 国別件数を集計（countryCode を真実として使う）
    var byCode = Object.create(null);
    for (var i = 0; i < groups.length; i++) {
      var code = groups[i].countryCode || 'UN';
      byCode[code] = (byCode[code] || 0) + 1;
    }

    var codes = Object.keys(byCode);
    stats.countries = codes.length;

    // 最大勢力
    var topCode = null;
    var topCount = 0;
    for (var j = 0; j < codes.length; j++) {
      if (byCode[codes[j]] > topCount) {
        topCount = byCode[codes[j]];
        topCode = codes[j];
      }
    }
    stats.topCountry = topCount;

    // 最大勢力の国名（表示済みの日本語ラベルを groups から拾う）
    for (var k = 0; k < groups.length; k++) {
      if (groups[k].countryCode === topCode && groups[k].country) {
        stats.topCountryName = groups[k].country;
        break;
      }
    }

    return stats;
  }

  function initHeroStats() {
    var stats = computeHeroStats();
    var nodes = document.querySelectorAll('.hero-index [data-stat]');
    if (!nodes.length) return;

    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var key = node.getAttribute('data-stat');
      var value = null;

      if (key === 'groups') value = stats.groups;
      else if (key === 'countries') value = stats.countries;
      else if (key === 'topCountry') value = stats.topCountry;

      if (value === null || isNaN(value)) continue;

      // data-count-to を実データで上書き（HTML初期表示はフォールバック）
      node.setAttribute('data-count-to', String(value));

      if (prefersReduced) {
        node.textContent = String(value);
      } else {
        // 初期表示を 0 にしておき、可視化時にカウントアップ
        node.textContent = '0';
        armCountUp(node, value);
      }
    }
  }

  // ヒーローが可視になった一度だけカウントアップを走らせる
  function armCountUp(node, target) {
    var ran = false;

    function run() {
      if (ran) return;
      ran = true;
      countUp(node, target);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries, obs) {
          for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
              run();
              obs.disconnect();
            }
          }
        },
        { threshold: 0.4 }
      );
      io.observe(node);
    } else {
      run();
    }
  }

  function countUp(node, target) {
    var duration = 900; // ms — 上質・抑制。控えめに。
    var start = null;
    // ease-out（cubic-bezier(0.16,1,0.3,1) 近似）
    function ease(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(now) {
      // 実行中に reduced-motion が ON になったら即座に最終値で確定する。
      if (prefersReduced) {
        node.textContent = String(target);
        return;
      }
      if (start === null) start = now;
      var elapsed = now - start;
      var t = Math.min(elapsed / duration, 1);
      var current = Math.round(ease(t) * target);
      node.textContent = String(current);
      if (t < 1) {
        window.requestAnimationFrame(frame);
      } else {
        node.textContent = String(target);
      }
    }

    window.requestAnimationFrame(frame);
  }

  /* ----------------------------------------------------------
     起動
     ---------------------------------------------------------- */
  ready(function () {
    initReveals();
    // initNavCurrent を先に呼び window.APT.updateNavCurrent を公開してから
    // initNavScroll の共有ハンドラ（初期 update 含む）を起動する。
    initNavCurrent();
    initNavScroll();
    initAnchorScroll();
    onIdle(initHeroStats);
  });
})();
