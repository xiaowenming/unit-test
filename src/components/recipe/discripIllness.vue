<template>
    <div class="fullPage discripIllnessPage pr">
        <commomHeader :headerTitle="headerTitle"></commomHeader>
        <div class="normalInput eachItem pr hasArrow" @click="toDrugStore">
            <div class="fl left tal">请选择药店</div>
            <input type="text" v-model="drugStoreName" readonly class="fr h100 right tar" placeholder="未选择">
            <i class="arrow center-y"></i>
        </div>
        <div class="normalInput eachItem pr hasArrow" @click="toAllergicHistory">
            <div class="fl left tal">过敏史</div>
            <input type="text" v-model="allergic" readonly class="fr h100 right tar" placeholder="未选择">
            <i class="arrow center-y"></i>
        </div>
        <div class="modelTitle tal">病情描述</div>
        <textarea class="discripIllness w100" v-model="illnessDetail" maxlength="100" :placeholder="textareaPlaceHolder"></textarea>
        <div class="modelTitle tal">上传图片</div>
        <p class="imgExplain bgWhite tal">请上传相关就诊资料(病历、检验检查)以便医生更准确的为您诊断</p>
        <div class="reportBox bgWhite clearfix">
        <div class="imgBox fl" v-for="(item, index) in imgList" :key="index">
            <div :class="{eachImg: true, pr:true, marginRightHide: (index + 1) % 4 == 0}">
            <div class="cancelBtn" @click="cancelImg(index)"></div>
            <img class="fullPage" :src="item" alt="" @click="bigerImgShow(item)">
            </div>
        </div>
        <div v-show="imgList.length < 9" class="addImgBtn fl" @click="uploadImg"></div>
        </div>
        <div class="confirmConsult bgBase" @click="subIllDiscription">提交</div>
    </div>
</template>
<style lang="less" scoped>
    .discripIllnessPage{
        background: #EFEFF4;
        padding-bottom: 1rem;
        overflow-y: scroll;
    }
    .eachItem input{
        width: 4.5rem;
    }
    .modelTitle{
        height: 0.8rem;
        line-height: 0.8rem;
        padding-left: 0.3rem;
        background-color: #F4F4F4;
        color: #666;
        font-size: 0.32rem;
    }
    .discripIllness{
        display: block;
        padding: 0.3rem;
        height: 5rem;
        border: none;
        font-size: 0.35rem;
        line-height: 0.35rem;
    }
    .discripIllness::-webkit-input-placeholder{
        color: #B6B6B6;
        font-size: 0.35rem;
    }
    .imgExplain {
        font-size: 0.34rem;
        color: #999;
        padding: 0.2rem 0.3rem;
    }
    .reportBox {
        padding-bottom: 0.5rem;
        padding-left: 0.3rem;
        padding-right: 0.3rem;
        .imgBox {
            .eachImg {
                width: 1.58rem;
                height: 1.58rem;
                margin-right: 0.19rem;
                margin-bottom: 0.19rem;
                .cancelBtn {
                    width: 0.4rem;
                    height: 0.4rem;
                    position: absolute;
                    right: -0.2rem;
                    top: -0.2rem;
                    background: url('/static/images/consult/cancel.png') no-repeat;
                    background-size: cover;
                }
            }
            .eachImg.marginRightHide {
                margin-right: 0;
            }
        }
        .addImgBtn {
            width: 1.58rem;
            height: 1.58rem;
            background: url('/static/images/consult/icon_p.png') no-repeat;
            background-size: cover;
        }
    }
    .confirmConsult {
        height: 1rem;
        line-height: 1rem;
        position: fixed;
        bottom: 0;
        width: 100%;
        color: #fff;
        font-size: 0.3rem;
    }
