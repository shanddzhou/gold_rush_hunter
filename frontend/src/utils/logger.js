const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
}

class Logger {
  constructor() {
    this.level = LOG_LEVELS.INFO
    this.logs = []
    this.maxLogs = 1000
    this.errorCache = new Set() // 用于去重错误
    this.errorCacheTimeout = 5000 // 错误缓存时间（毫秒）
  }

  setLevel(level) {
    this.level = LOG_LEVELS[level] || LOG_LEVELS.INFO
  }

  _formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString()
    return {
      timestamp,
      level,
      message: this._formatArgs(message, ...args)
    }
  }

  _formatArgs(message, ...args) {
    if (args.length === 0) return message
    
    if (message instanceof Error) {
      return {
        name: message.name,
        message: message.message,
        stack: message.stack
      }
    }
    
    return typeof message === 'object' ? { ...message } : { message, details: args[0] }
  }

  _shouldLogError(error) {
    const errorKey = `${error.name}:${error.message}`
    if (this.errorCache.has(errorKey)) {
      return false
    }
    
    // 添加到缓存并设置超时删除
    this.errorCache.add(errorKey)
    setTimeout(() => {
      this.errorCache.delete(errorKey)
    }, this.errorCacheTimeout)
    
    return true
  }

  _log(level, message, ...args) {
    // 错误去重处理
    if (level === 'ERROR' && message instanceof Error) {
      if (!this._shouldLogError(message)) {
        return null
      }
    }

    const logData = this._formatMessage(level, message, ...args)
    
    // 保存日志
    this.logs.push(logData)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }
    
    // 开发环境下在控制台输出
    if (process.env.NODE_ENV !== 'production') {
      const { timestamp, level, message } = logData
      const prefix = `[${timestamp}] ${level}:`
      
      switch (level) {
        case 'ERROR':
          console.error(prefix, message)
          break
        case 'WARN':
          console.warn(prefix, message)
          break
        case 'INFO':
          console.info(prefix, message)
          break
        default:
          console.log(prefix, message)
      }
    }

    return logData
  }

  debug(message, ...args) {
    return this._log('DEBUG', message, ...args)
  }

  info(message, ...args) {
    return this._log('INFO', message, ...args)
  }

  warn(message, ...args) {
    return this._log('WARN', message, ...args)
  }

  error(message, ...args) {
    return this._log('ERROR', message, ...args)
  }

  // 获取所有日志
  getLogs() {
    return [...this.logs]
  }

  // 清除日志
  clearLogs() {
    this.logs = []
  }
}

// 基础日志记录函数
const logMessage = (level, message, ...args) => {
  if (process.env.NODE_ENV !== 'production') {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] ${level}:`
    
    switch (level) {
      case 'ERROR':
        console.error(prefix, message, ...args)
        break
      case 'WARN':
        console.warn(prefix, message, ...args)
        break
      case 'INFO':
        console.info(prefix, message, ...args)
        break
      default:
        console.log(prefix, message, ...args)
    }
  }
}

// 只记录错误，不显示提示
const logError = (error, context = '') => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${context}]`, error)
  }
}

// 记录错误并显示提示
const logAndShowError = async (error, context = '') => {
  logError(error, context)
  
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  return '操作失败，请稍后重试'
}

export default new Logger() 