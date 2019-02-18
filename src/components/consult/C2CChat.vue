<template xmlns:v-bind='http://www.w3.org/1999/xhtml' xmlns:v-gallery='http://www.w3.org/1999/xhtml'>
  <div class='fullPage'>
    <div class="containerHeader">
      <img class="arrowLeft" src="/static/images/default/icon_left.png" @click="onLeftClick">
      <span class="spanTitle">{{getHeaderTitle}}</span>
      <span class="spanRight center-y-right" @click="onRightClick" :style="{color:rightColor}">{{rightText}}</span>
    </div>
    <mescroll-vue ref="mescroll" :up="mescrollUp" :down="mescrollDown" @init="mescrollInit">
      <div class='item' v-for='(item, index) in msgs'>
        <div class="containerCustomMsg" v-if="checkIsEndConsultMsg(item)">
          <label class="time" style="display: inline">{{item.MsgBody[0].MsgContent.Desc}}</label>
          <label class="time" style="display: inline;" v-show="status==0 && type==1">，如果想继续咨询，请点击</label>
          <label class="time" style="display: inline; color: #00c2b1;" v-show="status==0 && type==1" @click="onConsultPayClick">购买服务</label>
        </div>
        <p v-else-if="checkMsgTypeIsPrescription(item)" class="labelPrescriptionDesc">{{item.MsgBody[0].MsgContent.Desc}}</p>
        <p v-else-if="checkMsgTypeIsTransform(item)" class="labelPrescriptionDesc">{{item.MsgBody[0].MsgContent.Desc}}</p>
        <div v-else-if="checkMsgTypeIsRxAudit(item)">
          <label class="time">{{parseTime(item.MsgTimeStamp)}}</label>
          <div class="containerItemLeft">
            <img class="imgLeft" v-bind:src="getLeftHeaderImage(item)">
            <div>
              <div class="containerPrescriptionMsgLeft">
                <p class="pPrescription">诊断:</p>
                <p class="labelPrescription">{{getPrescriptionContent(item)}}</p>
                <p class="labelPrescriptionClick" @click="onPrescriptionClick(item)">点击查看处方详情</p>
              </div>
              <p class="labelPrescriptionDesc">{{item.MsgBody[0].MsgContent.Desc}}</p>
            </div>
          </div>
        </div>
        <div v-else>
          <label class='time'>{{parseTime(item.MsgTimeStamp)}}</label>
          <div class='containerItemLeft' v-if='checkIsLeft(item)'>
            <img class='imgLeft' v-bind:src='getLeftHeaderImage(item)'/>
            <label class='labelMsgLeft'>{{item.MsgBody[0].MsgContent.Text}}</label>
          </div>
          <div class='containerItemRight' v-else>
            <img class='imgRight' v-bind:src='getUserHeaderImage()'>
            <div class='containerDisease containerDiseaseRight' v-if='checkMsgTypeIsImageAndText(item)'>
              <label class="labelDisease0">咨询内容</label>
              <label class="labelDisease1">{{item.MsgBody[0].MsgContent.Desc}}</label>
              <label class="labelDisease0">病例/检查报告/照片</label>
              <div style="display: inline-block;"
                   v-for="url in item.MsgBody[0].MsgContent.Ext.split(';')"
                   v-show="checkPicIsShow(item.MsgBody[0].MsgContent.Ext)">
                <img class="imgDisease"
                     v-bind:src="url"
                     @click="biggerImgShow(url, item.MsgBody[0].MsgContent.Ext.split(';'))"
                />
              </div>
            </div>
            <label v-else class='labelMsgRight'>{{item.MsgBody[0].MsgContent.Text}}</label>
          </div>
        </div>
        <div class="containerFailure">
          <div class="containerSendFailure" v-show="checkSendFailureIsShow(item.SendStatus)">
            <img src="../../../static/images/chat/icon_send_failure.png" class="imgSendStatus">
            <label class="labelStatus">发送失败</label>
          </div>
          <div class="containerResend" v-show="checkSendFailureIsShow(item.SendStatus)">
            <img src="../../../static/images/chat/icon_resend.png" class="imgSendStatus">
            <label class="labelStatus" @click="onResendClick(item, index)">重新发送</label>
          </div>
        </div>
      </div>
    </mescroll-vue>
    <div class='containerBottom' v-show="status!==0">
      <input class='inputMsg' placeholder='请输入内容...' v-model='sendTextContent' maxlength="500"/>
      <!--<div class='containerSendMsg' @click='onSendMsgClick'>-->
      <div class='containerSendMsg' @click='onSendMsgClick' :disabled="isSendDisabled">
        <img class='imgSendMsg' src='../../../static/images/consult/icon_send.png'/>
      </div>
    </div>
    <confirm v-model="isShowModal"
             :title="('')"
             @on-confirm="onModalConfirm"
    >
      <p style="text-align:center;">{{ ('是否确定结束咨询?') }}</p>
    </confirm>
  </div>
