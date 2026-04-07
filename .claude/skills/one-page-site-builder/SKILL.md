---
name: one-page-site-builder
description: Build a complete single-page website (LP / ワンページサイト) with semantic HTML, Tailwind CSS v4, fixed navigation, and responsive design. Use when the user asks to create a landing page, one-page site, ワンページ, LP, ポートフォリオ, サービス紹介ページ, or any marketing/info site that fits on a single page. Covers HTML structure, tech stack defaults (Tailwind v4 CDN, Animate.css, AOS, Lucide), accessible fixed navigation spec, section composition, form validation, and image handling guidance. Works standalone or integrated with frameworks like Eleventy / Astro. Do NOT use for blog systems, multi-page apps, or SPA dashboards.
---

# One-Page Site Builder

非エンジニア向けに、ワンページ完結型のWebサイトを高品質に生成するためのスキル。
単体の `index.html` としても、Eleventy / Astro などのテンプレートの中身としても使える。

## いつ使うか

- ランディングページ / サービス紹介 / ポートフォリオ / イベント告知 / プロフィールページ
- 「ワンページで」「LP」「1枚ものサイト」などの指示
- 1ページに情報をまとめて提供したいケース

## いつ使わないか

- ブログ記事作成 / ダッシュボード / 管理画面
- 動的SPA

## 生成物の基本形

- 既定: 単体のHTMLファイル。保存先はプロジェクトの CLAUDE.md に従う。指定がなければ、ユーザーに質問する
- フレームワーク統合時: ユーザーの指示に合わせてテンプレート(`.njk`, `.astro` 等)に分解
- 画像・CSS・JS を別ファイル化する場合は `assets/` 配下(プロジェクト規約があればそれに従う)
- **文字コードは必ず UTF-8**。日本語の文字化けに注意

## 必須要件チェックリスト

作成時は以下を必ず満たすこと:

- [ ] セマンティック要素(`header` / `nav` / `main` / `section` / `article` / `footer`)
- [ ] 各 `section` に `id` 属性 → ナビゲーションリンクから遷移可能
- [ ] メタタグ完備(`description`, `keywords`, `og:image`, `og:title`, `og:description`, `viewport`)
- [ ] ファビコン設定
- [ ] モバイルファーストのレスポンシブ
- [ ] 画像は `loading="lazy" decoding="async"`
- [ ] フォームがあれば適切な validation(`required`, `type`, `pattern` 等)
- [ ] アクセシビリティ(nav の `aria-label`、ボタンの `aria-expanded` 等)
- [ ] コメントを適度に挿入(後から非エンジニアが編集しやすく)
- [ ] 外部依存は最小限

## セクション構成

- 指示がなければ自分で最適構成を考える(Hero / About / Features / Services / Works / Testimonials / Pricing / FAQ / Contact など)
- **A4 6ページ以上の情報量になるよう、最低8セクション程度**を目安にする(ユーザー指示があれば従う)
- 各セクションに `id` を付与。ただしナビが過密になるなら適度に間引く
- ホワイトスペースを効果的に使い、読みやすさを最優先
- コンテンツは、マーケターとして、顧客心理、顧客ニーズを想像し、顧客目線で作成する

詳細とパターンは [references/content-structure.md](references/content-structure.md) を参照。

## 技術スタック(デフォルト、上書き可)

ユーザーが別スタックを指定した場合はそれに従うこと。指定がなければ以下:

- **Tailwind CSS v4.1+**(CDN・scriptタグ形式、ビルド不要)
- **Animate.css v4.1.1+**(控えめなアニメーション)
- **AOS v2.3+** もしくは Animate.css + Intersection Observer(スクロール連動)
- **Lucide v0.536.0+**(アイコン / ロゴ)
- 日本語最適フォント(Noto Sans JP など)をパフォーマンス配慮しつつ選定

**重要な注意点(Tailwind v4 の落とし穴など)**、各ライブラリの正しい読み込み方は [references/tech-stack.md](references/tech-stack.md) を参照。

## ナビゲーション仕様

特別な指示がない限り、固定ヘッダーナビを以下の仕様で実装する:

- `position: fixed` で画面上部に固定(`sticky` ではない)
- スクロール50px以降で `backdrop-filter: blur(12px)` + 半透明背景に変化
- リンク色も背景に応じて切替
- `lg:` ブレークポイントでデスクトップ/モバイル切替
- アクセシビリティ(`aria-label`, `aria-expanded`, `aria-controls`)必須
- スクロールイベントは `requestAnimationFrame` でスロットリング
- モバイルメニュー開閉で Lucide `menu` ⇔ `x` を切替

実装サンプルと詳細は [references/navigation-spec.md](references/navigation-spec.md) を参照。

## デザイン要件

- Tailwind の `@theme` ディレクティブでカラーパレットをコンテンツに合わせて設定
- フォントは日本語最適 + パフォーマンス配慮
- 余白(ホワイトスペース)を大胆に取り、読みやすさ重視
- 派手すぎないアニメーション

## 画像について

1. ユーザー指定がなければ **`unsplash-image-finder` スキル**に委譲して画像を取得
2. Unsplash URL は `?w=800&q=80` 等のパラメータで最適化
3. 画像リンク切れに注意(取得した画像は生成前に有効性を確認する意識)
4. 背景画像としても活用可
5. ユーザーがローカル画像を用意している場合、ファイルサイズが大きければ最適化を案内する → [references/image-optimization.md](references/image-optimization.md)

## パフォーマンス

- CSS/JS は最小限、不要なライブラリは入れない
- 画像最適化を優先(ビルドプロセスより効果大)
- Core Web Vitals を意識(LCP のための Hero 画像は軽量化)

## ワークフロー

1. ユーザーの意図・コンテンツの有無を確認(創造的に作るか、指定に従うか)
2. セクション構成を決める(指示がなければ提案)
3. カラーパレット・フォントを決める
4. 画像が必要なら `unsplash-image-finder` スキルを使って収集
5. HTML を生成(上記チェックリストを満たすこと)
6. 保存先はプロジェクト規約(CLAUDE.md)に従う
7. 生成後、画像サイズや不要コードがないかセルフチェック、必要なら最適化を案内
