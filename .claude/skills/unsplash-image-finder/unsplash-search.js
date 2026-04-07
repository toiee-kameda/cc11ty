#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ESモジュールでの__dirnameの取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// プロジェクトルートを算出（.claude/skills/unsplash-image-finder/ → 3階層上）
const projectRoot = join(__dirname, '..', '..', '..');

// .env.local を自前パース（dotenv不要）
function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim();
      // 既存の環境変数を上書きしない
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // ファイルが無い場合は無視
  }
}

// 環境変数が設定されていない場合のみ .env.local を読み込む
if (!process.env.UNSPLASH_ACCESS_KEY) {
  loadEnvFile(join(projectRoot, '.env.local'));
}

const UNSPLASH_API = 'https://api.unsplash.com';

/**
 * Unsplash画像検索クラス
 */
class UnsplashImageSearch {
  constructor() {
    this.accessKey = process.env.UNSPLASH_ACCESS_KEY;

    if (!this.accessKey) {
      console.error('❌ Error: UNSPLASH_ACCESS_KEY not found in .env.local');
      console.error('📝 Please create .env.local file with your Unsplash API key');
      console.error('📖 See .env.local.example for reference');
      process.exit(1);
    }
  }

  /**
   * Unsplash API へリクエストを送る
   * @param {string} path APIパス
   * @param {Record<string, string>} params クエリパラメータ
   * @returns {Promise<any>}
   */
  async apiRequest(path, params = {}) {
    const url = new URL(path, UNSPLASH_API);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
    const res = await fetch(url.toString(), {
      headers: {
        'Authorization': `Client-ID ${this.accessKey}`,
        'Accept-Version': 'v1',
      },
    });
    if (!res.ok) {
      throw new Error(`Unsplash API error: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  /**
   * 画像を検索してURL を返す
   * @param {string} query 検索キーワード
   * @param {number} width 画像幅（デフォルト: 800）
   * @param {number} quality 画像品質（デフォルト: 80）
   * @returns {Promise<string>} 最適化された画像URL
   */
  async searchImage(query, width = 800, quality = 80) {
    try {
      console.log(`🔍 Searching for: "${query}"`);

      const data = await this.apiRequest('/search/photos', {
        query,
        page: '1',
        per_page: '10',
        orientation: 'landscape',
      });

      const photos = data.results;

      if (!photos || photos.length === 0) {
        console.log(`⚠️  No images found for "${query}"`);
        return this.getFallbackImageUrl(query, width, quality);
      }

      // 最初の画像を選択（通常は最も関連性が高い）
      const selectedPhoto = photos[0];

      // 最適化されたURLを生成
      const optimizedUrl = `${selectedPhoto.urls.raw}&w=${width}&q=${quality}&fm=webp&fit=crop`;

      console.log(`✅ Found image by ${selectedPhoto.user.name}`);
      console.log(`📸 Image URL: ${optimizedUrl}`);

      // ダウンロード追跡（Unsplash API規約に準拠）
      if (selectedPhoto.links.download_location) {
        try {
          await fetch(selectedPhoto.links.download_location, {
            headers: { 'Authorization': `Client-ID ${this.accessKey}` },
          });
        } catch (trackError) {
          console.warn('⚠️  Could not track download:', trackError.message);
        }
      }

      return optimizedUrl;

    } catch (error) {
      console.error('❌ Search failed:', error.message);
      return this.getFallbackImageUrl(query, width, quality);
    }
  }

  /**
   * フォールバック画像URLを生成
   * @param {string} query 検索キーワード
   * @param {number} width 画像幅
   * @param {number} quality 画像品質
   * @returns {string} フォールバック画像URL
   */
  getFallbackImageUrl(query, width, quality) {
    console.log(`🔄 Using fallback image for "${query}"`);
    // source.unsplash.com はサービス停止のため、ダミー画像を使用
    return 'https://cwm.toiee.jp/images/dummy.jpg';
  }

  /**
   * 複数の画像を取得
   * @param {string[]} queries 検索キーワードの配列
   * @param {number} width 画像幅
   * @param {number} quality 画像品質
   * @returns {Promise<Object>} キーワードとURLのマップ
   */
  async searchMultipleImages(queries, width = 800, quality = 80) {
    const results = {};

    for (const query of queries) {
      results[query] = await this.searchImage(query, width, quality);
      // レート制限を回避するため少し待機
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    return results;
  }
}

/**
 * ヘルスチェック: APIキーの存在確認とテスト検索を実行
 * @returns {Promise<void>}
 */
async function healthCheck() {
  const result = { status: 'error', message: '', guide: '' };

  // Step 1: APIキーの存在確認
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    result.message = 'UNSPLASH_ACCESS_KEY が設定されていません';
    result.guide = [
      '設定手順:',
      '1. https://unsplash.com/developers でアカウント作成・ログイン',
      '2. 「New Application」でアプリを作成し、Access Key を取得',
      '3. プロジェクトルートに .env.local ファイルを作成し、以下を記入:',
      '   UNSPLASH_ACCESS_KEY=取得したキー',
      '',
      '参考: .env.local.example にテンプレートがあります',
    ].join('\n');
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  // Step 2: テスト検索
  try {
    const url = new URL('/search/photos', UNSPLASH_API);
    url.searchParams.set('query', 'test');
    url.searchParams.set('per_page', '1');

    const res = await fetch(url.toString(), {
      headers: {
        'Authorization': `Client-ID ${accessKey}`,
        'Accept-Version': 'v1',
      },
    });

    if (!res.ok) {
      result.message = `Unsplash API エラー: ${res.status} ${res.statusText}`;
      if (res.status === 401) {
        result.guide = 'APIキーが無効です。.env.local の UNSPLASH_ACCESS_KEY を確認してください。';
      } else if (res.status === 403) {
        result.guide = 'APIのレート制限に達した可能性があります。しばらく待ってから再試行してください。';
      }
      console.log(JSON.stringify(result, null, 2));
      process.exit(1);
    }

    const data = await res.json();
    const photo = data.results?.[0];

    result.status = 'ok';
    result.message = 'Unsplash API は正常に動作しています';
    if (photo) {
      result.testResult = `${photo.urls.raw}&w=400&q=80&fm=webp&fit=crop`;
    }
    console.log(JSON.stringify(result, null, 2));

  } catch (error) {
    result.message = `接続エラー: ${error.message}`;
    result.guide = 'ネットワーク接続を確認してください。';
    console.log(JSON.stringify(result, null, 2));
    process.exit(1);
  }
}

/**
 * コマンドライン実行部分
 */
async function main() {
  const args = process.argv.slice(2);

  // --check オプション: ヘルスチェック実行
  if (args.includes('--check')) {
    await healthCheck();
    return;
  }

  if (args.length === 0) {
    console.log('📖 Usage:');
    console.log('  node unsplash-search.js "search keyword"');
    console.log('  node unsplash-search.js "keyword1,keyword2,keyword3"');
    console.log('  node unsplash-search.js --check');
    console.log('');
    console.log('🎯 Examples:');
    console.log('  node unsplash-search.js "business team"');
    console.log('  node unsplash-search.js "technology,innovation,startup"');
    console.log('  node unsplash-search.js --check  (APIキーの確認)');
    process.exit(1);
  }

  const searcher = new UnsplashImageSearch();

  const input = args[0];
  const keywords = input.includes(',')
    ? input.split(',').map(k => k.trim())
    : [input.trim()];

  try {
    if (keywords.length === 1) {
      // 単一キーワード検索
      const imageUrl = await searcher.searchImage(keywords[0]);
      console.log('\n🎉 Result:');
      console.log(imageUrl);
    } else {
      // 複数キーワード検索
      console.log(`🔍 Searching for ${keywords.length} images...`);
      const results = await searcher.searchMultipleImages(keywords);

      console.log('\n🎉 Results:');
      for (const [keyword, url] of Object.entries(results)) {
        console.log(`${keyword}: ${url}`);
      }
    }
  } catch (error) {
    console.error('❌ Execution failed:', error.message);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合のみmain()を呼び出し
// ESモジュールでの実行判定（より確実な方法）
const isMainModule = import.meta.url === new URL(process.argv[1], 'file:').href ||
                     import.meta.url.endsWith(process.argv[1]) ||
                     process.argv[1]?.includes('unsplash-search.js');

if (isMainModule) {
  main();
}

export { UnsplashImageSearch };
