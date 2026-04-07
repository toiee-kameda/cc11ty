# コンテンツ構造ガイド

ワンページサイトのセクション構成と HTML 構造のベストプラクティス。

## セクション構成の原則

- セクション構成の指示がなければ、自分でベストプラクティスに従って構成する
- **A4 6 ページ以上の情報量** = **最低 8 セクション程度**を目安にする
- ユーザー指示があれば従う(セクション数を絞る指示も含む)
- 各セクションに `id` を付けてナビゲーションリンクを設置
- セクション数が多すぎる場合はナビは間引く(主要 5〜7 個に絞る)
- ワンページで完結するように作成

## 標準セクションパターン

目的別の典型構成:

### サービス / プロダクト LP
1. **Hero** — キャッチコピー、CTA、ヒーロー画像/動画
2. **Problem** — ターゲットの悩み・課題提起
3. **Solution / About** — サービスの概要と価値提案
4. **Features** — 主要機能・特徴(3〜6 個のカード)
5. **How it works** — 利用ステップ(1→2→3)
6. **Testimonials / Voice** — お客様の声
7. **Pricing** — 料金プラン
8. **FAQ** — よくある質問(アコーディオン)
9. **CTA / Contact** — 問い合わせフォーム or 申込ボタン
10. **Footer** — 会社情報、SNS、コピーライト

### ポートフォリオ / 個人サイト
1. Hero(自己紹介 + ビジュアル)
2. About(経歴・スキル)
3. Skills / Tech Stack
4. Works / Projects(ギャラリー)
5. Experience(職歴・タイムライン)
6. Blog / Writing(外部リンク)
7. Contact
8. Footer

### イベント告知
1. Hero(イベント名・日時)
2. About(概要)
3. Speakers / Guests
4. Schedule / Timetable
5. Venue / Access(地図)
6. Pricing / Tickets
7. FAQ
8. Apply / Contact
9. Footer

## HTML 構造の必須要件

- セマンティック要素: `header` / `nav` / `main` / `section` / `article` / `aside` / `footer`
- 各 `section` に `id`(ナビからジャンプ)
- 見出しレベルは正しく階層化(h1 はページ内 1 つ)
- メタタグ: `description`, `keywords`, `og:title`, `og:description`, `og:image`, `og:type`, `twitter:card`, `viewport`, `theme-color`
- ファビコン(`<link rel="icon">`)
- 言語属性 `<html lang="ja">`
- 文字コード `<meta charset="UTF-8">`

## フォーム設計

- `required`, `type="email"`, `type="tel"`, `pattern` 等で validation
- ラベルと入力欄を `<label for>` で関連付け
- エラーメッセージ表示エリアを用意
- 送信ボタンは押下後の状態(disabled、ローディング)も考慮
- プライバシーポリシー同意チェックを付ける(問い合わせフォームの場合)

## アコーディオン(FAQ など)

- `<details>` / `<summary>` を使うとシンプル&アクセシブル
- 凝った見た目にしたい場合は ARIA(`aria-expanded`, `aria-controls`)で実装

## コメントの入れ方

非エンジニアが後で編集できるように、各セクション開始位置にコメントを入れる:

```html
<!-- ========== Hero セクション ========== -->
<section id="hero" class="...">
  ...
</section>

<!-- ========== About セクション ========== -->
<section id="about" class="...">
  ...
</section>
```
