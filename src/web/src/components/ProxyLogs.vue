<template>
  <div class="proxy-logs">
    <div class="logs-header">
      <h3 class="title">实时日志</h3>
      <n-button text size="small" @click="clearLogs">
        <n-icon size="16"><TrashOutline /></n-icon>
        清空
      </n-button>
    </div>

    <div class="logs-table">
      <!-- 表头 -->
      <div class="table-header">
        <div class="col col-channel">渠道</div>
        <div class="col col-token">请求</div>
        <div class="col col-token">回复</div>
        <div class="col col-token">写入</div>
        <div class="col col-token">命中</div>
        <div class="col col-time">时间</div>
      </div>

      <!-- 内容区域（可滚动） -->
      <div class="table-body" ref="tableBody">
        <div v-if="logs.length === 0" class="empty-state">
          暂无日志
        </div>

        <!-- 行为日志 - 占一整行 -->
        <div
          v-for="log in logs"
          :key="log.id"
          :class="log.type === 'action' ? 'action-row' : 'table-row'"
        >
          <!-- 行为日志样式 -->
          <template v-if="log.type === 'action'">
            <n-icon size="16" style="color: #18a058; margin-right: 8px;">
              <CheckmarkCircle />
            </n-icon>
            <span class="action-message">{{ log.message }}</span>
            <span class="action-time">{{ log.time }}</span>
          </template>

          <!-- 普通日志样式 -->
          <template v-else>
            <n-tooltip placement="top" :style="{ maxWidth: '300px' }">
              <template #trigger>
                <div class="table-row-content">
                  <div class="col col-channel" :title="log.channel">
                    <n-tag size="small" type="success">{{ log.channel }}</n-tag>
                  </div>
                  <div class="col col-token">{{ log.inputTokens }}</div>
                  <div class="col col-token">{{ log.outputTokens }}</div>
                  <div class="col col-token">{{ log.cacheCreation }}</div>
                  <div class="col col-token">{{ log.cacheRead }}</div>
                  <div class="col col-time">{{ log.time }}</div>
                </div>
              </template>
              <div v-if="log.model">
                <div style="font-weight: 600; margin-bottom: 4px;">模型信息</div>
                <div style="font-family: monospace; font-size: 12px;">{{ log.model }}</div>
              </div>
              <div v-else>暂无模型信息</div>
            </n-tooltip>
          </template>
        </div>
      </div>
    </div>

    <div class="logs-footer">
      <span class="status" :class="{ connected: wsConnected }">
        <n-icon size="14">
          <component :is="wsConnected ? CheckmarkCircle : CloseCircle" />
        </n-icon>
        {{ wsConnected ? '已连接' : '未连接' }}
      </span>
      <span class="count">共 {{ logs.length }} 条</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { NButton, NIcon, NTag, NTooltip } from 'naive-ui'
import { TrashOutline, CheckmarkCircle, CloseCircle } from '@vicons/ionicons5'
import api from '../api'
import message from '../utils/message'

const logs = ref([])
const wsConnected = ref(false)
const tableBody = ref(null)
let ws = null
let isInitialConnection = true // 标记是否是初次连接
let reconnectAttempts = 0 // 重连尝试次数
const MAX_RECONNECT_ATTEMPTS = 3 // 最大重连次数
let reconnectTimer = null // 重连定时器
let isConnecting = false // 是否正在连接中

