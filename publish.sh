#!/bin/bash

# CODING-TOOL 发布脚本

echo "📦 开始发布 CODING-TOOL v1.0.0..."

# 1. 构建前端
echo ""
echo "🔨 步骤 1/4: 构建前端..."
npm run build:web
if [ $? -ne 0 ]; then
  echo "❌ 前端构建失败！"
  exit 1
fi

# 2. 检查要发布的文件
echo ""
echo "📋 步骤 2/4: 检查打包文件..."
npm pack --dry-run

# 3. 确认发布
echo ""
read -p "📤 步骤 3/4: 确认发布到 npm？(y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ 发布已取消"
  exit 1
fi

# 4. 发布
echo ""
echo "🚀 步骤 4/4: 发布到 npm..."
npm publish

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ 发布成功！"
  echo ""
  echo "📖 接下来："
  echo "   1. 访问 https://www.npmjs.com/package/coding-tool 查看"
  echo "   2. 测试安装: npm install -g coding-tool"
  echo "   3. 运行测试: ct ui"
else
  echo ""
  echo "❌ 发布失败！请检查错误信息"
  exit 1
fi
