import {apiGet, apiPost} from '../utils/request'

export const recipeModel = {
    getDrugStoreByLocation (data, success, fail) {
        return apiGet('/store/v1/queryStoreAddressByLocation', data, success, fail);
    },
    addRecipeConsult (data, success, fail) {
        return apiPost('/rx/v1/add', data, success, fail);
    },
    getRecipeList (data, success, fail) {
        return apiGet('/rx/v1/pagedQueryList', data, success, fail);
    },
    getRecipeDetail (data, success, fail) {
        return apiGet('/rx/v1/queryById', data, success, fail);
    }
}