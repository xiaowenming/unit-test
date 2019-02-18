<template>
  <div class="subConsultPage fullPage">
    <commomHeader
      :headerTitle='headerTitle'
      :rightIsShow='false'
      :showAdd='false'
      :goBackTwo='false'>
    </commomHeader>
    <div class="modelTitle w100 tal">咨询内容</div>
    <textarea class="consultContent w100 bgWhite" placeholder="请详细描述您的疾病、身体状况、过往重大疾病及想要活得的帮助" v-model="desc"></textarea>
    <div class="modelTitle w100 tal">上传图片</div>
    <p class="imgExplain bgWhite tal">检查报告、B超、X光、身体症状图片等</p>
    <div class="reportBox bgWhite clearfix">
      <div class="imgBox fl" v-for="(item, index) in imgList" :key="index">
        <div :class="{eachImg: true, pr:true, marginRightHide: (index + 1) % 4 == 0}">
          <div class="cancelBtn" @click="cancelImg(index)"></div>
          <img class="fullPage" :src="item" alt="" @click="bigerImgShow(item)">
        </div>
      </div>
      <div v-show="imgList.length < 9" class="addImgBtn fl" @click="uploadImg"></div>
    </div>
    <div class="confirmConsult" @click="onConfirmConsultClick">确定咨询</div>
  </div>
</template>
<style lang="less" scoped>
  .subConsultPage {
    background-color: #EFEFF4;

  .modelTitle {
    height: 0.8rem;
    color: #666;
    font-size: 0.34rem;
    line-height: 0.8rem;
    padding-left: 0.3rem;
    background-color: #f4f4f4;
  }

  .consultContent {
    border: none;
    height: 5rem;
    padding: 0.3rem;
    font-size: 0.34rem;
  }

  .consultContent::-webkit-input-placeholder {
    color: #999;
  }

  .imgExplain {
    height: 0.9rem;
    line-height: 0.9rem;
    font-size: 0.34rem;
    color: #999;
    padding-left: 0.3rem;
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
    background-color: #00C2B1;
  }

  }
