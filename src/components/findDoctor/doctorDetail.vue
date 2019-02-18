<template>
  <div class="doctorDetailPage fullPage">
    <commomHeader
      :headerTitle='headerTitle'
      :rightIsShow='false'
      :showAdd='false'
      :goBackTwo='false'>
    </commomHeader>
    <div class="banner w100">
      <img class="headerImg" :src="userInfo.headerImgUrl" alt="">
      <p class="userInfo"><span class="doctorName">{{userInfo.nickname}}</span><span v-if="!!userInfo.job" class="job">{{userInfo.job}}</span>
      </p>
      <p class="hospitalInfo"><span class="hospital">{{userInfo.organizationName}}</span> | <span class="department">{{userInfo.departmentName}}</span>
      </p>
    </div>
    <div class="doctorIntroduce tal">
      <div class="title">
        <span>医生介绍</span>
        <i :class="{icon: true, fr: true, rotate: isRotate1}" @click="showAllIntroduce"></i>
      </div>
      <div :class="{content: true, w100: true, showPart: showPart1}">{{consultService.userIntroduce}}</div>
    </div>
    <div class="doctorIntroduce tal serviceIntroduce">
      <div class="title">
        <span>咨询服务介绍</span>
        <i :class="{icon: true, fr: true, rotate: isRotate2}" @click="showAllService"></i>
      </div>
      <div :class="{content: true, w100: true, showPart: showPart2}">{{consultService.serviceIntroduce}}</div>
    </div>
    <div :class="{btn: true,bgRed: bgRed, bgGreen: bgGreen}" @click="btnCallback">{{btnText}}</div>
  </div>
</template>
<style lang="less" scoped>
  .doctorDetailPage {
    overflow: scroll;

  .banner {
    height: 3.2rem;
    background: url('/static/images/findDoctor/sj_bg.png') no-repeat;
    background-size: cover;
    padding-top: 0.4rem;
    color: #fff;

  .headerImg {
    width: 1.2rem;
    height: 1.2rem;
    border: 2px solid #f4f4f4;
    border-radius: 50%;
    margin: 0 auto;
    margin-bottom: 0.25rem;
  }

  .userInfo {

  .doctorName {
    font-size: 0.34rem;
    padding-right: 5px;
    vertical-align: middle;
  }

  .job {
    padding: 3px;
    background-color: #FBAC20;
  }

  }
  .hospitalInfo {

  .hospital, .department {
    font-size: 0.28rem;
  }

  }
  }
  .doctorIntroduce {
    padding: 0.3rem;

  .title {
    height: 0.9rem;
    line-height: 0.9rem;
    color: #666;
    font-size: 0.3rem;

  .icon {
    height: 0.24rem;
    width: 0.24rem;
    box-sizing: border-box;
    border: 2px solid #C7C7CC;
    margin-top: 0.25rem;
    transform: rotate(45deg);
    border-top-color: transparent;
    border-left-color: transparent;
  }

  .icon.rotate {
    transform: rotate(-135deg);
  }

  }
  .content {
    font-size: 0.32rem;
    line-height: 0.44rem;
    color: #333;
  }

  .content.showPart {
    height: 1.32rem;
    overflow: hidden;
  }

  }
  .btn {
    height: 1rem;
    line-height: 1rem;
    position: fixed;
    bottom: 0;
    width: 100%;
    color: #fff;
    font-size: 0.3rem;
  }

  .bgRed {
    background-color: #ED4949;
  }

  .bgGreen {
    background-color: #00C2B1;
  }

  .serviceIntroduce {
    margin-bottom: 1rem;
  }

  }

</style>
<script>
  import commomHeader from '../commomComponents/header';
  import md5 from "js-md5";
  import {callpay, payCallBack} from '../../utils/pay.js'
  import {consultModel} from '../../api'
  import {validateString} from '../../utils/validate'
  import {imModel} from "../../imModel/imModel";
  export default {
    name: 'doctorDetail',
    data() {
      return {
        headerTitle: '医生详情',
        userInfo: {},
        consultService: {},
        showPart1: true,
        showPart2: true,
        btnText: '',
        isRotate1: false,
        isRotate2: false,
        hasConsult: null, // 有无资询
        consultStatus: '',
        bgRed: false, // 控制背景颜色红色
        bgGreen: false, // 控制背景颜色绿色
        sessionId: '', // 会话id
        doctorId: '', // 医生id
        webim: require('../../../static/js/tencentIMJS/webim.js'),
      }
    },
    methods: {
      showAllIntroduce() {
        this.showPart1 = !this.showPart1;
        this.isRotate1 = !this.isRotate1;
      },
      showAllService() {
        this.showPart2 = !this.showPart2;
        this.isRotate2 = !this.isRotate2;
      },
      getDoctorInfo() {
        consultModel.getDoctorInfo({userId: this.$route.query.doctorId}, res => {
          this.userInfo = res.data.data.userInfo;
          this.userInfo.headerImgUrl = this.userInfo.sex == '2' ? '/static/images/findDoctor/doctor_women.png' : '/static/images/findDoctor/doctor_man.png';
        });
      },
      getServiceIntroduce() {
        consultModel.getConsultService({userId: this.$route.query.doctorId}, res => {
          this.consultService = res.data.data.consultService;
          this.getConsultStatus();
        });
      },
      getConsultStatus() {
        consultModel.getSessionInfo({
          userId: this.$route.query.doctorId,
          customerId: sessionStorage.getItem('cid')
        }, res => {
          this.consultStatus = res.data.data.consultSession.status;
          this.sessionId = res.data.data.consultSession.sessionId || '';
          if (!this.consultStatus || this.consultStatus == '0') {
            this.hasConsult = false;
            this.btnText = '购买咨询服务: ' + this.consultService.servicePrice / 100 + '元/次';
            this.bgRed = true;
            this.bgGreen = false;
          } else if (this.consultStatus == '1') {
            this.hasConsult = true;
            this.btnText = '点击咨询';
            this.bgRed = false;
            this.bgGreen = true;
          } else {
            this.hasConsult = true;
            this.btnText = '继续咨询';
            this.bgRed = false;
            this.bgGreen = true;
          }
        });
      },
      btnCallback() {
        if (!this.hasConsult) {
          this.payConfig();
        } else {
          if (validateString(this.sessionId)) {
            this.toEachPage();
          } else {
            consultModel.getSessionInfo({
              userId: this.$route.query.doctorId,
              customerId: sessionStorage.getItem('cid')
            }, res => {
              this.sessionId = res.data.data.consultSession.sessionId;
              this.toEachPage();
            })
          }
        }
      },
      toEachPage () {
        if (this.consultStatus == '1') {
          this.$router.push({path: '/consult/subConsult', query: {sessionId: this.sessionId, doctorId: this.doctorId, doctorName: this.userInfo.nickname}});
        } else {
          this.$router.push({path: '/consult/C2CChat',query: {
            toId: this.doctorId, // 发送方id
            toName: this.userInfo.nickname, // 发送方昵称
            sessionId: this.sessionId, // 服务端sessionId
            status: this.consultStatus, // 咨询状态
            type: imModel.TYPE_CONSULT // 聊天类型：咨询
          }});
        }
      },
      payConfig() { // 配置支付参数
        let data = {
          serviceId: this.consultService.serviceId,
          appType: '1',
          payType: '1',
          feeType: 'CNY',
          tradeType: 'JSAPI',
          body: '咨询费用'
        }
        consultModel.consultPay(data, res => {
          let wxData = res.data.data.wxData;
          callpay(wxData, (res) => {
            let callBackObj = {successCallBack: this.paySuccessCallBack};
            payCallBack(res, callBackObj);
          });
        });
      },
      paySuccessCallBack () {
          this.consultStatus = '1';
          this.hasConsult = true;
          this.btnText = '点击咨询';
          this.bgRed = false;
          this.bgGreen = true;
      }
    },
    created() {
      this.doctorId = this.$route.query.doctorId;
      this.getDoctorInfo();
      this.getServiceIntroduce();
    },
    components: {
      commomHeader
    }
  }
</script>
