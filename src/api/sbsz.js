import request from '@/utils/request'


// 获取设备列表
export function terminalList(query) {
    return request({
        url: '/api/v1/terminalList',
        method: 'get',
        params: query
    })
}

// 手动详情
export function queryManautoData(terminalId) {
    return request({
        url: '/api/v1/queryManautoData/' + terminalId,
        method: 'get'
    })
}

// 发送手动指令
export function sendManautoSet(terminalId,data) {
    return request({
        url: '/api/v1/sendManautoSet/' + terminalId,
        method: 'post',
        data
    })
}

// 恢复自动运行
export function sendManautoRecover(terminalId) {
    return request({
        url: '/api/v1/sendManautoRecover/' + terminalId,
        method: 'get'
    })
}

// 获取时间
export function queryTimeSet(terminalId) {
    return request({
        url: '/api/v1/queryTimeSet/' + terminalId,
        method: 'get'
    })
}

// 获取地址位置
export function queryGmtSet(terminalId) {
    return request({
        url: '/api/v1/queryGmtSet/' + terminalId,
        method: 'get'
    })
}

// 开关时间设置
export function queryRelaySet(terminalId) {
    return request({
        url: '/api/v1/queryRelaySet/' + terminalId,
        method: 'get'
    })
}

// 漏电保护设置
export function queryLeakageInfo(terminalId) {
    return request({
        url: '/api/v1/queryLeakageInfo/' + terminalId,
        method: 'get'
    })
}