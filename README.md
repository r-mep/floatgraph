# floatgraph

Obsidian のグラフビューにインスパイアされた、ふわふわ浮遊するノードサイト。

**Live:** https://floatin.mep-std.com

## 機能

- D3.js フォースシミュレーションによるノードの浮遊・ドラッグ
- ノードをタップ/クリックすると詳細パネルが開く（アイコン・説明・写真）
- 多対多のノード間リンク
- ja / en 切り替え（localStorage で記憶）
- レスポンシブ対応（デスクトップ: サイドパネル / モバイル: ボトムシート）

## 構成

```
floatgraph/
├── index.html   # エントリーポイント
├── style.css    # スタイル
├── i18n.js      # UI 文字列（ja / en）
├── data.js      # ノードとリンクのデータ
└── app.js       # D3 グラフ + パネルロジック
```

## データの編集

`data.js` を編集するだけでノードとリンクを追加できます。ビルド不要。

```js
// ノードを追加
{
  id: "unique-id",
  icon: "🎵",
  label: { ja: "日本語ラベル", en: "English label" },
  description: { ja: "説明文（100字程度）", en: "Description" },
  photos: ["./imgs/photo1.jpg"],  // 省略可
}

// リンクを追加（多対多OK）
{ source: "node-id-a", target: "node-id-b" }
```

## デプロイ

GitHub Pages + カスタムドメイン。`CNAME` に `floatin.mep-std.com` を設定済み。

DNS: `floatin.mep-std.com` → CNAME → `r-mep.github.io`
