import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/users/me',
    method: 'get'
  })
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
} 