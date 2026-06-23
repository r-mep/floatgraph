# Architecture Decision Records (ADR)

このディレクトリは floatgraph の**設計判断の記録**を残す場所です。
「なぜこの構成にしたのか」を後から追えるように、重要な技術判断を1ファイル1決定で記録します。

## ADR とは

ADR（Architecture Decision Record）は、アーキテクチャ上の意思決定とその背景・選択肢・結果を
短い Markdown で残す手法です。コードからは読み取れない「なぜ」を保存するのが目的です。

## 一覧

| # | タイトル | ステータス |
|---|---|---|
| [0001](./0001-static-no-build-stack.md) | ビルドツールなしの静的サイト構成 | Accepted |
| [0002](./0002-mobile-posting-system.md) | スマホからの投稿システム（Cloudflare ネイティブ） | Accepted（実装着手前） |

## ステータスの意味

- **Proposed** — 提案中。まだ合意・採用されていない
- **Accepted** — 採用。実装済み or 実装に着手する
- **Superseded by ADR-XXXX** — より新しい決定に置き換えられた
- **Deprecated** — もう使っていない

## 新しい ADR の書き方

1. `000X-短いタイトル.md` を作る（番号は連番）
2. 下のテンプレートを使う
3. この README の一覧に追記する

```markdown
# ADR-000X: タイトル

- ステータス: Proposed | Accepted | Superseded | Deprecated
- 日付: YYYY-MM-DD

## コンテキスト
どんな課題・制約があったか。

## 決定
何を選んだか。

## 検討した選択肢
他に何を検討し、なぜ採らなかったか。

## 結果
この決定によって得られるもの / 引き受けるトレードオフ。
```
