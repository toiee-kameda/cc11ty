---
name: create-page
description: Create a new fixed page (固定ページ) for an Eleventy site as a .njk file with frontmatter. Use when the user says "固定ページ", "ページを追加", "ページ作成", "ページ編集", "Aboutページ作って", "Contactページ", or wants to add any non-blog page to the site. Reads src/_layouts/base.njk to understand the theme, then generates content-only sections (no full HTML wrapper) using one-page-site-builder quality standards, saved as src/[page-name].njk. Do NOT use for blog posts (→ src/posts/*.md) or for creating the base layout (→ set-theme skill).
---

# Create Page

Eleventy サイトの固定ページ（About / Services / Contact など）を `src/` 配下に `.njk` ファイルとして作成するスキル。

コンテンツの品質・デザイン基準は **`one-page-site-builder` スキルに準拠**する。  
ただし出力は完全な HTML ではなく、`base.njk` に差し込まれるコンテンツ断片。

## いつ使うか

- 「About ページ作って」「お問い合わせページ追加して」「サービス紹介ページ」
- 「固定ページ」「ページを追加」「ページ作成」「ページ編集」
- ブログ記事ではない、サイトの恒久ページを作るとき

## いつ使わないか

- ブログ記事 → `src/posts/*.md` に Markdown で作成する
- ベースレイアウトの変更 → `set-theme` スキルを使う
- デザインプロトタイプの作成 → `one-page-site-builder` スキルを使う

## 生成物

- `src/[ページ名].njk`（新規作成 or 上書き）

## ワークフロー

1. **テーマを把握する** — `src/_layouts/base.njk` を読み込み、カラーパレット・フォント・ナビ構造を確認する
2. **ページの内容を確認する** — ユーザーの指示からページ名・目的・掲載コンテンツを把握する。不明な点はユーザーに確認する
3. **コンテンツを生成する** — `one-page-site-builder` の品質基準（セクション構成・デザイン要件・アクセシビリティ）に従ってコンテンツを生成する（`one-page-site-builder` スキルを参照）
4. **ファイルを保存する** — `src/[ページ名].njk` として保存する（出力形式は下記参照）
5. **案内する** — `npm start` で確認するよう案内し、ナビへのリンク追加が必要なことを伝える

## 出力形式

`one-page-site-builder` との違い:

| 項目 | one-page-site-builder | create-page |
|---|---|---|
| 出力ファイル | `project-docs/*.html` | `src/[ページ名].njk` |
| `<html>/<head>/<body>` | 含む | **含まない** |
| CSS / JS の読み込み | `<head>` に記述 | **不要**（`base.njk` が担う） |
| Tailwind `@theme` | `<style>` に記述 | **不要**（`base.njk` から継承） |
| ファビコン / OGP | `<head>` に記述 | **不要** |
| frontmatter | なし | **必須** |

## 出力ファイルの基本形

```nunjucks
---
layout: base.njk
title: ページタイトル
description: ページの説明
---

<!-- ===== セクション名 ===== -->
<section id="section-id" class="py-20 ...">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    ...
  </div>
</section>

<!-- ===== 次のセクション ===== -->
<section id="section-id-2" class="py-20 ...">
  ...
</section>
```

## コンテンツ生成ルール（one-page-site-builder 準拠）

`one-page-site-builder` の以下の基準をそのまま適用する：

- **セクション構成** — ページの目的に合わせて最適なセクションを設計する
- **デザイン** — `base.njk` の `@theme` カラーパレットと同じ変数名を使う（`text-primary`、`bg-cream` 等）
- **フォント** — `base.njk` で読み込まれているフォントクラスをそのまま使う
- **アクセシビリティ** — セマンティックな HTML 要素、適切な `aria-*` 属性
- **レスポンシブ** — モバイルファースト
- **画像** — `loading="lazy" decoding="async"`、必要なら `unsplash-image-finder` スキルを使う
- **スクロールアニメーション** — AOS が `base.njk` で読み込まれていれば `data-aos` 属性を使用可

## 生成後の案内

ページ作成後に必ずユーザーへ伝えること：

> `src/_layouts/base.njk` の `<nav>` に新しいページへのリンクを追加してください。  
> 例: `<a href="/[ページ名]/">メニュー名</a>`
