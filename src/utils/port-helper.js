const { execSync } = require('child_process');
const net = require('net');

/**
 * 检查端口是否被占用
 */
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(false);
    });

    server.listen(port);
  });
}

/**
 * 查找占用端口的进程PID
 */
function findProcessByPort(port) {
  try {
    // macOS/Linux 使用 lsof
    const result = execSync(`lsof -ti :${port}`, { encoding: 'utf-8' }).trim();
    return result.split('\n').filter(pid => pid);
  } catch (err) {
    // 如果 lsof 失败，尝试使用其他命令
    try {
      // 适用于某些 Linux 系统
      const result = execSync(`fuser ${port}/tcp 2>/dev/null`, { encoding: 'utf-8' }).trim();
      return result.split(/\s+/).filter(pid => pid);
    } catch (e) {
      return [];
    }
  }
}

/**
 * 杀掉占用端口的进程
 */
function killProcessByPort(port) {
  try {
    const pids = findProcessByPort(port);
    if (pids.length === 0) {
      return false;
    }

    pids.forEach(pid => {
      try {
        execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
      } catch (err) {
        // 忽略单个进程杀掉失败的错误
      }
    });

    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 等待端口释放
 */
async function waitForPortRelease(port, timeout = 3000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const inUse = await isPortInUse(port);
    if (!inUse) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return false;
}

module.exports = {
  isPortInUse,
  findProcessByPort,
  killProcessByPort,
  waitForPortRelease
};
