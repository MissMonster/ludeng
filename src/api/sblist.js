import request from '@/utils/request'


// 获取设备列表
export function terminalList(query) {
    return request({
        url: '/api/v1/terminalList',
        method: 'get',
        params: query
    })
}

// 查看设备详情
export function terminalInfo(id) {
    return request({
        url: '/api/v1/terminalInfo?id=' + id,
        method: 'get',
        params:id
    })
}

// 新增设备
export function addterminal(data) {
    return request({
        url: '/api/v1/addterminal',
        method: 'post',
        data
    })
}

// 修改设备
export function editterminal(data) {
    return request({
        url: '/api/v1/editterminal',
        method: 'put',
        data
    })
}

// 删除设备
export function delterminal(id) {
    return request({
        url: '/api/v1/delterminal',
        method: 'delete',
        data:{
            id:id
        }
    })
}


// 获取招测列表
export function heartList(query) {
    return request({
        url: '/api/v1/heartList',
        method: 'get',
        params: query
    })
}

// 数据下发
export function sendHeartByTerminalId(terminalId) {
    return request({
      url: '/api/v1/sendHeartByTerminalId/'+terminalId,
      method: 'get'
    })
  }


  // 查看招测详情
export function heartInfo(id) {
    return request({
        url: '/api/v1/heartInfo?terminalId=' + id,
        method: 'get'
    })
}