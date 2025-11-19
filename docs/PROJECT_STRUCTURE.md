# 项目结构

## 目录结构

```
cc-tool/
├── bin/
│   └── cc.js              # CLI 入口脚本
├── src/
│   ├── commands/          # 命令处理模块
│   │   ├── list.js       # 列出会话
│   │   ├── search.js     # 搜索会话
│   │   ├── switch.js     # 切换项目
│   │   └── resume.js     # 恢复会话
│   ├── utils/             # 工具函数
│   │   ├── session.js    # 会话相关工具
│   │   └── format.js     # 格式化工具
│   ├── ui/                # UI 相关
│   │   ├── menu.js       # 主菜单
│   │   └── prompts.js    # 交互提示
│   ├── config/            # 配置管理
│   │   ├── default.js    # 默认配置
│   │   └── loader.js     # 配置加载器
│   └── index.js           # 主入口
├── docs/
│   ├── CHANGELOG.md       # 更新日志
│   └── PROJECT_STRUCTURE.md
├── test/
├── .gitignore
├── .npmignore
├── package.json
├── config.json
└── README.md
```

## 模块说明

### 命令模块 (src/commands/)

- **list.js**: 列出会话，处理会话列表显示和选择
- **search.js**: 搜索会话，支持关键词搜索
- **switch.js**: 切换项目，管理多个 Claude 项目
- **resume.js**: 恢复会话，启动 Claude CLI

### 工具模块 (src/utils/)

- **session.js**: 会话文件读取、解析、信息提取
- **format.js**: 时间、大小、文本格式化

### UI 模块 (src/ui/)

- **menu.js**: 主菜单显示
- **prompts.js**: 各种交互提示（选择会话、Fork 确认等）

### 配置模块 (src/config/)

- **default.js**: 默认配置定义
- **loader.js**: 配置加载和保存

## 数据流

```
用户启动 cc
  ↓
bin/cc.js → src/index.js
  ↓
显示主菜单 (ui/menu.js)
  ↓
用户选择操作
  ↓
调用对应命令 (commands/*)
  ↓
使用工具函数处理 (utils/*)
  ↓
显示交互提示 (ui/prompts.js)
  ↓
恢复会话 (commands/resume.js)
  ↓
启动 Claude CLI
```

## 扩展指南

### 添加新命令

1. 在 `src/commands/` 创建新文件
2. 实现命令逻辑
3. 在 `src/index.js` 中导入并添加路由
4. 在 `src/ui/menu.js` 添加菜单选项

### 添加工具函数

1. 在 `src/utils/` 创建新文件
2. 实现纯函数
3. 在需要的地方导入使用

## 设计原则

- **单一职责**: 每个模块只负责一个功能
- **低耦合**: 通过参数传递依赖
- **可测试**: 纯函数设计
- **可扩展**: 模块化架构
