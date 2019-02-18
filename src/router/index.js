import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import qs from 'qs'
import { Toast } from 'mint-ui'
import { decode } from 'punycode'
import wx from 'weixin-js-sdk'
import { DatetimePlugin } from 'vux'
import { ConfirmPlugin } from 'vux'
import  { LoadingPlugin } from 'vux'
import {IsInArray} from  '../utils/validate'
import {envConfig} from '../config/evnConfig'
import {getQueryVariable} from '../utils/utils'
Vue.use(DatetimePlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'mainPage',
            meta: {keepAlive: true},
            component: (resolve) => {require(['@/components/mainPage'], resolve)}
        },
        {
            path: '/guess',
            name: 'guess',
            component: (resolve) => {require(['@/components/guess'], resolve)}
        },
        {
            path: '/register',
            name: 'register',
            component: (resolve) => {require(['@/components/register'], resolve)}
        },
        {
            path: '/family',
            name: 'family',
            component: (resolve) => {require(['@/components/family'], resolve)}
        },
        {
            path: '/bindDevices/:type',
            name: 'bindDevices',
            component: (resolve) => {require(['@/components/bindDevices'], resolve)}
        },
        {
            path: '/unbindDevices',
            name: 'unbindDevices',
            component: (resolve) => {require(['@/components/unbindDevices'], resolve)}
        },
        {
            path: '/aboutDevices/bindError',
            name: 'bindError',
            component: (resolve) => {require(['@/components/aboutDevices/bindError'], resolve)}
        },
        {
            path: '/point/addressManage',
            name: 'addressManage',
            component: (resolve) => {require(['@/components/point/addressManage'], resolve)}
        },
        {
            path: '/point/addAddress',
            name: 'addAddress',
            component: (resolve) => {require(['@/components/point/addAddress'], resolve)}
        },
        {
            path: '/point/pointStore',
            name: 'pointStore',
            component: (resolve) => {require(['@/components/point/pointStore'], resolve)},
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/point/conversionRecord',
            name: 'conversionRecord',
            component: (resolve) => {require(['@/components/point/conversionRecord'], resolve)}
        },
        {
            path: '/point/myCoupon',
            name: 'myCoupon',
            component: (resolve) => {require(['@/components/point/myCoupon'], resolve)}
        },
        {
            path: '/tangyouCircle/tangyouCircle',
            name: 'tangyouCircle',
            component: (resolve) => {require(['@/components/tangyouCircle/tangyouCircle'], resolve)}
        },
        {
            path: '/tangyouCircle/newMessageList',
            name: 'newMessageList',
            component: (resolve) => {require(['@/components/tangyouCircle/newMessageList'], resolve)}
        },
        {
            path: '/tangyouCircle/newMessageDetail',
            name: 'newMessageDetail',
            component: (resolve) => {require(['@/components/tangyouCircle/newMessageDetail'], resolve)}
        },
        {
            path: '/point/pointRule',
            name: 'pointRule',
            component: (resolve) => {require(['@/components/point/pointRule'], resolve)},
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/point/orderDetail',
            name: 'orderDetail',
            component: (resolve) => {require(['@/components/point/orderDetail'], resolve)}
        },
        {
            path: '/search/search',
            name: 'search',
            component: (resolve) => {require(['@/components/search/search'], resolve)}
        },
        {
            path: '/search/sucess',
            name: 'sucess',
            component: (resolve) => {require(['@/components/search/sucess'], resolve)}
        },
        {
            path: '/search/friendReportList',
            name: 'friendReportList',
            component: (resolve) => {require(['@/components/search/friendReportList'], resolve)}
        },
        {
            path: '/sugarReport/addReport/:reportId',
            name: 'addReport',
            component: (resolve) => {require(['@/components/sugarReport/addReport'], resolve)}
        },
        {
            path: '/sugarReport/uploadReport',
            name: 'uploadReport',
            component: (resolve) => {require(['@/components/sugarReport/uploadReport'], resolve)}
        },
        {
            path: '/healthInfo/healthInfo',
            name: 'healthInfo',
            component: (resolve) => {require(['@/components/healthInfo/healthInfo'], resolve)}
        },
        {
            path: '/healthInfo/healthTarget',
            name: 'healthTarget',
            component: (resolve) => {require(['@/components/healthInfo/healthTarget'], resolve)}
        },
        {
            path: '/sugarReport/noReport',
            name: 'noReport',
            component: (resolve) => {require(['@/components/sugarReport/noReport'], resolve)}
        },
        {
            path: '/sugarReport/reportDetail',
            name: 'reportDetail',
            component: (resolve) => {require(['@/components/sugarReport/reportDetail'], resolve)}
        },
        {
            path: '/userRegister/userRegister',
            name: 'userRegister',
            component: (resolve) => {require(['@/components/userRegister/userRegister'], resolve)}
        },
        {
            path: '/userRegister/editPhone',
            name: 'editPhone',
            component: (resolve) => {require(['@/components/userRegister/editPhone'], resolve)}
        },
        {
            path: '/getPaper/getPaper',
            name: 'getPaper',
            component: (resolve) => {require(['@/components/getPaper/getPaper'], resolve)}
        },
        {
            path: '/getPaper/sendOrder',
            name: 'sendOrder',
            component: (resolve) => {require(['@/components/getPaper/sendOrder'], resolve)}
        },
        {
            path: '/set/set',
            name: 'set',
            component: (resolve) => {require(['@/components/set/set'], resolve)}
        },
        {
            path: '/set/aboutUs',
            name: 'aboutUs',
            component: (resolve) => {require(['@/components/set/aboutUs'], resolve)}
        },
        {
            path: '/point/logistics',
            name: 'logistics',
            component: (resolve) => {require(['@/components/point/logistics'], resolve)}
        },
        {
            path: '/consult/myConsultList',
            name: 'myConsultList',
            component: (resolve) => {require(['@/components/consult/myConsultList'], resolve)}
        },
        {
            path: '/consult/C2CChat',
            name: 'C2CChat',
            component: (resolve) => {require(['@/components/consult/C2CChat'], resolve)}
        },
        {
            path: '/findDoctor/findDoctor',
            name: 'findDoctor',
            component: (resolve) => {require(['@/components/findDoctor/findDoctor'], resolve)}
        },
        {
            path: '/findDoctor/doctorDetail',
            name: 'doctorDetail',
            component: (resolve) => {require(['@/components/findDoctor/doctorDetail'], resolve)}
        },
        {
            path: '/consult/subConsult',
            name: 'subConsult',
            component: (resolve) => {require(['@/components/consult/subConsult'], resolve)}
        },
        {
            path: '/consult/more',
            name: 'more',
            component: (resolve) => {require(['@/components/consult/more'], resolve)}
        },
        {
            path: '/recipe/fillInformation',
            name: 'fillInformation',
            component: (resolve) => {require(['@/components/recipe/fillInformation'], resolve)}
        },
        {
            path: '/recipe/discripIllness',
            name: 'discripIllness',
            component: (resolve) => {require(['@/components/recipe/discripIllness'], resolve)}
        },
        {
            path: '/recipe/chooseDrugStore',
            name: 'chooseDrugStore',
            component: (resolve) => {require(['@/components/recipe/chooseDrugStore'], resolve)}
        },
        {
            path: '/recipe/allergicHistory',
            name: 'allergicHistory',
            component: (resolve) => {require(['@/components/recipe/allergicHistory'], resolve)}
        },
        {
            path: '/recipe/recipeList',
            name: 'recipeList',
            component: (resolve) => {require(['@/components/recipe/recipeList'], resolve)}
        },
        {
            path: '/recipe/recipeDetail',
            name: 'recipeDetail',
            component: (resolve) => {require(['@/components/recipe/recipeDetail'], resolve)}
        },
        {
            path: '/bloodPressure/addBloodPressureReport/:hyperReportId',
            name: 'addBloodPressureReport',
            component: (resolve) => {require(['@/components/bloodPressure/addBloodPressureReport'], resolve)}
        }
    ]
})
const validateUserTypeList = ['/point/pointStore', '/', '/register'];
//判断公众号id , 确定公众号title
document.title = (envConfig.pa == 'gh_b57d2db1a464' || envConfig.pa == 'gh_672020b8b09c') ? '小糖医' : '掌护健康'
router.beforeEach((to, from, next) => {
    try {
        if (envConfig.env == 'dev') {
            // sessionStorage.setItem('cid', 'c_01')
            sessionStorage.setItem('nickname', '哈哈')
            sessionStorage.setItem('userType', '1')
            sessionStorage.setItem('cid', "4a9e3ed1a5e0492e841d8e3061f93397"); // 紫芊虫
            // sessionStorage.setItem('cid', "02f32017a4654a5da9619492ce856f6d"); //何涛
            sessionStorage.setItem('publicAccount', 'gh_b57d2db1a464')
            sessionStorage.setItem('openid', "om76ZwxeCAI6N7IIp-cMPJmsP5c8"); //糖豆豆
        }
        // if (envConfig.env == "test") {
        //     // sessionStorage.setItem('cid', "4a9e3ed1a5e0492e841d8e3061f93397");//紫芊虫
        //     // sessionStorage.setItem('cid', "df6ee816d7964f4287a9080ddba61242"); //糖豆豆
        //     // sessionStorage.setItem('cid', "708a85bc503b47d9ae25f0e0d799416e"); //兵斌
        //     // sessionStorage.setItem('cid', "81cd7b84378649c59e07bce623d94e2b"); //罗宾
        //     sessionStorage.setItem('cid', "83e56ae37634473e9da80b43fa8374a4"); //自己
        //     // sessionStorage.setItem('cid', "74ce48dea8ca4529bb710f355398b59e"); //luwei
        //     // sessionStorage.setItem('cid', "34cff5710639410f8206efea7f62fc88"); //尘缘
        //     // sessionStorage.setItem('cid', "4d9baad87eb24156a06a0ea27972cfab"); //涛哥
        //     // sessionStorage.setItem('cid', "1f068173204f43e983e4f00be7c884b4"); //ios测试机
        //     // sessionStorage.setItem('cid', "36459fdc33374741aa89be3ac145d4b7");
        //     // sessionStorage.setItem('openid', "om76ZwxeCAI6N7IIp-cMPJmsP5c8"); //糖豆豆
        //     // sessionStorage.setItem('openid', "18874180785"); //兵斌
        //     sessionStorage.setItem('openid', "oA9YNvx5iCl1YWOQEqVLF8se8zfo"); //罗宾
        //     // sessionStorage.setItem('openid', "om76Zw-HHYUv300V31ewlrBsiyns"); //自己
        //     // sessionStorage.setItem('openid', "om76Zw0kN0mNP-T1TzdRHeoorx4o"); //尘缘
        //     // sessionStorage.setItem('openid', "om76Zw_L0xY1jZI95ng-2loHLfXU"); //涛哥
        //     // sessionStorage.setItem('openid', "om76ZwwuVBz2vSNRTwIdJblUshAM"); //ios测试机
        //     // sessionStorage.setItem("nickname", "哈哈");
        //     sessionStorage.setItem("userType", "1");
        //     // sessionStorage.setItem("headimgurl", "aaaaa.png");
        //     sessionStorage.setItem("publicAccount", "gh_b57d2db1a464"); // 掌护健康云
        //     // sessionStorage.setItem("publicAccount", "gh_55034974db87"); //掌护健康测试
        // }
        getWxAuth()

        function getWxAuth() { // 微信授权
            if (!sessionStorage.getItem('openid')) {
                let currenturl = encodeURI(window.location.href.split('?')[0]) // 测试环境
                let code = getQueryVariable('code')
                if (!code) {
                    sessionStorage.setItem('currenturl', window.location.href)
                    location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + envConfig.appid + '&redirect_uri=' + currenturl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
                } else {
                    wxRegister(code)
                        // next();
                }
            } else {
                if (!IsInArray(validateUserTypeList, to.path) && sessionStorage.getItem('userType') != '1') {
                    if (to.path != '/register') {
                        sessionStorage.setItem('url', to.path);
                    }
                    router.push('/register');
                } else {
                    next();
                }
            }
        }

        function wxRegister(code) { // 通过code获取openid
            axios({
                method: 'get',
                url: envConfig.weiXinBaseUrl + '/wechat/oauth/getHtmlAccessToken',
                params: {
                    publicAccount: envConfig.pa,
                    code: code
                },
                paramsSerializer: function(params) {
                    return qs.stringify(params, { arrayFormat: 'brackets' })
                },
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            }).then(res => {
                if (res.data.code == '0') {
                    let result = res.data.data.userInfo
                    isAuth(result.openid)
                    sessionStorage.setItem('openid', result.openid)
                    sessionStorage.setItem('nickname', result.nickname)
                    sessionStorage.setItem('headimgurl', result.headimgurl)
                    sessionStorage.setItem('publicAccount', res.data.data.publicAccount)
                    sessionStorage.setItem('imgDomain', res.data.data.imgDomain)
                    sessionStorage.setItem('sex', result.sex)
                        // next()
                } else {
                    Toast({
                        message: res.data.meta.msg,
                        position: 'middle',
                        duration: 2000
                    })
                }
            }).catch(err => {
                Toast({
                    message: '请求错误 , 请稍后再试',
                    position: 'middle',
                    duration: 2000
                })
            })
        }

        //判断用户是否注册 , 获取customerId
        function isAuth(oppenId) {
            axios({
                method: 'get',
                url: envConfig.backgroundBaseUrl + '/login/v1/getByOpenid',
                params: {
                    publicAccount: envConfig.pa,
                    openid: oppenId
                },
                paramsSerializer: function(params) {
                    return qs.stringify(params, { arrayFormat: 'brackets' })
                },
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            }).then(res => {
                let data = JSON.stringify(res)
                if (res.data.meta.code == '0') {
                    let result = res.data.data.userInfo
                    sessionStorage.setItem('cid', result.customerId || '')
                    sessionStorage.setItem('userType', result.isAuth)
                    if (!IsInArray(validateUserTypeList, to.path) && result.isAuth != '1') {
                        if (to.path != '/register') {
                            sessionStorage.setItem('url', to.path);
                        }
                        router.push('/register');
                    } else {
                        next();
                    }
                } else {
                    throw new Error('wxRegister error: res.data.meta.code is not 0')
                }
            }).catch(err => {
                throw new Error('wxRegister error: request faile')
            })
        }
    } catch (e) {
        let customerId = sessionStorage.getItem('cid')
        let url = window.location.href
        let errName = e.name
        let errMessage = e.message
        let parama = JSON.stringify({
            funName: 'beforeEach',
            customerId: customerId || '',
            url: url || '',
            errName: errName || '',
            errMessage: errMessage || ''
        })
        if (errMessage == 'NetworkError') {
            Toast({
                message: '网络错误,请稍后再试',
                position: 'middle',
                duration: 2000
            })
        }
        axios({
            method: 'post',
            url: envConfig.backgroundBaseUrl + '/front/v1/log',
            params: {
                param: parama
            },
            paramsSerializer: function(params) {
                return qs.stringify(params, { arrayFormat: 'brackets' })
            },
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        }).then(res => {

        })
    }
})

// 区分ios和安卓浏览器的url

if (!Vue.prototype.firstUrl) {
    Vue.prototype.firstUrl = window.location.href.split('#')[0]
}

Vue.prototype.baseUrl = envConfig.backgroundBaseUrl
Vue.prototype.weiXinBaseUrl = envConfig.weiXinBaseUrl
Vue.prototype.currentUserId = sessionStorage.getItem('cid')
Vue.prototype.currentPa = sessionStorage.getItem('publicAccount')
Vue.prototype.currentUserNickname = sessionStorage.getItem('nickname')
Vue.prototype.userType = sessionStorage.getItem('userType')
Vue.prototype.huaweiBizBaseUrl = envConfig.huaweiBizBaseUrl
// 判断是否是掌护健康公众号 , 控制模块显示 , gh_ac65dddb60fc为掌护健康正式pa , 后面的为测试pa  gh_55034974db87
Vue.prototype.isAicaresHealth = (envConfig.pa == 'gh_ac65dddb60fc'|| envConfig.pa == 'gh_55034974db87') ? true : false
Vue.prototype.IM_ACCOUNT_TYPE = envConfig.IM_ACCOUNT_TYPE
Vue.prototype.IM_SDK_APP_ID = envConfig.IM_SDK_APP_ID

Vue.prototype.focusEvent = function(selector) {
    let bodyHeight = document.body.offsetHeight
    let clientHeight = document.body.clientHeight
    let page = document.querySelector(selector)
    if (is_weixn()) {
        let timer = setInterval(function() {
            page.scrollTop = document.body.scrollHeight
        }, 100)
        if (document.body.scrollHeight == bodyHeight) {
            clearInterval(timer)
        }
        document.body.style.height = clientHeight + 'px'
    }
    // 判断是否为ios或android移动端微信
    function is_weixn() {
        var ua = navigator.userAgent.toLowerCase()
        if (ua.match(/MicroMessenger/i) == 'micromessenger' && (ua.indexOf('android') > -1 || ua.indexOf('adr') > -1)) {
            return true
        } else {
            return false
        }
    }
}

