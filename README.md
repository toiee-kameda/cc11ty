# cc11ty

**Eleventy + Claude Code** で素早くサイトを構築するためのテンプレートリポジトリ。

Claude Code のスキルと組み合わせることで、デザイン生成からページ作成まで自然言語で操作できます。

## 必要環境

- Node.js 18 以上
- [Claude Code](https://claude.ai/code)

## セットアップ

```bash
git clone <this-repo>
cd cc11ty
npm install
npm start
```

開発サーバーが起動したら http://localhost:8080 を開きます。

## 開発コマンド

| コマンド | 内容 |
|---|---|
| `npm start` | 開発サーバー起動（ライブリロード） |
| `npm run build` | 本番ビルド（`_site/` に出力） |
| `npm run debug` | デバッグモードでビルド |

## プロジェクト構成

```
src/
  _layouts/
    base.njk        # ベースレイアウト（全ページ共通）
    post.njk        # ブログ記事レイアウト
  _includes/        # 再利用パーツ
  _data/            # グローバルデータ
  index.njk         # トップページ
  posts/            # ブログ記事（Markdown）
project-docs/       # デザインプロトタイプ（HTML）置き場
.claude/
  skills/           # Claude Code カスタムスキル
_site/              # ビルド出力（git 管理外）
```

- テンプレートエンジン: Nunjucks (`.njk`) と Markdown
- Input: `src/` → Output: `_site/`

## ワークフロー

Claude Code を使った標準的な作業手順です。

### 1. テーマを決める

LP・ポートフォリオ・サービス紹介などのデザインを生成します。

```
LP作って
```

`project-docs/` に HTML プロトタイプが保存されます。

### 2. テーマを適用する

プロトタイプを Eleventy のベースレイアウトに変換します。

```
テーマ設定して
```

`src/_layouts/base.njk` が更新されます。

### 3. ページを追加する

About・Services・Contact などの固定ページを作ります。

```
Aboutページ作って
```

`src/about.njk` が生成されます。

### 4. ブログ記事を書く

`src/posts/` に Markdown ファイルを追加します。フロントマターの例:

```yaml
---
title: 記事タイトル
date: 2024-01-01
tags: [news, tips]
---
```

## Claude Code スキル

| スキル | 説明 | 起動ワード例 |
|---|---|---|
| `one-page-site-builder` | ワンページHTMLサイトを生成して `project-docs/` に保存 | 「LP作って」「ポートフォリオ」 |
| `set-theme` | `project-docs/` のHTMLを `base.njk` に変換 | 「テーマ設定して」「デザイン適用」 |
| `create-page` | 固定ページ（`.njk`）を作成 | 「Aboutページ」「お問い合わせ」 |
| `unsplash-image-finder` | Unsplash から画像を検索・最適化 | 自動呼び出し |

## ファイル保存規則

| 種類 | 保存先 |
|---|---|
| デザインプロトタイプ | `project-docs/*.html` |
| ベースレイアウト | `src/_layouts/base.njk` |
| 固定ページ | `src/[ページ名].njk` |
| ブログ記事 | `src/posts/[記事名].md` |
| 静的アセット | `src/assets/` |

## ライセンス

MIT
