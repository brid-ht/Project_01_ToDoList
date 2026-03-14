# 极简待办清单

React + TypeScript + Vite 前端，Supabase 后端，支持 Vercel 部署的完整全栈待办应用。

---

## 1. 项目页面结构

```
Project_01/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AddTodo.tsx      # 添加任务表单
│   │   ├── TodoItem.tsx     # 单条任务（复选框 + 标题 + 删除）
│   │   └── TodoList.tsx     # 任务列表 / 空态 / 加载态
│   ├── hooks/
│   │   └── useTodos.ts      # 列表拉取、增删改、实时订阅
│   ├── lib/
│   │   └── supabase.ts      # Supabase 客户端
│   ├── types/
│   │   ├── database.ts      # Supabase 表类型
│   │   └── todo.ts          # Todo 业务类型
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── supabase/
│   └── migrations/
│       └── 001_create_todos.sql
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

**页面与路由**：单页应用，仅一个页面，包含：

- 顶部标题「极简待办清单」
- 添加新任务输入框 + 添加按钮
- 任务列表（每条可点击切换完成、删除）

---

## 2. 数据表设计（Supabase）

**表名**：`public.todos`

| 字段         | 类型         | 约束               | 说明           |
|--------------|--------------|--------------------|----------------|
| `id`         | `uuid`       | PRIMARY KEY, 默认 `gen_random_uuid()` | 主键           |
| `title`      | `text`       | NOT NULL           | 任务标题       |
| `completed`  | `boolean`    | NOT NULL, 默认 `false` | 是否已完成     |
| `created_at` | `timestamptz`| NOT NULL, 默认 `now()` | 创建时间       |
| `updated_at` | `timestamptz`| NOT NULL, 默认 `now()` | 更新时间（由触发器维护） |

**索引**：`todos_created_at_idx` on `(created_at DESC)`，便于按时间倒序展示。

**RLS**：已启用 Row Level Security，当前策略为允许所有匿名读写（适合演示/单用户）；若需多用户，可改为按 `auth.uid()` 过滤。

建表与策略脚本见：`supabase/migrations/001_create_todos.sql`。在 Supabase 控制台 → SQL Editor 中执行该文件即可。

---

## 3. 接口说明（Supabase 自动 API）

前端通过 `@supabase/supabase-js` 调用 Supabase 自动生成的 REST/Realtime API，无需自写后端。

| 操作     | 方式                    | 说明 |
|----------|-------------------------|------|
| 查询列表 | `GET /rest/v1/todos?order=created_at.desc` | 等价于 `supabase.from('todos').select('*').order('created_at', { ascending: false })` |
| 新增     | `POST /rest/v1/todos`   | Body: `{ "title": "任务内容", "completed": false }` |
| 更新     | `PATCH /rest/v1/todos?id=eq.<uuid>` | Body: `{ "completed": true }` 等 |
| 删除     | `DELETE /rest/v1/todos?id=eq.<uuid>` | 按主键删除 |
| 实时     | Realtime 订阅 `public.todos` | 表增删改时前端自动刷新列表 |

前端封装在 `src/hooks/useTodos.ts`：`fetchTodos`、`addTodo`、`toggleTodo`、`deleteTodo`，以及通过 `postgres_changes` 的实时订阅。

---

## 4. 本地运行与部署

### 环境变量

复制 `.env.example` 为 `.env`，并填写 Supabase 项目信息（Dashboard → Settings → API）：

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 创建表

在 [Supabase](https://supabase.com) 项目中打开 **SQL Editor**，执行 `supabase/migrations/001_create_todos.sql` 中的 SQL。

### 安装与运行

```bash
npm install
npm run dev
```

浏览器打开 Vite 给出的地址（如 `http://localhost:5173`）。

### 构建

```bash
npm run build
```

产物在 `dist/`。

### 部署到 Vercel

1. 将仓库推送到 GitHub（或连接 Vercel 支持的 Git 服务）。
2. 在 [Vercel](https://vercel.com) 中 Import 该仓库，框架选 **Vite**（或自动识别）。
3. 在项目 Settings → Environment Variables 中配置：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. 部署即可；`vercel.json` 已配置 `buildCommand`、`outputDirectory` 与 `framework`。

---

## 技术栈

- **前端**：React 18、TypeScript、Vite
- **后端/数据库**：Supabase（PostgreSQL + 自动 API + Realtime）
- **部署**：Vercel

界面为浅色、简洁风格，带基础过渡与列表项入场动画。
