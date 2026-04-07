---
name: set-theme
description: Convert an approved one-page HTML prototype from the project-docs/ directory into src/_layouts/base.njk for Eleventy. Use when the user wants to set, apply, or change the site theme/design/layout, says "テーマ設定して", "デザインを適用して", "base.njkを更新して", or asks to convert a prototype to a layout. Lists HTML files in project-docs/, asks the user which file to use, then reads the structural shell (nav, header, footer, head CSS/JS) and replaces the main content area with Nunjucks variables. Do NOT use for creating new pages, writing blog posts, or building the prototype itself.
---

# Set Theme

`project-docs/` 内の承認済みデザインファイルを Eleventy のベースレイアウト `src/_layouts/base.njk` に変換するスキル。

## いつ使うか

- 「テーマを設定したい」「デザインを適用して」「base.njk を更新して」
- プロトタイプ HTML が承認済みで、Eleventy に組み込みたいとき
- サイトのデザインを全面的に変更したいとき

## いつ使わないか

- プロトタイプがまだ存在しない / まだ承認されていないとき（→ まず `one-page-site-builder` を使う）
- 個別ページやブログ記事を作るとき
- `post.njk` など個別レイアウトの調整をするとき

## 生成物

- `src/_layouts/base.njk`（上書き）
- `src/index.njk`（テーマ初回設定時は上書き推奨）

## 前提条件チェック

スキル開始時に必ずこの順で確認する：

1. `project-docs/` ディレクトリ内の HTML ファイルを一覧取得する
2. ファイルが存在しない場合 → ユーザーに伝え、`one-page-site-builder` スキルでプロトタイプを先に作るよう案内して終了する
3. ファイルが1つだけの場合 → そのファイル名を示し、「このファイルをテンプレートとして使いますか？」と確認する
4. ファイルが複数ある場合 → ファイル名を一覧表示し、「どのファイルをベースレイアウトのテンプレートとして使いますか？」とユーザーに選択を求める
5. 選択されたファイルを読み込み、十分なデザイン（nav / footer が揃っているか）を確認する
6. 不十分な場合 → ユーザーに確認し、必要なら `one-page-site-builder` で再生成を案内する
7. 問題なければ変換を開始する

## ワークフロー

1. `project-docs/` 内の HTML ファイルを列挙し、ユーザーにテンプレートとして使うファイルを選ばせる（前提条件チェック参照）
2. 選択されたファイルを読み込む
3. HTML 構造を解析し、変換対象のセクションを特定する（詳細は [references/conversion-guide.md](references/conversion-guide.md) を参照）
4. ベースレイアウトとして保持するもの・除去するもの・Nunjucks 変数に置き換えるものを判断する
5. `src/_layouts/base.njk` を生成する
6. **`src/index.njk` も更新する**（詳細は「index.njk の更新」参照）
7. 変換結果のサマリーをユーザーに報告する（何を保持し、何を除いたか）
8. `npm start` で確認するよう案内する

## index.njk の更新

`base.njk` 生成後、**必ず `src/index.njk` もテンプレートの全コンテンツで上書きする**。
理由：テーマ初回設定時はトップページがプロトタイプと同じ見た目になることがゴールであるため。

### index.njk に含めるもの

- フロントマター（`layout: base.njk`、`title`、`description`）
- `base.njk` から削除したコンテンツ固有の CSS を `<style>` ブロックとして先頭に追加
  - `.hero-overlay` などの Hero 固有スタイル
  - `.product-card:hover` などのコンテンツ固有スタイル
  - `.step-line::after` などのセクション固有スタイル
- Hero セクション〜最後のセクション（フッター直前まで）の全コンテンツ

### Hero セクションと fixed nav の重なりを確保する

`<main class="pt-16 lg:pt-20">` のパディングでヒーローが押し下がるため、**Hero セクションには必ず `-mt-16 lg:-mt-20` を追加**してパディングを打ち消す：

```html
<section id="hero" class="relative min-h-screen ... -mt-16 lg:-mt-20">
```

これにより fixed nav がヒーロー画像に重なり、プロトタイプと同じ見た目になる。

### index.njk のテンプレート

```nunjucks
---
layout: base.njk
title: ページタイトル
description: ページの説明
---

<style>
  /* base.njk から削除したコンテンツ固有の CSS をここに移す */
  .hero-overlay { ... }
  .product-card:hover .product-img { ... }
  /* ...etc... */
</style>

<!-- Hero セクション：-mt-16 lg:-mt-20 で nav との重なりを確保 -->
<section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16 lg:-mt-20">
  ...
</section>

<!-- 以降のセクションをそのまま配置 -->
```

## 変換ルール（概要）

| HTML の要素 | base.njk での扱い |
|---|---|
| `<head>` 全体（CSS/JS/フォント） | そのまま保持 |
| `<html lang="...">` | `<html lang="{{ lang or 'ja' }}">` |
| `<title>...</title>` | `<title>{{ title or "サイト名" }}</title>` |
| `<meta name="description">` | `<meta name="description" content="{{ description or '' }}">` |
| `<nav>` / ナビゲーション全体 | そのまま保持 |
| `<footer>` | そのまま保持 |
| Hero セクション以降のコンテンツ | 削除 |
| メインコンテンツ領域 | `<main>\n  {{ content \| safe }}\n</main>` に置き換え |
| `<body class="...">` | そのまま保持 |
| `<script>` タグ群（初期化） | そのまま保持（`</body>` 直前） |

詳細な判断基準と具体例は [references/conversion-guide.md](references/conversion-guide.md) を参照。

## 出力テンプレートの基本形

```nunjucks
<!doctype html>
<html lang="{{ lang or 'ja' }}">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title or "サイト名" }}</title>
    <meta name="description" content="{{ description or '' }}">
    <!-- ここに元の <head> の CSS/JS/フォントをそのまま貼る -->
  </head>
  <body class="...（元の body クラスをそのまま）...">

    <!-- ===== ナビゲーション（元の <nav> をそのまま） ===== -->
    <nav ...>
      ...
    </nav>

    <!-- ===== メインコンテンツ ===== -->
    <main class="pt-16 lg:pt-20">
      {{ content | safe }}
    </main>

    <!-- ===== フッター（元の <footer> をそのまま） ===== -->
    <footer ...>
      ...
    </footer>

    <!-- ===== Scripts（元のスクリプトをそのまま） ===== -->
    <script>...</script>
  </body>
</html>
```

`<main>` の上パディング（`pt-16 lg:pt-20`）は fixed nav の高さを補正するため。元の nav の `h-*` クラスに合わせて調整すること。

## ナビゲーションリンクの調整

元のプロトタイプのナビは同一ページ内アンカーリンク（`href="#story"` など）になっている。  
変換後にユーザーへ必ず伝えること：

> ナビゲーションのリンクがプロトタイプのアンカーリンク（`#section`）のままです。  
> 実際のページを作ったら、`src/_layouts/base.njk` 内の `<nav>` のリンクを `/about/` や `/posts/` などのパスに更新してください。
