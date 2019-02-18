import axios from 'axios'
import qs from 'qs'
import { Toast } from 'mint-ui'
import {envConfig} from '../config/evnConfig'
import Vue from 'vue'

const cid = sessionStorage.getItem('cid');
const pa = sessionStorage.getItem('publicAccount');
const RESPONSE_SUCCESS_CODE = '0';
axios.defaults.baseURL = envConfig.backgroundBaseUrl;
// http request 拦截器
axios.interceptors.request.use(config => {
    if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    return config;
}, err => {
    return Promise.reject(err);
});

export const apiGet = function (url, data, success, fail) {
    if (Object.prototype.toString.call(data) === '[object Object]') {
        return axios({
            method: 'get',
            url: url,
            params: {
                cid: cid || sessionStorage.getItem('cid'),
                pa: pa,
                param: JSON.stringify(data)
            },
            timeout: 5000, // 设置超时时间
            paramsSerializer: function(params) {
                return qs.stringify(params, { arrayFormat: 'brackets' })
            },
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        }).then(res => {
            if (res.data.meta.code == RESPONSE_SUCCESS_CODE) {
                if (success) {
                    success(res);
                }
            } else {
                if (fail) {
                    fail(res);
                } else {
                    Toast({
                        message: res.data.meta.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            }
        }).catch(error =>{
            if(error.message === 'Network Error'){
                Toast({
                    message: '网络连接异常',
                    position: 'middle',
                    duration: 2000
                });
            }else{
                throw new Error(url + '---' + error)
            }
        });
    } else {
        throw new Error('Data Must be a Object');
    }
};
export const apiPost = function (url, data, success, fail) {
    if (Object.prototype.toString.call(data) === '[object Object]') {
        return axios({
            method: 'post',
            url: url,
            params: {
                cid: cid || sessionStorage.getItem('cid'),
                pa: pa,
                param: JSON.stringify(data)
            },
            timeout: 5000, // 设置超时时间
            paramsSerializer: function(params) {
                return qs.stringify(params, { arrayFormat: 'brackets' })
            },
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        }).then(res => {
            if (res.data.meta.code == RESPONSE_SUCCESS_CODE) {
                if (success) {
                    success(res);
                }
            } else {
                if (fail) {
                    fail(res);
                } else {
                    Toast({
                        message: res.data.meta.msg,
                        position: 'middle',
                        duration: 2000
                    });
                }
            }
        }).catch(error =>{
            if(error.message === 'Network Error'){
                Toast({
                    message: '网络连接异常',
                    position: 'middle',
                    duration: 2000
                });
            }else{
                throw new Error(error)
            }
        });
    }
};