# CLAUDE.md

このファイルは Claude Code 向けのプロジェクトガイドです。新しいセッションでもここを読めばコンテキストが揃います。

## プロジェクト概要

Obsidian グラフビュー風の浮遊ノードサイト。ノードをクリックすると Twitter 風の詳細パネルが開く。

- **Live:** https://floatin.mep-std.com
- **オーナー:** r-mep（めはら）

## 重要な前提

**ビルドツールなし。** Vite・Webpack・npm は使わない。HTML / CSS / JS のみ。`index.html` をそのままブラウザで開けば動く。依存ライブラリは CDN（D3.js）。この方針は意図的なもので、変えない。

## ファイルの役割と編集ルール

| ファイル | 役割 | 編集するとき |
|---|---|---|
| `data.js` | ノードとリンクのデータ | コンテンツを追加・変更するとき |
| `i18n.js` | UI 固定文字列（ja/en） | ボタン・ヒントなどの文言を追加するとき |
| `style.css` | 全スタイル・テーマ変数 | 見た目を変えるとき |
| `app.js` | D3・パネル・言語・テーマのロジック | 機能を追加・変更するとき |
| `index.html` | HTML 構造 | DOM 要素を追加するとき |

## i18n のルール

ユーザーに見えるテキストは**必ず `{ ja, en }` オブジェクト**にする。plain string は使わない。

```js
// ✅ 正しい
label: { ja: "すきなたべもの", en: "Favourite Food" }

// ❌ やらない
label: "すきなたべもの"
```

- ノードのコンテンツ → `data.js` に `{ ja, en }`
- UI 固定文言 → `i18n.js` に追加し、`app.js` で `ui("key")` で呼ぶ

## テーマのルール

色は直接書かず、必ず CSS 変数（`var(--bg)` など）を使う。

テーマの定義場所：
- ダーク（デフォルト）→ `:root`
- ライト（OS）→ `@media (prefers-color-scheme: light) { :root:not([data-theme="dark"]) }`
- ライト（手動）→ `:root[data-theme="light"]`
- ダーク（手動）→ `:root[data-theme="dark"]`

新しい色を追加するときは4箇所すべてに追加する。

## データ構造

```js
// ノード
{
  id: "unique-id",           // 英数字・ハイフン。links から参照される
  icon: "🎵",               // 絵文字
  label:       { ja: "...", en: "..." },
  description: { ja: "...", en: "..." },  // 100字程度
  photos: ["./imgs/photo.jpg"],           // 省略可。URL or 相対パス
}

// リンク（多対多 OK）
{ source: "id-a", target: "id-b" }
```

## app.js のアーキテクチャ

即時実行関数（IIFE）で全体を囲んでグローバル汚染を防いでいる。

主な関数：
- `t(node, field)` — ノードのフィールドを現在の言語で返す
- `ui(key)` — i18n.js の UI 文字列を現在の言語で返す
- `applyLang()` — 言語切り替え時に全テキストを再描画
- `applyTheme()` — テーマ切り替え時に `data-theme` 属性を更新
- `openPanel(d)` / `closePanel()` — 詳細パネルの開閉
- `drift()` — setInterval でノードに微小な速度を与えて浮遊感を維持

D3 フォースの主要パラメータ：
- `forceManyBody strength: -280` — ノード間の反発力
- `forceCollide radius: 60` — ノードが重ならない距離
- `alphaDecay: 0.015` — シミュレーションが冷める速度（遅めにして長く動く）

## ローカル開発

```bash
cd /Users/rmehara/personal-dev/floatgraph
python3 -m http.server 8765
# → http://localhost:8765
```

編集 → リロードで即確認。

## デプロイ

```bash
git push origin main
```

`main` への push で Cloudflare Pages が自動デプロイする。追加作業なし。

## やってはいけないこと

- `npm init` や `package.json` を作らない
- フレームワーク（React・Vue など）を導入しない
- ユーザー向けテキストを plain string で書かない（i18n が壊れる）
- CSS に直接カラーコードを書かない（テーマ変数を使う）
