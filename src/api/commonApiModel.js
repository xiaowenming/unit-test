import {apiGet, apiPost} from '../utils/request';

export const commonApiModel = {
    getWxConfig (data, success, fail) { // 获取微信配置
        return apiGet('/wechat/v1/getWxJsConfig', data, success, fail);
    },
    getSugarDic (data, success, fail) { // 获取通用血糖字典
        return apiGet('/config/v1/querySugarDic', data, success, fail);
    },
    getPhoneValidateCode (data, success, fail) { // 获取手机验证码
        return apiPost('/shortMsg/v1/getCode', data, success, fail);
    },
    getServerTime (data, success, fail) { // 后台获取系统时间
        return apiGet('/config/v1/getServerTime', data, success, fail);
    },
    getHealthInfoDicAll (data, success, fail) {
        return apiGet('/config/v1/queryDicAll', data, success, fail);
    },
    getScoreRule (data, success, fail) {
        return apiGet('/config/v1/queryScoreSettings', data, success, fail);
    },
    getDcByCode (data, success, fail) { // 根据字段获取字典
        return apiGet('/config/v1/queryDicByTypeCode', data, success, fail);
    },
    getLocationByLongitudeAndLatitude (data, success, fail) {
        return apiGet('/customer/v1/queryLocationByLongitudeAndLatitude', data, success, fail);
    },
    upLoadImg (data, success, fail) {
        return apiPost('/common/v1/uploadImage', data, success, fail);
    }
}