<template>
  <div class="uploadReportPage fullPage bgWhite">
        <commomHeader :headerTitle="headerTitle" :showArrow="showArrow" :rightIsShow="rightIsShow" :showText="showText" :rightText="rightText"></commomHeader>
        <div class="addReportBox">
            <img  @click="uploadImg" src="/static/images/sugarTestReport/upload_Photograph.png" alt="">
            <div class="addBtn" @click="uploadImg">上传报告</div>
        </div>
        <div class="myReport">
            <p class="title tal">我的报告</p>
            <div class="imgContainer clearfix">
                <div :class="{imgBox:true,pr:true,fl:true}" v-for="(item, index) in imgList" :key="index">
                    <img class="pressImg" :src="imgDomain + item.pressReportUrl" alt="" @click="bigerImgShow(item)">
                    <div class="bottom tal">
                        <span class="imgName">{{item.reportName}}</span>
                        <i class="deleteImg" @click="deleteReport(item.reportId)"></i>
                    </div>
                    <div class="uploadTime pr">
                        <i></i>
                        <p class="tal">{{item.updateTime.replace(/\-/g,'/').substring(0,16)}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="messageBox" v-show="show">
            <div class="content center-y">
                <div class="messageBoxTop tal">
                    <span class="title">报告名称</span>
                </div>
                <div class="messageBoxCenter">
                    <input type="text" class="deviceName" v-on:input="toMaxLength()" v-validateEmoji placeholder="请输入报告名称" v-model="reportName">
                </div>
                <div class="messageBoxBottom clearfix">
                    <a class="fl btnCancel" href="javascript:void(0)" @click="hiddenMessageBox">取消</a>
                    <a class="fr btnConfirm" href="javascript:void(0)" @click="confirmDeviceName">确认</a>
                </div>
            </div>
        </div>
        <div v-transfer-dom class="helpConfirm">
            <confirm v-model="helpShow"
            :title="('使用帮助')"
            @on-cancel="helpCancel"
            @on-confirm="helpConfirm">
                <div v-html="helpContent"></div>
            </confirm>
        </div>
        <div v-transfer-dom class="uploadReportConfirm">
            <confirm v-model="deleteReportShow"
            :title="('确认删除报告')"
            @on-cancel="deleteReportCancel"
            @on-confirm="deleteReportConfirm">
            </confirm>
        </div>
        <div class="helpBtn" @click="showHelp"></div>
  </div>
</template>
<style>
    .uploadReportConfirm .weui-dialog__hd{
        text-align: left;
        color: #000;
        font-weight: 700;
    }
    .uploadReportConfirm .weui-dialog__bd{
        padding: 1em 1.4em 0.8em;
    }
    .uploadReportConfirm .weui-dialog__bd input{
        width: 100%;
        height: 0.9rem;
        line-height: 0.9rem;
        padding-left: 0.3rem;
        border-radius: 0.08rem;
        border: 1px solid #cecece;
    }
    .helpConfirm .weui-dialog__btn_default{
        display: none;
    }
    .helpConfirm .weui-dialog__title,
    .helpConfirm .weui-dialog__btn_primary{
        font-size: 0.30rem;
    }
    .helpConfirm .weui-dialog__btn_primary{
        color: #00C2B1;
    }
    .helpConfirm .weui-dialog__title{
        font-weight: 700;
    }
    .helpConfirm .weui-dialog__bd{
        height: 5.35rem;
        overflow: scroll;
        font-size: 0.28rem;
        line-height: 0.36rem;
    }
    .helpConfirm .fw700{
        color: #000;
        font-weight: 700;
    }
    .helpConfirm .indent1{
        text-indent: 1em;
    }
    .helpConfirm .colorRed{
        color: #E95959;
    }
    .helpConfirm .fgx{
        height: 0.2rem;
        width: 100%;
    }
</style>

<style lang="less" scoped>
    .addReportBox img{
        height: 1.95rem;
        width: auto;
        margin: 30px auto 0;
    }
    .addReportBox .addBtn{
        width: 6.7rem;
        height: 0.8rem;
        margin: 0 auto;
        line-height: 0.8rem;
        font-size: 0.42rem;
        color: #3BC083;
        margin-bottom: 0.6rem;
        border-radius: 0.1rem;
    }
    .myReport .title{
        padding-left: 0.3rem;
        font-size: 0.34rem;
        color: #111;
    }
    .myReport .imgContainer{
        padding: 0.3rem;
        padding-bottom: 0;
    }
    .imgContainer .imgBox{
        width: 3.24rem;
        height: 3.24rem;
        margin-right: 0.42rem;
        margin-bottom: 1rem;
        background-color: #000;
    }
    .imgContainer .imgBox:nth-child(2n + 0){
        margin-right: 0;
    }
    .imgContainer .imgBox .pressImg{
        width: auto;
        height: auto;
        margin: 0 auto;
        max-width: 100%;
        max-height: 100%;
    }
    .imgBox .bottom{
        width: 100%;
        height: 0.74rem;
        line-height: 0.74rem;
        padding-left: 0.2rem;
        font-size: 0.28rem;
        position: absolute;
        bottom: 0;
        left: 0;
        color: #fff;
        background: url('/static/images/sugarTestReport/upload_delete_zhezhao.png') no-repeat;
        background-size: cover;
    }
    .imgBox .bottom .deleteImg{
        height: 0.38rem;
        width: 0.34rem;
        position: absolute;
        right:0.2rem;
        top:0.18rem;
        background: url('/static/images/sugarTestReport/upload_delete.png') no-repeat;
        background-size: cover;
    }
    .imgBox .uploadTime{
        height: 0.4rem;
        line-height: 0.4rem;
        font-size: 0.28rem;
        padding-left: 0.4rem;
    }
    .imgBox .uploadTime i{
        width: 0.22rem;
        height: 0.22rem;
        position: absolute;
        left: 0.09rem;
        top: 0.09rem;
        background: url('/static/images/sugarTestReport/icon_time.png');
        background-size: cover;
    }
    .helpBtn{
        height: 0.38rem;
        width: 1.44rem;
        position: absolute;
        right: 0.4rem;
        top: 0.3rem;
    }
    .messageBox{
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        float: left;
        background-color: rgba(0, 0, 0, .3);
    }
    .messageBox .content{
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
        font-size: 0.36rem;
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
    import commomHeader from '../commomComponents/header'
    import { Group,Confirm, TransferDomDirective as TransferDom } from 'vux'
    import {testData} from '../../js/protocol'
    import {uploadReportHelpText} from '../../js/protocol'
    import {validateEmoji} from '../../directives'
    import {isEmptyString} from '../../utils/utils'
    import {reportModel, commonApiModel, userModel} from '../../api'

    let wx = require('weixin-js-sdk');
    export default {
        name:"uploadReport",
        data (){
            return {
                headerTitle: '检测报告',
                showArrow: true,
                rightIsShow:true,
                showText:"showText",
                rightText:"使用帮助",
                wxConfig: {},
                show: false,
                localIds: [],
                reportName: '',
                pageNo: 1,
                pageSize: 100,
                imgList: [],
                previewImgList:[],
                imgDomain: '',
                bigerImgIsShow: false,
                bigerImgUrl: '',
                helpShow: false, // 帮助痰喘
                helpContent: uploadReportHelpText,
                deleteReportShow: false, // 删除报告弹窗
                reportId: ''
            }
        },
        components: {
            commomHeader,
            Confirm,
            Group
        },
        directives: {
            TransferDom,
            validateEmoji
        },
        methods: {
            uploadImg: function () {
                let url = "";
                let _this = this;
                if (window.__wxjs_is_wkwebview === true) {
                    url = this.firstUrl.split('#')[0]
                } else {
                    url = window.location.href.split('#')[0]
                }
                if (this.imgList.length * 1 < 10) {
                    commonApiModel.getWxConfig({currentUrl:encodeURIComponent(url, 'UTF-8')}, function (res) {
                        _this.wxConfig = res.data.data.wxJsConfig;
                        _this.wxConfig.jsApiList = ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage'];
                        // _this.wxConfig.debug = true;
                        wx.config(_this.wxConfig);
                        wx.ready(function () {
                            //选择图片或者拍摄
                            wx.chooseImage({
                                count: 1, // 默认9
                                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                                success: function (res) {
                                    // 返回一个数组
                                    _this.show = true;
                                    _this.localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                                }
                            });
                        });
                    });
                } else {
                    this.showToast('暂时您只能上传10张报告');
                }
                
            },
            hiddenMessageBox: function () {
                this.show = false;
            },
            confirmDeviceName: function () {
                let _this = this;
                if (isEmptyString(this.reportName) == '') {
                    this.showToast('请填写报告名');
                } else if ((this.reportName).length > 8) {
                    this.showToast('报告名称不能多余8个字符');
                } else {
                    this.show = false;
                    this.$vux.loading.show({
                        text: '正在上传图片'
                    });
                    wx.config(this.wxConfig);
                    wx.ready(function () {
                        wx.getLocalImgData({
                            localId:  _this.localIds[0], // 图片的localID
                            success: function (res) {
                                let base64Str;
                                if (window.__wxjs_is_wkwebview) {
                                    let index = res.localData.indexOf(',');
                                    base64Str = (res.localData).substring(index+1, res.localData.length);
                                } else {
                                    base64Str = res.localData;
                                }
                                let reportData = {
                                    "reportName": _this.reportName,
                                    "data": base64Str
                                }
                                _this.uploadBase64('/customer/v1/uploadReport', reportData, function (result) {
                                    _this.reportName = '';
                                    _this.$vux.loading.hide();
                                    _this.getImgList();
                                })
                            }
                        })
                    })
                }
            },
            // 后台获取图片列表
            getImgList: function () {
                let _this =this;
                userModel.getReportImg({pageNo: this.pageNo, pageSize: this.pageSize}, function(res){
                    _this.imgList = res.data.data.data;
                    _this.imgDomain = res.data.data.imgDomain;
                    _this.previewImgList = _this.imgList.map((item, index) => {
                        return _this.imgDomain + item.reportUrl;
                    });
                });
            },
            bigerImgShow: function (item) {
                let _this = this;
                // this.bigerImgIsShow = true;
                // this.bigerImgUrl = this.imgDomain + item.reportUrl;
                wx.config(this.wxConfig);
                wx.ready(function () {
                    wx.previewImage({
                        current: _this.imgDomain + item.reportUrl, // 当前显示图片的http链接
                        urls: _this.previewImgList // 需要预览的图片http链接列表
                    });
                })
            },
            bigerImgHide: function () {
                this.bigerImgIsShow = false;
            },
            deleteReport: function (id) {
                this.deleteReportShow = true;
                this.reportId = id;
            },
            showHelp: function () {
                this.helpShow = true;
            },
            helpConfirm: function () {

            },
            helpCancel: function () {

            },
            deleteReportConfirm: function () {
                reportModel.selectReport({reportId:this.reportId}, res => {
                    this.getImgList();
                });
            },
            deleteReportCancel: function () {

            }
        },
        created: function () {
            this.getImgList();
        },
        beforeDestroy: function () {
            this.$vux.loading.hide();
        }
    }
</script>