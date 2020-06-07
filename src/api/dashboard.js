import request from '@/utils/request'


// 获取首页地图数据
export function getMapdata() {
  return request({
    url: '/api/v1/terminalList',
    method: 'get'
  })
}
// 获取设备详情
export function heartData(id) {
  return request({
    url: '/api/v1/heartData?id='+id,
    method: 'get'
  })
}
