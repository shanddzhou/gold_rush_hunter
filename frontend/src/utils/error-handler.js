import { ElMessage } from 'element-plus'
import logger from './logger'

// 错误类型定义
const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  SERVER: 'SERVER_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  BUSINESS: 'BUSINESS_ERROR'
}

// 错误处理类
class ErrorHandler {
  constructor() {
    this.errorMessages = {
      [ErrorTypes.NETWORK]: '网络连接失败，请检查网络设置',
      [ErrorTypes.SERVER]: '服务器错误，请稍后重试',
      [ErrorTypes.AUTH]: '认证失败，请重新登录',
      [ErrorTypes.VALIDATION]: '输入数据验证失败',
      [ErrorTypes.BUSINESS]: '操作失败'
    }
  }

  // 处理错误
  handle(error, context = '') {
    // 记录错误
    logger.error('Error occurred', {
      context,
      error: this._formatError(error)
    })

    // 获取错误类型
    const errorType = this._getErrorType(error)
    
    // 获取错误消息
    const message = this._getErrorMessage(error, errorType)
    
    // 显示错误消息
    if (!error.config?.disableErrorMessage) {
      ElMessage.error(message)
    }

    // 特殊错误处理
    this._handleSpecialErrors(error, errorType)

    return {
      type: errorType,
      message
    }
  }

  // 格式化错误信息
  _formatError(error) {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    }
    return error
  }

  // 获取错误类型
  _getErrorType(error) {
    if (!error.response) {
      return ErrorTypes.NETWORK
    }

    const status = error.response.status
    if (status >= 500) {
      return ErrorTypes.SERVER
    }
    if (status === 401 || status === 403) {
      return ErrorTypes.AUTH
    }
    if (status === 422) {
      return ErrorTypes.VALIDATION
    }
    return ErrorTypes.BUSINESS
  }

  // 获取错误消息
  _getErrorMessage(error, type) {
    // 优先使用后端返回的错误消息
    if (error.response?.data?.message) {
      return error.response.data.message
    }

    // 使用预定义的错误消息
    return this.errorMessages[type]
  }

  // 处理特殊错误
  _handleSpecialErrors(error, type) {
    // 处理认证错误
    if (type === ErrorTypes.AUTH) {
      // 清除登录状态
      localStorage.removeItem('token')
      // 跳转到登录页
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
  }
}

export default new ErrorHandler() 