---
name: publish-blog
description: >
  blog-draft/ に置いた Markdown と画像を src/posts/ と src/assets/ に移してブログ記事を公開する。
  frontmatter の設定・画像パスの絶対パスへの修正を自動化する。
  「ブログ公開」「記事を公開」「下書きを公開」「publish-blog」などで起動。
user-invocable: true
---

# publish-blog

`blog-draft/` に置いた下書き記事と画像を Eleventy の公開ディレクトリへ移動し、
frontmatter の設定と画像パスの修正を自動で行うスキル。

## いつ使うか

- 「ブログ記事を公開したい」
- 「下書きを公開して」
- 「blog-draft の記事を公開する」
- `/publish-blog` と入力したとき

## いつ使わないか

- 記事をゼロから書きたい → そのまま `blog-draft/post.md` を編集する
- 固定ページを作りたい → `create-page` スキルを使う

## 前提条件

- `blog-draft/post.md` が存在すること
- 本文中の画像は `blog-draft/` にフラットに置かれていること（サブディレクトリ不可）
- 画像パスは相対パス（`./filename.webp` または `filename.webp`）で記述されていること

## 生成物

| ファイル | 内容 |
|---|---|
| `src/posts/{slug}.md` | frontmatter 付き Markdown（画像パス更新済み） |
| `src/assets/images/posts/{slug}/{画像ファイル}` | コピーされた画像 |

## ワークフロー

### ステップ 1 — ドラフト確認

`blog-draft/post.md` を読んで以下を確認・表示する：
- 記事タイトル（H1 または本文冒頭から推定）
- 本文の概要（2〜3行）
- `blog-draft/` 内の画像ファイル一覧（拡張子: `.webp`, `.jpg`, `.jpeg`, `.png`, `.gif`, `.avif`）

### ステップ 2 — スラッグ・frontmatter の提案

まず、既存の記事のfrontmatterをチェックし、frontmatterを提案し、ユーザーの確認を得る:

```yaml
---
title: "記事タイトル"
date: YYYY-MM-DD        # 今日の日付
description: "一言説明（SEO用・80文字以内）"
tags:
  - post
  - タグ名              # 記事内容から1〜3個推定
---
```

- **slug**: 記事内容を表す英語ケバブケース（例: `handmade-soap-ingredients`）
- **date**: 今日の日付（`currentDate` コンテキストがあればそれを使う）
- **tags**: `post` は必須。追加タグは内容から推定して提案

その他の情報も、既存の記事を参照して提案すること。

ユーザーが修正を希望する場合は反映してから次へ進む。

### ステップ 3 — 画像のコピー

1. `src/assets/images/posts/{slug}/` ディレクトリを作成
2. `blog-draft/` 内の全画像ファイルを上記ディレクトリへコピー（ファイル名はそのまま維持）

```bash
mkdir -p src/assets/images/posts/{slug}
cp blog-draft/*.webp src/assets/images/posts/{slug}/   # 拡張子ごとに実行
```

### ステップ 4 — 記事ファイルの作成

`src/posts/{slug}.md` を Write ツールで作成する：

1. **frontmatter を先頭に追加**（ステップ2で確定した内容）
2. **画像パスを絶対パスに変換**：

   | 変換前 | 変換後 |
   |---|---|
   | `./filename.webp` | `/assets/images/posts/{slug}/filename.webp` |
   | `filename.webp` | `/assets/images/posts/{slug}/filename.webp` |

3. 本文テキスト（見出し・段落・装飾など）は**一切変更しない**

### ステップ 5 — 完了確認

作成・コピーされたファイルを一覧表示する：

```
公開完了:
  src/posts/{slug}.md
  src/assets/images/posts/{slug}/
    ├── image1.webp
    └── image2.webp

プレビュー: npm start → http://localhost:8080/blog/{slug}/
```

## frontmatter テンプレート

```yaml
---
title: "記事タイトル"
date: 2026-04-07
description: "記事の一言説明"
tags:
  - post
---
```

`src/posts/posts.json` により `layout: post.njk` と `permalink: /blog/{{ page.fileSlug }}/` は自動適用される。

## 注意事項

- `blog-draft/` は `.gitignore` 対象のため git 管理外。コピー後も元ファイルは残る
- 画像が存在しない記事の場合はステップ3をスキップする
- 既に `src/posts/{slug}.md` が存在する場合はユーザーに上書き確認を取る
- frontmatter は、既存の記事を参考に作成すること。ここで示したテンプレートだけでは不十分な場合がある
