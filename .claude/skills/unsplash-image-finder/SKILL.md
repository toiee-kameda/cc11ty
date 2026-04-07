---
name: unsplash-image-finder
description: Search and optimize images from Unsplash for web pages. Use this skill when you need to find images for website content, hero sections, backgrounds, or any web design elements. Automatically triggered when creating web pages without user-provided images, or when user mentions needing images, photos, Unsplash, or visual content for websites. Optimizes images with width, quality, and format parameters for web performance.
user-invocable: true
---

# Unsplash Image Finder Skill

このスキルは、Webページ作成時にUnsplashから適切な画像を検索し、最適化されたURLを提供します。

## セットアップ確認（ヘルスチェック）

ユーザーが「Unsplashで画像検索できますか？」「画像検索の設定は大丈夫？」などと聞いてきた場合、以下のコマンドを実行して確認してください：

```bash
node .claude/skills/unsplash-image-finder/unsplash-search.js --check
```

**結果はJSON形式で返されます：**

- `status: "ok"` → 正常に動作しています。ユーザーに「画像検索は使えます」と伝えてください。
- `status: "error"` → 問題があります。`message` にエラー内容、`guide` に解決手順が含まれるので、それをユーザーに分かりやすく伝えてください。

**注意**: `--check` オプションは `UnsplashImageSearch` クラスのインスタンス化をスキップするため、APIキー未設定でも `process.exit(1)` で即終了せずに、適切なガイドメッセージをJSON出力します。

## 使用方法

### 基本的な呼び出し

既存の実装スクリプトを使用して画像を検索します：

```bash
node .claude/skills/unsplash-image-finder/unsplash-search.js "keyword"
```

**例**:
```bash
node .claude/skills/unsplash-image-finder/unsplash-search.js "coffee shop"
node .claude/skills/unsplash-image-finder/unsplash-search.js "mountain landscape"
node .claude/skills/unsplash-image-finder/unsplash-search.js "business meeting"
```

### 画像URL最適化パラメータ

Unsplash APIから取得した画像URLには、以下のパラメータを追加して最適化してください：

- **w** (width): 画像の幅（例: `w=800`, `w=1200`, `w=1920`）
  - Hero画像: `w=1920`
  - セクション画像: `w=800` または `w=1200`
  - サムネイル: `w=400`

- **q** (quality): 画像品質（1-100、推奨: `q=80`）
  - 標準: `q=80`
  - 高品質: `q=90`

- **fm** (format): 画像フォーマット（`webp`, `jpg`, `png`）
  - 推奨: `fm=webp`（モダンブラウザ対応）
  - フォールバック: `fm=jpg`

- **fit** (fit mode): 画像のフィット方法
  - `fit=crop`: 指定サイズにクロップ（推奨）
  - `fit=max`: アスペクト比を保持

**最適化例**:
```
元のURL:
https://images.unsplash.com/photo-1495474472287-4d71bcdd2085

最適化後:
https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&fm=webp&fit=crop
```

## HTMLへの挿入方法

画像をHTMLに挿入する際は、以下の属性を必ず含めてください：

```html
<img
  src="https://images.unsplash.com/photo-xxx?w=800&q=80&fm=webp&fit=crop"
  alt="適切な説明文"
  loading="lazy"
  decoding="async"
  class="w-full h-64 object-cover"
/>
```

**必須属性**:
- `loading="lazy"`: 遅延読み込みでパフォーマンス向上
- `decoding="async"`: 非同期デコードでレンダリングをブロックしない
- `alt`: アクセシビリティのための代替テキスト

## エラーハンドリング

### 環境変数の確認

スクリプト実行前に `UNSPLASH_ACCESS_KEY` が設定されているか確認してください：

```bash
if [ -z "$UNSPLASH_ACCESS_KEY" ]; then
  echo "Error: UNSPLASH_ACCESS_KEY is not set"
  exit 1
fi
```

### フォールバック処理

1. **APIエラーの場合**: プレースホルダー画像を使用
   ```html
   <img src="https://via.placeholder.com/800x600?text=Image+Not+Available" alt="Placeholder" />
   ```

2. **検索結果なしの場合**: 別のキーワードで再検索
   - 例: "coffee shop" → "cafe" → "coffee"

3. **複数画像が必要な場合**: 結果の異なる画像を選択
   - スクリプトが返す配列から、インデックスを変えて選択

## 環境変数の設定方法

### ローカル開発環境

`.env` ファイルに以下を追加（既に設定済み）：

```
UNSPLASH_ACCESS_KEY=your_access_key_here
```

### Unsplash Access Keyの取得方法

1. https://unsplash.com/developers にアクセス
2. 「New Application」をクリック
3. アプリケーション名と説明を入力
4. 利用規約に同意して作成
5. 表示される「Access Key」をコピー

## 使用例

### 単一画像の検索

```bash
# カフェの画像を検索
node .claude/skills/unsplash-image-finder/unsplash-search.js "cafe interior"
```

出力された画像URLを最適化：
```
https://images.unsplash.com/photo-xxx?w=1200&q=80&fm=webp&fit=crop
```

### 複数画像の検索

```bash
# Hero用の画像
node .claude/skills/unsplash-image-finder/unsplash-search.js "modern office"

# About用の画像
node .claude/skills/unsplash-image-finder/unsplash-search.js "team collaboration"

# Services用の画像
node .claude/skills/unsplash-image-finder/unsplash-search.js "technology workspace"
```

## ベストプラクティス

1. **キーワード選択**: 具体的で明確なキーワードを使用
   - 良い例: "coffee shop interior", "mountain sunset landscape"
   - 悪い例: "shop", "nature"

2. **画像サイズ**: セクションの用途に応じて適切なサイズを指定
   - Hero: `w=1920`
   - コンテンツ: `w=800-1200`
   - サムネイル: `w=400`

3. **品質設定**: ファイルサイズとのバランスを考慮
   - 通常は `q=80` で十分
   - 重要な画像のみ `q=90`

4. **アクセシビリティ**: alt属性には意味のある説明を記載
   - 良い例: "Barista making latte art in modern coffee shop"
   - 悪い例: "image", "photo"

5. **パフォーマンス**: 必ず `loading="lazy"` と `decoding="async"` を使用

## Unsplash利用規約の遵守

- クレジット表記: 可能な限り写真家名とUnsplashへのリンクを含める
- 商用利用: Unsplash License により商用利用可能
- 詳細: https://unsplash.com/license

**推奨クレジット表記**:
```html
<a href="https://unsplash.com/@photographer_username?utm_source=yourapp&utm_medium=referral">
  Photo by Photographer Name
</a> on
<a href="https://unsplash.com?utm_source=yourapp&utm_medium=referral">
  Unsplash
</a>
```
