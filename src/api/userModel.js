import {apiGet, apiPost} from '../utils/request'

export const userModel = {
    getUserInfo (data, success, fail) { // 获取用户基础登录信息
        return apiGet('/login/v1/getCurrent', data, success, fail);
    },
    userRegister (data, success, fail) { // 用户注册
        return apiPost('/login/v1/auth',  data, success, fail);
    },
    getDoctorList (data, success, fail) { // 健康档案获取医生丶护士列表
        return apiGet('/customer/v1/queryDoctor', data, success, fail);
    },
    getHospitalList (data, success, fail) {
        return apiGet('/customer/v1/queryHospital', data, success, fail);
    },
    getDepartmentList (data, success, fail) {
        return apiGet('/customer/v1/queryDepartment', data, success, fail);
    },
    saveDoctor (data, success, fail) { // 健康档案保存医生
        return apiPost('/customer/v1/saveDoctor', data, success, fail);
    },
    getUserLocation (data, success, fail) { // 获取用户位置信息
        return apiGet('/customer/v1/getLocation', data, success, fail);
    },
    getUserLegal (data, success, fail) { // 获取用户套餐权益
        return apiGet('/customer/v1/queryLegal', data, success, fail);
    },
    getCouponCanuser (data, success, fail) { // 获取用户可用优惠券
        return apiGet('/coupon/v1/queryCanUse', data, success, fail);
    },
    getCouponAll (data, success, fail) { // 获取用户全部可用优惠券
        return apiGet('/coupon/v1/queryAll', data, success, fail);
    },
    getUserAddressList (data, success, fail) { // 获取用户地址列表
        return apiGet('/address/v1/list', data, success, fail);
    },
    addUserAddress (data, success, fail) { // 添加地址
        return apiPost('/address/v1/add', data, success, fail);
    },
    editUserAddress (data, success, fail) { // 修改现有地址
        return apiPost('/address/v1/edit', data, success, fail);
    },
    getUserDefaultAddress (data, success, fail) {
        return apiGet('/address/v1/getDefault', data, success, fail);
    },
    setAnAddressDefault (data, success, fail) { //设置默认地址
        return apiPost('/address/v1/setDefault', data, success, fail);
    },
    deleteAddress (data, success, fail) { //删除地址
        return apiPost('/address/v1/del', data, success, fail);
    },
    getUserHealthInfo (data, success, fail) { // 获取用户健康档案
        return apiGet('/patient/v1/get', data, success, fail);
    },
    subUserHealthInfo (data, success, fail) { // 提交健康档案
        return apiPost('/patient/v1/add', data, success, fail);
    },
    getUserHealthTarget (data, success, fail) { // 获取用户自己设置的血糖字典 (健康目标)
        return apiGet('/customer/v1/querySugarDic', data, success, fail);
    },
    saveUserHealthTarget (data, success, fail) { // 保存用户健康目标
        return apiPost('/customer/v1/saveSugarObjective', data, success, fail);
    },
    resetUserHealthTarget (data, success, fail) { // 重置用户健康目标
        return apiPost('/customer/v1/deleteSugarObjective', data, success, fail);
    },
    getUserMessageSet (data, success, fail) { // 获取用户接收推送消息设置
        return apiGet('/customer/v1/getMsgSetting', data, success, fail);
    },
    updateUserMessageSet (data, success, fail) { // 更新用户接收推送消息状态
        return apiPost('/customer/v1/updateMsgSetting', data, success, fail);
    },
    getReportImg (data, success, fail) { // 获取上传过的报告列表
        return apiGet('/customer/v1/pageQueryReport', data, success, fail);
    },
    deleteReport (data, success, fail) { // 删除上传的报告
        return apiPost('/customer/v1/deleteReport', data, success, fail);
    },
    userEditPhone (data, success, fail) { // 用户修改手机号
        return apiPost('/customer/v1/updatePhone', data, success, fail);
    },
    editUserInfo (data, success, fail) { // 修改用户基础信息
        return apiPost('/customer/v1/edit', data, success, fail);
    }
}