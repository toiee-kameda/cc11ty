# cc11ty

Eleventy (ESM) ベースのサイトテンプレートリポジトリ。
日本語ユーザー向け。Claude Code と組み合わせて使うことを想定している。

## プロジェクト構成

```
src/
  _layouts/base.njk      # ベースレイアウト（全ページ共通のシェル）
  _layouts/post.njk      # ブログ記事レイアウト
  _includes/             # 再利用パーツ（空）
  _data/                 # グローバルデータ（空）
  index.njk              # トップページ
  posts/                 # ブログ記事（Markdown）
project-docs/
  *.html                 # デザインプロトタイプ置き場（ファイル名は自由）
.claude/
  skills/                # Claude Code スキル
```

**eleventy.config.js:** Input=`src` / Output=`_site` / Layouts=`_layouts`  
テンプレートエンジン: Nunjucks（`.njk`）と Markdown

## 開発コマンド

| コマンド | 内容 |
|---|---|
| `npm start` | 開発サーバー起動（ライブリロード） |
| `npm run build` | 本番ビルド |
| `npm run debug` | デバッグモードでビルド |

## 想定ワークフロー

1. このリポジトリをクローンする
2. **テーマを設定する** → `set-theme` スキルを使う
3. 個別ページを作る（`src/` に `.njk` や `.md` を追加）
4. ブログ記事を書く（`src/posts/` に Markdown を追加）
5. コレクションを使ってアーカイブやタグ一覧を作る

## 利用可能なスキル

### `one-page-site-builder`
ランディングページ / サービス紹介 / ポートフォリオなど、ワンページ完結のHTMLサイトを生成する。  
生成物は `project-docs/` に保存する（テーマ設定の入力として使う）。

**起動タイミング:** 「LP作って」「ワンページサイト」「ポートフォリオ作りたい」など

### `set-theme`
`project-docs/` 内の承認済みHTMLデザインを `src/_layouts/base.njk` に変換する。  
どのファイルを使うかをユーザーに確認した上で、ナビ・ヘッダー・フッターの構造を保ちつつ、コンテンツ領域を `{{ content | safe }}` に差し替える。

**起動タイミング:** 「テーマ設定して」「デザインを適用して」「base.njkを更新して」など

### `create-page`
About / Services / Contact などの固定ページを `src/[ページ名].njk` として作成する。  
`src/_layouts/base.njk` のテーマを読み取り、`one-page-site-builder` の品質基準でコンテンツ部分のみ生成する。

**起動タイミング:** 「固定ページ作って」「ページを追加」「Aboutページ」「お問い合わせページ」など

### `unsplash-image-finder`
Unsplash からサイトに使う画像を検索・最適化する。  
`one-page-site-builder` から自動呼び出しされることが多い。

### `publish-blog`
`blog-draft/` に置いた下書き記事（`post.md`）と画像を `src/posts/` と `src/assets/` へ移動して公開する。  
frontmatter の設定・スラッグの決定・画像パスの絶対パス変換を自動化する。

**起動タイミング:** 「ブログ公開」「記事を公開」「下書きを公開」など

## ファイル保存規則

| 種類 | 保存先 |
|---|---|
| デザインプロトタイプ（HTML） | `project-docs/` 配下（ファイル名は自由） |
| ベースレイアウト | `src/_layouts/base.njk` |
| ブログ記事 | `src/posts/記事名.md` |
| 静的アセット | `src/assets/` |
