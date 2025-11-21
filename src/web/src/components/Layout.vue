<template>
  <div class="layout">
    <!-- Global Header -->
    <header class="header">
      <div class="logo-section" @click="goHome">
        <img src="/logo.png" alt="Coding Tool Logo" class="logo-image" />
        <div class="title-group">
          <h1 class="title-main">Coding-Tool</h1>
          <span class="title-divider">-</span>
          <span class="title-sub">Vibe Coding增强工作助手</span>
        </div>
      </div>

      <div class="header-actions">
        <!-- Proxy Toggle -->
        <n-tooltip placement="bottom" :style="{ maxWidth: '280px' }">
          <template #trigger>
            <div class="proxy-control">
              <span class="proxy-label">动态切换</span>
              <n-switch
                v-model:value="proxyRunning"
                @update:value="toggleProxy"
                :loading="proxyLoading"
                size="medium"
              />
            </div>
          </template>
          <div style="line-height: 1.6;">
            开启后会在本地启动代理服务，让您可以在右侧面板快速切换渠道，无需修改配置文件。
            <br/>
            <span style="color: #f59e0b;">注意：开启期间请勿关闭 CC 进程窗口。</span>
          </div>
        </n-tooltip>

        <!-- Recent Sessions -->
        <HeaderButton
          :icon="ChatbubblesOutline"
          tooltip="最新对话"
          @click="showRecentDrawer = true"
        />

        <!-- Toggle Channels Panel -->
        <HeaderButton
          :icon="ServerOutline"
          :tooltip="showChannels ? '隐藏渠道列表' : '显示渠道列表'"
          :active="showChannels"
          @click="toggleChannels"
        />

        <!-- Toggle Logs Panel -->
        <HeaderButton
          :icon="TerminalOutline"
          :tooltip="!proxyRunning ? '开启动态切换后才能展示实时日志' : (showLogs ? '隐藏实时日志' : '显示实时日志')"
          :active="showLogs && proxyRunning"
          :disabled="!proxyRunning"
          @click="toggleLogs"
        />

        <!-- Help Button -->
        <HeaderButton
          :icon="HelpCircleOutline"
          :icon-size="24"
          tooltip="使用帮助"
          @click="showHelpModal = true"
        />

        <!-- GitHub Link -->
        <HeaderButton
          :icon="LogoGithub"
          tooltip="访问 GitHub 仓库"
          @click="openGithub"
        />
      </div>
    </header>

    <div class="main-container">
      <!-- Global Loading Overlay -->
      <div v-if="globalLoading" class="global-loading-overlay">
        <n-spin size="large">
          <template #description>
            加载配置中...
          </template>
        </n-spin>
      </div>

      <!-- Left Content Area (Router View) - Always mounted -->
      <div class="left-content">
        <router-view />
      </div>

      <!-- Right Panel (Global) - Only show if at least one panel is enabled -->
      <transition name="slide-right">
        <RightPanel
          v-if="showChannels || (showLogs && proxyRunning)"
          :show-channels="showChannels"
          :show-logs="showLogs"
          :proxy-running="proxyRunning"
        />
      </transition>
    </div>

    <!-- Recent Sessions Drawer -->
    <RecentSessionsDrawer v-model:visible="showRecentDrawer" />

    <!-- Help Modal -->
    <n-modal v-model:show="showHelpModal" preset="card" title="CODING-TOOL 使用帮助" style="width: 680px; max-width: 90vw;">
      <div class="help-content">
        <div class="help-section">
          <h4>🚀 快速开始</h4>
          <p>CODING-TOOL 是 Vibe Coding 的增强工作助手，提供智能会话管理、动态渠道切换、全局搜索和实时监控功能。</p>
        </div>

        <div class="help-section">
          <h4>📋 命令行用法</h4>
          <div class="command-list">
            <div class="command-item">
              <code>ct</code>
              <span>启动交互式命令行界面</span>
            </div>
            <div class="command-item">
              <code>ct ui</code>
              <span>启动 Web 可视化界面（推荐）</span>
            </div>
            <div class="command-item">
              <code>ct reset</code>
              <span>重置配置文件到默认状态</span>
            </div>
            <div class="command-item">
              <code>ct proxy start</code>
              <span>启动代理服务</span>
            </div>
            <div class="command-item">
              <code>ct proxy stop</code>
              <span>停止代理服务</span>
            </div>
            <div class="command-item">
              <code>ct status</code>
              <span>查看代理状态</span>
            </div>
            <div class="command-item">
              <code>ct -v</code>
              <span>显示版本号</span>
            </div>
            <div class="command-item">
              <code>ct -h</code>
              <span>显示帮助信息</span>
            </div>
          </div>
        </div>

        <div class="help-section">
          <h4>🎯 Web UI 功能</h4>
          <ul>
            <li><strong>项目管理</strong>：查看所有项目，支持拖拽排序、搜索过滤、删除项目</li>
            <li><strong>会话管理</strong>：查看项目会话列表，支持搜索、Fork、删除、重命名</li>
            <li><strong>快速启动</strong>：点击会话直接在终端中启动 ClaudeCode</li>
            <li><strong>动态切换</strong>：开启后可在右侧面板快速切换 API 渠道，无需修改配置文件</li>
            <li><strong>实时日志</strong>：查看代理请求的实时日志和状态</li>
            <li><strong>全局搜索</strong>：使用 <kbd>⌘/Ctrl</kbd> + <kbd>K</kbd> 在所有项目中搜索对话内容</li>
          </ul>
        </div>

        <div class="help-section">
          <h4>⚡ 动态渠道切换</h4>
          <p>开启「动态切换」后，会在本地启动代理服务。您可以在右侧面板添加多个 API 渠道，快速切换而无需修改配置文件或重启 ClaudeCode。</p>
          <p style="color: #f59e0b; font-size: 13px; margin-top: 8px;">⚠️ 注意：开启期间请勿关闭 CC 进程窗口。</p>
        </div>

        <div class="help-section">
          <h4>🔗 相关链接</h4>
          <div class="link-list">
            <a href="https://github.com/CooperJiang/cc-tool" target="_blank">GitHub 仓库</a>
            <a href="https://github.com/CooperJiang/cc-tool/issues" target="_blank">问题反馈</a>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { NTooltip, NSwitch, NSpin, NModal } from 'naive-ui'
