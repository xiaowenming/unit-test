import {apiGet, apiPost} from '../utils/request'

export const consultModel = {
    getUnreadConsultSum (data, success, fail) { // 获取未读咨询消息数
        return apiGet('/consult/v1/queryUnreadCount', data, success, fail);
    },
    addMessage (data, success, fail) { // 添加发送一条新消息
        return apiPost('/consult/v1/addMessage', data, success, fail);
    },
    getMessageList (data, success, fail) { // 获取消息列表
        return apiGet('/consult/v1/pagedQueryMessageList', data, success, fail);
    },
    closeConsult (data, success, fail) { // 关闭咨询
        return apiPost('/consult/v1/close', data, success, fail);
    },
    getConsultService (data, success, fail) { // 获取咨询服务情况
        return apiGet('/consult/v1/queryService', data, success, fail);
    },
    getDoctorInfo (data, success, fail) { // 获取医生信息
        return apiGet('/consult/v1/queryDoctor', data, success, fail);
    },
    getSessionInfo (data, success, fail) { // 获取医生和患者关联的当前会话信息
        return apiGet('/consult/v1/querySessionByUserIdAndCustomerId', data, success, fail);
    },
    getSessionInfoBySessionId (data, success, fail) { // 根据会话id获取医生和患者关联的当前会话信息
        return apiGet('/consult/v1/querySessionBySessionId', data, success, fail);
    },
    setSessionReaded (data, success, fail) { // 设置会话消息已读
        return apiPost('/consult/v1/setSessionReaded', data, success, fail);
    },
    getConsultList (data, success, fail) { // 获取患者咨询列表
        return apiGet('/consult/v1/pagedQueryList', data, success, fail);
    },
    subConsult (data, success, fail) {
        return apiPost('/consult/v1/startup', data, success, fail);
    },
    consultPay (data, success, fail) {
        return apiPost('/consult/v1/pay', data, success, fail);
    },
    getConsultDoctorList (data, success, fail) {
        return apiGet('/consult/v1/pagedQueryDoctorList', data, success, fail);
    }
}