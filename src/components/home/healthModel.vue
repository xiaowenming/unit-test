<template>
    <div class="healthModelPage fullPage">
        <div class="top pr">
            <img class="banner" src="/static/images/home/banner.png" alt="" @click="toSugarReport">
        </div>
        <ul class="healthModelList">
            <li
                :class="{w50:true, fl: true,bdr: item.borderRight, bdb: item.borderBottom}"
                :style="{background: 'url('+mainUrl+item.imgUrl+') no-repeat', backgroundSize: 'cover'}"
                v-for="(item, index) in healthModelList" :key="index"
                @click="toEachPage(item)">
            </li>
            <li :class="{w50:true, fl: true, bgWhite: true}" v-if="isAicaresHealth"></li>
        </ul>
        <div v-transfer-dom>
            <confirm v-model="show"
            :title="'确定位置'"
            :cancel-text="cancelText"
            :confirm-text="'重新获取'"
            @on-cancel="onCancel"
            @on-confirm="onConfirm">
                <p style="text-align:left;">{{ noticeTip }}</p>
            </confirm>
        </div>
        <div v-transfer-dom>
            <alert v-model="noDrugStore"> <p class="tal">{{ ('您所在区域暂无药店 , 无法使用此功能') }}</p></alert>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .healthModelPage{
        background-color: #EFEFF4;
        .top{
            height: 3.7rem;
            width: 100%;
            padding-top: 0.42rem;
            .banner{
                width: 7.27rem;
                height: 2.86rem;
                margin: 0 auto;
            }
            .addButton {
                width: 1.3rem;
                height: 0.46rem;
                line-height: 0.46rem;
                font-size: 0.2rem;
                position: absolute;
                left: 0.6rem;
                bottom: 0.95rem;
                background-color: #55DEB0;
                border: 1px solid #fff;
                color: #fff;
                border-radius: 0.23rem;
            }
        }
        .healthModelList{
            li{
                height: 2rem;
                box-sizing: border-box;
            }
            .bdr{
                border-right: 1px solid #EFEFF4;
            }
            .bdb{
                border-bottom: 1px solid #EFEFF4;
            }
        }
    }
</style>
<script>
import {healthModelList, zhanghuHealthModelList} from '../../config/home';
import {userModel, recipeModel, commonApiModel} from '../../api';
import {Confirm, Alert, TransferDomDirective as TransferDom } from 'vux';
import md5 from 'js-md5';
let wx = require('weixin-js-sdk');
export default {
    name: 'healthModel',
    data () {
        return {
            healthModelList: [],
            mainUrl: '/static/images/home/',
            show: false,
            noticeTip: '',
            province: '',
            city: '',
            district: '',
            noDrugStore: false,
            wxConfig: {},
            cancelText: '确定'
        }
    },
    methods: {
        toEachPage (item) {
            if (item.type == 'push') {
                this.$router.push(item.path);
            } else if (item.type == 'jump') {
                window.location.href = item.path;
            } else if (item.type == 'function') {
                (this[item.path])();
            }
        },
        toNiaoDaiFu () {
            if(sessionStorage.getItem('userType') != 1){
                this.isNormalUser();
            }else{
                let userId = sessionStorage.getItem("cid");
                let currentTime = new Date().getTime();
                let a = md5("eOYFW1ptES:-R6If_XTOK8nV74MqtTx");
                let b = a.substring(8,24);
                let sign = md5(b+":"+currentTime);//获取签名
                let url = "https://open.niaodaifu.cn/wap/index";
                window.location.href = "https://open.niaodaifu.cn/wap/login?appkey=eOYFW1ptES&userbind="+userId+"&atime="+currentTime+"&sign="+sign;
            }
        },
        toSugarReport () {
            this.$router.push('/guess');
        },
        getLocation () {
            userModel.getUserLocation({}, res => {
                let data = res.data.data;
                if (data.location && JSON.stringify(data.location) !== '{}' && !!data.location.province) {
                    let location = data.location;
                    this.province = location.province;
                    this.city = location.city;
                    this.district = location.district;
                    this.noticeTip = '系统检测您当前位置为' + this.province + this.city + this.district + '，是否确定？';
                    this.show = true;
                } else {
                    this.noticeTip = '系统检测不到您当前的位置，是否重新获取？';
                    this.cancelText = '取消';
                    this.show = true;
                }
            });
        },
        onCancel () {
            if (this.cancelText == '确定') {
                this.getDrugStoreByLocation();
            }
        },
        onConfirm () {
            // this.$router.push('/recipe/fillInformation');
            let url = "";
            if (window.__wxjs_is_wkwebview === true) {
                url = this.firstUrl.split('#')[0]
            } else {
                url = window.location.href.split('#')[0]
            }
            commonApiModel.getWxConfig({currentUrl:encodeURIComponent(url, 'UTF-8')}, res => {
                this.wxConfig = res.data.data.wxJsConfig;
                this.wxConfig.jsApiList = ["getLocation"];
                // this.wxConfig.debug = true;
                wx.config(this.wxConfig);
                wx.ready(() => {
                    wx.getLocation({
                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: (res) => {
                            let data = {
                                longitude: res.longitude,
                                latitude: res.latitude
                            };
                            // let data = {
                            //     longitude: '113.938316',
                            //     latitude: '22.558714'
                            // };
                            commonApiModel.getLocationByLongitudeAndLatitude(data, res => {
                                let location = res.data.data;
                                this.province = location.province;
                                this.city = location.city;
                                this.district = location.district;
                                this.getDrugStoreByLocation(); // 重新获取位置之后获取药店
                            })
                        }
                    })
                });
            });
        },
        getDrugStoreByLocation () {
            let data = {
                province: this.province,
                city: this.city,
                district: this.district
            };
            sessionStorage.setItem('locationData', JSON.stringify(data));
            recipeModel.getDrugStoreByLocation(data, res => {
                if (res.data.data.items && res.data.data.items.length > 0) { // 用户定位位置有药店
                    this.$router.push({path: '/recipe/fillInformation'});
                } else { // 用户定位位置没有药店
                    this.noDrugStore = true;
                }
            });
        }
    },
    components: {
        Confirm,
        Alert
    },
    directives: {
        TransferDom
    },
    created () {
        this.healthModelList = this.isAicaresHealth ? zhanghuHealthModelList : healthModelList;
    }
}
</script>
