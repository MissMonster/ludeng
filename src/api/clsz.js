import request from '@/utils/request'

// 查询策略列表
export function strategySetList(query) {
    return request({
      url: '/api/v1/strategySetList',
      method: 'get',
      params: query
    })
}

// 查询策略详细
export function strategySetInfo(id,attribute) {
    return request({
      url: '/api/v1/strategySetInfo?id=' + id + '&attribute=' + attribute,
      method: 'get'
    })
}


// 新增策略
export function addStrategySet(data) {
  return request({
      url: '/api/v1/addStrategySet',
      method: 'post',
      data
  })
}

// 修改策略
export function editStrategySet(data) {
  return request({
      url: '/api/v1/editStrategySet',
      method: 'put',
      data
  })
}

// 删除策略
export function delStrategySet(id) {
  return request({
      url: '/api/v1/delStrategySet',
      method: 'delete',
      data:{
          id:id
      }
  })
}