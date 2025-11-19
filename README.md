# CC-Tool

> 交互式的 Claude Code 会话管理工具

[![npm version](https://img.shields.io/npm/v/cc-tool.svg)](https://www.npmjs.com/package/cc-tool)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 简介

CC-Tool 是一个命令行工具，帮助你快速查找、搜索和恢复 Claude Code 的历史会话。

**核心功能**：
- 📋 列出最近会话，单行清晰显示
- 🔎 关键词搜索会话
- 🔀 切换不同项目
- 🌿 Fork 会话（创建分支）

## 安装

### 从 npm 安装（推荐）

```bash
npm install -g cc-tool
```

### 从源码安装

```bash
# 克隆项目
git clone https://github.com/CooperJiang/cc-tool.git
cd cc-tool

# 安装依赖
npm install

# 全局链接
npm link
```

## 快速开始

```bash
# 启动 CLI
cc

# 选择操作：
# 1. 💼 列出最近的会话
# 2. 🔎 搜索会话
# 3. 🔀 切换项目
# 4. 👋 退出程序
```

## 使用示例

### 查看最近会话

```bash
cc
# 选择 "列出最近的会话"
# 浏览列表，选择要恢复的会话
```

### 搜索特定会话

```bash
cc
# 选择 "搜索会话"
# 输入关键词，如 "orderCenter"
# 从搜索结果中选择会话
```

### Fork 会话说明

- **继续原会话**（推荐）：直接在原会话上继续对话
- **Fork 新分支**：基于原会话创建新会话，保留原会话不变

> 💡 99% 的情况选择"继续原会话"，Fork 仅在需要保留原版本做备份时使用。

## 配置

编辑 `config.json` 自定义配置：

```json
{
  "projectsDir": "~/.claude/projects",
  "defaultProject": "your-project-name",
  "maxDisplaySessions": 20,
  "pageSize": 15
}
```

## 项目结构

```
cc-tool/
├── bin/          # CLI 入口
├── src/          # 源代码
│   ├── commands/ # 命令处理
│   ├── utils/    # 工具函数
│   ├── ui/       # UI 相关
│   └── config/   # 配置管理
├── docs/         # 文档
└── test/         # 测试
```

详细架构请查看 [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)

## 技术栈

- **Node.js** - 运行环境
- **inquirer** - 交互式命令行
- **chalk** - 彩色输出
- **ora** - 加载动画

## 版本历史

查看 [CHANGELOG.md](docs/CHANGELOG.md) 了解详细更新记录。

**最新版本 v1.3.0**：
- ✨ 模块化重构
- 📦 标准 npm 包结构
- 📝 完善文档

## 卸载

```bash
npm uninstall -g cc-tool
```

## 许可

MIT License