import { ChatbubblesOutline, ServerOutline, TerminalOutline, LogoGithub, HelpCircleOutline } from '@vicons/ionicons5'
import RightPanel from './RightPanel.vue'
import RecentSessionsDrawer from './RecentSessionsDrawer.vue'
import HeaderButton from './HeaderButton.vue'
import api from '../api'
import message from '../utils/message'

const router = useRouter()
const showRecentDrawer = ref(false)
const showHelpModal = ref(false)
const proxyRunning = ref(false)
const proxyLoading = ref(false)
const globalLoading = ref(true) // 全局 loading 状态
let statusCheckInterval = null

// Panel visibility settings (with localStorage persistence)
const showChannels = ref(true)
const showLogs = ref(true)

// Load panel visibility from localStorage
function loadPanelSettings() {
  const saved = localStorage.getItem('cc-panel-visibility')
  if (saved) {
    try {
      const settings = JSON.parse(saved)
      showChannels.value = settings.showChannels !== false // default true
      showLogs.value = settings.showLogs !== false // default true
    } catch (e) {
      // Ignore parse errors
    }
  }
}

// Save panel visibility to localStorage
function savePanelSettings() {
  localStorage.setItem('cc-panel-visibility', JSON.stringify({
    showChannels: showChannels.value,
    showLogs: showLogs.value
  }))
}

// Toggle handlers
function toggleChannels() {
  showChannels.value = !showChannels.value
  savePanelSettings()
}

function toggleLogs() {
  showLogs.value = !showLogs.value
  savePanelSettings()
}

function goHome() {
  router.push({ name: 'projects' })
}

function openGithub() {
  window.open('https://github.com/CooperJiang/cc-tool', '_blank')
}

// 检查代理状态
async function checkProxyStatus(isInitial = false) {
  try {
    const status = await api.getProxyStatus()
    proxyRunning.value = status.proxy.running
  } catch (err) {
    console.error('Failed to check proxy status:', err)
    // 即使失败也要关闭 loading
  } finally {
    // 初次加载完成后关闭全局 loading
    if (isInitial) {
      globalLoading.value = false
    }
  }
}

