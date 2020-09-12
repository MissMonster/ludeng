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

// 键盘锁
export function sendLock(data) {
    return request({
        url: '/api/v1/sendLock',
        method: 'post',
        data
    })
}

// 获取时间
export function queryTimeSet(terminalId) {
    return request({
        url: '/api/v1/queryTimeSet/' + terminalId,
        method: 'get'
    })
}

// 同步时间
export function sendTimeSet(terminalId) {
    return request({
        url: '/api/v1/sendTimeSet/' + terminalId,
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
// 设置 地理位置
export function sendGmtSet(data) {
    return request({
        url: '/api/v1/sendGmtSet',
        method: 'post',
        data
    })
}


// 开关时间设置
export function queryRelaySet(terminalId) {
    return request({
        url: '/api/v1/queryRelaySet/' + terminalId,
        method: 'get'
    })
}
// 开关时间设置
export function sendRelaySet(data) {
    return request({
        url: '/api/v1/sendRelaySet',
        method: 'post',
        data
    })
}
// 初始化设置
export function sendInitSet(data) {
    return request({
        url: '/api/v1/sendInitSet',
        method: 'post',
        data
    })
}

//  电流电压及策略设置
export function queryElectricitySetInfo(id) {
    return request({
        url: '/api/v1/queryElectricitySetInfo?id=' + id,
        method: 'get'
    })
}
export function editElectricitySet(data) {
    return request({
        url: '/api/v1/editElectricitySet',
        method: 'post',
        data
    })
}




// 漏电保护设置
export function queryLeakageInfo(terminalId) {
    return request({
        url: '/api/v1/queryLeakageInfo/' + terminalId,
        method: 'get'
    })
}

export function sendLeakageInfo(data) {
    return request({
        url: '/api/v1/sendLeakageInfo',
        method: 'post',
        data
    })
}
//过流保护及策略设置
export function queryOverCurrentData(terminalId) {
    return request({
        url: '/api/v1/queryOverCurrentData/' + terminalId,
        method: 'get'
    })
}
export function sendOverCurrent(data) {
    return request({
        url: '/api/v1/sendOverCurrent',
        method: 'POST',
        data
    })
}







// 告警配置
export function queryAlarmSetInfo(terminalId) {
    return request({
        url: '/api/v1/queryAlarmSetInfo?terminalId=' + terminalId,
        method: 'get'
    })
}
export function editAlarmSet(data) {
    return request({
        url: '/api/v1/editAlarmSet',
        method: 'put',
        data
    })
}