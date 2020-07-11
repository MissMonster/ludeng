import request from '@/utils/request'

// 查询用户列表
export function strategySetList(query) {
    return request({
      url: '/api/v1/strategySetList',
      method: 'get',
      params: query
    })
}

// 查询用户详细
export function strategySetInfo(id) {
    return request({
      url: '/api/v1/strategySetInfo?id=' + id,
      method: 'get'
    })
}