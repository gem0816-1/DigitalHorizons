# 部署文档

## 环境变量

基于 `.env.example` 创建 `.env`：

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 构建与预览

```bash
npm install
npm run test
npm run lint
npm run build
npm run preview
```

## CI 行为

工作流文件：`.github/workflows/tag-test.yml`

- 触发条件：推送 tag（`v*` 或 `release-*`）
- 执行动作：安装依赖并运行单元测试

## 生产部署说明

- 硬件静态数据来自 `src/data`
- 用户装机方案存储在 Supabase
- SPA 部署时需要配置回退到 `index.html`
