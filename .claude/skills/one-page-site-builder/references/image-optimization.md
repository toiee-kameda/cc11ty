# 画像最適化ガイド

## 基本方針

- 画像最適化は速度改善に最も効きやすい(ビルドプロセスより優先)
- すべての `<img>` に `loading="lazy" decoding="async"` を付与
- Hero 画像など Above the Fold は `loading="eager"` でも可、ただしサイズは小さく
- 画像サイズは表示サイズの 2 倍程度まで(Retina 対応)
- 可能なら `width` / `height` を指定して CLS を防ぐ

## Unsplash 画像の最適化

URL パラメータでサーバーサイドリサイズ:

```
https://images.unsplash.com/photo-xxxx?w=800&q=80&auto=format&fit=crop
```

- `w=800` : 幅 800px(用途に応じ 400 / 800 / 1200 / 1600)
- `q=80`  : 品質 80%(80〜85 が画質と容量のバランス良)
- `auto=format` : ブラウザ対応に応じて WebP / AVIF を自動配信
- `fit=crop` : 指定サイズにクロップ

**画像リンクが切れていることがあるので、生成前に必ず有効性を意識すること。**

## 推奨フォーマット

- 写真: WebP(フォールバック JPEG)
- イラスト/ロゴ: SVG
- アイコン: SVG または Lucide(`<i data-lucide="...">`)
- アニメーション: WebP / Lottie(GIF は避ける)

## 目安サイズ

- Hero 画像: 200KB 以下が理想、最大 500KB
- セクション内画像: 100KB 以下
- サムネイル: 30KB 以下
