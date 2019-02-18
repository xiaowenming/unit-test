import {apiGet, apiPost} from '../utils/request';

export const deviceModel = {
    getDeviceList (data, success, fail) {
        return apiGet('/device/v1/queryDeviceKindList', data, success, fail);
    },
    editDeviceName (data, success, fail) {
        return apiPost('/device/v1/edit', data, success, fail);
    },
    bindDevice (data, success, fail) {
        return apiPost('/device/v1/bind', data, success, fail);
    },
    unBindDevice (data, success, fail) {
        return apiPost('/device/v1/unbind', data, success, fail);
    }
}