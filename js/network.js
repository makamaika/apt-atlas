/* =============================================================
   APT ATLAS — 関係ネットワーク図
   プレフィックス: net-
   window.APT_DATA / window.APT_RELATIONS からSVGを決定論的に生成する。
   force simulation は使わない。国別クラスタを盤面へ据え、クラスタ内は
   黄金角スパイラルで整然と並べる（乱数不使用・毎回同一の配置）。
   横長(デスクトップ)と縦長(モバイル)で構図を組み替え、
   ブレークポイント跨ぎのリサイズでのみ再構築する（デバウンス）。
   バニラJS(ES2020+) / 'use strict' / IIFE / ライブラリ不使用。
   ============================================================= */
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var GOLDEN = Math.PI * (3 - Math.sqrt(5)); // 黄金角 ≈ 2.399963 rad
  var PORTRAIT_MAX = 768; // これ未満は縦長レイアウト

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  ready(function () {
    var section = document.getElementById('network');
    var stage = document.getElementById('net-stage');
    var tip = document.getElementById('net-tip');
    if (!section || !stage) return;

    var DATA = window.APT_DATA;
    var REL = window.APT_RELATIONS;
    if (!DATA || !REL || !Array.isArray(DATA.groups)) {
      stage.innerHTML = '<p class="net-fallback">データを読み込めませんでした。</p>';
      return;
    }

    var groups = DATA.groups;

    /* ---------- インデックス構築（レイアウト非依存・一度だけ） ---------- */
    var byId = Object.create(null);
    groups.forEach(function (g) { byId[g.id] = g; });

    function keyOf(a, b) { return a < b ? a + '|' + b : b + '|' + a; }

    /* ---------- エッジ導出（sharedMalware から実行時に再構成） ----------
       ・相対固有ツール（distinctive）だけを線にする。Cobalt Strike 等の
         コモディティ（commodity）は共有リスト・モーダル表示に残すが線にしない。
       ・共有 2 組織（n=2）は通常線、3 組織以上（n>=3）は共起メッシュ。
       ・同一ペアが複数ツールを共有しても線は 1 本に統合（二重カウントなし）。
       ・relations.js の edges からは attribution（組織的帰属の系譜）のみ描く。
       挿入順はオブジェクトキー挿入順で決定論的（乱数不使用の方針を維持）。 */
    var TIERS = (REL.malwareTiers && Array.isArray(REL.malwareTiers.distinctive))
      ? REL.malwareTiers
      : {
          distinctive: ['SOGU', 'HOMEUNIX', 'PHOTO', 'ENFAL', 'MIRAGE', 'POWBAT'],
          commodity: ['BEACON', 'GH0ST', 'ZXSHELL', 'POISON IVY']
        };
    var DISTINCTIVE = new Set(TIERS.distinctive);

    var pairMap = Object.create(null);  // keyOf(a,b) -> { a, b, malware: [], tier }
    var pairKeys = [];                  // 挿入順（決定論的）
    (Array.isArray(REL.sharedMalware) ? REL.sharedMalware : []).forEach(function (entry) {
      if (!DISTINCTIVE.has(entry.malware)) return;   // コモディティは線にしない
      var ms = (entry.groups || []).filter(function (id) { return byId[id]; });
      if (ms.length < 2) return;
      var tier = ms.length === 2 ? 'pair' : 'mesh';  // n=2は通常、n>=3はメッシュ
      for (var i = 0; i < ms.length; i++) {
        for (var j = i + 1; j < ms.length; j++) {
          var key = keyOf(ms[i], ms[j]);
          var rec = pairMap[key];
          if (!rec) {
            rec = pairMap[key] = { a: ms[i], b: ms[j], malware: [], tier: 'mesh' };
            pairKeys.push(key);
          }
          rec.malware.push(entry.malware);
          if (tier === 'pair') rec.tier = 'pair';    // n=2共有が1つでもあれば通常線が勝つ
        }
      }
    });

    var drawnEdges = pairKeys.map(function (key) {
      var rec = pairMap[key];
      return {
        a: rec.a,
        b: rec.b,
        etype: rec.tier === 'pair' ? 'malware' : 'mesh',
        label: rec.malware.join('・') + 'を共有',
        // MIRAGE は命名論争含み（表示は変えない・後続決定用のデータフック）
        note: rec.malware.indexOf('MIRAGE') !== -1 ? 'naming-disputed' : null
      };
    });

    // 帰属エッジ（relations.js 由来）。防御的に attribution 以外は無視する。
    (Array.isArray(REL.edges) ? REL.edges : []).forEach(function (e) {
      if (e.type !== 'attribution' || !byId[e.a] || !byId[e.b] || e.a === e.b) return;
      drawnEdges.push({ a: e.a, b: e.b, etype: 'attribution', label: e.label, note: null });
    });

    // 配線演出の見栄え：通常線 → 帰属 → メッシュの順に安定ソート
    var ETYPE_ORDER = { malware: 0, attribution: 1, mesh: 2 };
    drawnEdges = drawnEdges
      .map(function (e, i) { return { e: e, i: i }; })
      .sort(function (x, y) {
        var d = (ETYPE_ORDER[x.e.etype] || 0) - (ETYPE_ORDER[y.e.etype] || 0);
        return d !== 0 ? d : x.i - y.i;
      })
      .map(function (o) { return o.e; });

    // 隣接 & 度数（固有ツール共起グラフ＋帰属エッジ。メッシュはペア統合済み）
    var adj = Object.create(null);      // id -> Set(近隣id)
    var degree = Object.create(null);
    groups.forEach(function (g) { adj[g.id] = new Set(); degree[g.id] = 0; });

    drawnEdges.forEach(function (e) {
      adj[e.a].add(e.b);
      adj[e.b].add(e.a);
      degree[e.a]++;
      degree[e.b]++;
    });

    // 図キャプションの本数を実データから動的算出（静的数値のズレを防ぐ）
    (function () {
      var solid = 0, attr = 0;
      drawnEdges.forEach(function (e) {
        if (e.etype === 'attribution') attr++; else solid++;
      });
      var elSolid = document.getElementById('net-count-solid');
      var elAttr = document.getElementById('net-count-attr');
      if (elSolid) elSolid.textContent = String(solid);
      if (elAttr) elAttr.textContent = String(attr);
    })();

    /* ---------- 国クラスタ定義 ---------- */
    var COUNTRY_ORDER = ['CN', 'IR', 'KP', 'RU', 'VN', 'UN'];
    var COUNTRY_LABEL = {
      CN: '中国', IR: 'イラン', KP: '北朝鮮', RU: 'ロシア', VN: 'ベトナム', UN: '未公表'
    };
    var COUNTRY_EN = {
      CN: 'China', IR: 'Iran', KP: 'North Korea', RU: 'Russia', VN: 'Vietnam', UN: 'Undisclosed'
    };
    var CC_CLASS = {
      CN: 'cc-cn', IR: 'cc-ir', KP: 'cc-kp', RU: 'cc-ru', VN: 'cc-vn', UN: 'cc-un'
    };

    // グループを国ごとに分ける（各国内は num 昇順で決定論的順序）
    var clusters = {};
    COUNTRY_ORDER.forEach(function (cc) { clusters[cc] = []; });
    groups.forEach(function (g) {
      var cc = g.countryCode;
      if (!clusters[cc]) clusters[cc] = [];
      clusters[cc].push(g);
    });
    Object.keys(clusters).forEach(function (cc) {
      clusters[cc].sort(function (a, b) { return a.num - b.num; });
    });

    /* ---------- ハブ判定（常時ラベル表示する主星） ----------
       度数3以上を「主星」とし、常時ラベルを掲げる（レビュー指示）。 */
    var HUB_MIN_DEGREE = 3;

    /* ---------- 半径スケール（度数に応じて拡大） ----------
       度数＝固有ツール共起グラフ＋帰属で、分布は {0,1,2} と {8,9} の二峰型。
       勾配が急だと高位ノードが皆ほぼ同径に張り付くため緩やかにする。
       deg0→6.0 / deg1→7.7 / deg2→8.4 / deg8→10.8 / deg9→11.1（上限13）。 */
    function radiusFor(deg) {
      return Math.min(13, 6 + Math.sqrt(deg) * 1.7);
    }

    /* ---------- レイアウト・プロファイル（横長 / 縦長） ----------
       各クラスタ中心を「盤面全体を均整よく使う」よう決め打ちで配置。
       右下の空白を解消し、中国クラスタと他クラスタの間延びを詰める。
       spacing はメンバー数で決まる（密度を一定に保つ）。         */
    function landscapeProfile() {
      var VBW = 1000, VBH = 640;
      var CX = VBW / 2, CY = VBH / 2;
      return {
        w: VBW, h: VBH, pad: 40, portrait: false,
        // 中国(28)を主星群として左〜中央に大きく据え、他5クラスタを
        // 右上→右下の対角の流れに配し、単独国(VN/UN)で中盤の間と
        // 右下・下辺の空白を埋めて盤面をむらなく満たす。
        centers: {
          CN: { x: CX - 190, y: CY + 4 },    // 主星群：左中央、最大
          IR: { x: CX + 232, y: CY - 168 },  // 右上（4組織）
          RU: { x: CX + 372, y: CY - 44 },   // 右（2組織・最右）
          KP: { x: CX + 322, y: CY + 128 },  // 右下（3組織）
          VN: { x: CX + 92,  y: CY - 150 },  // 中上・橋渡し（単独）
          UN: { x: CX + 168, y: CY + 210 }   // 下辺・中央〜右寄り（単独）
        }
      };
    }

    function portraitProfile() {
      var VBW = 560, VBH = 1000;
      var CX = VBW / 2;
      return {
        w: VBW, h: VBH, pad: 38, portrait: true,
        // 縦の流れ：中国を上部の主星群に大きく据え、以下を縦に配して
        // 縦長の器を上から下まで均整よく満たす。左右に軽く振って単調さを避ける。
        centers: {
          CN: { x: CX + 4,   y: 250 },   // 主星群：上部中央、最大
          IR: { x: CX - 108, y: 560 },   // 中段左（4組織）
          KP: { x: CX + 112, y: 640 },   // 中段右（3組織）
          RU: { x: CX - 140, y: 782 },   // 下段左（2組織）
          VN: { x: CX + 104, y: 812 },   // 下段右（単独）
          UN: { x: CX - 8,   y: 916 }    // 最下（単独）
        }
      };
    }

    // クラスタ内スパイラル。度数の高いノードを内側（中心寄り）に置くと
    // 主星が中央に来て星座らしい均整になる。
    function spiralPositions(cx, cy, n, spacing) {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var r = spacing * Math.sqrt(i + 0.75);
        var theta = i * GOLDEN;
        pts.push({ x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) });
      }
      return pts;
    }

    function spacingFor(count) {
      return count === 1 ? 0
        : count === 2 ? 46
        : count <= 4 ? 42
        : 38;  // 大クラスタも38（ラベル混雑緩和。中国28ノードで最外周≈200）
    }

    /* ---------- 状態（再構築で作り替わる） ---------- */
    var current = null; // { svg, nodeEls, edgeEls, edgeElByKey, activeId, ... }

    /* ---------- 共有内容の要約（ツールチップ用・レイアウト非依存） ---------- */
    function sharedSummary(id) {
      var neighbors = adj[id];
      if (!neighbors || neighbors.size === 0) return '同国クラスタの一員（直接の共有関係は未報告）';
      var mset = [];
      var seen = Object.create(null);
      drawnEdges.forEach(function (e) {
        if (e.a !== id && e.b !== id) return;
        var lbl = e.label || '';
        if (lbl && !seen[lbl]) { seen[lbl] = 1; mset.push(lbl); }
      });
      var head = '接続 ' + neighbors.size + ' 組織';
      if (mset.length) {
        var show = mset.slice(0, 3).join(' ・ ');
        return head + '｜' + show + (mset.length > 3 ? ' ほか' : '');
      }
      return head;
    }

    /* ---------- ツールチップ（DOM は固定・座標のみ更新） ---------- */
    function showTip(id, clientX, clientY) {
      if (!tip) return;
      var g = byId[id];
      if (!g) return;
      tip.querySelector('.net-tip-name').textContent =
        g.id + ' — ' + (COUNTRY_LABEL[g.countryCode] || '');
      tip.querySelector('.net-tip-hook').textContent = g.hook || '';
      tip.querySelector('.net-tip-shared').textContent = sharedSummary(id);
      tip.className = 'net-tip ' + (CC_CLASS[g.countryCode] || 'cc-un') + ' is-open';
      tip.hidden = false;
      positionTip(clientX, clientY);
    }

    function positionTip(clientX, clientY) {
      if (!tip || tip.hidden) return;
      var w = tip.offsetWidth || 240;
      var h = tip.offsetHeight || 90;
      var x = clientX + 16;
      var y = clientY + 16;
      var vw = window.innerWidth, vh = window.innerHeight;
      if (x + w + 12 > vw) x = clientX - w - 16;
      if (y + h + 12 > vh) y = clientY - h - 16;
      x = Math.max(8, x);
      y = Math.max(8, y);
      tip.style.left = x + 'px';
      tip.style.top = y + 'px';
    }

    function hideTip() {
      if (!tip) return;
      tip.classList.remove('is-open');
      window.setTimeout(function () {
        if (!tip.classList.contains('is-open')) tip.hidden = true;
      }, 200);
    }

    /* ---------- モーダル起動（契約） ---------- */
    function openDetail(id) {
      if (!byId[id]) return;
      window.dispatchEvent(new CustomEvent('apt:open', { detail: { id: id } }));
    }

    var prefersReduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =============================================================
       図の構築（プロファイルを受けて SVG を組み、状態を返す）
       ============================================================= */
    function build(profile) {
      var VBW = profile.w, VBH = profile.h, PAD = profile.pad;
      var CENTER = profile.centers;

      // node配置を計算（id -> {x,y}）
      var pos = Object.create(null);
      COUNTRY_ORDER.forEach(function (cc) {
        var members = clusters[cc] || [];
        if (!members.length) return;
        var center = CENTER[cc] || { x: VBW / 2, y: VBH / 2 };
        var spacing = spacingFor(members.length);
        // 度数降順 → 内側。決定論的タイブレークは num 昇順。
        var ordered = members.slice().sort(function (a, b) {
          var da = degree[a.id], db = degree[b.id];
          if (db !== da) return db - da;
          return a.num - b.num;
        });
        var pts = spiralPositions(center.x, center.y, ordered.length, spacing);
        ordered.forEach(function (g, i) { pos[g.id] = pts[i]; });
      });

      // viewBox 内にクランプ（安全マージン）
      Object.keys(pos).forEach(function (id) {
        var p = pos[id];
        p.x = Math.max(PAD, Math.min(VBW - PAD, p.x));
        p.y = Math.max(PAD, Math.min(VBH - PAD, p.y));
      });

      /* ---------- SVG ルート ---------- */
      var svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('class', 'net-svg');
      svg.setAttribute('viewBox', '0 0 ' + VBW + ' ' + VBH);
      svg.setAttribute('role', 'group');
      svg.setAttribute('aria-label', '39組織の関係ネットワーク図。ノードを選ぶと詳細が開きます。');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      /* ---------- 発光フィルタ（国色で「灯る」ドロップシャドウ） ----------
         国色は CSS 変数 --edge。SVG filter は CSS 変数を直接読めないため、
         各ノードの塗り色（currentColor 相当）を feFlood ではなく
         feDropShadow の flood-color=... で個別指定する必要がある。
         これを避け、色に依存しない「自己発光」を feGaussianBlur+feMerge で作る:
         元のアルファをぼかし、元グラフィックの色で色付けして重ねる。      */
      var defs = document.createElementNS(SVG_NS, 'defs');
      var filt = document.createElementNS(SVG_NS, 'filter');
      var FILTER_ID = 'net-glow';
      filt.setAttribute('id', FILTER_ID);
      filt.setAttribute('x', '-120%');
      filt.setAttribute('y', '-120%');
      filt.setAttribute('width', '340%');
      filt.setAttribute('height', '340%');
      // SourceAlpha をぼかし → 元グラフィック(SourceGraphic)の色で塗る →
      // 元を上に重ねる。結果、ドット自身の色でにじむ微発光になる。
      var blur = document.createElementNS(SVG_NS, 'feGaussianBlur');
      blur.setAttribute('in', 'SourceGraphic');
      blur.setAttribute('stdDeviation', '2.4');
      blur.setAttribute('result', 'glowBlur');
      var merge = document.createElementNS(SVG_NS, 'feMerge');
      var m1 = document.createElementNS(SVG_NS, 'feMergeNode');
      m1.setAttribute('in', 'glowBlur');
      var m2 = document.createElementNS(SVG_NS, 'feMergeNode');
      m2.setAttribute('in', 'SourceGraphic');
      merge.appendChild(m1);
      merge.appendChild(m2);
      filt.appendChild(blur);
      filt.appendChild(merge);
      defs.appendChild(filt);
      svg.appendChild(defs);

      // 描画レイヤ（背面→前面）: ハロー → キャプション → エッジ → ノード
      var gHalos = document.createElementNS(SVG_NS, 'g');
      gHalos.setAttribute('class', 'net-halos');
      gHalos.setAttribute('aria-hidden', 'true');
      var gCaptions = document.createElementNS(SVG_NS, 'g');
      gCaptions.setAttribute('class', 'net-captions');
      gCaptions.setAttribute('aria-hidden', 'true');
      var gEdges = document.createElementNS(SVG_NS, 'g');
      gEdges.setAttribute('class', 'net-edges');
      var gNodes = document.createElementNS(SVG_NS, 'g');
      gNodes.setAttribute('class', 'net-nodes');
      svg.appendChild(gHalos);
      svg.appendChild(gCaptions);
      svg.appendChild(gEdges);
      svg.appendChild(gNodes);

      /* ---------- クラスタ・ハロー & 図中キャプション ----------
         各クラスタのメンバー座標から中心と広がりを求め、
         (a) 極薄い楕円ハロー（国色2〜4%）と
         (b) 「中国 — 28」の図中キャプション（色ドット付き）を置く。 */
      var haloByCC = Object.create(null);   // cc -> ellipse要素
      var captionByCC = Object.create(null); // cc -> {g, dot, text}
      COUNTRY_ORDER.forEach(function (cc) {
        var members = clusters[cc] || [];
        if (!members.length) return;

        // メンバーのバウンディング
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        var maxR = 0;
        members.forEach(function (g) {
          var p = pos[g.id]; if (!p) return;
          var rr = radiusFor(degree[g.id]);
          if (rr > maxR) maxR = rr;
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
        });
        if (minX === Infinity) return;
        var midX = (minX + maxX) / 2;
        var midY = (minY + maxY) / 2;
        // 楕円半径：広がり + ノード半径 + 余白
        var padH = 30 + maxR;
        var rx = (maxX - minX) / 2 + padH;
        var ry = (maxY - minY) / 2 + padH;

        var ell = document.createElementNS(SVG_NS, 'ellipse');
        ell.setAttribute('class', 'net-halo ' + (CC_CLASS[cc] || 'cc-un'));
        ell.setAttribute('cx', midX.toFixed(1));
        ell.setAttribute('cy', midY.toFixed(1));
        ell.setAttribute('rx', rx.toFixed(1));
        ell.setAttribute('ry', ry.toFixed(1));
        ell.setAttribute('data-country', cc);
        gHalos.appendChild(ell);
        haloByCC[cc] = ell;

        // キャプション位置：クラスタ楕円の下端（縦長では上端寄り回避）。
        // ハローの外周・上側に置き、ノードと重ならないようにする。
        var capX = midX;
        var capY = midY - ry - 10;
        // 上端がはみ出す場合は下側へ回す
        if (capY < PAD + 6) capY = midY + ry + 20;

        var capG = document.createElementNS(SVG_NS, 'g');
        capG.setAttribute('class', 'net-caption-tag ' + (CC_CLASS[cc] || 'cc-un'));
        capG.setAttribute('data-country', cc);
        capG.setAttribute('transform', 'translate(' + capX.toFixed(1) + ' ' + capY.toFixed(1) + ')');

        var capDot = document.createElementNS(SVG_NS, 'circle');
        capDot.setAttribute('class', 'net-caption-dot');
        capDot.setAttribute('r', '3.4');
        capDot.setAttribute('cx', '0');
        capDot.setAttribute('cy', '0');

        var capText = document.createElementNS(SVG_NS, 'text');
        capText.setAttribute('class', 'net-caption-text');
        capText.setAttribute('x', '9');
        capText.setAttribute('y', '3.6');
        // 「中国 28 · China」— 小さな英字混じりラベル
        var jp = COUNTRY_LABEL[cc] || '';
        var n = members.length;
        capText.textContent = jp + '  ' + n;
        var capEn = document.createElementNS(SVG_NS, 'tspan');
        capEn.setAttribute('class', 'net-caption-en');
        capEn.textContent = '  ' + (COUNTRY_EN[cc] || '');
        capText.appendChild(capEn);

        capG.appendChild(capDot);
        capG.appendChild(capText);
        gCaptions.appendChild(capG);
        captionByCC[cc] = { g: capG, dot: capDot, text: capText };
      });

      /* ---------- エッジ（曲線） ---------- */
      var edgeEls = []; // {el, a, b, key}
      drawnEdges.forEach(function (e) {
        var pa = pos[e.a], pb = pos[e.b];
        if (!pa || !pb) return;
        var mx = (pa.x + pb.x) / 2;
        var my = (pa.y + pb.y) / 2;
        var dx = pb.x - pa.x, dy = pb.y - pa.y;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var bow = Math.min(40, len * 0.14);
        if (e.etype === 'mesh') bow *= 0.7;  // メッシュは曲がりを弱めて網目を静かに
        var sign = ((e.a.charCodeAt(3) + e.b.charCodeAt(3)) % 2) ? 1 : -1;
        var cxp = mx + (-dy / len) * bow * sign;
        var cyp = my + (dx / len) * bow * sign;
        var d = 'M' + pa.x.toFixed(1) + ' ' + pa.y.toFixed(1) +
                ' Q' + cxp.toFixed(1) + ' ' + cyp.toFixed(1) +
                ' ' + pb.x.toFixed(1) + ' ' + pb.y.toFixed(1);
        var path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('class', 'net-edge');
        path.setAttribute('d', d);
        path.setAttribute('data-etype', e.etype);
        if (e.note) path.setAttribute('data-note', e.note);
        path.setAttribute('data-a', e.a);
        path.setAttribute('data-b', e.b);
        gEdges.appendChild(path);
        edgeEls.push({ el: path, a: e.a, b: e.b, key: keyOf(e.a, e.b) });
      });
      var edgeElByKey = Object.create(null);
      edgeEls.forEach(function (o) { edgeElByKey[o.key] = o.el; });

      /* ---------- ノード ---------- */
      var nodeEls = Object.create(null); // id -> {g, dot, cc}
      groups.forEach(function (g) {
        var p = pos[g.id];
        if (!p) return;
        var deg = degree[g.id];
        var isHub = deg >= HUB_MIN_DEGREE;
        var rDot = radiusFor(deg);

        var gEl = document.createElementNS(SVG_NS, 'g');
        gEl.setAttribute('class', 'net-node ' + (CC_CLASS[g.countryCode] || 'cc-un') + (isHub ? ' is-hub' : ''));
        gEl.setAttribute('data-id', g.id);
        gEl.setAttribute('data-country', g.countryCode);
        gEl.setAttribute('tabindex', '0');
        gEl.setAttribute('role', 'button');
        gEl.setAttribute('aria-label', g.id + '（' + (COUNTRY_LABEL[g.countryCode] || '') + '）の詳細を開く。接続 ' + deg + ' 件。');
        gEl.setAttribute('transform', 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ')');

        var halo = document.createElementNS(SVG_NS, 'circle');
        halo.setAttribute('class', 'net-node-halo');
        halo.setAttribute('r', (rDot + 13).toFixed(1));

        var ring = document.createElementNS(SVG_NS, 'circle');
        ring.setAttribute('class', 'net-node-ring');
        ring.setAttribute('r', (rDot + 5).toFixed(1));

        var dot = document.createElementNS(SVG_NS, 'circle');
        dot.setAttribute('class', 'net-node-dot');
        dot.setAttribute('r', rDot.toFixed(1));
        dot.setAttribute('filter', 'url(#' + FILTER_ID + ')');

        var label = document.createElementNS(SVG_NS, 'text');
        label.setAttribute('class', 'net-node-label');
        label.setAttribute('y', (-rDot - 7).toFixed(1));
        label.textContent = g.id;

        gEl.appendChild(halo);
        gEl.appendChild(ring);
        gEl.appendChild(dot);
        gEl.appendChild(label);
        gNodes.appendChild(gEl);

        nodeEls[g.id] = { g: gEl, dot: dot, cc: g.countryCode };
      });

      return {
        svg: svg,
        nodeEls: nodeEls,
        edgeEls: edgeEls,
        edgeElByKey: edgeElByKey,
        haloByCC: haloByCC,
        captionByCC: captionByCC,
        activeId: null,
        activeCC: null
      };
    }

    /* =============================================================
       ハイライト制御（current を参照）
       ============================================================= */
    // pinnedKey は凡例クリックで固定されたクラスタ（後段で定義）。
    // clearHighlight はピンがあればその状態へ戻す（完全消灯にしない）。
    var pinnedCC = function () { return null; }; // 後段で実体を差し込む

    function resetAll() {
      if (!current) return;
      var svg = current.svg;
      svg.classList.remove('is-focusing', 'is-clustering');
      Object.keys(current.nodeEls).forEach(function (id) {
        current.nodeEls[id].g.classList.remove('is-active', 'is-primary', 'is-dim', 'is-clan');
      });
      current.edgeEls.forEach(function (o) { o.el.classList.remove('is-active', 'is-dim'); });
      Object.keys(current.haloByCC).forEach(function (cc) {
        current.haloByCC[cc].classList.remove('is-lit');
      });
      Object.keys(current.captionByCC).forEach(function (cc) {
        current.captionByCC[cc].g.classList.remove('is-lit');
      });
      current.activeId = null;
      current.activeCC = null;
    }

    function clearHighlight() {
      if (!current) return;
      hideTip();
      var pin = pinnedCC();
      if (pin) { highlightCluster(pin); }
      else { resetAll(); }
    }

    // ノード中心の強調（本人＋隣接＋接続線）
    function highlight(id) {
      if (!current || !current.nodeEls[id]) return;
      resetAll();
      current.activeId = id;
      current.svg.classList.add('is-focusing');

      current.nodeEls[id].g.classList.add('is-active', 'is-primary');
      adj[id].forEach(function (nb) {
        if (current.nodeEls[nb]) current.nodeEls[nb].g.classList.add('is-active');
        var key = keyOf(id, nb);
        if (current.edgeElByKey[key]) current.edgeElByKey[key].classList.add('is-active');
      });
    }

    // クラスタ強調（凡例hover/click）：該当国を灯し、他を減光
    function highlightCluster(cc) {
      if (!current) return;
      resetAll();
      current.activeCC = cc;
      current.svg.classList.add('is-clustering');

      Object.keys(current.nodeEls).forEach(function (id) {
        var ne = current.nodeEls[id];
        if (ne.cc === cc) ne.g.classList.add('is-clan');
        else ne.g.classList.add('is-dim');
      });
      current.edgeEls.forEach(function (o) {
        var same = current.nodeEls[o.a] && current.nodeEls[o.b] &&
                   current.nodeEls[o.a].cc === cc && current.nodeEls[o.b].cc === cc;
        if (!same) o.el.classList.add('is-dim');
      });
      if (current.haloByCC[cc]) current.haloByCC[cc].classList.add('is-lit');
      if (current.captionByCC[cc]) current.captionByCC[cc].g.classList.add('is-lit');
    }

    // 任意のノード集合を灯す（「注目の繋がり」カード連動）
    function highlightSet(ids) {
      if (!current || !ids || !ids.length) return;
      var set = Object.create(null);
      ids.forEach(function (id) { if (current.nodeEls[id]) set[id] = 1; });
      if (!Object.keys(set).length) return;
      resetAll();
      current.svg.classList.add('is-clustering');

      Object.keys(current.nodeEls).forEach(function (id) {
        var ne = current.nodeEls[id];
        if (set[id]) ne.g.classList.add('is-clan');
        else ne.g.classList.add('is-dim');
      });
      // 集合内どうしを結ぶエッジのみ灯す
      current.edgeEls.forEach(function (o) {
        var inSet = set[o.a] && set[o.b];
        if (inSet) o.el.classList.add('is-active');
        else o.el.classList.add('is-dim');
      });
    }

    /* =============================================================
       ノードのポインタ/キーボード配線（current 生成のたびに付け直す）
       ============================================================= */
    var isTouch = false;

    function wireNodeEvents() {
      Object.keys(current.nodeEls).forEach(function (id) {
        var gEl = current.nodeEls[id].g;

        gEl.addEventListener('pointerenter', function (ev) {
          if (ev.pointerType === 'touch') { isTouch = true; return; }
          highlight(id);
          showTip(id, ev.clientX, ev.clientY);
        });
        gEl.addEventListener('pointermove', function (ev) {
          if (ev.pointerType === 'touch') return;
          if (current.activeId === id) positionTip(ev.clientX, ev.clientY);
        });
        gEl.addEventListener('pointerleave', function (ev) {
          if (ev.pointerType === 'touch') return;
          clearHighlight();
        });

        gEl.addEventListener('click', function (ev) {
          if (isTouch) {
            if (current.activeId !== id) {
              highlight(id);
              var box = gEl.getBoundingClientRect();
              showTip(id, box.left + box.width / 2, box.top);
              ev.preventDefault();
              return;
            }
          }
          openDetail(id);
        });

        gEl.addEventListener('focusin', function () {
          highlight(id);
          var box = gEl.getBoundingClientRect();
          showTip(id, box.left + box.width / 2, box.top + box.height / 2);
        });
        gEl.addEventListener('focusout', function () {
          clearHighlight();
        });
        gEl.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
            ev.preventDefault();
            openDetail(id);
          }
        });
      });

      // 図の外側タップ/クリックで強調解除
      current.svg.addEventListener('pointerdown', function (ev) {
        var t = ev.target;
        if (t === current.svg || t.parentNode === current.svg ||
            (t.classList && (t.classList.contains('net-edges') ||
             t.classList.contains('net-nodes') || t.classList.contains('net-halos') ||
             t.classList.contains('net-captions') || t.classList.contains('net-halo')))) {
          if (current.activeCC == null) clearHighlight();
        }
      });
    }

    /* =============================================================
       配線アニメーション（IntersectionObserver）
       図が視界に入ったらエッジを stagger で灯す静かな配線演出。
       ============================================================= */
    var hasWired = false; // 一度でも配線したら以後の再構築は即時
    function wireAll(instant) {
      var els = current.edgeEls;
      if (instant) {
        els.forEach(function (o) { o.el.classList.add('is-wired'); });
        return;
      }
      var total = els.length;
      var span = 1600;
      var step = total > 1 ? Math.min(60, span / total) : 0;
      els.forEach(function (o, i) {
        window.setTimeout(function () { o.el.classList.add('is-wired'); }, i * step);
      });
    }

    var wireObserver = null;
    function armWiring() {
      if (prefersReduced || !('IntersectionObserver' in window)) {
        wireAll(true);
        hasWired = true;
        return;
      }
      if (hasWired) { wireAll(true); return; } // 再構築時は即時
      if (wireObserver) { wireObserver.disconnect(); }
      wireObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && !hasWired) {
            hasWired = true;
            wireAll(false);
            wireObserver.disconnect();
          }
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
      wireObserver.observe(stage);
    }

    /* =============================================================
       レンダリング（プロファイル選択 → build → 挿入 → 配線）
       ============================================================= */
    function currentProfile() {
      var w = window.innerWidth || document.documentElement.clientWidth || 1024;
      return w < PORTRAIT_MAX ? portraitProfile() : landscapeProfile();
    }

    function render() {
      clearHighlightSafe();
      current = build(currentProfile());
      stage.innerHTML = '';
      stage.appendChild(current.svg);
      wireNodeEvents();
      armWiring();
      // 再構築時にピン留めされた凡例クラスタがあれば復元
      var pin = pinnedCC();
      if (pin) highlightCluster(pin);
    }

    function clearHighlightSafe() {
      if (current) { try { clearHighlight(); } catch (e) { /* noop */ } }
    }

    // 初回描画
    var lastPortrait = (window.innerWidth || 1024) < PORTRAIT_MAX;
    render();

    /* ---------- スクロールでツールチップを閉じる ---------- */
    document.addEventListener('scroll', function () {
      if (current && current.activeId && tip && !tip.hidden) hideTip();
    }, { passive: true });

    /* ---------- リサイズ再構築（ブレークポイント跨ぎのみ・デバウンス） ---------- */
    var resizeTimer = null;
    window.addEventListener('resize', function () {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        var nowPortrait = (window.innerWidth || 1024) < PORTRAIT_MAX;
        if (nowPortrait !== lastPortrait) {
          lastPortrait = nowPortrait;
          render();
        }
      }, 200);
    }, { passive: true });

    /* =============================================================
       凡例チップ → クラスタ強調（hover / focus / click）
       他クラスタを減光し、当該国の星群を灯す。
       ============================================================= */
    // ピン留め（クリック固定）は全キー共通で1つだけ。
    // is-pinned クラスと pinnedKey 変数を唯一の真実として同期させる。
    var legendKeys = section.querySelectorAll('.net-key[data-country]');
    var pinnedKey = null;

    // clearHighlight がピン状態へ戻せるよう、実体をここで差し込む。
    pinnedCC = function () {
      return pinnedKey ? pinnedKey.getAttribute('data-country') : null;
    };

    function unpinAll() {
      Array.prototype.forEach.call(legendKeys, function (k) {
        k.classList.remove('is-pinned');
        k.setAttribute('aria-pressed', 'false');
      });
      pinnedKey = null;
    }

    Array.prototype.forEach.call(legendKeys, function (key) {
      var cc = key.getAttribute('data-country');
      // キーボード操作のため tabindex/role を付与（凡例チップは元々静的span）。
      // role は無条件に button へ上書きする — HTML 側に別 role が残っていても
      // トグルボタンであること・aria-pressed の押下状態を支援技術へ確実に伝えるため。
      if (!key.hasAttribute('tabindex')) key.setAttribute('tabindex', '0');
      key.setAttribute('role', 'button');
      key.setAttribute('aria-pressed', 'false');

      // hover/focus プレビュー（ピン中は他キーのプレビューを抑制）
      key.addEventListener('pointerenter', function (ev) {
        if (ev.pointerType === 'touch') return;
        if (!pinnedKey) highlightCluster(cc);
      });
      key.addEventListener('pointerleave', function (ev) {
        if (ev.pointerType === 'touch') return;
        if (!pinnedKey) clearHighlight();
      });
      key.addEventListener('focus', function () { if (!pinnedKey) highlightCluster(cc); });
      key.addEventListener('blur', function () { if (!pinnedKey) clearHighlight(); });

      // クリック/タップ/Enter で固定トグル
      function toggle() {
        var wasPinned = (pinnedKey === key);
        unpinAll();
        if (wasPinned) {
          clearHighlight();
        } else {
          key.classList.add('is-pinned');
          key.setAttribute('aria-pressed', 'true');
          pinnedKey = key;
          highlightCluster(cc);
        }
      }
      key.addEventListener('click', toggle);
      key.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
          ev.preventDefault();
          toggle();
        }
      });
    });

    /* =============================================================
       「注目の繋がり」カード → hover で該当ノード群を図中で灯す
       ・カードの data-focus（結節点）＋ 本文中の APT 番号（.net-mono）を
         疎結合で拾う。data-focus が無ければタイトル/本文から推定する。
       ・クリックは従来どおり apt:open でモーダルを開く（図の強調は
         モーダル背後で不可視のため呼ばない）。
       ============================================================= */
    function idsFromCard(card) {
      var ids = Object.create(null);
      // 1) data-focus（カンマ区切りにも対応）
      var focus = card.getAttribute('data-focus');
      if (focus) {
        focus.split(/[\s,、・]+/).forEach(function (s) {
          var t = s.trim().toUpperCase();
          if (byId[t]) ids[t] = 1;
        });
      }
      // 2) 本文・タイトル中の APTxx 表記をすべて拾う（疎結合の推定）
      var text = card.textContent || '';
      var re = /APT\d{1,2}/g, mm;
      while ((mm = re.exec(text)) !== null) {
        var id = mm[0].toUpperCase();
        if (byId[id]) ids[id] = 1;
      }
      return Object.keys(ids);
    }

    var hlCards = section.querySelectorAll('.net-hl');
    Array.prototype.forEach.call(hlCards, function (card) {
      var ids = idsFromCard(card);
      var focusId = card.getAttribute('data-focus');

      function act() {
        // 図中の強調はモーダル背後で不可視のため呼ばない。詳細を開くのみ。
        if (focusId && byId[focusId]) openDetail(focusId);
        else if (ids.length) openDetail(ids[0]);
      }

      // ホバー/フォーカスで図中のノード群を灯す（連動）
      card.addEventListener('pointerenter', function (ev) {
        if (ev.pointerType === 'touch') return;
        if (ids.length) highlightSet(ids);
      });
      card.addEventListener('pointerleave', function (ev) {
        if (ev.pointerType === 'touch') return;
        clearHighlight();
      });
      card.addEventListener('focusin', function () {
        if (ids.length) highlightSet(ids);
      });
      card.addEventListener('focusout', function () {
        clearHighlight();
      });

      card.addEventListener('click', act);
      card.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') {
          ev.preventDefault();
          act();
        }
      });
    });
  });
})();
