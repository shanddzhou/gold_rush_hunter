/**
 * 格式化日期时间
 * @param {string|Date} date - 日期字符串或Date对象
 * @param {boolean} [withTime=true] - 是否包含时间
 * @returns {string} 格式化后的日期时间字符串
 */
export function formatDate(date, withTime = true) {
  if (!date) return '-'
  
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return '-'
    
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    
    if (!withTime) {
      return `${year}-${month}-${day}`
    }
    
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('Date format error:', error)
    return '-'
  }
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}

/**
 * 格式化数字（添加千分位）
 * @param {number} num - 数字
 * @param {number} [decimals=2] - 小数位数
 * @returns {string} 格式化后的数字
 */
export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined) return '-'
  
  try {
    return Number(num).toLocaleString('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  } catch (error) {
    console.error('Number format error:', error)
    return '-'
  }
}

/**
 * 格式化百分比
 * @param {number} num - 数字
 * @param {number} [decimals=2] - 小数位数
 * @returns {string} 格式化后的百分比
 */
export function formatPercent(num, decimals = 2) {
  if (num === null || num === undefined) return '-'
  
  try {
    return `${(num * 100).toFixed(decimals)}%`
  } catch (error) {
    console.error('Percent format error:', error)
    return '-'
  }
}

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {string} [currency='CNY'] - 货币代码
 * @returns {string} 格式化后的金额
 */
export function formatMoney(amount, currency = 'CNY') {
  if (amount === null || amount === undefined) return '-'
  
  try {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency
    }).format(amount)
  } catch (error) {
    console.error('Money format error:', error)
    return '-'
  }
}

/**
 * 格式化时间间隔
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间间隔
 */
export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '-'
  
  try {
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)
    const remainingSeconds = seconds % 60
    
    const parts = []
    if (days > 0) parts.push(`${days}天`)
    if (hours > 0) parts.push(`${hours}小时`)
    if (minutes > 0) parts.push(`${minutes}分钟`)
    if (remainingSeconds > 0) parts.push(`${remainingSeconds}秒`)
    
    return parts.join(' ') || '0秒'
  } catch (error) {
    console.error('Duration format error:', error)
    return '-'
  }
}

/**
 * 格式化状态
 * @param {string} status - 状态值
 * @param {Object} statusMap - 状态映射
 * @returns {Object} 格式化后的状态对象
 */
export function formatStatus(status, statusMap = {}) {
  const defaultStatusMap = {
    active: { text: '正常', type: 'success' },
    inactive: { text: '禁用', type: 'info' },
    pending: { text: '待处理', type: 'warning' },
    processing: { text: '处理中', type: 'primary' },
    completed: { text: '已完成', type: 'success' },
    failed: { text: '失败', type: 'danger' },
    deleted: { text: '已删除', type: 'info' },
    ...statusMap
  }
  
  return defaultStatusMap[status] || { text: status, type: 'info' }
}

/**
 * 格式化地址
 * @param {Object} address - 地址对象
 * @returns {string} 格式化后的地址字符串
 */
export function formatAddress(address) {
  if (!address) return '-'
  
  try {
    const parts = []
    if (address.province) parts.push(address.province)
    if (address.city) parts.push(address.city)
    if (address.district) parts.push(address.district)
    if (address.street) parts.push(address.street)
    if (address.detail) parts.push(address.detail)
    
    return parts.join(' ') || '-'
  } catch (error) {
    console.error('Address format error:', error)
    return '-'
  }
}

/**
 * 格式化手机号
 * @param {string} phone - 手机号
 * @param {boolean} [mask=true] - 是否掩码处理
 * @returns {string} 格式化后的手机号
 */
export function formatPhone(phone, mask = true) {
  if (!phone) return '-'
  
  try {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length !== 11) return phone
    
    if (mask) {
      return cleaned.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
    
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
  } catch (error) {
    console.error('Phone format error:', error)
    return phone
  }
}

/**
 * 格式化身份证号
 * @param {string} idCard - 身份证号
 * @param {boolean} [mask=true] - 是否掩码处理
 * @returns {string} 格式化后的身份证号
 */
export function formatIdCard(idCard, mask = true) {
  if (!idCard) return '-'
  
  try {
    const cleaned = idCard.replace(/\s/g, '')
    if (cleaned.length !== 18) return idCard
    
    if (mask) {
      return cleaned.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
    }
    
    return cleaned.replace(/(\d{6})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4')
  } catch (error) {
    console.error('ID card format error:', error)
    return idCard
  }
}

/**
 * 格式化银行卡号
 * @param {string} cardNo - 银行卡号
 * @param {boolean} [mask=true] - 是否掩码处理
 * @returns {string} 格式化后的银行卡号
 */
export function formatBankCard(cardNo, mask = true) {
  if (!cardNo) return '-'
  
  try {
    const cleaned = cardNo.replace(/\s/g, '')
    if (cleaned.length < 16) return cardNo
    
    if (mask) {
      return cleaned.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2')
    }
    
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  } catch (error) {
    console.error('Bank card format error:', error)
    return cardNo
  }
}

/**
 * 格式化文件名
 * @param {string} filename - 文件名
 * @param {number} [maxLength=20] - 最大长度
 * @returns {string} 格式化后的文件名
 */
export function formatFilename(filename, maxLength = 20) {
  if (!filename) return '-'
  
  try {
    if (filename.length <= maxLength) return filename
    
    const ext = filename.split('.').pop()
    const name = filename.substring(0, filename.length - ext.length - 1)
    const half = Math.floor((maxLength - 5) / 2)
    
    return `${name.substring(0, half)}...${name.slice(-half)}.${ext}`
  } catch (error) {
    console.error('Filename format error:', error)
    return filename
  }
} 