import request from '@/utils/request'


// 获取首页地图数据
export function getMapdata() {
  return request({
    url: '/api/v1/terminalList',
    method: 'get'
  })
}
