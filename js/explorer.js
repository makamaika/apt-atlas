/* =============================================================
   APT ATLAS — 全グループ探索セクション + 詳細モーダル
   担当プレフィックス: exp-
   バニラ JS（ES2020+）/ ライブラリ禁止 / 'use strict' + IIFE。

   契約:
   - window.APT_DATA / window.APT_RELATIONS を参照。
   - window.addEventListener('apt:open', e => open(e.detail.id)) を実装
     （他セクションからの起動）。
   - 似ているAPTへの遷移も同じ 'apt:open' 経路で行い、単一実装に集約。
   ============================================================= */
(function () {
  'use strict';

  var root = document.getElementById('explorer');
  if (!root) return;

  var DATA = (window.APT_DATA && Array.isArray(window.APT_DATA.groups))
    ? window.APT_DATA.groups : [];
  var RELATIONS = window.APT_RELATIONS || {};
  var SIMILAR = RELATIONS.similarTo || {};

  if (!DATA.length) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 参照テーブル ---------- */

  // 国コード → 表示名・バインドクラス。順序は最大勢力順（凡例の見栄え）。
  var COUNTRY_META = {
    CN: { label: '中国',   cc: 'cc-cn' },
    IR: { label: 'イラン', cc: 'cc-ir' },
    KP: { label: '北朝鮮', cc: 'cc-kp' },
    RU: { label: 'ロシア', cc: 'cc-ru' },
    VN: { label: 'ベトナム', cc: 'cc-vn' },
    UN: { label: '未公表', cc: 'cc-un' }
  };
  var COUNTRY_ORDER = ['CN', 'IR', 'KP', 'RU', 'VN', 'UN'];

  // 目的キー → 日本語ラベル。
  var PURPOSE_META = {
    'espionage':    'サイバースパイ',
    'ip-theft':     '知的財産窃取',
    'surveillance': '個人・組織監視',
    'financial':    '金銭目的',
    'destructive':  '破壊的攻撃'
  };
  var PURPOSE_ORDER = ['espionage', 'ip-theft', 'surveillance', 'financial', 'destructive'];

  /* ---------- ユーティリティ ---------- */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  function byId(id) {
    for (var i = 0; i < DATA.length; i++) {
      if (DATA[i].id === id) return DATA[i];
    }
    return null;
  }

  function countryMeta(code) {
    return COUNTRY_META[code] || { label: code || '不明', cc: 'cc-un' };
  }

  // 番号順（昇順）で安定ソートした配列。
  var GROUPS = DATA.slice().sort(function (a, b) {
    return (a.num || 0) - (b.num || 0);
  });

  /* ---------- 国別・目的別の件数集計 ---------- */

  var countryCounts = {};
  var purposeCounts = {};
  GROUPS.forEach(function (g) {
    var cc = g.countryCode || 'UN';
    countryCounts[cc] = (countryCounts[cc] || 0) + 1;
    (g.purposes || []).forEach(function (p) {
      purposeCounts[p] = (purposeCounts[p] || 0) + 1;
    });
  });

  /* =============================================================
     カード生成
     ============================================================= */

  function nationHTML(g, cls) {
    var cm = countryMeta(g.countryCode);
    return '<span class="' + cls + ' ' + cm.cc + '" data-country="' + esc(g.countryCode) + '">' +
      '<span class="exp-dot" aria-hidden="true"></span>' +
      '<span>' + esc(cm.label) + '</span>' +
      '</span>';
  }

  function sectorsHTML(sectors) {
    var list = (sectors || []).slice(0, 3);
    if (!list.length) return '';
    var chips = list.map(function (s) {
      return '<span class="exp-chip-tag">' + esc(s) + '</span>';
    }).join('');
    var extra = (sectors.length > 3)
      ? '<span class="exp-chip-more">他 ' + (sectors.length - 3) + ' 業種</span>'
      : '';
    return '<div class="exp-field">' +
      '<span class="exp-field-label" lang="ja">標的とされる業種</span>' +
      '<div class="exp-sectors">' + chips + extra + '</div>' +
      '</div>';
  }

  function malwareHTML(malware) {
    var list = (malware || []);
    if (!list.length) return '';
    var head = list.slice(0, 2);
    var chips = head.map(function (m) {
      return '<span class="exp-chip-tag is-mal">' + esc(m) + '</span>';
    }).join('');
    var extra = (list.length > 2)
      ? '<span class="exp-chip-more">他 ' + (list.length - 2) + ' 種</span>'
      : '';
    return '<div class="exp-field">' +
      '<span class="exp-field-label" lang="ja">代表マルウェア</span>' +
      '<div class="exp-sectors">' + chips + extra + '</div>' +
      '</div>';
  }

  function aliasHTML(aliases) {
    if (!aliases || !aliases.length) return '';
    return '<p class="exp-plate-alias">' +
      '<span class="exp-alias-key">別名</span>' +
      esc(aliases.join(' ／ ')) +
      '</p>';
  }

  function buildCard(g, index) {
    var cm = countryMeta(g.countryCode);

    // 出現スタッガーは exp-in クラス＋ --exp-i（可視カードの連番）で制御する。
    // data-reveal は付けない（グリッドは即時。個々の立ち上がりは
    // staggerReveal() が担い、フィルタ切替でも再生できるようにするため）。
    var card = el(
      '<article class="exp-plate ' + cm.cc + '" ' +
        'data-country="' + esc(g.countryCode) + '" ' +
        'data-id="' + esc(g.id) + '" ' +
        'role="listitem">' +

        '<div class="exp-plate-inner" role="button" tabindex="0" ' +
          'aria-label="' + esc(g.id) + ' の詳細を開く">' +

          '<div class="exp-plate-top">' +
            '<span class="exp-plate-idx">' +
              '<span class="exp-plate-tab" aria-hidden="true"></span>' +
              '<span class="exp-plate-no">NO. ' + pad2(g.num) + '</span>' +
            '</span>' +
            nationHTML(g, 'exp-nation') +
          '</div>' +

          '<h3 class="exp-plate-id">' + esc(g.id) + '</h3>' +
          aliasHTML(g.aliases) +

          (g.hook ? '<p class="exp-plate-hook">' + esc(g.hook) + '</p>' : '') +

          '<div class="exp-plate-body">' +
            sectorsHTML(g.sectors) +
            malwareHTML(g.malware) +
          '</div>' +

        '</div>' +
      '</article>'
    );

    // クリック / キーボードで開く。role=button は内側要素に付与。
    var btn = card.querySelector('.exp-plate-inner');
    // article 全体をクリック可能に（内側 role=button がフォーカス対象）
    card.addEventListener('click', function () { openModal(g.id, card); });
    btn.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
        ev.preventDefault();
        openModal(g.id, card);
      }
    });

    // 検索用の正規化文字列を保持
    card._searchText = buildSearchText(g);
    card._group = g;
    return card;
  }

  function buildSearchText(g) {
    var parts = [g.id, g.country];
    if (g.aliases) parts = parts.concat(g.aliases);
    if (g.malware) parts = parts.concat(g.malware);
    return parts.join(' ').toLowerCase();
  }

  /* =============================================================
     グリッド構築
     ============================================================= */

  var grid = document.getElementById('exp-grid');
  var animatable = !reduceMotion && ('IntersectionObserver' in window);
  var cards = [];
  GROUPS.forEach(function (g, i) {
    var c = buildCard(g, i);
    // アニメ可能環境では、初進入まで伏せておく（フラッシュ防止）。
    if (animatable) c.classList.add('exp-hold');
    cards.push(c);
    grid.appendChild(c);
  });

  // 章見出し・検索/フィルタ帯（data-reveal 付き）のリビール保険。
  // カード自体は data-reveal を持たず、下記 staggerReveal が担当する。
  ensureReveal();

  /* ---------- カード出現スタッガー ----------
     可視カードに 0 起点の連番 --exp-i を割り当て、exp-in を（再）付与して
     30ms 間隔で立ち上げる。初期表示（グリッド初進入）とフィルタ切替の双方で再生。
     reduced-motion では即時最終形（CSS 側でも保証）。 */
  function staggerReveal(list) {
    if (reduceMotion) {
      list.forEach(function (c) {
        c.style.removeProperty('--exp-i');
        c.classList.remove('exp-in', 'exp-hold');
      });
      return;
    }
    list.forEach(function (c, i) {
      // アニメを確実に再start：一旦外して reflow、連番を振り直して再付与。
      // 保持状態(exp-hold)もここで解く（exp-in が初期形を担う）。
      c.classList.remove('exp-in', 'exp-hold');
      c.style.setProperty('--exp-i', i);
    });
    // 強制リフロー（1回）で animation を巻き戻す
    void grid.offsetWidth;
    list.forEach(function (c) {
      c.classList.add('exp-in');
    });
  }

  // exp-in はアニメ完了で自然に最終状態（opacity:1）になるが、
  // 途中でフィルタ再生されても破綻しないよう animationend で class を掃除する。
  grid.addEventListener('animationend', function (ev) {
    if (ev.animationName === 'exp-plate-in' &&
        ev.target && ev.target.classList.contains('exp-plate')) {
      ev.target.classList.remove('exp-in');
      ev.target.style.removeProperty('--exp-i');
    }
  });

  // 初期表示：グリッドが初めてビューに入った時に一度だけスタッガー再生。
  var firstRevealDone = false;
  function primeInitialReveal() {
    if (firstRevealDone) return;
    firstRevealDone = true;
    staggerReveal(visibleCards());
  }
  if (reduceMotion || !('IntersectionObserver' in window)) {
    firstRevealDone = true; // 即時（CSS が最終形を保証）
  } else {
    // グリッドは全 39 枚で非常に縦長のため、面積比しきい値では発火しにくい。
    // 「上端が少し入ったら」で確実に着火するよう threshold:0 とし、
    // 下方に余裕（-8%）を持たせて気持ちよく立ち上げる。
    var gridIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          primeInitialReveal();
          obs.disconnect();
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    gridIO.observe(grid);
  }

  // 現在表示中（hidden でない）のカードを番号順で返す。
  function visibleCards() {
    return cards.filter(function (c) { return !c.hidden; });
  }

  /* =============================================================
     フィルタ・チップ生成
     ============================================================= */

  var state = { q: '', country: 'ALL', purpose: 'ALL' };

  var countryChipsWrap = document.getElementById('exp-country-chips');
  var purposeChipsWrap = document.getElementById('exp-purpose-chips');

  // 「すべて」国チップ
  countryChipsWrap.appendChild(buildFilterChip({
    kind: 'country', value: 'ALL', label: 'すべて',
    n: GROUPS.length, all: true
  }));
  COUNTRY_ORDER.forEach(function (code) {
    if (!countryCounts[code]) return;
    var cm = countryMeta(code);
    countryChipsWrap.appendChild(buildFilterChip({
      kind: 'country', value: code, label: cm.label,
      n: countryCounts[code], cc: cm.cc
    }));
  });

  // 「すべて」目的チップ
  purposeChipsWrap.appendChild(buildFilterChip({
    kind: 'purpose', value: 'ALL', label: 'すべて',
    n: GROUPS.length, all: true, purpose: true
  }));
  PURPOSE_ORDER.forEach(function (p) {
    if (!purposeCounts[p]) return;
    purposeChipsWrap.appendChild(buildFilterChip({
      kind: 'purpose', value: p, label: PURPOSE_META[p] || p,
      n: purposeCounts[p], purpose: true
    }));
  });

  function buildFilterChip(opt) {
    var classes = ['exp-chip'];
    if (opt.cc) classes.push(opt.cc);
    if (opt.all) classes.push('exp-chip-all');
    if (opt.purpose) classes.push('exp-chip-purpose');
    if (opt.value === 'ALL') classes.push('is-active');

    var marker = opt.purpose
      ? '<span class="exp-chip-mark" aria-hidden="true"></span>'
      : '<span class="exp-chip-dot" aria-hidden="true"></span>';

    var chip = el(
      '<button type="button" class="' + classes.join(' ') + '" ' +
        'data-kind="' + opt.kind + '" data-value="' + esc(opt.value) + '" ' +
        'aria-pressed="' + (opt.value === 'ALL' ? 'true' : 'false') + '">' +
        marker +
        '<span class="exp-chip-label">' + esc(opt.label) + '</span>' +
        '<span class="exp-chip-n">' + opt.n + '</span>' +
      '</button>'
    );

    chip.addEventListener('click', function () {
      selectFilter(opt.kind, opt.value, chip);
    });
    return chip;
  }

  function selectFilter(kind, value, sourceChip) {
    if (kind === 'country') state.country = value;
    else if (kind === 'purpose') state.purpose = value;

    // 該当グループ内のチップの active 状態を更新
    var wrap = (kind === 'country') ? countryChipsWrap : purposeChipsWrap;
    var chips = wrap.querySelectorAll('.exp-chip');
    chips.forEach(function (ch) {
      var active = ch.getAttribute('data-value') === value;
      ch.classList.toggle('is-active', active);
      ch.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    // 押されたチップに spring（0.97→1）を一瞬掛ける。
    if (sourceChip) popChip(sourceChip);

    // フィルタ切替 → 件数フリップ＋カード再スタッガー。
    applyFilters({ stagger: true, flip: true });
  }

  // チップの spring 演出（アニメ完了で class を掃除し再発火可能に）。
  function popChip(chip) {
    if (reduceMotion) return;
    chip.classList.remove('exp-pop');
    void chip.offsetWidth;
    chip.classList.add('exp-pop');
    chip.addEventListener('animationend', function onEnd(ev) {
      if (ev.animationName !== 'exp-chip-pop') return;
      chip.classList.remove('exp-pop');
      chip.removeEventListener('animationend', onEnd);
    });
  }

  /* =============================================================
     検索入力
     ============================================================= */

  var searchInput = document.getElementById('exp-search-input');
  var searchClear = document.getElementById('exp-search-clear');

  // 検索は連続入力のため、毎キーでカードを再スタッガーさせない
  // （＝派手さの回避）。件数フリップのみ更新し、絞り込みは即時反映。
  searchInput.addEventListener('input', function () {
    state.q = searchInput.value.trim().toLowerCase();
    searchClear.hidden = (searchInput.value.length === 0);
    applyFilters({ stagger: false, flip: true });
  });
  searchClear.addEventListener('click', function () {
    searchInput.value = '';
    state.q = '';
    searchClear.hidden = true;
    searchInput.focus();
    // クリアは明確な操作 → 残ったカードを再スタッガーで立ち上げ直す。
    applyFilters({ stagger: true, flip: true });
  });

  /* =============================================================
     フィルタ適用
     ============================================================= */

  var countEl = document.getElementById('exp-count');
  var countNEl = countEl.querySelector('.exp-count-n');
  var countUnitEl = countEl.querySelector('.exp-count-unit');
  var emptyEl = document.getElementById('exp-empty');
  var resetBtn = document.getElementById('exp-reset');
  var emptyResetBtn = document.getElementById('exp-empty-reset');

  // 空状態に図録調の小さなアイブロウを一度だけ添える（壁札の格）。
  // 既存のマーク／見出し／本文はそのまま活かし、頭に朱を1点だけ足す。
  (function primeEmptyEyebrow() {
    if (!emptyEl) return;
    var mark = emptyEl.querySelector('.exp-empty-mark');
    if (!mark || emptyEl.querySelector('.exp-empty-eyebrow')) return;
    var eb = document.createElement('p');
    eb.className = 'exp-empty-eyebrow';
    eb.innerHTML = '該当なし ／ <span class="en">No matching records</span>';
    emptyEl.insertBefore(eb, mark);
  })();

  function matches(card) {
    var g = card._group;
    if (state.country !== 'ALL' && g.countryCode !== state.country) return false;
    if (state.purpose !== 'ALL') {
      if (!g.purposes || g.purposes.indexOf(state.purpose) === -1) return false;
    }
    if (state.q && card._searchText.indexOf(state.q) === -1) return false;
    return true;
  }

  var prevShown = null;   // 前回件数（変化時のみフリップを走らせる）

  function applyFilters(opts) {
    opts = opts || {};
    var shown = 0;
    cards.forEach(function (card) {
      var ok = matches(card);
      card.hidden = !ok;
      if (ok) shown++;
    });

    // 件数の更新。値が変わった時だけ小さくフリップさせる。
    var changed = (prevShown !== null && prevShown !== shown);
    countNEl.textContent = shown;
    if (opts.flip && changed && !reduceMotion) flipCount();
    prevShown = shown;

    // 件数と単位ラベルを個別要素の textContent で更新（childNodes 添字依存を排除）。
    var unitText = (shown === GROUPS.length) ? ' 組織を表示中' : ' 組織が該当';
    if (countUnitEl) countUnitEl.textContent = unitText;

    var filtering = (state.q !== '' || state.country !== 'ALL' || state.purpose !== 'ALL');
    resetBtn.hidden = !filtering;
    emptyEl.hidden = (shown !== 0);
    grid.hidden = (shown === 0);

    // カード再スタッガー：実際に表示がある時のみ。
    // 初進入前にフィルタ操作が来た場合も、ここで初回スタッガーを兼ねる
    // （exp-hold のまま取り残されて不可視になるのを防ぐ）。
    if (opts.stagger && shown > 0) {
      firstRevealDone = true;
      staggerReveal(visibleCards());
    }
  }

  // 件数の数字だけを一瞬フリップ（fade + translateY）。
  function flipCount() {
    countNEl.classList.remove('exp-flip');
    void countNEl.offsetWidth;
    countNEl.classList.add('exp-flip');
    countNEl.addEventListener('animationend', function onEnd(ev) {
      if (ev.animationName !== 'exp-count-flip') return;
      countNEl.classList.remove('exp-flip');
      countNEl.removeEventListener('animationend', onEnd);
    });
  }

  function resetAll() {
    state = { q: '', country: 'ALL', purpose: 'ALL' };
    searchInput.value = '';
    searchClear.hidden = true;
    [countryChipsWrap, purposeChipsWrap].forEach(function (wrap) {
      wrap.querySelectorAll('.exp-chip').forEach(function (ch) {
        var active = ch.getAttribute('data-value') === 'ALL';
        ch.classList.toggle('is-active', active);
        ch.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    });
    applyFilters({ stagger: true, flip: true });
  }

  resetBtn.addEventListener('click', function () { resetAll(); searchInput.focus(); });
  emptyResetBtn.addEventListener('click', function () { resetAll(); searchInput.focus(); });

  /* =============================================================
     詳細モーダル
     ============================================================= */

  var modalRoot = document.getElementById('exp-modal-root');
  var modalEl = document.getElementById('exp-modal');
  var modalInner = document.getElementById('exp-modal-inner');
  var overlay = document.getElementById('exp-overlay');

  var lastFocus = null;      // 発火元へフォーカスを戻す
  var isOpen = false;
  var currentId = null;      // 現在表示中グループ
  var navList = [];          // 前後移動の対象 id 列（番号順）
  var crossTimer = null;     // クロスフェード待ちタイマー

  /* ---------- 前後移動リスト ----------
     フィルタ結果内に対象がいればその結果内で循環、いなければ全 39 組織で循環。
     いずれも番号（num）昇順。 */
  function computeNavList(id) {
    var vis = visibleCards().map(function (c) { return c._group.id; });
    if (vis.indexOf(id) !== -1) return vis;      // フィルタ結果内で循環
    return GROUPS.map(function (g) { return g.id; }); // 全体で循環
  }

  function navIndex(id) {
    return navList.indexOf(id);
  }

  function metaRow(key, val, isNum) {
    if (val == null || val === '') return '';
    return '<div class="exp-meta-item">' +
      '<span class="exp-meta-key" lang="ja">' + esc(key) + '</span>' +
      '<span class="exp-meta-val' + (isNum ? ' is-num' : '') + '">' + esc(val) + '</span>' +
      '</div>';
  }

  function chipsBlock(label, items, isMal) {
    if (!items || !items.length) return '';
    var chips = items.map(function (m) {
      return '<span class="exp-chip-tag' + (isMal ? ' is-mal' : '') + '">' + esc(m) + '</span>';
    }).join('');
    return '<div class="exp-mfield">' +
      '<span class="exp-mfield-label" lang="ja">' + esc(label) + '</span>' +
      '<div class="exp-mchips">' + chips + '</div>' +
      '</div>';
  }

  function textField(label, text) {
    if (!text) return '';
    return '<div class="exp-mfield">' +
      '<span class="exp-mfield-label" lang="ja">' + esc(label) + '</span>' +
      '<p class="exp-mfield-text">' + esc(text) + '</p>' +
      '</div>';
  }

  function purposesBlock(purposes) {
    if (!purposes || !purposes.length) return '';
    var tags = purposes.map(function (p) {
      var lbl = PURPOSE_META[p] || p;
      return '<span class="exp-purpose-tag">' + esc(lbl) + '</span>';
    }).join('');
    return '<div class="exp-mfield">' +
      '<span class="exp-mfield-label" lang="ja">活動目的</span>' +
      '<div class="exp-mchips">' + tags + '</div>' +
      '</div>';
  }

  function similarBlock(id) {
    var list = (SIMILAR[id] || []).slice(0, 3);
    if (!list.length) return '';
    var cards = list.map(function (s) {
      var g = byId(s.id);
      if (!g) return '';
      var cm = countryMeta(g.countryCode);
      var reasons = (s.reasons || []).join('。');
      if (reasons) reasons += '。';
      return '<button type="button" class="exp-simcard ' + cm.cc + '" ' +
          'data-goto="' + esc(s.id) + '" ' +
          'aria-label="' + esc(s.id) + ' の詳細へ移動">' +
          '<span class="exp-simcard-top">' +
            '<span class="exp-simcard-id">' + esc(s.id) + '</span>' +
            '<span class="exp-simcard-nation ' + cm.cc + '">' +
              '<span class="exp-dot" aria-hidden="true"></span>' + esc(cm.label) +
            '</span>' +
          '</span>' +
          '<p class="exp-simcard-reason">' + esc(reasons) + '</p>' +
          '<span class="exp-simcard-go">' +
            '詳細へ' +
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
              '<line x1="4" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
              '<polyline points="13,6 19,12 13,18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
          '</span>' +
        '</button>';
    }).join('');
    return '<div class="exp-similar">' +
      '<span class="exp-mfield-label" lang="ja">似ているグループ</span>' +
      '<div class="exp-similar-list">' + cards + '</div>' +
      '</div>';
  }

  /* 差し替わる本文（ヘッダ＋ボディ）だけの HTML を返す。
     上部バー（前後ナビ・閉じる）は含めない（常在させるため）。 */
  function contentHTML(g) {
    var cm = countryMeta(g.countryCode);

    var aliases = '';
    if (g.aliases && g.aliases.length) {
      aliases = '<div class="exp-modal-aliases">' +
        '<span class="exp-alias-key">別名</span>' +
        g.aliases.map(function (a) {
          return '<span class="exp-alias-item">' + esc(a) + '</span>';
        }).join('') +
        '</div>';
    }

    // 帰属（留保ラベルつき）
    var attribHTML = '';
    if (g.attribution) {
      attribHTML = '<div class="exp-mfield">' +
        '<span class="exp-mfield-label" lang="ja">帰属</span>' +
        '<p class="exp-mfield-text">' +
          '<span class="exp-attrib-note">関与が疑われる：</span>' +
          esc(g.attribution) +
        '</p>' +
      '</div>';
    }

    // メタ（初出年・標的地域）
    var regions = (g.targetRegions && g.targetRegions.length)
      ? g.targetRegions.join('、') : '';
    var metaItems = metaRow('初出', g.firstSeen, true) + metaRow('主な標的地域', regions, false);
    var metaBlock = metaItems
      ? '<div class="exp-mfield"><div class="exp-meta">' + metaItems + '</div></div>'
      : '';

    return '<header class="exp-modal-head ' + cm.cc + '">' +
        '<div class="exp-modal-topline">' +
          '<span class="exp-modal-plateno">NO. ' + pad2(g.num) + ' ／ 図録番号</span>' +
          '<span class="exp-modal-nation ' + cm.cc + '" data-country="' + esc(g.countryCode) + '">' +
            '<span class="exp-dot" aria-hidden="true"></span>' + esc(cm.label) +
          '</span>' +
        '</div>' +
        '<h2 class="exp-modal-id" id="exp-modal-title">' + esc(g.id) + '</h2>' +
        aliases +
        (g.hook ? '<p class="exp-modal-hook">' + esc(g.hook) + '</p>' : '') +
      '</header>' +

      '<div class="exp-modal-body">' +
        attribHTML +
        textField('標的とされる業種', g.targetsIndustries) +
        chipsBlock('主な対象セクター', g.sectors, false) +
        textField('概要', g.summary) +
        chipsBlock('関連するマルウェア', g.malware, true) +
        textField('攻撃経路', g.attackVector) +
        purposesBlock(g.purposes) +
        metaBlock +
        similarBlock(g.id) +
      '</div>';
  }

  // 位置インジケータ（フィルタ結果内の連番）の中身を返す。
  function posHTML() {
    var idx = navIndex(currentId);
    var cur = (idx === -1) ? 1 : (idx + 1);
    return '<span class="exp-modal-pos-cur">' + pad2(cur) + '</span>' +
      ' ／ ' + pad2(navList.length);
  }

  // 前後移動が可能か（2件以上で循環が意味を持つ）。
  function navEnabled() {
    return navList.length > 1;
  }

  // モーダル骨格（上部バー＋内容ラッパ）を一度だけ組み、内容を流し込む。
  function renderModal(g) {
    var navBar = navEnabled()
      ? '<div class="exp-modal-nav" role="group" aria-label="組織を前後に移動">' +
          '<button type="button" class="exp-modal-navbtn is-prev" id="exp-modal-prev" aria-label="前の組織へ">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
              '<polyline points="14,6 8,12 14,18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
          '</button>' +
          '<span class="exp-modal-pos" id="exp-modal-pos" aria-hidden="true">' + posHTML() + '</span>' +
          '<button type="button" class="exp-modal-navbtn is-next" id="exp-modal-next" aria-label="次の組織へ">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
              '<polyline points="10,6 16,12 10,18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
            '</svg>' +
          '</button>' +
        '</div>'
      : '<span></span>'; // 左側プレースホルダ（バーの両端揃え維持）

    modalInner.innerHTML =
      '<div class="exp-modal-bar">' +
        navBar +
        '<button type="button" class="exp-modal-close" id="exp-modal-close" aria-label="閉じる">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
            '<line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
            '<line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="exp-modal-content" id="exp-modal-content">' +
        contentHTML(g) +
      '</div>';

    // バー（閉じる・前後ナビ）はここで一度だけ配線する。
    // 内容差し替え時（goTo の非再構築ブランチ）はバーを作り直さないため、
    // ここでの二重バインドを避けるのが循環バグ防止の要。
    wireBar();
    wireContent();

    modalEl.scrollTop = 0;
    modalRoot.scrollTop = 0;
  }

  // バーのボタン配線（renderModal でバーを組んだ直後のみ呼ぶ）。
  function wireBar() {
    var closeBtn = modalInner.querySelector('#exp-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    var prevBtn = modalInner.querySelector('#exp-modal-prev');
    var nextBtn = modalInner.querySelector('#exp-modal-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });
  }

  // 本文内（似ているグループ）の配線。内容差し替えのたびに呼ぶ。
  function wireContent() {
    // 似ているAPTカード → 同モーダルを差し替え（apt:open 経路で単一化）
    modalInner.querySelectorAll('.exp-simcard').forEach(function (b) {
      b.addEventListener('click', function () {
        var goto = b.getAttribute('data-goto');
        if (goto) navigateTo(goto);
      });
    });
  }

  function openModal(id, originEl) {
    var g = byId(id);
    if (!g) return;

    if (!isOpen) {
      lastFocus = originEl ||
        (document.activeElement && document.activeElement !== document.body
          ? document.activeElement : null);
      lockScroll();
      modalRoot.hidden = false;
      isOpen = true;
      // 次フレームで is-open を付けて遷移を発火
      requestAnimationFrame(function () {
        modalRoot.classList.add('is-open');
      });
      document.addEventListener('keydown', onKeydown, true);
      overlay.addEventListener('click', closeModal);
    }

    currentId = id;
    navList = computeNavList(id);
    renderModal(g);

    // 初期フォーカスを閉じるボタンへ（focus trap 起点）
    var closeBtn = modalInner.querySelector('#exp-modal-close');
    if (closeBtn) {
      // reduced-motion 以外では遷移直後に。即時 focus で問題なし。
      closeBtn.focus();
    }
  }

  /* 開いたまま別グループへ遷移（内容クロスフェード）。
     - fromNav=true（前後ナビ）: navList はそのまま、位置だけ更新。
     - fromNav=false（似ているグループ等）: 遷移先を基準に navList を組み直す。 */
  function goTo(id, fromNav) {
    var g = byId(id);
    if (!g) return;

    currentId = id;
    if (!fromNav) navList = computeNavList(id);

    var content = modalInner.querySelector('#exp-modal-content');

    var swap = function () {
      // 骨格（バー）は前後ナビの有無が変わらない限り再構築しない。
      // 似ているグループ経由で navList 件数が変わると前後ナビの有無が
      // 変化しうるため、その場合はバーごと組み直す。
      var barHasNav = !!modalInner.querySelector('.exp-modal-nav');
      if (barHasNav !== navEnabled()) {
        // 前後ナビの有無が変わる → バーごと作り直し（配線も renderModal 内で一括）。
        renderModal(g);
      } else {
        // 内容だけ差し替え（バーは据え置き＝二重バインド回避）。
        var c = modalInner.querySelector('#exp-modal-content');
        if (c) c.innerHTML = contentHTML(g);
        var pos = modalInner.querySelector('#exp-modal-pos');
        if (pos) pos.innerHTML = posHTML();
        wireContent();
      }
      modalEl.scrollTop = 0;
      modalRoot.scrollTop = 0;
      // 焦点はバーに残す（閉じるへ）。ナビ連打時のフォーカス喪失を防ぐ。
      var closeBtn = modalInner.querySelector('#exp-modal-close');
      if (closeBtn) closeBtn.focus();
      // in（フェード戻し）
      var cc = modalInner.querySelector('#exp-modal-content');
      if (cc) cc.classList.remove('exp-cross-out');
    };

    if (reduceMotion || !content) {
      swap();
      return;
    }

    // out → 差し替え → in（150ms out を待って swap）。
    if (crossTimer) { clearTimeout(crossTimer); crossTimer = null; }
    content.classList.add('exp-cross-out');
    crossTimer = setTimeout(function () {
      crossTimer = null;
      swap();
    }, 150);
  }

  // 似ているグループ等からの遷移（navList を組み直す）。
  function navigateTo(id) { goTo(id, false); }

  // 前後移動（navList 内で循環）。dir: -1=前 / +1=次。
  function step(dir) {
    if (!navEnabled()) return;
    var idx = navIndex(currentId);
    if (idx === -1) idx = 0;
    var next = (idx + dir + navList.length) % navList.length;
    goTo(navList[next], true);
  }

  function closeModal() {
    if (!isOpen) return;
    isOpen = false;
    modalRoot.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown, true);
    overlay.removeEventListener('click', closeModal);
    if (crossTimer) { clearTimeout(crossTimer); crossTimer = null; }

    var finish = function () {
      modalRoot.hidden = true;
      modalInner.innerHTML = '';
      unlockScroll();
      currentId = null;
      navList = [];
      if (lastFocus && document.contains(lastFocus)) {
        var target = lastFocus.querySelector
          ? (lastFocus.querySelector('.exp-plate-inner') || lastFocus)
          : lastFocus;
        try { target.focus(); } catch (e) {}
      }
      lastFocus = null;
    };

    if (reduceMotion) {
      finish();
    } else {
      var done = false;
      var onEnd = function () {
        if (done) return;
        done = true;
        modalEl.removeEventListener('transitionend', onEnd);
        finish();
      };
      modalEl.addEventListener('transitionend', onEnd);
      // フォールバック（transitionend が来ないケース）
      setTimeout(onEnd, 400);
    }
  }

  /* ---------- キーボード（ESC / focus trap） ---------- */

  function onKeydown(ev) {
    if (ev.key === 'Escape' || ev.key === 'Esc') {
      ev.preventDefault();
      closeModal();
      return;
    }
    // ← / → で前後の組織へ（テキスト入力中は誤爆しないよう除外）。
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
      var a = document.activeElement;
      var typing = a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' ||
        a.isContentEditable);
      if (typing) return;
      if (!navEnabled()) return;
      ev.preventDefault();
      step(ev.key === 'ArrowLeft' ? -1 : 1);
      return;
    }
    if (ev.key === 'Tab') {
      trapFocus(ev);
    }
  }

  function focusables() {
    return Array.prototype.slice.call(
      modalInner.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function (n) {
      return !n.hasAttribute('disabled') && n.offsetParent !== null;
    });
  }

  function trapFocus(ev) {
    var f = focusables();
    if (!f.length) { ev.preventDefault(); return; }
    var first = f[0];
    var last = f[f.length - 1];
    var active = document.activeElement;

    if (!modalInner.contains(active)) {
      ev.preventDefault();
      first.focus();
      return;
    }
    if (ev.shiftKey && active === first) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && active === last) {
      ev.preventDefault();
      first.focus();
    }
  }

  /* ---------- スクロールロック ---------- */

  /* overflow:hidden 方式のみ（position:fixed は使わないためスクロール位置の保存は不要）。 */
  function lockScroll() {
    document.body.style.overflow = 'hidden';
  }
  function unlockScroll() {
    document.body.style.overflow = '';
  }

  /* =============================================================
     外部起動契約: apt:open
     ============================================================= */
  window.addEventListener('apt:open', function (e) {
    var id = e && e.detail && e.detail.id;
    if (!id) return;
    // 既に開いていれば内容差し替え、閉じていれば新規オープン。
    if (isOpen) navigateTo(id);
    else openModal(id, null);
  });

  /* =============================================================
     リビール・フォールバック
     base.css / main.js の IntersectionObserver が動く環境では、
     そちらが .is-visible を付与するので二重処理は無害。
     main.js が無い / 監視外の場合の保険としてここでも監視する。
     ============================================================= */
  function ensureReveal() {
    var targets = root.querySelectorAll('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (t) {
      // 既に表示済みならスキップ
      if (t.classList.contains('is-visible') || t.classList.contains('in')) return;
      io.observe(t);
    });
  }

  // 初期表示（既定は「すべて」）
  applyFilters();

})();
