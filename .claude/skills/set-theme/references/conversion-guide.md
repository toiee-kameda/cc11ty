# 変換ガイド: project-docs HTML → base.njk

`set-theme` スキルが `project-docs/` 内のユーザー選択HTMLファイルを `src/_layouts/base.njk` に変換する際の詳細な判断基準と具体例。

## 基本原則

**保持するもの（サイト全ページに共通する構造）**
- `<head>` の全内容（CSS/JS/フォント/メタタグ）
- `<nav>` 要素（固定ナビゲーション）
- `<footer>` 要素
- `<body>` のクラス属性
- `</body>` 直前の全 `<script>` タグ

**置き換えるもの（Nunjucks 変数化）**
- `<html lang="ja">` → `<html lang="{{ lang or 'ja' }}">`
- `<title>ページ固有のタイトル</title>` → `<title>{{ title or "サイト名" }}</title>`
- `<meta name="description" content="...">` → `<meta name="description" content="{{ description or '' }}">`

**削除するもの（プロトタイプ固有のコンテンツ）**
- Hero セクション（`<section id="hero">` 等）
- 製品・サービス・ストーリー等のコンテンツセクション全て
- お問い合わせフォームセクション
- コンテンツ固有の CSS ルール（後述）

> ⚠️ **重要**: `base.njk` から削除したコンテンツ固有の CSS（`.hero-overlay` など）は、`src/index.njk` に `<style>` ブロックとして移す。削除しっぱなしにしない。

**挿入するもの**
- `<main class="pt-16 lg:pt-20">{{ content | safe }}</main>`（nav と footer の間）

---

## `<main>` の挿入位置

`<nav>` の閉じタグ `</nav>` の直後、`<footer` の直前に挿入する。

```html
</nav>

<!-- ===== メインコンテンツ ===== -->
<main class="pt-16 lg:pt-20">
  {{ content | safe }}
</main>

<footer ...>
```

プロトタイプに `<main>` が存在しない場合（`<section>` が直接 `<body>` の子要素になっている場合）、`<nav>` と `<footer>` の間にある全 `<section>` / `<div>` を削除して `<main>` を挿入する。

---

## `<style>` タグの判断

| 内容の種類 | 判断 |
|---|---|
| `@theme { ... }` (Tailwind カスタム変数) | **保持** — カラーパレット定義 |
| `html { scroll-behavior: smooth; }` | **保持** — サイト全体の挙動 |
| フォントファミリー指定 | **保持** |
| `.hero-overlay { ... }` など Hero 固有 | **削除** |
| `.product-card:hover` など商品固有 | **削除** |
| `.step-line::after` など特定セクション固有 | **削除** |

迷う場合は「このクラスがコンテンツページ（ブログ記事、About ページ等）でも使われ得るか？」を基準にする。

---

## `<main>` の上パディング

Fixed nav（`position: fixed`）を使っている場合、コンテンツが nav に隠れないようパディングが必要。

| nav の高さ指定 | 推奨 `<main>` クラス |
|---|---|
| `h-16` (64px) | `pt-16` |
| `h-16 lg:h-20` (64px / 80px) | `pt-16 lg:pt-20` |
| `h-20` (80px) | `pt-20` |
| カスタム高さ | 同等の `pt-*` を計算して設定 |

---

## 具体例：SORA オーガニック石鹸 → base.njk

### 保持する要素
- `<head>` 全体（Tailwind v4 CDN、Animate.css、AOS、Lucide、Google Fonts）
- `<style type="text/tailwindcss">` 内の `@theme { ... }` ブロック
- `<style>` 内の `html { scroll-behavior: smooth; }` と `.font-serif { ... }`
- `<nav id="navbar">` ～ `</nav>`（固定ナビ全体）
- `<footer>` ～ `</footer>`
- AOS・Lucide・ナビ制御スクリプト

### 削除する要素
- `<style>` 内の `.hero-overlay`、`.product-card:hover .product-img`、`.ingredient-icon`、`.step-line::after`
- `<section id="hero">` 以降の全セクション

### 置き換える要素
- `<html lang="ja">` → `<html lang="{{ lang or 'ja' }}">`
- `<title>SORA | オーガニック石鹸 — ...</title>` → `<title>{{ title or "SORA" }}</title>`
- `<meta name="description" content="SORA（ソラ）は...">` → `<meta name="description" content="{{ description or '' }}">`

### 挿入する要素（`</nav>` 直後）
```nunjucks
<!-- ===== メインコンテンツ ===== -->
<main class="pt-16 lg:pt-20">
  {{ content | safe }}
</main>
```

（SORA プロトタイプの nav は `h-16 lg:h-20` なので `pt-16 lg:pt-20` を使用）

---

## 変換後の確認チェックリスト

- [ ] `src/_layouts/base.njk` が生成されている
- [ ] `{{ content | safe }}` が `<main>` 内に存在する
- [ ] `{{ title or "..." }}` が `<title>` に存在する
- [ ] `<html lang="{{ lang or 'ja' }}">` になっている
- [ ] `<main>` に適切な上パディングが設定されている
- [ ] `src/index.njk` にプロトタイプの全コンテンツが配置されている
- [ ] `base.njk` から削除したコンテンツ固有 CSS が `index.njk` の `<style>` に移されている
- [ ] Hero セクションに `-mt-16 lg:-mt-20`（nav 高さ分の負マージン）が付いており、fixed nav と重なっている
- [ ] ナビリンクがアンカーリンクのままであることをユーザーへ案内済み
- [ ] `npm start` で確認するよう案内済み
