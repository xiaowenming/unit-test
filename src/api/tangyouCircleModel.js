import {apiGet, apiPost} from '../utils/request'

export const tangyouCircleModel = {
    setAllReaded (data, success, fail) { // 设置所有未读消息已读
        return apiPost('/tangyou/v1/updateAllReadStatus', data, success, fail);
    },
    addPraise (data, success, fail) { // 点赞
        return apiPost('/tangyou/v1/addPraise', data, success, fail);
    },
    addComment (data, success, fail) { // 添加评论
        return apiPost('/tangyou/v1/addComment', data, success, fail);
    },
    getSugarTestLsit (data, success, fail) { // 获取糖友圈血糖测量数据
        return apiGet('/tangyou/v1/getSugarTest', data, success, fail);
    },
    getUnreadCommentList (data, success, fail) { // 获取未读评论列表
        return apiGet('/tangyou/v1/getUnreadCommentList', data, success, fail);
    },
    getUnreadCommentCount (data, success, fail) { // 获取未读评论总数
        return apiGet('/tangyou/v1/getUnreadCommentCount', data, success, fail);
    },
    getMyDynamic (data, success, fail) { // 获取用户糖友圈动态
        return apiGet('/tangyou/v1/dynamic', data, success, fail);
    }
}