### 快速开始

```bash
# 创建新项目
npm create astro@latest

# 启动开发服务器
npm run dev

# 构建静态文件
npm run build
```

### 内容集合

Astro 的内容集合功能让管理博客文章变得简单：

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

### 部署

Astro 生成的静态文件可以部署到各种平台：

- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages
