import {getQueryVariable} from '../utils/utils'
const envConfig = {};
if(!sessionStorage.getItem('pa') && !!getQueryVariable('pa')){
    sessionStorage.setItem('pa', getQueryVariable('pa'))
}
if(!sessionStorage.getItem('appid') && !!getQueryVariable('appid')){
    sessionStorage.setItem('appid', getQueryVariable('appid'))
}
// if (process.env.NODE_ENV == 'development') {
//     envConfig.env = 'dev'
//     // envConfig.backgroundBaseUrl = "http://192.168.8.92:9191/epg-wechat";
//     envConfig.backgroundBaseUrl = "http://192.168.8.13:18080/epg-wechat"; // 晓尧本地
//     envConfig.webBaseUrl = 'http://localhost:8042/'
//     envConfig.appid = '',
//     // envConfig.backgroundBaseUrl = 'http://192.168.8.49:8080/epg-wechat' // 金义本地
//     // envConfig.backgroundBaseUrl = 'http://192.168.8.34:8080/epg-wechat' // 兵斌本地
//     envConfig.huaweiBizBaseUrl = 'http://192.168.8.22:10500/third/business' // 华为业务baseUrl
//     envConfig.getUserInfoRetryTime = 5
//     envConfig.IM_SDK_APP_ID = 1400124203
//     envConfig.IM_ACCOUNT_TYPE = 37073
// }
// 开发调试测试环境
if (process.env.NODE_ENV == 'development') {
    envConfig.env = 'test'
    envConfig.backgroundBaseUrl = 'http://119.23.246.236:8080'
    envConfig.weiXinBaseUrl = 'http://120.79.195.58:10300/wx'
    envConfig.webBaseUrl = 'http://tfwx.aicares.net/'
    envConfig.huaweiBizBaseUrl = 'http://120.79.195.58:10500/third/business' // 华为业务baseUrl
    envConfig.appid = !!sessionStorage.getItem('appid') ? sessionStorage.getItem('appid') : 'wx3348fd5acf22a086'
    envConfig.pa = !!sessionStorage.getItem('pa') ? sessionStorage.getItem('pa') : 'gh_b57d2db1a464'
    envConfig.getUserInfoRetryTime = 10
    envConfig.IM_SDK_APP_ID = 1400124203
    envConfig.IM_ACCOUNT_TYPE = 37073
}
// 测试环境
if (process.env.NODE_ENV == 'testing') {
    envConfig.env = 'test'
    envConfig.backgroundBaseUrl = 'http://119.23.246.236:8080'
    envConfig.weiXinBaseUrl = 'http://120.79.195.58:10300/wx'
    envConfig.webBaseUrl = 'http://tfwx.aicares.net/'
    envConfig.huaweiBizBaseUrl = 'http://120.79.195.58:10500/third/business' // 华为业务baseUrl
    envConfig.appid = !!sessionStorage.getItem('appid') ? sessionStorage.getItem('appid') : 'wx3348fd5acf22a086'
    envConfig.pa = !!sessionStorage.getItem('pa') ? sessionStorage.getItem('pa') : 'gh_b57d2db1a464'
    envConfig.getUserInfoRetryTime = 10
    envConfig.IM_SDK_APP_ID = 1400124203
    envConfig.IM_ACCOUNT_TYPE = 37073
}
// 生产环境
if (process.env.NODE_ENV == 'production') {
    envConfig.env = 'product'
    envConfig.backgroundBaseUrl = 'http://112.74.183.120:8080'
    envConfig.weiXinBaseUrl = 'http://120.77.182.40:10300/wx'
    envConfig.webBaseUrl = 'http://fwx.aicares.net/'
    envConfig.huaweiBizBaseUrl = 'http://120.77.182.40:10500/third/business' // 华为业务baseUrl
    envConfig.appid = !!sessionStorage.getItem('appid') ? sessionStorage.getItem('appid') : 'wx2cb410e34e8114ad'
    envConfig.pa = !!sessionStorage.getItem('pa') ? sessionStorage.getItem('pa') : 'gh_672020b8b09c'
    envConfig.getUserInfoRetryTime = 10
    envConfig.IM_SDK_APP_ID = 1400124203
    envConfig.IM_ACCOUNT_TYPE = 37073
}

export {envConfig};