</style>
<script>
  import commomHeader from '../commomComponents/header'
  import {imModel} from "../../imModel/imModel";
  import {commonApiModel, consultModel} from '../../api'
  import {imManager} from "../../imModel/imManager";

  let wx = require('weixin-js-sdk');
  export default {
    data() {
      return {
        headerTitle: '提交咨询',
        localIds: [],
        imgList: [],
        wxConfig: {},
        base64StrList: [],
        sessionId: '',
        doctorId: '',
        doctorName: '',
        sdkSession: '',
        uploadedImages: [],
        desc: '',
        webim: require('../../../static/js/tencentIMJS/webim.js'),
        lastSubmitClickTime: 0, // 上次提交时间，防止重复点击
      }
    },
    methods: {
      uploadImg() {
        let url = "";
        let _this = this;
        if (window.__wxjs_is_wkwebview === true) {
          url = this.firstUrl.split('#')[0]
        } else {
          url = window.location.href.split('#')[0]
        }
        commonApiModel.getWxConfig({currentUrl: encodeURIComponent(url, 'UTF-8')}, function (res) {
          _this.wxConfig = res.data.data.wxJsConfig;
          _this.wxConfig.jsApiList = ['chooseImage', 'previewImage', 'uploadImage', 'downloadImage'];
          // _this.wxConfig.debug = true;
          wx.config(_this.wxConfig);
          wx.ready(function () {
            //选择图片或者拍摄
            wx.chooseImage({
              count: 9 - _this.imgList.length, // 默认9
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                // 返回一个数组
                _this.localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

                _this.$vux.loading.show({
                  text: '正在上传图片'
                });
                _this.localIds.forEach((item, index) => {
                  wx.getLocalImgData({
                    localId: item, // 图片的localID
                    success: function (res) {
                      let base64Str;
                      if (window.__wxjs_is_wkwebview) {
                        let index = res.localData.indexOf(',');
                        base64Str = (res.localData).substring(index + 1, res.localData.length);
                      } else {
                        base64Str = res.localData;
                      }
                      _this.base64StrList.push(base64Str);
                      if (index >= _this.localIds.length - 1) {
                        _this.imgList = _this.imgList.concat(_this.localIds);
                        _this.$vux.loading.hide();
                      }
                    }
                  })
                });
              }
            });
          });
        });
      },
      bigerImgShow(item) {
        let _this = this;
        wx.config(this.wxConfig);
        wx.ready(function () {
          wx.previewImage({
            current: item, // 当前显示图片的http链接
            urls: _this.imgList // 需要预览的图片http链接列表
          });
        })
      },
      cancelImg(index) {
        this.imgList.splice(index, 1);
        this.base64StrList.splice(index, 1);
      },
      onConfirmConsultClick: function () {
        let currentTime = new Date().getTime();
        console.log(currentTime - this.lastSubmitClickTime)
        if (currentTime - this.lastSubmitClickTime < 2000) {
          return;
        }
        this.lastSubmitClickTime = currentTime;
        if (this.desc.trim().length === 0) {
          this.showToast('请输入咨询内容')
          return;
        }
        this.$vux.loading.show({
          text: '提交数据中'
        })
        if (this.sdkSession === '') {
          this.sdkSession = imModel.initSession(imModel.TYPE_CONSULT, this.doctorId)
        }
        this.uploadedImages = [];
        if (this.base64StrList.length > 0) {
          this.upload(0);
        } else {
          this.submitConsult('')
        }
      },
      showUploadFail: function () {
        this.$vux.loading.hide();
        this.showToast('上传图片失败')
      },
      upload: function (i) {
        if (i < this.base64StrList.length) {
          this.uploadBase64('/common/v1/uploadImage', {data: this.base64StrList[i]}, res => {
            this.uploadedImages.push('http://aicare.oss-cn-shenzhen.aliyuncs.com/' + res.data.data.pressImgUrl.toString().replace('press_', ''))
            i++;
            this.upload(i)
          }, fail => {
            this.$vux.loading.hide()
            this.showToast('上传失败')
          })
        } else {
          let downUrls = ''
          for (let j = 0; j < this.uploadedImages.length; j++) {
            downUrls += this.uploadedImages[j]
            if (j !== this.uploadedImages.length - 1) {
              downUrls += ';'
            }
          }
          this.submitConsult(downUrls)
        }
      },
      getParams: function () {
        this.sessionId = this.$route.query.sessionId
        this.doctorId = this.$route.query.doctorId
        this.doctorName = this.$route.query.doctorName
      },
      submitConsult: function (downUrls) {
        let cid = sessionStorage.getItem('cid')
        imModel.sendStartConsultMsg(this.sdkSession, cid, this.desc, downUrls, (res) => {
          let msgBody = JSON.stringify(webim.currentMsg.MsgBody).toString()
          let time = new Date().getTime();
          let data = {
            'sessionId': this.sessionId,
            'sdkSessionId': this.sdkSession._impl.id,
            'fromAccount': cid,
            'toAccount': this.doctorId,
            'msgRandom': Math.round(Math.random() * 429496729),
            'msgContent': this.desc,
            'msgTimeStamp': time,
            'msgTime': time,
            'isRead': 0,
            'msgBody': msgBody
          }
          // this.identifier = sessionStorage.getItem('cid');
          // this.toId = query.toId;
          // this.sessionId = query.sessionId
          // this.status = query.status;
          // this.headerTitle = query.toName;
          // this.type = query.type;
          consultModel.addMessage(data, (res) => {
            // history.go(-2)
            consultModel.subConsult({'sessionId': this.sessionId}, (res) => {
              this.$vux.loading.hide();
              this.$router.replace({
                path: '/consult/C2CChat',
                query: {
                  toId: this.doctorId, // 发送方id
                  sessionId: this.sessionId, // 服务端sessionId
                  status: 1, // 咨询状态,
                  toName: this.doctorName, // 发送方昵称
                  type: imModel.TYPE_CONSULT // 聊天类型：咨询
                }
              })
            }, (res) => {
              this.$vux.loading.hide();
              this.showToast(res.data.meta.msg)
            }, err => {
            })
          }, (res) => {
            this.$vux.loading.hide();
            this.showToast(res.data.meta.msg)
          })
        }, (res) => {
          this.$vux.loading.hide();
          this.showToast(JSON.stringify(res))
        })
      }
    },
    components: {
      commomHeader
    },
    created: function () {
      this.getParams()
      if (!webim.checkLogin()) {
        imManager.initIM()
      }
    }
  }
</script>
