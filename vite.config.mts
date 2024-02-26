import { defineConfig } from 'vite';
import { crx, defineManifest } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
const manifest = defineManifest({
  manifest_version: 3,
  name: 'Kemonova+ (ケモノバプラス)',
  version: '0.0.1',
  // TODO: 将来的に英語対応する？
  // default_locale: "ja",
  description: 'ケモノ情報サイト Kemonova をもっと使いやすくする拡張機能です。',
  icons: {
    '16': 'src/img/icon.png',
    '48': 'src/img/icon.png',
    '128': 'src/img/icon.png',
  },
  author: 'hikage.works@gmail.com',
  options_page: 'src/options.html',
  action: {
    default_popup: 'src/popup.html',
  },
  background: {
    service_worker: 'src/background.ts',
    type: 'module',
  },
  permissions: ['storage'],
  host_permissions: ['https://twipla.jp/'],
  content_scripts: [
    {
      // 将来的にサブディレクトリを使うようになったら後ろに*を付ける
      matches: ['https://kemonova.jp/*'],
      js: ['src/scripts/content.ts'],
    },
  ],
});
export default defineConfig({
  // appType: 'custom',
  plugins: [react(), crx({ manifest })],
});