// 切换代理状态
async function toggleProxy(newValue) {
  proxyLoading.value = true

  // 保存旧值，如果失败需要恢复
  const oldValue = !newValue

  try {
    if (newValue) {
      // 启动代理
      const result = await api.startProxy()
      message.success(`代理已启动，端口: ${result.port}`)

      // 立即更新状态，让日志面板立即显示（不等待后台检查）
      proxyRunning.value = true

      // 自动展示日志面板
      showLogs.value = true
      savePanelSettings()

      // 后台异步检查状态确认，不阻塞 UI
      checkProxyStatus().catch(err => console.error('Background status check failed:', err))
    } else {
      // 停止代理
      await api.stopProxy()
      message.success('代理已停止并恢复配置')

      // 立即更新状态，让日志面板立即隐藏
      proxyRunning.value = false

      // 后台异步检查状态确认
      checkProxyStatus().catch(err => console.error('Background status check failed:', err))
    }
  } catch (err) {
    message.error('操作失败: ' + err.message)
    // 恢复旧值
    proxyRunning.value = oldValue
  } finally {
    proxyLoading.value = false
  }
}

onMounted(() => {
  // 加载面板可见性设置
  loadPanelSettings()

  // 初始检查状态（传入 isInitial = true）
  checkProxyStatus(true)

  // 每30秒检查一次状态（降低请求频率）
  statusCheckInterval = setInterval(() => checkProxyStatus(false), 30000)

  // 添加超时保护，确保 3 秒后无论如何都关闭 loading
  setTimeout(() => {
    if (globalLoading.value) {
      console.warn('Global loading timeout, forcing to hide')
      globalLoading.value = false
    }
  }, 3000)
})

onUnmounted(() => {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval)
  }
})
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
}

.header {
  height: 64px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fffe 50%, #f0fdf4 100%);
  box-shadow: 0 2px 12px rgba(24, 160, 88, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  z-index: 10;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.proxy-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.proxy-label {
  font-size: 13px;
  color: #4b5563;
  font-weight: 600;
  user-select: none;
  letter-spacing: 0.3px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.logo-section:hover {
  opacity: 0.8;
}

.logo-image {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.title-group {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.title-main {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #18a058;
  user-select: none;
  letter-spacing: -0.5px;
}

.title-divider {
  font-size: 18px;
  font-weight: 400;
  color: #d1d5db;
  user-select: none;
}

.title-sub {
  font-size: 15px;
  font-weight: 500;
  color: #6b7280;
  user-select: none;
}

.main-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.global-loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.left-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  transition: all 0.3s ease-out;
}

/* Slide in from right animation */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-right-enter-to,
.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* Help Modal Styles */
.help-content {
  max-height: 65vh;
  overflow-y: auto;
}

.help-section {
  margin-bottom: 20px;
}

.help-section:last-child {
  margin-bottom: 0;
}

.help-section h4 {
  margin: 0 0 10px 0;
  font-size: 15px;
  font-weight: 700;
  color: #1f2937;
}

.help-section p {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: #4b5563;
}

.help-section ul {
  margin: 0;
  padding-left: 20px;
}

.help-section li {
  font-size: 13px;
  line-height: 1.8;
  color: #4b5563;
}

.help-section li strong {
  color: #1f2937;
}

.command-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.command-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
}

.command-item code {
  min-width: 140px;
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 12px;
  font-weight: 600;
  color: #18a058;
  background: #f0fdf4;
  padding: 4px 8px;
  border-radius: 4px;
}

.command-item span {
  font-size: 13px;
  color: #4b5563;
}

.help-section kbd {
  display: inline-block;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 11px;
  color: #666;
  background-color: #f5f5f5;
  border: 1px solid #d0d0d0;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}

.link-list {
  display: flex;
  gap: 16px;
}

.link-list a {
  font-size: 13px;
  color: #18a058;
  text-decoration: none;
  transition: color 0.2s;
}

.link-list a:hover {
  color: #16a34a;
  text-decoration: underline;
}
</style>
