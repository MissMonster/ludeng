import request from '@/utils/request'

// 查询区域列表
export function areaSetList(query) {
    return request({
      url: '/api/v1/areaSetList',
      method: 'get',
      params: query
    })
}

// 查看区域详情
export function areaSetInfo(id) {
  return request({
      url: '/api/v1/areaSetInfo?id=' + id,
      method: 'get'
  })
}

// 新增区域
export function addAreaSet(data) {
  return request({
      url: '/api/v1/addAreaSet',
      method: 'post',
      data
  })
}

// 修改区域
export function editAreaSet(data) {
  return request({
      url: '/api/v1/editAreaSet',
      method: 'put',
      data
  })
}

// 删除区域
export function delAreaSet(id) {
  return request({
      url: '/api/v1/delAreaSet',
      method: 'delete',
      data:{
          id:id
      }
  })
}

// 查询国
export function queryCountry() {
  return request({
    url: '/api/v1/queryCountry',
    method: 'get'
  })
}

// 查询省
export function queryProvince(data) {
  return request({
      url: '/api/v1/queryProvince',
      method: 'post',
      data
  })
}

// 查询市
export function queryCity(data) {
  return request({
      url: '/api/v1/queryCity',
      method: 'post',
      data
  })
}

// 查询区
export function queryCounty(data) {
  return request({
      url: '/api/v1/queryCounty',
      method: 'post',
      data
  })
}

// 查询省镇
export function queryTown(data) {
  return request({
      url: '/api/v1/queryTown',
      method: 'post',
      data
  })
}