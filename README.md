<div align="center">
  <img src="docs/logo.png" alt="CODING-TOOL Logo" width="120" />

  # CODING-TOOL

  **Vibe Coding 增强工作助手 - 智能会话管理 & 多渠道切换**

  [![npm version](https://img.shields.io/npm/v/coding-tool.svg)](https://www.npmjs.com/package/coding-tool)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

  <img src="docs/bannel.png" alt="CODING-TOOL Banner" width="90%" />
</div>

---

## ✨ 特性

🎯 **智能会话管理** - 自动识别并管理所有历史会话，支持自定义命名、全局搜索、Fork 分支

🔀 **动态渠道切换** - 管理多个 API 渠道，一键切换无需重启，成本优化与稳定性兼得

⚡ **上下文复用** - Fork 对话功能，完整保留上下文同时探索不同方向

📊 **实时监控** - 可视化展示每次 API 请求的 Token 消耗（输入/输出/缓存）

🌐 **现代化 Web UI** - 直观的可视化界面，让会话管理、渠道切换、全局搜索更高效

---

## 📦 安装

### 从 npm 安装（推荐）

```bash
npm install -g coding-tool
```

### 从源码安装

```bash
git clone https://github.com/CooperJiang/cc-tool.git
cd cc-tool
npm install
npm link
```

---

## 🚀 快速开始

### Web UI 模式（推荐）

```bash
ct ui
```

启动可视化界面，浏览器自动打开 `http://localhost:9999`

**主要功能：**
- 📋 可视化管理所有项目和会话
- 🔍 全局搜索（快捷键 `⌘/Ctrl + K`）
- 🔀 动态切换 API 渠道
- 📊 实时查看 API 请求日志和 Token 消耗
- 🎨 拖拽排序、自定义命名

**Web UI 界面预览：**

<div align="center">
  <img src="docs/cc-tool.png" alt="Web UI 界面截图" width="90%" />
  <p><i>现代化 Web 界面 - 项目与会话管理、实时日志监控</i></p>
</div>

### 命令行模式

```bash
ct
```

启动交互式命令行界面，通过菜单完成会话管理和渠道切换

### 其他命令

```bash
ct reset            # 重置配置文件
ct proxy start      # 启动代理服务
ct proxy stop       # 停止代理服务
ct status           # 查看代理状态
ct --version        # 显示版本号
ct --help           # 显示帮助信息
```

---

## 📖 核心功能

### 🎯 会话管理

- **项目与会话列表**：卡片式展示所有项目和会话
- **会话别名**：为会话设置易记的名称
- **全局搜索**：快捷键 `⌘/Ctrl + K` 跨项目搜索会话内容
- **Fork 会话**：创建会话分支，保留历史版本
- **快速启动**：点击"使用对话"直接在终端中打开会话

### 🔀 多渠道管理

- **动态切换**：一键切换不同 API 渠道，无需重启
- **渠道管理**：添加、编辑、删除渠道，支持拖拽排序
- **安全显示**：API Key 脱敏显示，防止泄露
- **快捷访问**：点击跳转到渠道官网

### 📊 实时监控

- **实时日志**：WebSocket 推送，实时查看 API 请求详情
- **Token 统计**：显示请求/回复/缓存写入/缓存命中 Token 数
- **行为日志**：渠道切换、会话启动等操作实时提示
- **连接状态**：WebSocket 连接状态实时显示

---

## 🎨 使用技巧

### 全局搜索

1. 在任意页面按 `⌘/Ctrl + K`
2. 输入关键词搜索所有项目的会话内容
3. 点击搜索结果直接启动对话

### 动态切换渠道

1. 点击顶部"动态切换"开关
2. 在右侧渠道列表中点击"切换"按钮
3. ClaudeCode 自动使用新渠道，无需重启

> ⚠️ **注意**：动态切换期间请勿关闭进程窗口

### Fork 会话

1. 在会话列表中点击 Fork 按钮
2. 新会话会继承原会话的所有历史消息
3. 可以基于相同上下文探索不同方向

---

## ❓ 常见问题

**Q: 动态切换不生效？**

A: 确保已开启"动态切换"开关，且进程窗口未关闭

**Q: 实时日志面板不显示？**

A: 实时日志需要先开启"动态切换"功能

**Q: 如何备份配置？**

A: 直接复制 `~/.claude/cc-tool/` 整个目录即可

---

## ⭐ Star History

如果这个项目对你有帮助，请给它一个 Star ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=CooperJiang/cc-tool&type=Date)](https://star-history.com/#CooperJiang/cc-tool&Date)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License

---

**Made with ❤️ for Vibe Coding users**
