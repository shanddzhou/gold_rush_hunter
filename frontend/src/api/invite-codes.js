import request from '@/utils/request'

export function getInviteCodes() {
  return request({
    url: '/invite-codes',
    method: 'get'
  })
}

export function generateInviteCode(data) {
  return request({
    url: '/invite-codes/generate',
    method: 'post',
    data
  })
}

export function deleteInviteCode(id) {
  return request({
    url: `/invite-codes/${id}`,
    method: 'delete'
  })
} 