import request from '@/utils/request'

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

export function uploadAvatar(file) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url: '/users/avatar',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}