import { defineConfig } from 'astro/config';

// GitHub Pages 部署配置
// 将 'matchafrenchfriesblog' 替换为你的 GitHub 仓库名
export default defineConfig({
  site: 'https://sereinmono.github.io',
  // 本地开发时注释下一行，部署到 GitHub Pages 时取消注释
  // base: '/matchafrenchfriesblog',
  output: 'static',
  build: {
    assets: 'assets'
  }
});
