/* =============================================================
   APT ATLAS — theme.js
   デザインテーマの適用・永続化・切替 UI（ポップオーバー）制御。

   ・テーマは <html data-theme="..."> で切替。属性なし = 既定「編纂 / hensan」。
   ・localStorage('apt-atlas-theme') に永続化（FOUC 防止の即時反映は
     index.html <head> のインラインスクリプトが担う。ここは完全版）。
   ・meta[name=theme-color] をテーマの地色へ更新（無ければ生成）。
   ・切替時は html に .theme-switching を 150ms 付与し、地・文字色を
     滑らかに遷移させる（prefers-reduced-motion では即時）。
   ・テーマメタ（ID / 和名 / EN / スウォッチ2色 / 地色）はここが唯一の定義元。

   バニラ JS（ES2020+）/ 'use strict' + IIFE / ライブラリ禁止。
   ============================================================= */
(function () {
  'use strict';

  var STORAGE_KEY = 'apt-atlas-theme';
  var DEFAULT_ID = 'hensan';

  /* ----------------------------------------------------------
     テーマ・メタデータ（唯一の定義元）
       id      : data-theme 値（hensan は属性なしで表現＝既定）
       ja / en : 表示名（和名 / 英字サブ）
       sw      : スウォッチ2色 [地寄り, アクセント/差し色寄り]。
                 トグルとメニューの2色円、および現テーマ表示に使う。
       ground  : meta[name=theme-color] に入れる地色（モバイル UI の色）。
     ※色は各テーマ CSS の実値と整合させること（スウォッチは"見本"）。
       既定 hensan の値は tokens.css（--paper / --accent 等）と一致。
     ---------------------------------------------------------- */
  var THEMES = [
    {
      id: 'hensan',
      ja: '編纂',
      en: 'Editorial',
      sw: ['#F5F3EE', '#C8452E'],
      ground: '#F5F3EE'
    },
    {
      id: 'glass',
      ja: '硝子',
      en: 'Liquid Glass',
      sw: ['#E9EDF3', '#5B7CA6'],
      ground: '#E9EDF3'
    },
    {
      id: 'abyss',
      ja: '深淵',
      en: 'Abyss',
      sw: ['#0B1016', '#3FE3D2'],
      ground: '#0B1016'
    },
    {
      id: 'beach',
      ja: '白昼',
      en: 'Noon Beach',
      sw: ['#FBF3E2', '#E08A2E'],
      ground: '#FBF3E2'
    },
    {
      id: 'terminal',
      ja: '端末',
      en: 'Terminal',
      sw: ['#0B140F', '#4FE07E'],
      ground: '#0B140F'
    }
  ];

  var VALID = Object.create(null);
  THEMES.forEach(function (t) { VALID[t.id] = t; });

  var prefersReduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

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

  function getStored() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return v && VALID[v] ? v : null;
    } catch (e) {
      return null;
    }
  }

  function setStored(id) {
    try {
      if (id === DEFAULT_ID) localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, id);
    } catch (e) { /* 保存不可でも実行時反映は済んでいる */ }
  }

  // 現在の data-theme（属性なし or 不正値 → 既定 hensan）
  function currentId() {
    var t = document.documentElement.getAttribute('data-theme');
    return t && VALID[t] ? t : DEFAULT_ID;
  }

  /* ----------------------------------------------------------
     meta[name=theme-color]（モバイル UI 帯の色）を更新
     ---------------------------------------------------------- */
  function updateThemeColor(meta) {
    var el = document.querySelector('meta[name="theme-color"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', 'theme-color');
      document.head.appendChild(el);
    }
    el.setAttribute('content', meta.ground);
  }

  /* ----------------------------------------------------------
     トグルのスウォッチ／ラベルを現テーマに同期
     ---------------------------------------------------------- */
  var els = {}; // DOM 参照（init で埋める）

  function syncToggle(meta) {
    // トグルのスウォッチは CSS の var(--sw-a)/var(--sw-b) 経路で着色する
    // （base.css .theme-toggle-swatch-a/-b が参照）。JS はカスタムプロパティを
    // 立てるだけで、直接 background 代入はしない（CSS を単一の真実に保つ）。
    if (els.swA) els.swA.style.setProperty('--sw-a', meta.sw[0]);
    if (els.swB) els.swB.style.setProperty('--sw-b', meta.sw[1]);
    if (els.toggle) {
      els.toggle.setAttribute(
        'aria-label',
        'デザインテーマを切り替える（現在：' + meta.ja + '）'
      );
    }
    // ラベルは常に「テーマ」固定（現テーマ名は aria とメニューのチェックで表す）。
  }

  function syncMenuChecks(id) {
    if (!els.options) return;
    els.options.forEach(function (opt) {
      var on = opt.getAttribute('data-theme-id') === id;
      opt.setAttribute('aria-checked', on ? 'true' : 'false');
      opt.tabIndex = on ? 0 : -1; // ロービングタブインデックス（開いた時の初期焦点用）
    });
  }

  /* ----------------------------------------------------------
     テーマ適用（属性 → 永続化 → meta → UI 同期）
       animate=false のときは switching トランジションを掛けない
       （初期化時など）。
     ---------------------------------------------------------- */
  var switchTimer = null;

  function applyTheme(id, opts) {
    opts = opts || {};
    var meta = VALID[id] || VALID[DEFAULT_ID];
    var html = document.documentElement;

    if (opts.animate && !prefersReduced) {
      html.classList.add('theme-switching');
      if (switchTimer) window.clearTimeout(switchTimer);
      switchTimer = window.setTimeout(function () {
        html.classList.remove('theme-switching');
        switchTimer = null;
      }, 150);
    }

    if (meta.id === DEFAULT_ID) html.removeAttribute('data-theme');
    else html.setAttribute('data-theme', meta.id);

    updateThemeColor(meta);
    syncToggle(meta);
    syncMenuChecks(meta.id);
  }

  /* ----------------------------------------------------------
     ポップオーバー（開閉・キーボード・外側クリック / ESC）
     ---------------------------------------------------------- */
  var isOpen = false;

  function openMenu() {
    if (isOpen || !els.menu || !els.toggle) return;
    isOpen = true;
    els.menu.hidden = false;
    // 次フレームで .is-open を付け、閉→開のトランジションを効かせる
    window.requestAnimationFrame(function () {
      els.menu.classList.add('is-open');
    });
    els.toggle.setAttribute('aria-expanded', 'true');

    document.addEventListener('pointerdown', onOutside, true);
    document.addEventListener('keydown', onKeydown, true);

    // 選択中の項目へフォーカス（なければ先頭）
    var focusTarget = els.options && els.options.filter(function (o) {
      return o.getAttribute('aria-checked') === 'true';
    })[0];
    if (!focusTarget && els.options) focusTarget = els.options[0];
    if (focusTarget) focusTarget.focus();
  }

  function closeMenu(returnFocus) {
    if (!isOpen || !els.menu || !els.toggle) return;
    isOpen = false;
    els.menu.classList.remove('is-open');
    els.toggle.setAttribute('aria-expanded', 'false');

    document.removeEventListener('pointerdown', onOutside, true);
    document.removeEventListener('keydown', onKeydown, true);

    // トランジション後に hidden へ戻す（reduced-motion では即時）
    var finalize = function () { if (!isOpen) els.menu.hidden = true; };
    if (prefersReduced) finalize();
    else window.setTimeout(finalize, 200);

    if (returnFocus) els.toggle.focus();
  }

  function toggleMenu() {
    if (isOpen) closeMenu(true);
    else openMenu();
  }

  function onOutside(ev) {
    if (!els.root) return;
    if (!els.root.contains(ev.target)) closeMenu(false);
  }

  function onKeydown(ev) {
    if (!isOpen) return;
    var key = ev.key;

    if (key === 'Escape' || key === 'Esc') {
      ev.preventDefault();
      closeMenu(true);
      return;
    }

    if (!els.options || !els.options.length) return;
    var idx = els.options.indexOf(document.activeElement);

    if (key === 'ArrowDown' || key === 'Down') {
      ev.preventDefault();
      var n = idx < 0 ? 0 : (idx + 1) % els.options.length;
      els.options[n].focus();
    } else if (key === 'ArrowUp' || key === 'Up') {
      ev.preventDefault();
      var p = idx < 0 ? els.options.length - 1
        : (idx - 1 + els.options.length) % els.options.length;
      els.options[p].focus();
    } else if (key === 'Home') {
      ev.preventDefault();
      els.options[0].focus();
    } else if (key === 'End') {
      ev.preventDefault();
      els.options[els.options.length - 1].focus();
    } else if (key === 'Tab') {
      // メニュー外へ抜ける操作は閉じる（フォーカスは自然遷移させる）
      closeMenu(false);
    }
  }

  /* ----------------------------------------------------------
     メニュー項目の生成（THEMES から）
     ---------------------------------------------------------- */
  var CHECK_SVG =
    '<svg class="theme-option-check" viewBox="0 0 16 16" aria-hidden="true" focusable="false">' +
    '<path d="M3 8.5 L6.5 12 L13 4.5" fill="none" stroke="currentColor" ' +
    'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function buildMenu() {
    if (!els.menu) return;
    var frag = document.createDocumentFragment();

    els.options = THEMES.map(function (t) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-option';
      btn.setAttribute('role', 'menuitemradio');
      btn.setAttribute('data-theme-id', t.id);
      btn.setAttribute('aria-checked', 'false');
      btn.tabIndex = -1;

      btn.innerHTML =
        '<span class="theme-option-swatch" aria-hidden="true">' +
          '<span class="theme-option-swatch-a" style="background:' + t.sw[0] + '"></span>' +
          '<span class="theme-option-swatch-b" style="background:' + t.sw[1] + '"></span>' +
        '</span>' +
        '<span class="theme-option-names">' +
          '<span class="theme-option-ja">' + t.ja + '</span>' +
          '<span class="theme-option-en">' + t.en + '</span>' +
        '</span>' +
        CHECK_SVG;

      btn.addEventListener('click', function () {
        applyTheme(t.id, { animate: true });
        setStored(t.id);
        closeMenu(true);
      });

      frag.appendChild(btn);
      return btn;
    });

    els.menu.appendChild(frag);
  }

  /* ----------------------------------------------------------
     初期化
     ---------------------------------------------------------- */
  ready(function () {
    els.root = document.getElementById('theme-switch');
    els.toggle = document.getElementById('theme-toggle');
    els.menu = document.getElementById('theme-menu');
    els.swA = els.toggle ? els.toggle.querySelector('.theme-toggle-swatch-a') : null;
    els.swB = els.toggle ? els.toggle.querySelector('.theme-toggle-swatch-b') : null;

    // UI が無くてもテーマ適用（FOUC スクリプトの後始末＝meta 同期等）は行う
    buildMenu();
    applyTheme(currentId(), { animate: false });

    if (els.toggle) {
      els.toggle.addEventListener('click', function (ev) {
        ev.preventDefault();
        toggleMenu();
      });
    }

    // OS のモーション設定変更に追従
    if (window.matchMedia) {
      var mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      var onChange = function (e) { prefersReduced = e.matches; };
      if (typeof mql.addEventListener === 'function') mql.addEventListener('change', onChange);
      else if (typeof mql.addListener === 'function') mql.addListener(onChange);
    }
  });

  // 他モジュールから参照できるよう最小 API を公開（任意）
  window.APT = window.APT || {};
  window.APT.setTheme = function (id) {
    if (!VALID[id]) return;
    applyTheme(id, { animate: true });
    setStored(id);
  };
  window.APT.getTheme = currentId;
})();
