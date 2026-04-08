# 开发文档

## 代码规范

- 架构目标：高内聚、低耦合，按数据层/业务层/展示层分离
- 数据职责：
  - 硬件静态数据仅放在 `src/data/*.json`
  - 用户数据仅放在 Supabase（`saved_builds`）
- 注释风格：使用 Doxygen 风格注释
- 持久化策略：前端日志写入应用运行上下文（`localStorage`），不写系统目录

## Git 工作流

- 使用 Git Flow 基线分支：`main`、`dev`
- 提交信息遵循 Angular Commit 规范
- 每次提交必须附带 co-author：
  - `Co-authored-by: opencode-agent[bot] <opencode-agent[bot]@users.noreply.github.com>`
- 本项目要求：每次 commit 前必须先得到用户确认

## Agent 使用规范

- 必须基于 `LanternCX/superpowers` fork
- 项目 agent 工作目录固定为 `.opencode`
- 项目 skill 放在 `.opencode/skills`

## 常用命令

```bash
npm run dev
npm run test
npm run lint
npm run typecheck
npm run build
```