</template>

<script>
  import {imModel} from '../../imModel/imModel'
  import {dateFormat} from '../../utils/dateFormat'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import {Confirm} from 'vux'
  import {eventBus, eventKey} from '../../utils/eventBus'
  import {consultModel, userModel, commonApiModel} from '../../api'
  import {constants} from "../../utils/constants";
  import {imManager} from "../../imModel/imManager";

  let wx = require('weixin-js-sdk');
  const SEND_STATUS_FAILURE = -1; // 发送状态：失败
  export default {
    name: 'C2CChat', // 单聊页面
    data() {
      return {
        msgs: [],
        headerTitle: "",
        rightText: "结束咨询",
        receivedMsg: '',
        webim: require('../../../static/js/tencentIMJS/webim.js'),
        SparkMD5: require('../../../static/js/tencentIMJS/spark-md5'),
        accountType: 37073,
        accountMode: 2,// 账号模式，1.托管，其他独立
        sdkAppID: 1400124203,
        toId: 'admin', // 接收方id
        // toId: 'test', // 接收方id
        // identifier: 'admin', // 当前登录用户id
        identifier: '', // 当前登录用户id
        identifierNick: '', // 当前登录用户设置昵称
        customerHeaderImg: '', // 用户头像
        doctorSex: '', // 医生性别
        // 登录用户签名
        userSig: '',
        selSess: null, // 单聊session
        images: null, // 上传成功后的图片对象
        sendTextContent: '', // 发送文本内容
        sessionId: '', // 服务端sessionId
        rightColor: '', // 顶部右侧按钮颜色
        isShowModal: false, // 确认关闭框是否显示标志
        status: 1, // 咨询状态

        mescroll: null, // mescroll实例对象
        mescrollUp: { // 上拉加载的配置.
          use: false,
          // callback: upCallback,
          // page: {
          //   num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          //   size: 10 //每页数据条数,默认10
          // },
          // noMoreSize: 5
        },
        mescrollDown: {
          use: true,
          callback: this.downCallback,
        },
        wxConfig: null,
        isSendDisabled: false,

        type: 1, //类型, 1：咨询(单聊)，2：开处方（群聊）
        groupId: '', // 群id
        groups: [], //成员信息
      }
    },
    methods: {

      // 发送文本消息
      onSendMsgClick: function () {
        if (this.status == 0) {
          this.showToast('当前咨询已结束');
          return;
        }
        const msgToSend = this.sendTextContent;//最大长度1200
        if (msgToSend == '') {
          this.showToast('请输入内容')
          return;
        }
        this.isSendDisabled = true
        setTimeout(() => {
          this.isSendDisabled = false
        }, 1000)
        if (!this.selSess) {
          this.selSess = imModel.initSession(this.type, this.toId)
        }
        const random = Math.round(Math.random() * 429496729) // 消息随机数，用于去重
        imModel.sendTextMsg(this.type, this.selSess, this.toId, this.identifier, this.identifierNick, msgToSend, random, (resp) => {
          this.sendTextContent = ''
          webim.currentMsg.MsgTimeStamp = new Date().getTime();
          this.msgs.push(webim.currentMsg)
          let msgBody = JSON.stringify(webim.currentMsg.MsgBody).toString()
          let time = new Date().getTime();
          let data = {
            'sessionId': this.sessionId,
            'sdkSessionId': this.selSess._impl.id,
            'fromAccount': this.identifier,
            'toAccount': this.toId,
            'msgRandom': random,
            'msgBody': msgBody,
            'isRead': 0,
            'msgContent': msgToSend,
            'msgTimeStamp': time,
            'msgTime': time
          }
          consultModel.addMessage(data)
          this.scrollToBottom()
        }, (err) => {
          console.log(err.ErrorInfo)
          this.sendTextContent = ''
          let failMsg = {
            "From_Account": this.identifier,
            "To_Account": this.toId,
            "MsgTimeStamp": new Date().getTime(),
            "MsgSeq": -1,
            "MsgRandom": random,
            "SendStatus": SEND_STATUS_FAILURE,
            "MsgBody": [
              {
                "MsgType": "TIMTextElem",
                "MsgContent": {
                  "Text": msgToSend
                }
              }
            ]
          };
          this.msgs.push(failMsg);
          this.scrollToBottom();
        })
      },

      // 上传文件
      uploadFile: function () {
        let inputDOM = this.$refs.inputer
        // 通过DOM取文件数据
        imModel.uploadFile(inputDOM, this.identifier, this.toId, (resp) => {
          this.images = resp
          this.receivedMsg = '上传图片成功'
        }, (err) => {
          console.log(err.ErrorInfo)
        })
      },

      // 检测是否为自定义消息（咨询结束消息）
      checkIsEndConsultMsg: function (item) {
        return (item.MsgBody[0].MsgType == 'TIMCustomElem') && (item.MsgBody[0].MsgContent.Data == imModel.customMsgKeyEndConsult)
      },

      // 检测是否消息是否显示在左边
      checkIsLeft: function (item) {
        return item.From_Account !== this.identifier // 发送方非当前登录用户，消息显示在左边
      },

      // 检测消息类型是否为图文消息
      checkMsgTypeIsImageAndText: function (item) {
        return (item.MsgBody[0].MsgType == 'TIMCustomElem') && (item.MsgBody[0].MsgContent.Data == imModel.customMsgKeyStartConsult)
      },

      // 检测消息类型是否为医生开处方
      checkMsgTypeIsPrescription: function (item) {
        return (item.MsgBody[0].MsgType == 'TIMCustomElem') && (item.MsgBody[0].MsgContent.Data == imModel.customMsgKeyPrescribe)
      },

      // 检测消息类型是否为转诊
      checkMsgTypeIsTransform: function (item) {
        return (item.MsgBody[0].MsgType == 'TIMCustomElem') && (item.MsgBody[0].MsgContent.Data == imModel.customMsgKeyTransform)
      },

      // 检测消息类型是否为药师审核
      checkMsgTypeIsRxAudit: function (item) {
        return (item.MsgBody[0].MsgType == 'TIMCustomElem') && (item.MsgBody[0].MsgContent.Data == imModel.customMsgKeyRxAudit)
      },

      // 滚动条置于最低端
      scrollToBottom: function () {
        let container = document.querySelector('.mescroll');
        this.$nextTick(() => {
          container.scrollTop = container.scrollHeight
        })
        // let timer = setInterval(() => {
        //   // container.scrollTo(0, container.scrollHeight); // 发送成功后滚动消息到最底部
        //   container.scrollTop = container.scrollHeight
        //   clearInterval(timer)
        // }, 500)
      },

      // 解析时间
      parseTime: function (time) {
        if (time == null || typeof time == 'undefined' || time.length == 0) {
          return ''
        } else {
          if (time.toString().length == 10) {
            time = time * 1000
          }
          return dateFormat.getFormatDateByLong(time, 'yyyy-MM-dd hh:mm')
        }
      },

      getParams() {
        // 取到路由带过来的参数
        let query = this.$route.query;
        this.identifier = sessionStorage.getItem('cid');
        this.toId = query.toId;
        this.sessionId = query.sessionId
        this.status = query.status;
        this.headerTitle = query.toName;
        this.type = query.type;
      },

      // mescroll组件初始化的回调,可获取到mescroll对象
      mescrollInit(mescroll) {
        this.mescroll = mescroll
      },

      downCallback: function () {
        let data = {}
        let firstFlag = true
        if (this.msgs.length !== 0) {
          data = {
            'pageNo': 1,
            'pageSize': 10,
            'sessionId': this.sessionId,
            'lastMessageTime': dateFormat.getFormatDateByLong(this.msgs[0].MsgTimeStamp, 'yyyy-MM-dd hh:mm:ss')
          }
          firstFlag = false
        } else {
          data = {'pageNo': 1, 'pageSize': 10, 'sessionId': this.sessionId}
        }
        consultModel.getMessageList(data, res => {
          let tempArray = res.data.data.consultList
          for (var i = 0; i < tempArray.length; i++) {
            let tempMsg = tempArray[i]
            let msg = {
              'From_Account': tempMsg.fromAccount,
              'To_Account': tempMsg.toAccount,
              'MsgRandom': tempMsg.msgRandom,
              'MsgTimeStamp': new Date(tempMsg.createTime).getTime(),
              'MsgBody': JSON.parse(tempMsg.msgBody)
            }
            this.msgs.splice(0, 0, msg);
          }
          if (tempArray.length < 10) {
            this.mescroll.lockDownScroll(true);
          } else {
            this.mescroll.lockDownScroll(false);
          }
          this.$nextTick(() => {
            this.mescroll.endSuccess()
          })
          if (firstFlag) {
            this.scrollToBottom()
          }
        }, (res) => {
          this.$nextTick(() => {
            this.mescroll.endErr()
          })
        })
      },
      onRightClick: function () {
        if (this.status !== 0) {
          this.isShowModal = true
        }
      },
      onLeftClick: function () {
        history.go(-1);
      },
      onModalConfirm: function () {
        consultModel.closeConsult({'sessionId': this.sessionId}, res => {
          if (this.selSess == null) {
            this.selSess = imModel.initSession(this.type, this.toId);
          }
          imModel.sendCustomMsg(this.selSess, this.identifier, imModel.customMsgKeyEndConsult,
            imModel.customMsgDescEndConsult, imModel.customMsgDescEndConsult, (res) => {
              webim.currentMsg.MsgTimeStamp = webim.currentMsg.MsgTimeStamp * 1000
              this.msgs.push(webim.currentMsg)
              let msgBody = JSON.stringify(webim.currentMsg.MsgBody).toString()
              let time = new Date().getTime()
              let data = {
                'sessionId': this.sessionId,
                'sdkSessionId': this.selSess._impl.id,
                'fromAccount': this.identifier,
                'toAccount': this.toId,
                'msgRandom': Math.round(Math.random() * 429496729), // 消息随机数，用于去重,
                'msgBody': msgBody,
                'isRead': 0,
                'msgContent': imModel.customMsgDescEndConsult,
                'msgTimeStamp': time,
                'msgTime': time
              }
              consultModel.addMessage(data, (res) => {
              }, (res) => {
              })
              this.status = 0
              this.setRightText()
              this.scrollToBottom()
            }, (res) => {
              console.log('im send customMsg fail')
            })
        }, res => {
          console.log('close consult fail')
        })
      },
      // 设置head右侧文本及样式
      setRightText() {
        if (this.status == 0) {
          this.rightColor = '#999999';
          this.rightText = '已结束';
        } else {
          this.rightColor = '#619aeb';
          this.rightText = '结束咨询';
        }
      },
      onConsultPayClick: function () {
        this.$router.push({
          path: '/findDoctor/doctorDetail',
          query: {
            doctorId: this.toId
          }
        });
      },
      getServiceIntroduce() {
        consultModel.getConsultService({userId: this.toId}, res => {
          this.status = res.data.data.consultSession.status
        })
      },
      biggerImgShow(currentUrl, urlArray) {
        let _this = this
        if (this.wxConfig == null) {
          let url = ''
          if (window.__wxjs_is_wkwebview == true) {
            url = this.firstUrl.split('#')[0]
          } else {
            url = window.location.href.split('#')[0]
          }
          commonApiModel.getWxConfig({currentUrl: encodeURIComponent(url, 'UTF-8')}, function (res) {
            _this.wxConfig = res.data.data.wxJsConfig;
            _this.wxConfig.jsApiList = ['previewImage']
            wx.config(_this.wxConfig)
            wx.ready(function () {
              wx.previewImage({
                current: currentUrl, // 当前显示图片的http链接
                urls: urlArray // 需要预览的图片http链接列表
              });
            })
          })
        } else {
          wx.ready(function () {
            wx.previewImage({
              current: currentUrl, // 当前显示图片的http链接
              urls: urlArray // 需要预览的图片http链接列表
            })
          })
        }
      },

      checkPicIsShow: function (url) {
        return url != null && url.length !== 0
      },

      getUserHeaderImage: function () {
        if (this.customerHeaderImg == null) {
          return '../../../static/images/customer/home_pic_woman.png'
        } else {
          return this.customerHeaderImg
        }
      },
      getLeftHeaderImage: function (item) {
        if (this.type == imModel.TYPE_CONSULT){
          if (this.doctorSex == 1) {
            return '../../../static/images/findDoctor/doctor_man.png'
          } else {
            return '../../../static/images/findDoctor/doctor_women.png'
          }
        } else {
          for (let i = 0; i < this.groups.length; i++) {
            let group = this.groups[i];
            if (item.From_Account == group.memberId) {
              if (group.type == constants.GROUP_TYPE_DOCTOR) {
                return group.sex == constants.SEX_TYPE_MALE ? '../../../static/images/findDoctor/doctor_man.png' : '../../../static/images/findDoctor/doctor_women.png'
              } else if (group.type == constants.GROUP_TYPE_HEALTH_MANAGER){
                return group.sex == constants.SEX_TYPE_MALE ? '../../../static/images/recipe/ic_health_manager_m.png' : '../../../static/images/recipe/ic_health_manager_f.png';
              }
            }
          }
          return '../../../static/images/findDoctor/doctor_man.png'
        }
      },
      getSessionStatus: function () {
        consultModel.getSessionInfoBySessionId({
          sessionId: this.sessionId
        }, res => {
          this.status = res.data.data.consultSession.status
          this.groups = res.data.data.consultSession.groups
          this.setRightText()
        })
      },
      checkSendFailureIsShow: function (SendStatus) {
        if (SendStatus !== 'undefined' && SendStatus == SEND_STATUS_FAILURE) {
          return true;
        } else {
          return false;
        }
      },
      onResendClick: function (item, index) {
        const msgToSend = item.MsgBody[0].MsgContent.Text;//最大长度1200
        if (!this.selSess) {
          this.selSess = imModel.initSession(this.type, this.toId);
        }
        const random = Math.round(Math.random() * 429496729);//消息随机数，用于去重
        imModel.sendTextMsg(this.type, this.selSess, this.toId, this.identifier, this.identifierNick, msgToSend, random, (resp) => {
          webim.currentMsg.MsgTimeStamp = new Date().getTime();
          this.$set(this.msgs, index, webim.currentMsg)
          let msgBody = JSON.stringify(webim.currentMsg.MsgBody).toString()
          let time = new Date().getTime()
          let data = {
            'sessionId': this.sessionId,
            'sdkSessionId': this.selSess._impl.id,
            'fromAccount': this.identifier,
            'toAccount': this.toId,
            'msgRandom': random,
            'msgBody': msgBody,
            'isRead': 0,
            'msgContent': msgToSend,
            'msgTimeStamp': time,
            'msgTime': time
          }
          consultModel.addMessage(data)
          this.scrollToBottom()
        }, (err) => {
          this.showToast("重新发送失败，请检查您的网络设置")
        })
      },

      // 查看处方详情
      onPrescriptionClick: function (item) {
        let recipeId = JSON.parse(item.MsgBody[0].MsgContent.Ext).infoId;
        this.$router.push({path: '/recipe/recipeDetail', query: {recipeId: recipeId, isFromChat: '1'}});
      },

      getPrescriptionContent: function(item){
        let ext = JSON.parse(item.MsgBody[0].MsgContent.Ext);
        return ext.firstContent;
      }
    },
    components: {
      MescrollVue,
      Confirm
    },
    mounted() {
      this.getParams()
      this.setRightText()
      this.getSessionStatus();
      consultModel.setSessionReaded({'sessionId': this.sessionId}, res => {
        // 上传消息已读
        eventBus.$emit(eventKey.imNewMsgForClear, 0)
      })
      userModel.getUserInfo({ratio: "yes"}, res => {
        this.customerHeaderImg = sessionStorage.getItem("imgDomain") + res.data.data.customerVo.headimgurl
      });
    },
    beforeCreate: function () {
      if(!webim.checkLogin()){
        imManager.initIM()
      }
      eventBus.$on(eventKey.imNewMsgForC2CChat, target => {
        console.log('C2CChat receive newMsg =>' + JSON.stringify(target))
        if ((this.type == imModel.TYPE_CONSULT && target.From_Account == this.toId) ||
          (this.type == imModel.TYPE_PRESCRIPTION && target.To_Account == this.toId && target.From_Account != this.identifier && target.From_Account != '@TIM#SYSTEM')) {
          this.msgs.push(target)
          this.scrollToBottom()
          // 收到消息后设置当前会话消息状态为已读
          let data = {'sessionId': this.sessionId}
          consultModel.setSessionReaded(data, res => {
            // 上传消息已读
          })
          if (this.checkIsEndConsultMsg(target)) {
            this.getSessionStatus();
          }
        }
      })
    },
    beforeDestroy() {
      eventBus.$off(eventKey.imNewMsgForC2CChat);
    },
    computed: {
      getHeaderTitle () {
        return this.headerTitle = this.headerTitle.length > 12 ? this.headerTitle.substring(0, 12) + '...' : this.headerTitle;
      }
    }
  }
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

  .fullPage {
    width: 100%;
    height: 100%;
    background-color: #f3f3f7;
  }

  .containerHeader {
    position: relative;
    width: 100%;
    height: 0.96rem;
    line-height: 0.96rem;
    background: white;
    border-bottom: 1px solid #F3F3F3;
  }

  .arrowLeft {
    position: absolute;
    display: inline-block;
    width: 0.3rem;
    height: 0.48rem;
    left: 0.2rem;
    top: 0.26rem;
  }

  .spanTitle {
    font-size: 0.36rem;
    color: #000000;
  }

  .spanRight {
    font-size: 0.36rem;
    color: #619aeb;
    right: 0.3rem;
  }

  /*以fixed的方式固定mescroll的高度*/
  .mescroll {
    position: fixed;
    width: 100%;
    height: auto;
    top: 0.96rem;
    bottom: 1rem;
  }

  .item {
    width: 100%;
    float: left;
    padding: 0.3rem 0 0 0;
  }

  .time {
    width: 100%;
    text-align: center;
    display: block;
    font-size: 0.28rem;
    color: #999999;
  }

  .containerItemLeft {
    width: 88%;
    margin: 0.33rem;
  }

  .imgLeft {
    display: inline-block;
    width: 0.8rem;
    height: 0.8rem;
    float: left;
    margin: 0 0.36rem 0 0;
  }

  .containerDisease {
    display: inline-block;
    max-width: 78%;
    background-color: #ffffff;
    border-radius: 6px;
    padding: 0.3rem 0.3rem 0.2rem 0.3rem;
    float: left;
    text-align: left;
  }

  .labelMsgLeft {
    display: inline-block;
    max-width: 70%;
    float: left;
    text-align: left;
    background-color: white;
    border-radius: 0.06rem;
    font-size: 0.30rem;
    color: #333333;
    padding: 0.3rem 0.3rem 0.3rem 0.3rem;
  }

  .containerDiseaseRight {
    float: right;
    margin-right: 0.3rem;
    background-color: #00c2b1;
  }

  .labelDisease0 {
    display: block;
    font-size: 0.26rem;
    color: white;
    margin: 0 0 0.1rem 0;
  }

  .labelDisease1 {
    display: block;
    font-size: 0.3rem;
    color: white;
    margin: 0 0 0.3rem 0;
  }

  .imgDisease {
    display: inline-block;
    width: 1.11rem;
    height: 1.11rem;
    background-color: #ffffff;
    border-radius: 0.04rem;
    margin: 0 0.3rem 0.1rem 0;
  }

  .containerItemRight {
    width: 100%;
    padding: 0.33rem 0.36rem;
  }

  .labelMsgRight {
    display: inline-block;
    max-width: 78%;
    float: right;
    margin-right: 0.3rem;
    background-color: #00c2b1;
    border-radius: 0.06rem;
    font-size: 0.30rem;
    color: #fefefe;
    padding: 0.3rem 0.3rem 0.3rem 0.3rem;
    text-align: left;
  }

  .imgRight {
    display: inline-block;
    width: 0.8rem;
    height: 0.8rem;
    float: right;
    border-radius: 0.8rem;
  }

  .containerBottom {
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    background-color: #ffffff;
    border-top: 1px solid #dddde4;
    position: fixed;
    bottom: 0;
  }

  .inputMsg {
    width: 80%;
    height: 0.7rem;
    background-color: #ffffff;
    border-radius: 0.04rem;
    border: solid 1px #dddde4;
    padding: 0 0.2rem 0 0.2rem;
    float: left;
    margin: 0.15rem 0 0 0.3rem;
    font-size: 0.32rem;
  }

  .containerSendMsg {
    width: 0.7rem;
    height: 0.7rem;
    border-radius: 0.7rem;
    background-color: #78adf7;
    margin: 0.15rem 0.3rem 0 0.2rem;
    float: right;
  }

  .imgSendMsg {
    width: 0.3rem;
    height: 0.3rem;
    margin: 0.2rem 0.2rem 0.2rem 0.2rem;
  }

  .containerCustomMsg {
    wdith: 50%;
    padding-left: 25%;
    padding-right: 25%;
  }

  .containerFailure {
    position: relative;
    width: 71%;
    float: right;
    margin-right: 1.45rem;
    text-align: right;
    margin-top: 0.2rem;
  }

  .containerSendFailure {
    display: inline-block;
    width: 1.64rem;
    height: 0.50rem;
    line-height: 0.50rem;
    background-color: #bcc8d8;
    border-radius: 0.04rem;
    text-align: center;
  }

  .containerResend {
    display: inline-block;
    width: 1.64rem;
    height: 0.50rem;
    line-height: 0.50rem;
    background-color: #78adf7;
    border-radius: 0.04rem;
    text-align: center;
  }

  .imgSendStatus {
    display: inline-block;
    width: 0.18rem;
    height: 0.18rem;
    margin: 0.15rem 0.08rem 0 0;
  }

  .labelStatus {
    display: inline-block;
    font-size: 0.24rem;
    color: #ffffff;
  }

  .containerPrescriptionMsgLeft{
    display: inline-block;
    width: 78%;
    /*float: left;*/
    text-align: left;
    background-color: white;
    border-radius: 0.06rem;
    font-size: 0.30rem;
    color: #333333;
    padding: 0.3rem 0.3rem 0.2rem 0.3rem;
  }

  .pPrescription {
    font-size: 0.30rem;
    color: #333333;
  }

  .labelPrescription {
    width: 100%;
    display: inline-block;
    font-size: 0.30rem;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;;
  }

  .labelPrescriptionClick {
    font-size: 0.30rem;
    color: #619aeb;
    margin-top: 0.1rem;
  }

  .labelPrescriptionDesc {
    width: 100%;
    padding: 0.3rem 20% 0rem 20%;
    font-size: 0.28rem;
    color: #999999;
    text-align: center;
  }

</style>
