# 固定ナビゲーション仕様

ワンページサイトの標準ナビ実装ガイド。特別な指示がない限りこの仕様で作る。

## 動作仕様

- **`position: fixed`** で画面上部に固定(`sticky` ではない)
- **初期状態**: 背景透明、リンク色は白系(Hero セクションの背景画像を考慮)
- **スクロール 50px 以降**: `backdrop-filter: blur(12px)` + 半透明背景(`rgba` で 70% 程度の透明度)
- **リンク色**: スクロール後は暗色系に切替(背景とのコントラスト確保)
- **レスポンシブ**: `lg:` ブレークポイントでデスクトップ / モバイル切替

## アクセシビリティ(必須)

- `<nav>` に `aria-label="メインナビゲーション"` 等を設定
- モバイルメニューボタンに `aria-expanded`, `aria-controls`, `aria-label` を設定
- メニュー開閉時に `aria-expanded` を動的に更新
- メニュー開閉でアイコン切替(Lucide の `menu` ⇔ `x`)

## パフォーマンス

- スクロールイベントは `requestAnimationFrame` でスロットリング(毎フレーム発火を防止)

## デザイン(Claude 判断)

- 具体的な色、トランジション速度、影の強さは全体デザインに合わせて決定

## 実装サンプル(Tailwind v4 + Lucide)

```html
<nav id="main-nav" aria-label="メインナビゲーション"
     class="fixed top-0 inset-x-0 z-50 transition-all duration-300">
  <div class="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
    <a href="#hero" class="font-bold text-white nav-link">Brand</a>

    <!-- Desktop -->
    <ul class="hidden lg:flex gap-8">
      <li><a href="#about" class="nav-link text-white hover:opacity-80">About</a></li>
      <li><a href="#services" class="nav-link text-white hover:opacity-80">Services</a></li>
      <li><a href="#contact" class="nav-link text-white hover:opacity-80">Contact</a></li>
    </ul>

    <!-- Mobile button -->
    <button id="menu-btn" class="lg:hidden text-white"
            aria-expanded="false" aria-controls="mobile-menu" aria-label="メニューを開く">
      <i data-lucide="menu"></i>
    </button>
  </div>

  <!-- Mobile menu -->
  <div id="mobile-menu" class="hidden lg:hidden bg-white/95 backdrop-blur-md">
    <ul class="flex flex-col px-6 py-4 gap-4">
      <li><a href="#about">About</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </div>
</nav>

<script>
  // スクロールでナビ背景切替(rAF スロットリング)
  const nav = document.getElementById('main-nav');
  let ticking = false;
  function onScroll() {
    if (window.scrollY > 50) {
      nav.classList.add('bg-white/70', 'backdrop-blur-md', 'shadow-sm');
      nav.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('text-white');
        el.classList.add('text-gray-900');
      });
    } else {
      nav.classList.remove('bg-white/70', 'backdrop-blur-md', 'shadow-sm');
      nav.querySelectorAll('.nav-link').forEach(el => {
        el.classList.add('text-white');
        el.classList.remove('text-gray-900');
      });
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  });

  // モバイルメニュー開閉
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('hidden') === false;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    btn.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    lucide.createIcons();
  });
</script>
```

このサンプルはあくまで雛形。プロジェクトのデザインに合わせて色・余白・トランジションを調整すること。
