import {apiGet, apiPost} from '../utils/request'

export const reportModel = {
    selectReport (data, success, fail) { // 删除上传的检查报告
        return apiPost('/customer/v1/deleteReport', data, success, fail);
    },
    getSugarTestById (data, success, fail) { // 根据Id获取血糖测试记录
        return apiGet('/sugarTest/v1/getById', data, success, fail);
    },
    addSugarTest (data, success, fail) { // 添加血糖测试记录
        return apiPost('/sugarTest/v1/add', data, success, fail);
    },
    editSugarTest (data, success, fail) { // 修改手动添加的血糖记录
        return apiPost('/sugarTest/v1/edit', data, success, fail);
    },
    getHealthScienceTip (data, success, fail) { // 获取健康小科普
        return apiGet('/sugarTest/v1/getHealthMessage', data, success, fail);
    },
    getSugarTestJudgeAndList (data, success, fail) { // 获取血糖测试统计和数据列表
        return apiGet('/sugarTestReport/v1/queryTrend', data, success, fail);
    },
    getMonthReport (data, success, fail) { // 获取月报
        return apiGet('/healthReport/v1/getMonthReport', data, success, fail);
    },
    getWeekReport (data, success, fail) { // 获取周报
        return apiGet('/healthReport/v1/getWeekReport', data, success, fail);
    },
    getReportList (data, success, fail) { // 获取周报月报列表数据
        return apiGet('/healthReport/v1/list', data, success, fail);
    },
    getSugarTestList (data, success, fail) { // 获取血糖测试列表数据
        return apiGet('/sugarTestReport/v1/queryLog', data, success, fail);
    },
    getSugarTestJudge (data, success, fail) { // 获取血糖测试统计
        return apiGet('/sugarTestReport/v1/queryJudge', data, success, fail);
    },
    getSugarTestOfOneDay (data, success, fail) { // 获取一天的血糖测试数据
        return apiGet('/sugarTest/v1/queryDayData', data, success, fail);
    },
    getHypertensionList (data, success, fail) { // 获取高血压列表数据
        return apiGet('/bloodPressureTest/v1/pageQueryList', data, success, fail);
    },
    addHypertensionReport (data, success, fail) { // 添加高血压数据
        return apiPost('/bloodPressureTest/v1/add', data, success, fail);
    },
    editHypertensionReport (data, success, fail) {
        return apiPost('/bloodPressureTest/v1/edit', data, success, fail);
    },
    getHypertensionChartData (data, success, fail) {
        return apiGet('/bloodPressureTest/v1/trendpageQueryList', data, success, fail);
    },
    getHypertensionById (data, success, fail) {
        return apiGet('/bloodPressureTest/v1/getById', data, success, fail);
    }
}