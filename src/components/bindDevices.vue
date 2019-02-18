<template>
    <div class="devicesPage pr fullPage">
        <div class="devicesBanner"></div>
        <div class="noBind tac" v-if="noBind">尚未绑定任何设备</div>
        <div class="devicesList">
            <!-- 血糖设备列表 -->
            <div class="modelTitle w100 pr fontSize36 tal" v-if="diabetesDeviceList.length > 0"><span class="greenBlock"></span>血糖仪</div>
            <device-list
                :devicesBindListData="diabetesDeviceList"
                :editBtnCallBack="showMessageBox"
                :unBindBtnCallBack="unBindBtnCallBack">
            </device-list>
            <div class="block" v-if="!noBind"></div>
            <!-- 血压设备列表 -->
            <div class="modelTitle w100 pr fontSize36 tal" v-if="hypertensionDeviceList.length > 0"><span class="greenBlock"></span>血压计</div>
            <device-list
                :devicesBindListData="hypertensionDeviceList"
                :editBtnCallBack="showMessageBox"
                :unBindBtnCallBack="unBindBtnCallBack">
            </device-list>
        </div>
        <div class="footerBlock"></div>
        <div class="devicesfooter">
            <div class="bindButton fl bgBase colorWhite" @click="callBackBtn1" id="btnBindDevice">绑定设备</div>
        </div>
        <my-mask v-if="messageBoxIsShow" :scrollValue="bodyScrollDistance">
            <div class="content center-y bgWhite" slot="body">
                <div class="messageBoxTop tal">
                    <span class="title">设备名称</span><span class="remark">(必填，最多10个字符)</span>
                </div>
                <div class="messageBoxCenter">
                    <input type="hidden" class="currentImei" :value="deviceImei">
                    <input type="text" class="deviceName" v-validateEmoji v-on:input="toMaxLength()" :placeholder="deviceText" v-model="thisDeviceName">
                </div>
                <div class="messageBoxBottom clearfix">
                    <a class="fl btnCancel" href="javascript:void(0)" @click="hiddenMessageBox()">取消</a>
                    <a class="fr btnConfirm" href="javascript:void(0)" @click="confirmDeviceName()">确认</a>
                </div>
            </div>
        </my-mask>
        <chooseDoctor v-on:closeMask="closeChooseMask" v-if="createCascadeForm" ref="cascadeForm" :formType="formType" :scrollValue="pageScroll"></chooseDoctor>
        <router-view></router-view>
    </div>
</template>
<style lang="less" scoped>
    .devicesPage{
        background-color: #fff;
        .devicesList{
            .modelTitle{
                height: 0.8rem;
                line-height: 0.8rem;
                padding-left: 0.5rem;
                border-bottom: 1px solid #E0E0E0;
                span{
                    width: 0.05rem;
                    height: 0.34rem;
                    position: absolute;
                    top: 0.23rem;
                    left: 0.3rem;
                }
                .greenBlock{
                    background-color: #27d2b9;
                }
            }
        }
    }
    .devicesBanner{
        height: 2.4rem;
        background: url("/static/images/device/banner.png") no-repeat;
        background-size: cover;
    }
    .noBind{
        width: 100%;
        margin-top: 2rem;
        font-size: 0.36rem;
    }
    .block{
        height: 0.1rem;
        background-color: #E0E0E0;
    }
    .footerBlock{
        height: 1.5rem;
    }
    .devicesfooter{
        background-color: #fff;
        height: 1.5rem;
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        padding-top: 0.3rem;
    }
    .bindButton{
        position: absolute;
        width: 6.91rem;
        height: 0.9rem;
        line-height: 0.9rem;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.36rem;
        box-sizing: content-box;
        border-radius: 0.08rem;
    }
    .content{
        width: 95%;
        left: 50%;
        top: 23%;
        border-radius: 0.2rem;
        transform: translateX(-50%);
        background-color: #fff;
    }
    .messageBoxTop{
        height: 0.8rem;
        line-height: 0.8rem;
        margin-left: 0.3rem;
        font-size: 0.32rem;
        color: #666;
    }
    .messageBoxTop .title{
        color: #000;
    }
    .messageBoxCenter{
        margin-top: 0.2rem;
    }
    .messageBoxCenter input {
        width: 90%;
        height: 0.88rem;
        padding-left: 0.2rem;
        border-radius: 0.10rem;
        border: 1px solid #cccccc;
    }
    .messageBoxBottom{
        margin: 0.6rem 0.3rem;
    }
    .messageBoxBottom a{
        display: block;
        width: 45%;
        height: 0.88rem;
        line-height: 0.88rem;
        border: 1px solid #34B597;
        border-radius: 0.1rem;
        color: #000;
    }
    .messageBoxBottom .btnConfirm{
        background-color: #34B597;
        color: #fff;
    }
</style>

