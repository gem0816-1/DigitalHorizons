# 数码视界 Dashboard

[English](./README.en-US.md)

数码视界 Dashboard 是一个基于 React + TypeScript 的数码硬件信息应用，用来查看移动 SoC 数据、进行芯片横向对比，并完成 PC 装机方案规划。项目把仓库内的静态硬件数据与 Supabase 认证结合起来，让用户可以保存并回看自己的装机方案。

## 功能概览

- 基于 ECharts 的 SoC 数据总览，包括雷达图、柱状图、散点图等可视化
- 可筛选的 SoC 列表页、详情页和多芯片对比页
- 覆盖 CPU、GPU、主板、内存、SSD、电源、机箱的 PC 装机助手
- 基于 Supabase 的注册、登录和个人方案保存
- 当 `saved_builds` 数据表尚未创建时，自动回退到浏览器 `localStorage`
- 带有过渡动画的亮色/暗色主题切换，并持久化用户偏好

## 技术栈

- React 19
- TypeScript
- Vite 7
- React Router 7
- Tailwind CSS 4 与自定义 CSS 变量、布局样式
- ECharts 6 与 Echarts-For-React
- Supabase Auth + Postgres
- Vitest、Testing Library、Playwright

## 页面路由

- `/`：总览页，展示 SoC 与桌面硬件数据
- `/soc`：SoC 列表页
- `/soc/:id`：SoC 详情页
- `/soc/compare`：芯片对比页
- `/builder`：PC 装机助手
- `/login`：登录/注册页
- `/my-builds`：已保存方案管理页

## 数据说明

- 静态目录数据位于 [`src/data`](./src/data) 下的 JSON 文件
- 用户自己的装机方案存放在 Supabase 的 `saved_builds` 表中
- 硬件条目中包含京东等商品链接，但价格和参数数据本身仍然是仓库内维护的静态数据

## 本地启动

### 环境要求

- Node.js 20+ 与 npm
- 如果需要登录和云端保存功能，需要准备一个 Supabase 项目

### 安装依赖

```bash
npm install
```

### 配置环境变量

1. 将 `.env.example` 复制为 `.env.local`
2. 配置以下变量：

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

如果没有配置 Supabase 环境变量，应用仍然可以展示静态图表和装机页面，但登录与云端保存能力不可用。

### 创建 `saved_builds` 表

把 [`supabase/migrations/001_saved_builds.sql`](./supabase/migrations/001_saved_builds.sql) 应用到你的 Supabase 项目中。这个迁移会：

- 创建 `saved_builds` 表
- 启用 RLS
- 添加仅允许用户访问自己数据的策略
- 通过触发器自动维护 `updated_at`

如果 Supabase 认证已经可用，但 `saved_builds` 表尚未创建，装机方案的增删改查会自动回退到浏览器 `localStorage`.

### 启动开发服务器

```bash
npm run dev
```

然后访问 `http://localhost:5173`。

## 常用脚本

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run test:e2e
npm run preview
```

## 目录结构

```text
.
|-- src/
|   |-- components/       # 可复用 UI 与图表组件
|   |-- data/             # 静态 SoC 与硬件数据
|   |-- hooks/            # 认证与装机状态 hooks
|   |-- layouts/          # 应用外壳与导航布局
|   |-- lib/              # 数据加载、主题、Supabase、持久化等工具
|   |-- pages/            # 路由页面
|   |-- styles/           # 样式相关测试
|   `-- types/            # 共享 TypeScript 类型
|-- supabase/
|   `-- migrations/       # Supabase SQL 迁移
|-- docs/
|   |-- en/
|   `-- zh-cn/
`-- server/               # 预留的后端工作区
```

## 其他文档

- 英文开发文档：[`docs/en/developer-guide.md`](./docs/en/developer-guide.md)
- 中文开发文档：[`docs/zh-cn/developer-guide.md`](./docs/zh-cn/developer-guide.md)
