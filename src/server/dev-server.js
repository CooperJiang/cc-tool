#!/usr/bin/env node

/**
 * 开发环境后端服务器启动脚本
 * 用于本地前端开发时启动后端 API 服务
 * 配合 nodemon 实现热重载
 */

const { startServer } = require('./index');
const { loadConfig } = require('../config/loader');
const chalk = require('chalk');

const config = loadConfig();
const port = config.ports?.webUI || 10099;

console.log(chalk.cyan('\n🔧 开发模式：启动后端 API 服务器...\n'));

(async () => {
  await startServer(port);

  console.log(chalk.yellow('💡 开发提示：'));
  console.log(chalk.gray(`   - 后端 API: http://localhost:${port}/api`));
  console.log(chalk.gray('   - 前端开发服务器: http://localhost:3000'));
  console.log(chalk.gray('   - 修改后端代码会自动重启 (nodemon)'));
  console.log(chalk.gray('   - 按 Ctrl+C 停止服务器\n'));
})();
