import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data: {
      username: data.username,
      password: data.password,
      email: data.email,
      phone: data.phone,
      invite_code: data.invite_code
    }
  })
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get'
  })
} 