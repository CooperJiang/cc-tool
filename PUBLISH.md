# 发布指南

## 📦 发布到 npm

### 前提条件

1. **注册 npm 账号**
   - 访问 https://www.npmjs.com/signup
   - 注册一个账号（如果没有）

2. **验证邮箱**
   - npm 需要验证邮箱才能发布包

### 第一步：修改作者信息

编辑 `package.json`，修改 author 字段：

```json
"author": "你的名字 <your.email@example.com>"
```

### 第二步：登录 npm

```bash
npm login
```

输入你的：
- Username
- Password
- Email
- OTP (如果启用了双因素认证)

验证登录：
```bash
npm whoami
```

### 第三步：测试打包

确保包能正确打包：

```bash
# 查看会被发布的文件
npm pack --dry-run

# 实际打包（生成 .tgz 文件）
npm pack
```

### 第四步：发布

```bash
npm publish
```

如果是第一次发布，会提示确认包名。

### 第五步：验证发布

```bash
# 查看包信息
npm view cc-tool

# 测试安装
npm install -g cc-tool
```

---

## 🔄 更新版本

### 版本号规则

- **补丁版本** (1.3.0 → 1.3.1): Bug 修复
- **次版本** (1.3.0 → 1.4.0): 新功能，向后兼容
- **主版本** (1.3.0 → 2.0.0): 破坏性变更

### 更新步骤

```bash
# 方法 1: 使用 npm version 命令（推荐）
npm version patch   # 1.3.0 → 1.3.1
npm version minor   # 1.3.0 → 1.4.0
npm version major   # 1.3.0 → 2.0.0

# 方法 2: 手动修改 package.json
# 然后发布
npm publish
```

---

## 🌐 GitHub 发布（可选）

如果要发布到 GitHub：

### 1. 创建 GitHub 仓库

在 GitHub 上创建新仓库 `cc-tool`

### 2. 初始化 Git

```bash
cd /Users/lilithgames/Desktop/cc-cli

# 初始化 git
git init

# 添加远程仓库
git remote add origin https://github.com/CooperJiang/cc-tool.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial release v1.3.0"

# 推送
git push -u origin main
```

### 3. 创建 Release

在 GitHub 上创建 Release：
- Tag: v1.3.0
- Title: v1.3.0 - Initial Release
- Description: 从 CHANGELOG.md 复制内容

### 4. 更新 package.json

将 GitHub URL 更新为你的实际地址：

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/CooperJiang/cc-tool.git"
  },
  "bugs": {
    "url": "https://github.com/CooperJiang/cc-tool/issues"
  },
  "homepage": "https://github.com/CooperJiang/cc-tool#readme"
}
```

---

## 🛡️ 发布前检查清单

- [ ] 已测试功能正常
- [ ] 版本号已更新
- [ ] CHANGELOG.md 已更新
- [ ] README.md 信息完整
- [ ] LICENSE 文件存在
- [ ] package.json 信息完整（author、repository 等）
- [ ] 已登录 npm (`npm whoami`)
- [ ] 包名可用 (`npm view cc-tool`)

---

## ⚠️ 常见问题

### 包名已被占用

```bash
# 检查包名
npm view your-package-name

# 如果被占用，修改 package.json 中的 name 字段
```

### 没有权限发布

```bash
# 确认登录状态
npm whoami

# 重新登录
npm logout
npm login
```

### 双因素认证

如果启用了 2FA，发布时需要输入 OTP：

```bash
npm publish --otp=123456
```

### 撤销发布

**注意**：只能撤销 72 小时内发布的版本

```bash
npm unpublish cc-tool@1.3.0
```

---

## 📊 发布后

### 更新 README badge

在 README.md 添加：

```markdown
[![npm version](https://img.shields.io/npm/v/cc-tool.svg)](https://www.npmjs.com/package/cc-tool)
[![downloads](https://img.shields.io/npm/dm/cc-tool.svg)](https://www.npmjs.com/package/cc-tool)
```

### 推广

- 在 README 中添加安装说明
- 发布到社交媒体
- 提交到相关社区

---

## 🚀 快速发布流程

```bash
# 1. 更新版本号
npm version patch  # 或 minor、major

# 2. 更新 CHANGELOG.md
# 手动编辑

# 3. 提交更改（如果使用 git）
git add .
git commit -m "Release v1.3.1"
git push

# 4. 发布到 npm
npm publish

# 5. 创建 git tag（如果使用 git）
git tag v1.3.1
git push --tags
```

---

## 📝 本地测试发布包

在发布前，可以本地测试：

```bash
# 打包
npm pack

# 在另一个目录测试安装
cd /tmp
npm install /Users/lilithgames/Desktop/cc-cli/cc-tool-1.3.0.tgz

# 测试命令
cc

# 清理
npm uninstall -g cc-tool
```
