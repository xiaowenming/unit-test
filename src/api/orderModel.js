import {apiGet, apiPost} from '../utils/request'

export const orderModel = {
    getOrderList (data, success, fail) { // 获取订单列表
        return apiGet('/order/v1/list', data, success, fail);
    },
    addOrder (data, success, fail) { // 提交订单
        return apiPost('/order/v1/add', data, success, fail);
    },
    orderPay (data, success, fail) { // 订单支付
        return apiPost('/order/v1/wxpay', data, success, fail);
    },
    deleteOrder (data, success, fail) { // 删除订单
        return apiPost('/order/v1/delete', data, success, fail);
    },
    getOrderInfoById (data, success, fail) { // 根据ID获取订单详情
        return apiGet('/order/v1/getById', data, success, fail);
    },
    getLogisticsDetail (data, success, fail) { // 获取订单物流详情
        return apiGet('/order/v1/logisticDtail', data, success, fail);
    }
}