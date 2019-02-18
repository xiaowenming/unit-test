import {apiGet, apiPost} from '../utils/request'

export const pointStoreModel = {
    getGoodsContainer (data, success, fail) { // 获取商品货柜
        return apiGet('/goods/v1/queryGoodsContainerList', data, success, fail);
    },
    getGoodsByContainerId (data, success, fail) { // 根据货柜ID获取商品
        return apiGet('/goods/v1/getListByContainerId',  data, success, fail);
    },
    goodsBuyValid (data, success, fail) { // 验证商品购买资格
        return apiGet('/goods/v1/buyValid', data, success, fail);
    },
    getGoodsInfoById (data, success, fail) {
        return apiGet('/goods/v1/getById', data, success, fail);
    }
}