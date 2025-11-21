#!/usr/bin/env node

/**
 * CC-CLI - Claude Code 会话管理工具
 * 主入口文件
 */

const { loadConfig } = require('./config/loader');
const { showMainMenu } = require('./ui/menu');
const { handleList } = require('./commands/list');
const { handleSearch } = require('./commands/search');
const { switchProject } = require('./commands/switch');
const { handleUI } = require('./commands/ui');
const { handleProxyStart, handleProxyStop, handleProxyStatus } = require('./commands/proxy');
const { resetConfig } = require('./reset-config');
const { handleSwitchChannel, handleAddChannel } = require('./commands/channels');
const { handleToggleProxy } = require('./commands/toggle-proxy');
const { handlePortConfig } = require('./commands/port-config');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

// 读取版本号
function getVersion() {
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  return packageJson.version;
}

// 显示帮助信息
function showHelp() {
  const version = getVersion();
  console.log(chalk.cyan.bold(`\nCODING-TOOL v${version}`));
  console.log(chalk.gray('Vibe Coding 增强工作助手 - 智能会话管理、动态渠道切换、全局搜索、实时监控\n'));

  console.log(chalk.yellow('使用方法:'));
  console.log('  ct                  启动交互式命令行界面');
  console.log('  ct ui               启动 Web 可视化界面（推荐）');
  console.log('  ct reset            重置配置文件');
  console.log('  ct proxy [start]    启动代理服务');
  console.log('  ct proxy stop       停止代理服务');
  console.log('  ct proxy status     查看代理状态');
  console.log('  ct status           查看代理状态（快捷方式）');
  console.log('  ct --version, -v    显示版本号');
  console.log('  ct --help, -h       显示帮助信息\n');

  console.log(chalk.yellow('示例:'));
  console.log(chalk.gray('  $ ct ui              # 启动 Web UI'));
  console.log(chalk.gray('  $ ct                 # 启动交互式命令行'));
  console.log(chalk.gray('  $ ct reset           # 重置配置\n'));

  console.log(chalk.yellow('更多信息:'));
  console.log(chalk.gray('  官网: https://github.com/CooperJiang/cc-tool'));
  console.log(chalk.gray('  问题: https://github.com/CooperJiang/cc-tool/issues\n'));
}

// 全局错误处理
process.on('uncaughtException', (err) => {
  // 忽略终端相关的错误（通常在 Ctrl+C 时发生）
  if (err.code === 'EIO' || err.code === 'ENOTTY' || err.code === 'EPIPE') {
    process.exit(0);
  }
  throw err;
});

// 处理 SIGINT 信号（Ctrl+C）
process.on('SIGINT', () => {
  process.exit(0);
});

/**
 * 主函数
 */
async function main() {
  // 处理命令行参数
  const args = process.argv.slice(2);

  // --version 或 -v - 显示版本号
  if (args[0] === '--version' || args[0] === '-v') {
    console.log(getVersion());
    return;
  }

  // --help 或 -h - 显示帮助信息
  if (args[0] === '--help' || args[0] === '-h') {
    showHelp();
    return;
  }

  // reset 命令 - 恢复默认配置
  if (args[0] === 'reset') {
    await resetConfig();
    return;
  }

  // ui 命令 - 快捷启动 Web UI
  if (args[0] === 'ui') {
    await handleUI();
    return;
  }

  // status 命令 - 快捷方式
  if (args[0] === 'status') {
    handleProxyStatus();
    return;
  }

  // 代理命令
  if (args[0] === 'proxy') {
    const subCommand = args[1] || 'start';

    switch (subCommand) {
      case 'start':
        await handleProxyStart();
        return;

      case 'stop':
        await handleProxyStop();
        return;

      case 'status':
        handleProxyStatus();
        return;

      default:
        // 默认执行 start
        await handleProxyStart();
        return;
    }
  }

  // 加载配置
  let config = loadConfig();

  while (true) {
    // 显示主菜单
    const action = await showMainMenu(config);

    switch (action) {
      case 'list':
        await handleList(config, async () => {
          const switched = await switchProject(config);
          if (switched) {
            // 重新加载配置以获取最新的项目设置
            config = loadConfig();
          }
          return switched;
        }, true); // crossProject = true，跨项目显示最近会话
        break;

      case 'search':
        await handleSearch(config, async () => {
          const switched = await switchProject(config);
          if (switched) {
            config = loadConfig();
          }
          return switched;
        });
        break;

      case 'switch':
        const switched = await switchProject(config);
        if (switched) {
          config = loadConfig();
          // 切换成功后自动进入会话列表
          await handleList(config, async () => {
            const switched = await switchProject(config);
            if (switched) {
              config = loadConfig();
            }
            return switched;
          });
        }
        break;

      case 'switch-channel':
        await handleSwitchChannel();
        break;

      case 'toggle-proxy':
        await handleToggleProxy();
        break;

      case 'add-channel':
        await handleAddChannel();
        break;

      case 'ui':
        await handleUI();
        break;

      case 'port-config':
        await handlePortConfig();
        break;

      case 'reset':
        await resetConfig();
        break;

      case 'exit':
        console.log('\n👋 再见！\n');
        process.exit(0);
        break;

      default:
        console.log('未知操作');
        break;
    }
  }
}

// 启动应用
main().catch((error) => {
  console.error('程序出错:', error);
  process.exit(1);
});