// 连接 WebSocket
function connectWebSocket() {
  // 避免重复连接
  if (isConnecting || (ws && ws.readyState === WebSocket.CONNECTING)) {
    return
  }

  // 如果已有连接且是打开状态，直接返回
  if (ws && ws.readyState === WebSocket.OPEN) {
    return
  }

  // 如果已有连接但未完全关闭，先关闭
  if (ws && ws.readyState !== WebSocket.CLOSED) {
    try {
      ws.close()
    } catch (err) {
      // 忽略关闭错误
    }
    ws = null
  }

  try {
    isConnecting = true

    // 根据当前环境构建 WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = window.location.host
    const wsUrl = `${protocol}//${host}/ws`

    ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      wsConnected.value = true
      isConnecting = false
      reconnectAttempts = 0 // 重置重连次数

      // 初次连接时清空日志，准备接收历史日志
      if (isInitialConnection) {
        logs.value = []
        isInitialConnection = false
      }
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        // 格式化时间
        const time = new Date(data.timestamp || Date.now()).toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })

        // 添加唯一 ID
        const log = {
          ...data,
          id: `${Date.now()}-${Math.random()}`,
          time
        }

        logs.value.push(log)

        // 限制日志数量（最多保留 100 条）
        if (logs.value.length > 100) {
          logs.value.shift()
        }

        // 自动滚动到底部，确保最后一条完全可见
        nextTick(() => {
          if (tableBody.value) {
            // 立即滚动到底部，确保新日志可见
            tableBody.value.scrollTop = tableBody.value.scrollHeight
          }
        })
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err)
      }
    }

    ws.onerror = (error) => {
      // 不要打印错误，避免控制台刷屏
      wsConnected.value = false
      isConnecting = false
    }

    ws.onclose = () => {
      wsConnected.value = false
      isConnecting = false

      // 清除之前的重连定时器
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }

      // 限制重连次数，避免无限重连
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++

        // 延迟重连，时间递增（5秒、10秒、15秒）
        const delay = reconnectAttempts * 5000
        reconnectTimer = setTimeout(() => {
          if (!wsConnected.value) {
            connectWebSocket()
          }
        }, delay)
      }
    }
  } catch (err) {
    console.error('Failed to connect WebSocket:', err)
    isConnecting = false
    wsConnected.value = false
  }
}

// 清空日志
async function clearLogs() {
  try {
    await api.clearProxyLogs()
    logs.value = []
    message.success('日志已清空')
  } catch (err) {
    message.error('清空失败: ' + err.message)
  }
}

// 重置连接（可在代理开启时调用）
function resetConnection() {
  reconnectAttempts = 0
  if (!wsConnected.value) {
    connectWebSocket()
  }
}

onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  // 清除重连定时器
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  // 关闭 WebSocket 连接
  if (ws) {
    ws.close()
    ws = null
  }

  // 重置状态
  isConnecting = false
  wsConnected.value = false
})

// 暴露给父组件
defineExpose({
  resetConnection
})
</script>

<style scoped>
.proxy-logs {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
}

.logs-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #18181b;
}

.logs-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-header {
  flex-shrink: 0;
  display: flex;
  padding: 8px 12px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
}

.table-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 40px;
  scroll-padding-bottom: 40px;
}

.table-row {
  display: flex;
  padding: 8px 12px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 12px;
  transition: background-color 0.2s;
  cursor: pointer;
}

.table-row:hover {
  background: #f9fafb;
}

.table-row-content {
  display: flex;
  width: 100%;
}

/* 行为日志样式 */
.action-row {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #f3f4f6;
  background: #f0fdf4;
  font-size: 13px;
  color: #166534;
  border-left: 3px solid #18a058;
}

.action-message {
  flex: 1;
  font-weight: 500;
}

.action-time {
  font-size: 11px;
  font-family: monospace;
  color: #6b7280;
  margin-left: 12px;
  margin-right: 7px;
}

.col {
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-channel {
  flex: 0 0 120px;
  min-width: 0;
  overflow: hidden;
}

.col-channel .n-tag {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-token {
  flex: 0 0 65px;
  justify-content: center;
  min-width: 0;
}

.col-time {
  flex: 0 0 70px;
  min-width: 0;
  font-family: monospace;
  font-size: 11px;
  justify-content: flex-end;
}

.empty-state {
  padding: 40px 16px;
  text-align: center;
  font-size: 13px;
  color: #9ca3af;
}

.logs-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-top: 1px solid #e5e7eb;
  font-size: 12px;
  color: #6b7280;
}

.status {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ef4444;
}

.status.connected {
  color: #10b981;
}

.count {
  color: #6b7280;
}
</style>
