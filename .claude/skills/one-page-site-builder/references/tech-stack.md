# 技術スタック詳細

デフォルトで使用するライブラリと、その正しい読み込み方・落とし穴。

## Tailwind CSS v4.1+

**必ず CDN の script タグ形式で読み込む**(ビルドプロセス不要):

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

### 重要な注意点

- **v3 の `<link>` タグ形式は使用しないこと**。v4 では `<script>` タグを使う
- カスタムテーマは `<style type="text/tailwindcss">` 内で `@theme` ディレクティブを使用:

```html
<style type="text/tailwindcss">
  @theme {
    --color-primary: #3b82f6;
    --color-accent: #f59e0b;
    --font-sans: 'Noto Sans JP', sans-serif;
  }
</style>
```

- `@theme` で定義した値は `bg-primary`, `text-primary`, `font-sans` などのユーティリティクラスとして自動生成される
- ビルドプロセスは不要(画像最適化の方が速度に寄与する)

## Animate.css v4.1.1+

控えめなアニメーション(派手にならないこと):

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
```

使用例:
```html
<h1 class="animate__animated animate__fadeInUp">タイトル</h1>
```

## AOS v2.3+(スクロールアニメーション)

```html
<link rel="stylesheet" href="https://unpkg.com/aos@2.3.4/dist/aos.css">
<script src="https://unpkg.com/aos@2.3.4/dist/aos.js"></script>
<script>AOS.init({ duration: 800, once: true });</script>
```

要素側:
```html
<div data-aos="fade-up" data-aos-delay="100">...</div>
```

### 代替: Animate.css + Intersection Observer

軽量にしたい場合や AOS が過剰な場合は、Intersection Observer で要素が画面に入ったら Animate.css のクラスを付与する実装を選ぶ。

## Lucide v0.536.0+(アイコン / ロゴ)

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<script>lucide.createIcons();</script>
```

使用例:
```html
<i data-lucide="menu"></i>
<i data-lucide="mail"></i>
```

ナビのモバイルメニュー開閉では `menu` ⇔ `x` を切り替える。

## 日本語フォント

Google Fonts の Noto Sans JP を推奨(パフォーマンス考慮で `display=swap`、必要なウェイトのみ):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
```

見出し用に Noto Serif JP を併用するのも良い。