<script>
    import chooseDoctor from './commomComponents/chooseDoctor'
    import {validateEmoji} from '../directives/index'
    import {isEmptyString} from '../utils/utils'
    import {deviceModel, commonApiModel, userModel} from '../api'
    import deviceList from '../components/commomComponents/deviceList'
    import myMask from './commomComponents/myMask'
    let wx = require('weixin-js-sdk');
    export default {
        name:"bindDevices",
        data() {
            return {
                noBind:false,
                diabetesDeviceList:[],
                hypertensionDeviceList: [],
                messageBoxIsShow:false,
                deviceText:"",
                deviceImei:"",
                btnText1:"绑定设备",
                btnText2:"如何绑定",
                bindPath2:"/aboutDevices/howToBind",
                diveceIndex:0,
                wxConfig:{},
                thisDeviceName:"",
                createCascadeForm:false,//是否弹出选择医生表单
                pageScroll:0,
                formType: 'chooseDoctor',
                flag: true, // 防止重复点击绑定设备按钮
                bodyScrollDistance: ''
            }
        },
        methods:{
            //获取设备列表
            getDeviceList (res) {
                let result = res.data.data;
                if(result.disabeDeviceList.length == 0 && result.hypertensionDeviceList.length == 0){
                    this.noBind=true;
                }else{
                    this.noBind = false;
                    this.diabetesDeviceList = result.disabeDeviceList;
                    this.hypertensionDeviceList = result.hypertensionDeviceList;
                }
            },
            //显示修改设备名称弹窗
            showMessageBox (deviceImei,deviceText,index) {
                this.bodyScrollDistance = document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;
                this.deviceImei = deviceImei;
                this.thisDeviceName = deviceText;
                this.messageBoxIsShow = true ;
                this.devieceIndex = index;
            },
            unBindBtnCallBack (devicesNumber, deviceName, devicesId) {
                this.$router.push({path:"/unbindDevices",query:{devicesNumber: devicesNumber,deviceName: deviceName,deviceId: devicesId}});
            },
            //隐藏修改设备弹窗
            hiddenMessageBox:function(){
                this.messageBoxIsShow = false ;
            },
            //修改设备名称弹窗 确认按钮方法
            confirmDeviceName:function(){
                let defaultText = this.deviceText;//原来的设备名字
                let deviceName = this.thisDeviceName;
                let deviceImei = this.deviceImei;
                let data = {deviceImei:deviceImei,deviceName:deviceName} ;
                let _this = this;
                if(!!(deviceName.trim())&&deviceName!=defaultText){
                    deviceModel.editDeviceName(data,function(res){
                        _this.diabetesDeviceList[_this.devieceIndex].deviceName = deviceName;
                        _this.messageBoxIsShow = false ;
                    })
                }else{
                    this.messageBoxIsShow = false ;
                }
            },
            //限制设备名最大长度
            toMaxLength:function(){
                if(isEmptyString(this.thisDeviceName) !== '' && this.thisDeviceName.length > 10){
                    this.thisDeviceName = this.thisDeviceName.substring(0,10);
                    this.showToast("设备名不能超过10个字符");
                }
            },
            // 获取路传过来的 参数
            GetQueryString:function(){
                return this.$route.params.type;
            },
            //点击设备绑定方法
            callBackBtn1:function() {
                let url = "";
                if (window.__wxjs_is_wkwebview === true) {
                    url = this.firstUrl.split('#')[0]
                } else {
                    url = window.location.href.split('#')[0]
                }

                let _this = this;
                if (_this.flag) {
                    _this.flag = false;
                    commonApiModel.getWxConfig({currentUrl:encodeURIComponent(url, 'UTF-8')},function(res){
                        _this.wxConfig = res.data.data.wxJsConfig;
                        _this.wxConfig.jsApiList = ["scanQRCode"];
                        // _this.wxConfig.debug = true;
                        wx.config(_this.wxConfig);
                        wx.ready(function(){
                            wx.scanQRCode({
                                needResult: 1,
                                scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有,"barCode"
                                desc: 'scanQRCode desc',
                                success: function (res) {
                                    let reg = /imei/i;
                                    let imei,imeiIndex,tempStr;
                                    if (reg.test(res.resultStr)) {
                                        imeiIndex = reg.exec(res.resultStr).index + 5;
                                        tempStr = res.resultStr.substring(imeiIndex, res.resultStr.length);
                                        if (tempStr.indexOf('&') != -1) {
                                            imei = tempStr.substring(0, tempStr.indexOf('&')).trim();
                                        } else {
                                            imei = tempStr.trim();
                                        }
                                    } else {
                                        imei = res.resultStr.trim();
                                    }
                                    let data = {
                                        deviceImei : imei
                                    };
                                    _this.flag = true;
                                    deviceModel.bindDevice(data,function(res){
                                        sessionStorage.setItem("fourthFlag", "444");
                                        if(res.data.data.deviceVo.deviceType == '2' || res.data.data.deviceVo.deviceType == '3'){
                                            userModel.getUserHealthInfo({},function(res){
                                                let result = res.data.data;
                                                if (isEmptyString(result.doctorName) == '') {
                                                    _this.createCascadeForm = true;
                                                }
                                            })
                                        }
                                        deviceModel.getDeviceList({},_this.getDeviceList);
                                    },function(err){
                                        _this.$router.push({path: '/aboutDevices/bindError', query: {imei: err.data.meta.msg}});
                                    });
                                },
                                cancel: function (res) {
                                    _this.flag = true;
                                }
                            });
                        });
                    }, function (err) {
                        _this.flag = true;
                    });
                }
            },
            // 医生选择表单组件关闭对应的处理方法
            closeChooseMask:function(){
                this.createCascadeForm = false;
            }
        },
        components:{
            chooseDoctor,
            deviceList,
            myMask
        },
        directives: {
            validateEmoji
        },
        mounted:function(){
            document.body.style.top = '0px';
            let _this = this;
            let key = this.GetQueryString();
            if(key=="auto"&&!sessionStorage.getItem("fourthFlag")){
                _this.callBackBtn1();
              }
            deviceModel.getDeviceList({},_this.getDeviceList);
        }
    }
</script>
