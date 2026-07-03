# APT ATLAS ｜ 影の図鑑

国家支援型サイバー攻撃グループ（APT: Advanced Persistent Threat）**全39組織**を紹介する、教育目的のビジュアルカタログです。中国・イラン・北朝鮮・ロシア・ベトナムほか、6つの国家・地域にわたる攻撃グループの帰属・標的・手口・マルウェア共有関係を、公開情報にもとづき静かに図録化します。

APT番号を「図録番号＝標本プレート」として扱い、明（紙／公開情報）と暗（Vault／隠蔽）の交互構成でその二面性を描く、美術館の特別展のような編纂です。

## 収録内容

- **APTとは** — 高度で持続的な脅威の定義と、活動目的の五分類（サイバースパイ／知的財産窃取／個人・組織監視／金銭目的／破壊的攻撃）。
- **国家・地域分析** — 6つの国家・地域への帰属内訳、国別プロファイル、地域と標的の相関考察。
- **関係ネットワーク図** — 39組織を共有マルウェア・帰属・戦術で結んだ関係の星座（SVGで自己完結）。
- **全グループ探索** — 名称・別名・マルウェア名での検索、国家・地域／活動目的での絞り込み、各組織の詳細モーダル。

## デザインテーマ

ナビ右端の「テーマ」ボタンから、サイト全体の配色を5つのテーマで切り替えられます。既定は **編纂（Editorial）** ― 明（紙）と暗（Vault）の交互構成による美術館の図録意匠です。ほかに、半透明の**硝子（Liquid Glass）**、全面を沈める**深淵（Abyss）**、明るい砂浜基調の**白昼（Noon Beach）**、抑制的な**端末（Terminal）**を用意しています。選択したテーマは端末に記憶され、次回以降も維持されます。テーマは `<html data-theme>` 属性と CSS 変数（デザイントークン）だけで実現され、レイアウトや文章構造は一切変わりません。`prefers-reduced-motion` 設定時は切替アニメーションを無効化します。

## データ出典

本サイトのデータは、以下の2つの公開情報にもとづきます。

1. **FireEye「APT攻撃グループ」（2022年5月保存版）**
   web.archive.org に保存されたアーカイブ
   `https://web.archive.org/web/20220518103556/https://www.fireeye.jp/current-threats/apt-groups.html`

2. **Google Cloud Threat Intelligence「APT45」記事**
   `https://cloud.google.com/blog/ja/topics/threat-intelligence/apt45-north-korea-digital-military-machine`

## 技術

- **Vanilla JS（依存ゼロ）** — フレームワーク・ビルドツールを使用しない、素のHTML／CSS／JavaScript。
- **完全自己完結** — 外部CDN・外部フォント・Webフォント・外部画像・外部JSライブラリを一切使用しません。GitHub Pages にそのまま配置して動作します。
- **フォント** — システムフォントスタックのみ（`-apple-system`, `Segoe UI`, `Hiragino Sans`, `Yu Gothic UI`, `Meiryo` ほか）。
- **アクセシビリティ** — キーボード操作、`prefers-reduced-motion` の尊重、`aria` 属性、フォーカストラップ付きモーダルに対応。

### ファイル構成

```
site/
  index.html        自己完結した単一ページ（全セクションをインライン内包）
  css/
    tokens.css      デザイントークン（色・タイポ・余白の唯一の定義元）
    themes/         テーマ別トークン上書き（glass / abyss / beach / terminal）
    base.css        骨格・タイポ基礎・ナビ・ヒーロー・フッター・テーマ切替UI
    intro.css       「APTとは」セクション
    nations.css     国家・地域分析セクション
    network.css     関係ネットワーク図セクション
    explorer.css    全グループ探索セクション＋詳細モーダル
  js/
    theme.js        デザインテーマの適用・永続化・切替ポップオーバー
    main.js         スクロールリビール・ナビ・ヒーロー統計
    nations.js      国別バーチャート・プロファイル生成
    network.js      関係ネットワーク図（SVG）生成
    explorer.js     カードグリッド・検索フィルタ・モーダル
  data.js           全39組織のデータ（window.APT_DATA）
  relations.js      共有マルウェア・関係エッジ・分析（window.APT_RELATIONS）
  sections/         各セクションのHTML断片（index.html に取り込み済み・参考用）
```

## 免責

本サイトは教育目的で公開情報をまとめたものです。掲載する帰属・分類は各出典の報告にもとづく評価であり、確定的な事実の断定を意図するものではありません。特定の組織・個人・国家に対する主張として利用されることを意図していません。システムからAPT関連のマルウェアが見つかったとしても、それだけで標的にされている証拠にはなりません。
