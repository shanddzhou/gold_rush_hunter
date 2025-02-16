import request from '@/utils/request'

export function checkSystemStatus() {
  return request({
    url: '/system/status',
    method: 'get'
  })
}

export function configureDatabase(data) {
  return request({
    url: '/system/configure-database',
    method: 'post',
    data
  })
}

export function createAdmin(data) {
  return request({
    url: '/system/create-admin',
    method: 'post',
    data
  })
}

export function testDatabase(data) {
  return request({
    url: '/system/test-database',
    method: 'post',
    data
  })
}

export function initializeSystem(data) {
  return request({
    url: '/system/initialize',
    method: 'post',
    data
  })
}

export function getSystemHealth() {
  return request({
    url: '/system/health-check',
    method: 'get'
  })
} 