</style>
<script>
import commomHeader from "../commomComponents/header";
import {commonApiModel, recipeModel} from '../../api';
import {validateString} from '../../utils/validate'
let wx = require('weixin-js-sdk');
export default {
    name: 'discripIllness',
    data () {
        return{
            headerTitle: '病情描述',
            textareaPlaceHolder:'请详细描述您的病症、病情，以便医生能更好的诊断',
            imgList: [],
            wxConfig: {},
            localIds: [],
            drugStoreName: '',
            allergic: '',
            illnessDetail: '',
            imgUrlList: [], // 传到后台的图片url字符串
            subFlage: true,
            base64StrList: []
        }
    },
    methods: {
        toDrugStore () {
            this.cachIllnessDetail();
            this.$router.push({path:'/recipe/chooseDrugStore'});
        },
        toAllergicHistory () {
            this.cachIllnessDetail();
            this.$router.push('/recipe/allergicHistory');
        },
        uploadImg () {
            let url = "";
            if (window.__wxjs_is_wkwebview === true) {
                url = this.firstUrl.split('#')[0]
            } else {
                url = window.location.href.split('#')[0]
            }
            commonApiModel.getWxConfig({currentUrl: encodeURIComponent(url, 'UTF-8')}, res => {
                this.wxConfig = res.data.data.wxJsConfig;
                this.wxConfig.jsApiList = ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage'];
                // this.wxConfig.debug = true;
                wx.config(this.wxConfig);
                wx.ready(() => {
                    //选择图片或者拍摄
                    wx.chooseImage({
                        count: 9 - this.imgList.length, // 默认9
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: (res) => {
                            // 返回一个数组
                            this.localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

                            this.$vux.loading.show({
                                text: '正在上传图片'
                            });
                            this.localIds.forEach((item, index) => {
                                wx.getLocalImgData({
                                    localId: item, // 图片的localID
                                    success: (res) => {
                                        let base64Str;
                                        if (window.__wxjs_is_wkwebview) {
                                            let index = res.localData.indexOf(',');
                                            base64Str = (res.localData).substring(index + 1, res.localData.length);
                                        } else {
                                            base64Str = res.localData;
                                        }
                                        this.base64StrList.push(base64Str);
                                        if (index >= this.localIds.length - 1) {
                                            this.imgList = this.imgList.concat(this.localIds);
                                            sessionStorage.setItem('illnessImgList', JSON.stringify(this.imgList));
                                            sessionStorage.setItem('illnessImgUrlList', JSON.stringify(this.imgUrlList));
                                            this.$vux.loading.hide();
                                        }
                                    }
                                })
                            });
                        }
                    });
                });
            });
        },
        upload (i) {
            if (i < this.base64StrList.length) {
                this.uploadBase64('/common/v1/uploadImage', {data: this.base64StrList[i]}, res => {
                    this.imgUrlList.push(res.data.data.pressImgUrl);
                    i++;
                    this.upload(i);
                }, err => {
                    this.$vux.loading.hide();
                    this.showToast('上传失败');
                });
            } else {
                this.$vux.loading.hide();
                this.addRecip();
            }
        },
        cachIllnessDetail () {
            if (validateString(this.illnessDetail)) {
                sessionStorage.setItem('illnessDetail', this.illnessDetail);
            }
        },
        bigerImgShow (item) {
            let _this = this;
            wx.config(this.wxConfig);
            wx.ready(function () {
            wx.previewImage({
                current: item, // 当前显示图片的http链接
                urls: _this.imgList // 需要预览的图片http链接列表
            });
            })
        },
        cancelImg (index) {
            this.imgList.splice(index, 1);
            this.localIds.splice(index, 1);
            this.base64StrList.splice(index, 1);
        },
        subIllDiscription () {
            if (!validateString(this.drugStoreName)) {
                this.showToast('请选择药店');
            } else if (!validateString(this.allergic)) {
                this.showToast('请选择过敏史');
            } else if (!validateString(this.illnessDetail)) {
                this.showToast('请填写病情描述');
            } else if (this.imgList.length == 0) {
                this.showToast('请上传就诊资料图片');
            } else {
                if (this.subFlage) {
                    this.subFlage = false;
                    this.$vux.loading.show({
                        text: '正在提交'
                    });
                    this.upload(0);
                }
            }
        },
        addRecip () {
            let allergicHistoryData = JSON.parse(sessionStorage.getItem('allergicData'));
            let drugStoreData = JSON.parse(sessionStorage.getItem('durgStoreData'));
            let caseHistoryImgUrl = '';
            this.imgUrlList.forEach(item => {
                caseHistoryImgUrl = caseHistoryImgUrl + item + ',';
            });
            caseHistoryImgUrl = caseHistoryImgUrl.substring(0, caseHistoryImgUrl.length - 1);
            let data = {
                allergicHistory: allergicHistoryData.allergicHistoryItem + allergicHistoryData.allergicDetail || '',
                storeId: drugStoreData.storeId,
                storeName: drugStoreData.storeName,
                storeAddress: drugStoreData.storeAddress,
                caseHistory: this.illnessDetail,
                caseHistoryImgUrl: caseHistoryImgUrl
            };
            recipeModel.addRecipeConsult(data, res => {
                sessionStorage.removeItem('allergicData');
                sessionStorage.removeItem('durgStoreData');
                sessionStorage.removeItem('illnessImgList');
                sessionStorage.removeItem('illnessDetail');
                sessionStorage.removeItem('illnessImgUrlList');
                this.subFlage = true;
                this.$router.push('/');
            }, err => {
                this.showToast('提交失败 , 请稍后再试');
                this.subFlage = true;
            });
        },
        getDrugStoreData (code) {
            return JSON.parse(sessionStorage.getItem(code));
        }
    },
    created () {
        if (this.getDrugStoreData('durgStoreData')) {
            this.drugStoreName = this.getDrugStoreData('durgStoreData').storeName;
        } else {
            this.drugStoreName = '';
        }
        if (this.getDrugStoreData('allergicData')) {
            this.allergic = this.getDrugStoreData('allergicData').allergicHistoryItem;
        } else {
            this.allergic = '';
        }
        if (sessionStorage.getItem('illnessImgList')) {
            this.imgList = JSON.parse(sessionStorage.getItem('illnessImgList'));
            this.imgUrlList = JSON.parse(sessionStorage.getItem('illnessImgUrlList'));
        }
        if (sessionStorage.getItem('illnessDetail')) {
            this.illnessDetail = sessionStorage.getItem('illnessDetail');
        }
    },
    components: {
        commomHeader
    }
}
</script>
