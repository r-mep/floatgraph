# floatgraph

Obsidian のグラフビューにインスパイアされた、ふわふわ浮遊するノードサイト。

**Live:** https://floatin.mep-std.com  
**Repo:** https://github.com/r-mep/floatgraph

## 機能

- D3.js フォースシミュレーションによるノードの浮遊・ドラッグ・ズーム
- ノードをタップ/クリックすると詳細パネルが開く（アイコン・説明・写真グリッド）
- 多対多のノード間リンク
- ja / en 切り替え（localStorage で記憶）
- ダーク / ライトモード（OS 自動追従 + 手動上書き、localStorage で記憶）
- レスポンシブ対応（デスクトップ: サイドパネル / モバイル: ボトムシート）

## ファイル構成

```
floatgraph/
├── index.html   # エントリーポイント。ボタン・パネルの HTML 構造
├── style.css    # 全スタイル。テーマ変数は :root / [data-theme] で管理
├── i18n.js      # UI 文字列（ja / en）。ノードコンテンツとは別管理
├── data.js      # ノードとリンクのデータ。ここだけ編集すれば内容を変えられる
└── app.js       # D3 グラフ + パネル + 言語 + テーマのロジック
```

## ローカル開発

ビルド不要。ブラウザで直接開くか、ローカルサーバーを立てる。

```bash
python3 -m http.server 8765
# → http://localhost:8765
```

編集 → ブラウザリロード で即確認できる。

## デプロイ

`main` に push すると **Cloudflare Pages が自動でデプロイ**する。

```
git push origin main  # これだけ
```

インフラ構成：
- ホスティング：Cloudflare Pages（`floatgraph.pages.dev`）
- ドメイン：Cloudflare（`mep-std.com`）
- DNS：`floatin.mep-std.com` → CNAME → `floatgraph.pages.dev`

## データの編集

`data.js` を編集するだけ。ビルド・設定変更は不要。

```js
// ノードを追加
{
  id: "unique-id",           // 他と被らない英数字
  icon: "🎵",
  label:       { ja: "日本語ラベル", en: "English label" },
  description: { ja: "説明文（100字程度）", en: "Description" },
  photos: ["./imgs/photo1.jpg"],  // URL または相対パス。省略可
}

// リンクを追加（多対多 OK）
{ source: "node-id-a", target: "node-id-b" }
```

## UI 文字列の追加

ノード以外の固定テキスト（ボタンラベルなど）は `i18n.js` に追加する。

```js
const I18N = {
  ja: { myKey: "日本語テキスト" },
  en: { myKey: "English text" },
};
```

`app.js` 内では `ui("myKey")` で呼び出せる。

## テーマ

CSS 変数（`--bg`, `--text-primary` など）が `style.css` の `:root` に定義されている。  
ライトモードは `:root[data-theme="light"]` と `@media (prefers-color-scheme: light)` の両方で上書きしている。  
色を変えたい場合はこの変数を編集するだけでよい。

## 今後やりたいこと

- [ ] 写真を実際のものに差し替え
- [ ] ノードを増やす
- [ ] ノード検索 / フィルター
