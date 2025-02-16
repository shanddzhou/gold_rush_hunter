import request from '@/utils/request'

export function getUsers() {
  return request({
    url: '/users',
    method: 'get'
  })
}

export function updateUser(id, data) {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  })
}

export function toggleUserStatus(id) {
  return request({
    url: `/users/${id}/toggle-status`,
    method: 'post'
  })
}

export function resetUserPassword(id) {
  return request({
    url: `/users/${id}/reset-password`,
    method: 'post'
  })
}

export function getCurrentUser() {
  return request({
    url: '/users/me',
    method: 'get'
  })
}

export function updateProfile(data) {
  return request({
    url: '/users/profile',
    method: 'put',
    data
  })
}

export function changePassword(data) {
  return request({
    url: '/users/password',
    method: 'put',
    data
  })
} 