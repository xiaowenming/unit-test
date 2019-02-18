import {apiGet, apiPost} from '../utils/request';

export const friendModel = {
    getIFocusList (data, success, fail) { // 获取我关注的好友列表
        return apiGet('/follower/v1/queryIFocus', data, success, fail);
    },
    editFocusStatus (data, success, fail) { // 编辑接收好友提醒状态或者备注
        return apiPost('/follower/v1/editIFocus', data, success, fail);
    },
    searchFriendsByPhoneNumber (data, success, fail) { // 根据手机号搜索好友
        return apiGet('/follower/v1/queryByPhone', data, success, fail);
    },
    addFriends (data, success, fail) { // 添加好友
        return apiPost('/follower/v1/addFocus', data, success, fail);
    },
    getFriendsSugarData (data, success, fail) { // 获取好友血糖数据
        return apiGet('/follower/v1/queryIFocusData', data, success, fail);
    },
    getFriendSugarDataStatics (data, success, fail) { // 获取好友血糖数据统计
        return apiGet('/follower/v1/queryIFocusStat', data, success, fail);
    },
    deleteFriends (data, success, fail) {
        return apiPost('/follower/v1/del', data, success, fail);
    }
}