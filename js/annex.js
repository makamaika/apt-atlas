/* =============================================================
   APT ATLAS — 別館 / ANNEX（番号なき者たち）
   担当プレフィックス: ax-
   window.APT_ANNEX（annex.js データ）を読み、命名体系の展示と
   カタログ（無番の標本プレート）＋専用モーダルを動的生成する。

   契約の遵守:
   - data-reveal / .is-visible … main.js/base.css の Observer が付与。
     本ファイルは保険として自前でも監視する（二重は無害）。
   - 本館モーダルへの遷移は window.dispatchEvent(new CustomEvent('apt:open', {detail:{id}}))。
     explorer.js が受けて本館モーダルを開く。explorer.js は編集しない。
   - prefers-reduced-motion を尊重（アニメ無効・即時最終形）。
   ============================================================= */
(function () {
  'use strict';

  var DATA = window.APT_ANNEX;
  if (!DATA || !Array.isArray(DATA.groups)) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 国・分類メタ（コード → 日本語ラベル / .cc-* クラス） ---------- */
  var COUNTRY_META = {
    'CN': { label: '中国',   cc: 'cc-cn' },
    'IR': { label: 'イラン', cc: 'cc-ir' },
    'KP': { label: '北朝鮮', cc: 'cc-kp' },
    'RU': { label: 'ロシア', cc: 'cc-ru' },
    'VN': { label: 'ベトナム', cc: 'cc-vn' },
    'UN': { label: '未公表', cc: 'cc-un' },
    'IN': { label: 'インド', cc: 'cc-in' },
    'US': { label: '米国',   cc: 'cc-us' },
    'CR': { label: '犯罪組織', cc: 'cc-cr' }
  };
  function countryMeta(code) {
    return COUNTRY_META[code] || { label: (code || '未公表'), cc: 'cc-un' };
  }

  /* ---------- 活動目的（本館の5分類＋別館の prepositioning） ---------- */
  var PURPOSE_META = {
    'espionage':      'サイバースパイ',
    'ip-theft':       '知的財産窃取',
    'surveillance':   '個人・組織監視',
    'financial':      '金銭目的',
    'destructive':    '破壊的攻撃',
    'prepositioning': '事前配置'
  };

  /* ---------- エスケープ（テキスト・属性・URL） ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  // 出典 URL は http(s) のみ許可（javascript: 等を弾く）。不正なら空文字。
  function safeUrl(u) {
    var s = String(u == null ? '' : u).trim();
    if (/^https?:\/\//i.test(s)) return s;
    return '';
  }

  /* コードネームのイニシャル（無番の登録印）。英字先頭2語のイニシャルを拾う。
     例: "Volt Typhoon" → "VT"、"FIN7" → "F7" 相当の頭文字。 */
  function cipherOf(name) {
    var s = String(name || '').trim();
    if (!s) return '—';
    var parts = s.split(/[\s\-–—]+/).filter(Boolean);
    var out = '';
    for (var i = 0; i < parts.length && out.length < 2; i++) {
      var ch = parts[i].charAt(0);
      if (ch) out += ch.toUpperCase();
    }
    return out || s.charAt(0).toUpperCase();
  }

  /* =============================================================
     1. 命名体系の展示（CrowdStrike / Microsoft / 多名の実例）
     ============================================================= */
  function renderTaxonomy() {
    var tax = DATA.taxonomy || {};

    // CrowdStrike 動物サフィックス表
    var csEl = document.querySelector('[data-ax-cs]');
    if (csEl && tax.crowdstrike && Array.isArray(tax.crowdstrike.suffixes)) {
      csEl.innerHTML = tax.crowdstrike.suffixes.map(function (row) {
        return '<div class="ax-lex-row">' +
          '<dt class="ax-lex-term">' + esc(row.suffix) + '</dt>' +
          '<dd class="ax-lex-country">' + esc(row.country) + '</dd>' +
        '</div>';
      }).join('');
    }

    // Microsoft 気象ファミリー表
    var msEl = document.querySelector('[data-ax-ms]');
    if (msEl && tax.microsoft && Array.isArray(tax.microsoft.families)) {
      msEl.innerHTML = tax.microsoft.families.map(function (row) {
        return '<div class="ax-lex-row">' +
          '<dt class="ax-lex-term">' + esc(row.family) + '</dt>' +
          '<dd class="ax-lex-country">' + esc(row.country) + '</dd>' +
        '</div>';
      }).join('');
    }

    // 同一グループ多名の実例
    var crossEl = document.querySelector('[data-ax-cross]');
    if (crossEl && Array.isArray(tax.crossExamples)) {
      crossEl.innerHTML = tax.crossExamples.map(function (ex) {
        return '<li class="ax-cross-item">' +
          '<p class="ax-cross-canon">' + esc(ex.canonical) + '</p>' +
          '<p class="ax-cross-names">' + esc(ex.names) + '</p>' +
        '</li>';
      }).join('');
    }
  }

  /* =============================================================
     2. カタログ（無番の標本プレート）
     ============================================================= */
  var CARD_MAL_MAX = 5;      // カードに出すマルウェアチップの上限
  var CARD_VENDOR_MAX = 3;   // カードに出すベンダー呼称の上限

  function cardHTML(g, i) {
    var cm = countryMeta(g.countryCode);

    // ベンダー呼称（先頭数件を抜粋）
    var vendors = Array.isArray(g.vendorNames) ? g.vendorNames : [];
    var vendorChips = '';
    if (vendors.length) {
      var vShown = vendors.slice(0, CARD_VENDOR_MAX);
      vendorChips = vShown.map(function (v) {
        return '<span class="ax-chip-tag">' + esc(v.vendor) + '</span>';
      }).join('');
      if (vendors.length > vShown.length) {
        vendorChips += '<span class="ax-chip-more">他 ' +
          (vendors.length - vShown.length) + ' 社</span>';
      }
    }

    // マルウェアチップ
    var mal = Array.isArray(g.malware) ? g.malware : [];
    var malChips = '';
    if (mal.length) {
      var mShown = mal.slice(0, CARD_MAL_MAX);
      malChips = mShown.map(function (m) {
        return '<span class="ax-chip-tag is-mal">' + esc(m) + '</span>';
      }).join('');
      if (mal.length > mShown.length) {
        malChips += '<span class="ax-chip-more">他 ' +
          (mal.length - mShown.length) + ' 種</span>';
      }
    }

    var mitre = g.mitre
      ? '<span class="ax-card-mitre">' + esc(g.mitre) + '</span>'
      : '';

    var vendorField = vendorChips
      ? '<div class="ax-field">' +
          '<span class="ax-field-label">追跡ベンダー ／ <span class="en">Trackers</span></span>' +
          '<div class="ax-vendors">' + vendorChips + '</div>' +
        '</div>'
      : '';

    var malField = malChips
      ? '<div class="ax-field">' +
          '<span class="ax-field-label">関連するマルウェア ／ <span class="en">Malware</span></span>' +
          '<div class="ax-chips">' + malChips + '</div>' +
        '</div>'
      : '';

    return '<div class="ax-card ' + cm.cc + '" role="listitem" ' +
        'data-country="' + esc(g.countryCode) + '" style="--ax-i:' + i + '">' +
      '<div class="ax-card-inner" role="button" tabindex="0" ' +
          'data-id="' + esc(g.id) + '" ' +
          'aria-label="' + esc(g.name) + ' の詳細を開く">' +
        '<div class="ax-card-top">' +
          '<span class="ax-card-idx">' +
            '<span class="ax-card-tab" aria-hidden="true"></span>' +
            '<span class="ax-card-mark">' +
              '<span class="ax-card-cipher">' + esc(cipherOf(g.name)) + '</span>' +
              mitre +
            '</span>' +
          '</span>' +
          '<span class="ax-nation ' + cm.cc + '" data-country="' + esc(g.countryCode) + '">' +
            '<span class="ax-dot" aria-hidden="true"></span>' + esc(cm.label) +
          '</span>' +
        '</div>' +
        '<h4 class="ax-card-name">' + esc(g.name) + '</h4>' +
        (g.nameJa ? '<p class="ax-card-ja">' + esc(g.nameJa) + '</p>' : '') +
        (g.hook ? '<p class="ax-card-hook">' + esc(g.hook) + '</p>' : '') +
        '<div class="ax-card-body">' +
          vendorField +
          malField +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function renderGrid() {
    var grid = document.querySelector('[data-ax-grid]');
    if (!grid) return;

    grid.innerHTML = DATA.groups.map(cardHTML).join('');

    // 件数表示（データ件数を真実として上書き。HTML初期値はフォールバック）。
    var countEl = document.querySelector('[data-ax-count]');
    if (countEl) countEl.textContent = String(DATA.groups.length);

    // カードのクリック／キーボード起動。
    // click は外側 .ax-card へ束縛する（本館 explorer.js と同挙動）。
    // .ax-card は cursor:pointer を全面に持つため、パディング帯が
    // 「カーソルは出るのに反応しない」デッドゾーンにならないようにする。
    // keydown は role=button の .ax-card-inner に残す（role=button は
    // Enter/Space で click を合成しないため二重発火しない）。
    var cards = grid.querySelectorAll('.ax-card-inner');
    Array.prototype.forEach.call(cards, function (inner) {
      var card = inner.closest('.ax-card');
      (card || inner).addEventListener('click', function () {
        openModal(inner.getAttribute('data-id'), card || inner);
      });
      inner.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
          ev.preventDefault();
          openModal(inner.getAttribute('data-id'), card);
        }
      });
    });

    // 出現スタッガー（グリッドが初めて可視になった一度だけ）。
    armGridReveal(grid, cards);
  }

  // グリッドが可視になったらカードを順に立ち上げる（本館 staggerReveal と同質）。
  function armGridReveal(grid, cards) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      // 即時最終形（ホールドも掛けない）
      return;
    }
    // アニメ前の初期形（伏せる）
    Array.prototype.forEach.call(cards, function (inner) {
      var card = inner.closest('.ax-card');
      if (card) card.classList.add('ax-hold');
    });
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        obs.disconnect();
        Array.prototype.forEach.call(cards, function (inner) {
          var card = inner.closest('.ax-card');
          if (!card) return;
          card.classList.remove('ax-hold');
          card.classList.add('ax-in');
          // アニメ終了後にクラスを外し、hover 等の transform と衝突させない
          card.addEventListener('animationend', function onEnd() {
            card.classList.remove('ax-in');
            card.removeEventListener('animationend', onEnd);
          });
        });
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    io.observe(grid);
  }

  /* =============================================================
     3. 詳細モーダル（.ax-modal 系）
     本館（explorer.js）の作法を踏襲：フォーカストラップ / ESC /
     背景クリック / × / スクロールロック / 開閉アニメ。
     前後ナビは持たない（別館は列挙よりも各標本の読み物として扱う）。
     ============================================================= */
  var modalRoot = document.getElementById('ax-modal-root');
  var modalEl = document.getElementById('ax-modal');
  var modalInner = document.getElementById('ax-modal-inner');
  var overlay = document.getElementById('ax-overlay');

  var isOpen = false;
  var lastFocus = null;

  function byId(id) {
    for (var i = 0; i < DATA.groups.length; i++) {
      if (DATA.groups[i].id === id) return DATA.groups[i];
    }
    return null;
  }

  // 本館データから当該 id のグループを引く（関連図録の遷移可否判定・国色の束縛）。
  function aptGroup(id) {
    var d = window.APT_DATA;
    if (!d || !Array.isArray(d.groups)) return null;
    for (var i = 0; i < d.groups.length; i++) {
      if (d.groups[i].id === id) return d.groups[i];
    }
    return null;
  }

  // 本館データに当該 id のグループが存在するか（関連図録の遷移可否判定）。
  function aptExists(id) {
    var d = window.APT_DATA;
    if (!d || !Array.isArray(d.groups)) return true; // データ未読でも一応リンクは出す
    return !!aptGroup(id);
  }

  function chipList(items, isMal) {
    if (!Array.isArray(items) || !items.length) return '';
    return items.map(function (m) {
      return '<span class="ax-chip-tag' + (isMal ? ' is-mal' : '') + '">' +
        esc(m) + '</span>';
    }).join('');
  }

  function textField(labelJa, labelEn, value) {
    if (!value) return '';
    return '<div class="ax-mfield">' +
      '<span class="ax-mfield-label">' + esc(labelJa) +
        (labelEn ? ' ／ <span class="en">' + esc(labelEn) + '</span>' : '') +
      '</span>' +
      '<p class="ax-mfield-text">' + esc(value) + '</p>' +
    '</div>';
  }

  function chipsField(labelJa, labelEn, items, isMal) {
    if (!Array.isArray(items) || !items.length) return '';
    return '<div class="ax-mfield">' +
      '<span class="ax-mfield-label">' + esc(labelJa) +
        (labelEn ? ' ／ <span class="en">' + esc(labelEn) + '</span>' : '') +
      '</span>' +
      '<div class="ax-mchips">' + chipList(items, isMal) + '</div>' +
    '</div>';
  }

  function attribField(g) {
    if (!g.attribution) return '';
    return '<div class="ax-mfield">' +
      '<span class="ax-mfield-label">帰属 ／ <span class="en">Attribution</span></span>' +
      '<p class="ax-mfield-text">' +
        '<span class="ax-attrib-note">関与が疑われる：</span>' +
        esc(g.attribution) +
      '</p>' +
    '</div>';
  }

  function vendorNamesField(g) {
    var vendors = Array.isArray(g.vendorNames) ? g.vendorNames : [];
    if (!vendors.length) return '';
    var rows = vendors.map(function (v) {
      return '<div class="ax-vendor-row">' +
        '<span class="ax-vendor-name-vendor">' + esc(v.vendor) + '</span>' +
        '<span class="ax-vendor-name-alias">' + esc(v.name) + '</span>' +
      '</div>';
    }).join('');
    return '<div class="ax-mfield">' +
      '<span class="ax-mfield-label">他ベンダーの呼称 ／ <span class="en">Aliases by Vendor</span></span>' +
      '<div class="ax-vendor-list">' + rows + '</div>' +
    '</div>';
  }

  function purposesField(g) {
    var ps = Array.isArray(g.purposes) ? g.purposes : [];
    if (!ps.length) return '';
    var tags = ps.map(function (p) {
      var lbl = PURPOSE_META[p] || p;
      return '<span class="ax-purpose-tag">' + esc(lbl) + '</span>';
    }).join('');
    return '<div class="ax-mfield">' +
      '<span class="ax-mfield-label">活動目的 ／ <span class="en">Purpose</span></span>' +
      '<div class="ax-mchips">' + tags + '</div>' +
    '</div>';
  }

  function metaField(g) {
    var items = '';
    if (g.firstSeen) {
      items += '<div class="ax-meta-item">' +
        '<span class="ax-meta-key">初出 ／ <span class="en">First Seen</span></span>' +
        '<span class="ax-meta-val is-num">' + esc(g.firstSeen) + '</span>' +
      '</div>';
    }
    if (g.mitre) {
      items += '<div class="ax-meta-item">' +
        '<span class="ax-meta-key">MITRE ATT&amp;CK</span>' +
        '<span class="ax-meta-val is-num">' + esc(g.mitre) + '</span>' +
      '</div>';
    }
    if (!items) return '';
    return '<div class="ax-mfield"><div class="ax-meta">' + items + '</div></div>';
  }

  function opsField(g) {
    var ops = Array.isArray(g.notableOps) ? g.notableOps : [];
    if (!ops.length) return '';
    var rows = ops.map(function (op) {
      return '<div class="ax-op">' +
        '<span class="ax-op-year">' + esc(op.year) + '</span>' +
        '<div class="ax-op-main">' +
          '<p class="ax-op-title">' + esc(op.title) + '</p>' +
          (op.desc ? '<p class="ax-op-desc">' + esc(op.desc) + '</p>' : '') +
        '</div>' +
      '</div>';
    }).join('');
    return '<div class="ax-mfield">' +
      '<span class="ax-mfield-label">代表的な事件 ／ <span class="en">Notable Operations</span></span>' +
      '<div class="ax-ops">' + rows + '</div>' +
    '</div>';
  }

  function relatedField(g) {
    var rel = Array.isArray(g.relatedApt) ? g.relatedApt : [];
    if (!rel.length) return '';
    var cards = rel.map(function (id) {
      var exists = aptExists(id);
      // 国別色罫の束縛（DESIGN_SPEC「国別色は識別専用」・本館 .exp-simcard と同作法）。
      // 本館データから遷移先の国コードを引き、.cc-* を付けて --edge を国色にする。
      // 引けない場合は既定の --edge: var(--c-un)（未公表グレー）のまま。
      var target = aptGroup(id);
      var ccClass = target ? ' ' + countryMeta(target.countryCode).cc : '';
      var note = exists
        ? '本館の図録をひらく'
        : '本館には未収録';
      // 存在しない場合もカード自体は出すが、data-goto を空にして無効化。
      return '<button type="button" class="ax-relcard' + ccClass + '" ' +
          (exists ? 'data-goto="' + esc(id) + '"' : 'disabled aria-disabled="true"') + '>' +
        '<span class="ax-relcard-main">' +
          '<span class="ax-relcard-id">' + esc(id) + '</span>' +
          '<span class="ax-relcard-note">' + esc(note) + '</span>' +
        '</span>' +
        (exists
          ? '<span class="ax-relcard-go">本館へ' +
              '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
                '<polyline points="9,6 15,12 9,18" fill="none" stroke="currentColor" ' +
                'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
              '</svg>' +
            '</span>'
          : '') +
      '</button>';
    }).join('');
    return '<div class="ax-related">' +
      '<span class="ax-mfield-label">本館の関連図録 ／ <span class="en">In the Main Hall</span></span>' +
      '<div class="ax-related-list">' + cards + '</div>' +
    '</div>';
  }

  function sourcesField(g) {
    var srcs = Array.isArray(g.sources) ? g.sources : [];
    if (!srcs.length) return '';
    var rows = srcs.map(function (s) {
      var url = safeUrl(s.url);
      var title = esc(s.title);
      if (url) {
        return '<p class="ax-source">' +
          '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
            title +
          '</a>' +
        '</p>';
      }
      return '<p class="ax-source">' + title + '</p>';
    }).join('');
    return '<div class="ax-mfield">' +
      '<span class="ax-mfield-label">出典 ／ <span class="en">Sources</span></span>' +
      '<div class="ax-sources">' + rows + '</div>' +
    '</div>';
  }

  function contentHTML(g) {
    var cm = countryMeta(g.countryCode);
    var mitre = g.mitre
      ? '<span class="ax-modal-mitre">' + esc(g.mitre) + '</span>'
      : '';

    return '<header class="ax-modal-head ' + cm.cc + '">' +
        '<div class="ax-modal-topline">' +
          '<span class="ax-modal-mark">' +
            '<span class="ax-modal-cipher">' + esc(cipherOf(g.name)) + '</span>' +
            mitre +
          '</span>' +
          '<span class="ax-modal-nation ' + cm.cc + '" data-country="' + esc(g.countryCode) + '">' +
            '<span class="ax-dot" aria-hidden="true"></span>' + esc(cm.label) +
          '</span>' +
        '</div>' +
        '<h2 class="ax-modal-name" id="ax-modal-title">' + esc(g.name) + '</h2>' +
        (g.nameJa ? '<p class="ax-modal-ja">' + esc(g.nameJa) + '</p>' : '') +
        (g.hook ? '<p class="ax-modal-hook">' + esc(g.hook) + '</p>' : '') +
      '</header>' +

      '<div class="ax-modal-body">' +
        attribField(g) +
        vendorNamesField(g) +
        textField('概要', 'Overview', g.summary) +
        chipsField('主な対象セクター', 'Sectors', g.sectors, false) +
        chipsField('関連するマルウェア', 'Malware', g.malware, true) +
        purposesField(g) +
        metaField(g) +
        opsField(g) +
        relatedField(g) +
        sourcesField(g) +
      '</div>';
  }

  function renderModal(g) {
    modalInner.innerHTML =
      '<div class="ax-modal-bar">' +
        '<button type="button" class="ax-modal-close" id="ax-modal-close" aria-label="閉じる">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
            '<line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
            '<line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
          '</svg>' +
        '</button>' +
      '</div>' +
      '<div class="ax-modal-content" id="ax-modal-content">' +
        contentHTML(g) +
      '</div>';

    // 閉じる
    var closeBtn = modalInner.querySelector('#ax-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    // 本館の関連図録 → apt:open で本館モーダルへ
    modalInner.querySelectorAll('.ax-relcard[data-goto]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-goto');
        if (!id) return;
        // 別館モーダルが「完全に閉じ切ってから」本館を開く（二重モーダル回避）。
        // 同期発火すると、非 reduced-motion では finish() が ~280–400ms 後に走り、
        //   ・unlockScroll() が本館モーダル背後のスクロールを解放
        //   ・lastFocus.focus() が本館外の別館カードへフォーカスを奪う
        //   ・modalInner.innerHTML='' が explorer の lastFocus 要素を破棄
        // という競合を起こす。onDone に委ねて直列化する。
        closeModal(function () {
          window.dispatchEvent(new CustomEvent('apt:open', { detail: { id: id } }));
        });
      });
    });

    modalEl.scrollTop = 0;
    modalRoot.scrollTop = 0;
  }

  function openModal(id, originEl) {
    var g = byId(id);
    if (!g || !modalRoot) return;

    lastFocus = originEl ||
      (document.activeElement && document.activeElement !== document.body
        ? document.activeElement : null);

    lockScroll();
    modalRoot.hidden = false;
    isOpen = true;
    requestAnimationFrame(function () {
      modalRoot.classList.add('is-open');
    });
    document.addEventListener('keydown', onKeydown, true);
    overlay.addEventListener('click', closeModal);

    renderModal(g);

    var closeBtn = modalInner.querySelector('#ax-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  // onDone: 別館モーダルが完全に閉じ切った後（DOM 破棄・スクロール解放・
  //   フォーカス復帰まで済んだ後）に一度だけ呼ばれる任意コールバック。
  //   本館への apt:open ハンドオフを直列化するために使う。
  //   overlay クリックや × ボタンからの呼び出しでは引数なし＝関数でないため無視される。
  function closeModal(onDone) {
    if (!isOpen) return;
    isOpen = false;
    modalRoot.classList.remove('is-open');
    document.removeEventListener('keydown', onKeydown, true);
    overlay.removeEventListener('click', closeModal);

    var finish = function () {
      modalRoot.hidden = true;
      modalInner.innerHTML = '';
      unlockScroll();
      if (lastFocus && document.contains(lastFocus)) {
        var target = lastFocus.querySelector
          ? (lastFocus.querySelector('.ax-card-inner') || lastFocus)
          : lastFocus;
        try { target.focus(); } catch (e) {}
      }
      lastFocus = null;
      if (typeof onDone === 'function') onDone();
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
      setTimeout(onEnd, 400); // フォールバック
    }
  }

  /* ---------- キーボード（ESC / focus trap） ---------- */
  function onKeydown(ev) {
    if (ev.key === 'Escape' || ev.key === 'Esc') {
      ev.preventDefault();
      closeModal();
      return;
    }
    if (ev.key === 'Tab') {
      trapFocus(ev);
    }
  }

  function focusables() {
    return Array.prototype.slice.call(
      modalInner.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
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

  /* ---------- スクロールロック（本館と同じ overflow:hidden 方式） ---------- */
  function lockScroll() { document.body.style.overflow = 'hidden'; }
  function unlockScroll() { document.body.style.overflow = ''; }

  /* =============================================================
     4. リビール・フォールバック（main.js が拾えない場合の保険）
     ============================================================= */
  function ensureReveal() {
    var root = document.getElementById('annex');
    if (!root) return;
    var targets = root.querySelectorAll('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (t) {
        t.classList.add('is-visible');
      });
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

    Array.prototype.forEach.call(targets, function (t) {
      if (t.classList.contains('is-visible') || t.classList.contains('in')) return;
      io.observe(t);
    });
  }

  /* =============================================================
     初期化
     ============================================================= */
  function init() {
    renderTaxonomy();
    renderGrid();
    ensureReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