Vue.prototype.isNormalUser = function(){
    if (sessionStorage.getItem('userType') != 1){
      this.$router.replace('/register')
    }
}
Vue.prototype.toStr = function(value) {
    if (value || value === 0) {
        return value.toString().trim()
    } else {
        return ''
    }
}
Vue.prototype.showToast = function(msg) {
    Toast({
        message: msg,
        position: 'middle',
        duration: 2000
    })
}

Vue.prototype.ajax = function(method, url, data, successCallBack, errCallBack, isFullUrl) {
    // 创建取消请求
    let source = axios.CancelToken.source()
    let param
    if (!isFullUrl) {
        if (data != null) {
            param = JSON.stringify(data)
        }
    } else {
        param = data
    }

    let cid = this.currentUserId
    let pa = this.currentPa
    let _this = this
    if (!cid) {
        Vue.prototype.currentUserId = sessionStorage.getItem('cid')
    }
    if (!pa) {
        Vue.prototype.currentPa = sessionStorage.getItem('publicAccount')
    }
    axios({
            method: method,
            url: isFullUrl ? url : this.baseUrl + url,
            params: {
                cid: this.currentUserId,
                pa: this.currentPa,
                param: param
            },
            cancelToken: source.token, // 为ajax注册取消事件
            timeout: 5000, // 设置超时时间
            paramsSerializer: function(params) {
                return qs.stringify(params, { arrayFormat: 'brackets' })
            },
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        }).then(res => {
            if ((!isFullUrl && res.data.meta.code == 0) || (isFullUrl && res.data.code == 0)) {
                successCallBack(res)
            } else {
                if (errCallBack) {
                    errCallBack(res)
                } else {
                    if (!isFullUrl) {
                        if (res.data.meta.code != 0) {
                            _this.showToast(res.data.meta.msg);
                        }
                    }
                }
                let customerId = sessionStorage.getItem('cid')
                let currentUrl = window.location.href
                let errName = 'Code error:Error Code is' + res.data.meta.code
                let errMessage = 'ajax function error'
                let parama = JSON.stringify({
                    funName: url,
                    customerId: customerId || '',
                    url: currentUrl || '',
                    errName: errName,
                    errMessage: errMessage
                })
                axios({
                    method: 'post',
                    url: this.baseUrl + '/front/v1/log',
                    params: {
                        param: parama
                    },
                    paramsSerializer: function(params) {
                        return qs.stringify(params, { arrayFormat: 'brackets' })
                    },
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                }).then(res => {

                })
            }
        }).catch(err => {
            console.log(err)
        })
    // 存储实例的钩子函�
    let $destroy = this.$destroy;
    this.$destroy = function() {
        source.cancel('取消请求' + url)
        $destroy.call(_this)
    }
}
Vue.prototype.uploadBase64 = function (url, data, successCallBack, errCallBack) {
    let source = axios.CancelToken.source();
    let formdata = new FormData();
    formdata.append('cid',sessionStorage.getItem('cid'));
    formdata.append('pa',sessionStorage.getItem('publicAccount'));
    formdata.append('param', JSON.stringify(data));
    axios({
        method: 'post',
        url: this.baseUrl + url,
        data: formdata,
        paramsSerializer: function(params) {
            return qs.stringify(data, { arrayFormat: 'brackets' })
        },

        cancelToken: source.token, // 为ajax注册取消事件
        timeout: 5000, // 设置超时时间
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'multipart/form-data'
        }
    }).then(function (res) {
        if (res.data.meta.code == 0) {
            successCallBack(res);
        } else {
            if (errCallBack) {
                errCallBack(res);
            } else {
                _this.showToast(res.data.meta.msg);
            }
        }
    })

    // 存储实例的钩子函�
    let $destroy = this.$destroy,
    _this = this;
    this.$destroy = function() {
        source.cancel('取消请求' + url)
        $destroy.call(_this)
    }
}

export default router
