<template>
  <div class="mineModelPage fullPage">
    <div class="top pr">
      <div class="bgBanner w100"></div>
      <div class="userInfoModel">
        <img class="userHeaderImg" :src="userInfo.headimgurl" alt="">
        <p class="userType">{{userTypeText}}</p>
        <p class="infoPercent">资料完成度<span class="percent">{{percent}}</span>% , <span class="addInfo" @click="toUserRegister">去完善</span></p>
        <p class="userScore">积分: <span class="sumScore">{{userInfo.customerScore}}</span></p>
      </div>
    </div>
    <div class="bottom">
      <div class="title tal pr"><span></span>我的</div>
      <ul class="clearfix">
        <li
          :class="{w33: true, fl: true, pr:true, borderRight: item.borderRight, borderBottom: item.borderBottom}"
          :style="{background: 'url('+mainUrl+item.icon+') no-repeat', backgroundSize: 'cover'}"
          v-for="(item, index) in mineModelList" :key="index"
          @click="toEachPage(item, index)">
          <div class="messageTip tac" v-if="item.messageTipShow">{{item.messageSum}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .mineModelPage {
    overflow-y: scroll;
    background-color: #F4F4F9;

  .top {

  .bgBanner {
    height: 3.19rem;
    background: url('/static/images/home/bg.png') no-repeat;
    background-size: cover;
    margin-bottom: 0.62rem;
  }

  .userInfoModel {
    width: 6.89rem;
    height: 2.6rem;
    background: url('/static/images/home/bg_02.png') no-repeat;
    background-size: cover;
    position: absolute;
    top: 1rem;
    left: 0.305rem;

  .userHeaderImg {
    width: 1.16rem;
    height: 1.16rem;
    border: 2px solid #fff;
    box-sizing: border-box;
    border-radius: 50%;
    margin: 0 auto;
    margin-top: -0.58rem;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }

  .userType, .userScore {
    margin-top: 0.3rem;
    color: #444;
  }

  .infoPercent {
    margin-top: 0.1rem;
    color: #999;

  .addInfo {
    color: #00C09E;
  }

  }
  .userScore {
    color: #999;

  .sumScore {
    color: #FBAC20;
  }

  }
  }
  }
  .bottom {
    background-color: #fff;

  .title {
    height: 0.7rem;
    line-height: 0.7rem;
    font-size: 0.2rem;
    padding-left: 0.5rem;
    color: #444;
    border-bottom: 1px solid #EFEFF4;

  span {
    height: 0.24rem;
    width: 0.04rem;
    position: absolute;
    left: 0.3rem;
    top: 0.25rem;
    background-color: #FBAC20;
  }

  }
  ul {
    margin-bottom: 1rem;

  li {
    height: 1.5rem;

  .messageTip {
    width: 0.4rem;
    height: 0.4rem;
    line-height: 0.4rem;
    background-color: #f00;
    color: #fff;
    position: absolute;
    right: 0.75rem;
    top: 0.1rem;
    border-radius: 50%;
    font-size: 0.22rem;
  }

  }
  .borderRight {
    border-right: 1px solid #F4F4F9;
  }

  .borderBottom {
    border-bottom: 1px solid #F4F4F9;
  }

  }
  }
  }
</style>
<script>
  import {mineModelList, zhanghuMineModelList} from '../../config/home'
  import {eventBus, eventKey} from '../../utils/eventBus'
  import {userModel, consultModel} from '../../api'
  export default {
    name: 'mineModel',
    data() {
      return {
        userTypeText: '',
        percent: '',
        mainUrl: '/static/images/home/',
        userInfo: {},
        mineModelList: []
      }
    },
    methods: {
      getUserInfo() {
        if (!!sessionStorage.getItem("cid")) {
          userModel.getUserInfo({ratio: "yes"}, res => {
            this.userInfo = res.data.data.customerVo;
            // //1男2女
            if (!!this.userInfo.headimgurl && this.userInfo.headimgurl != "undefined") {
              this.userInfo.headimgurl = sessionStorage.getItem("imgDomain") + this.userInfo.headimgurl;
            } else if (this.userInfo.sex == '2') {
              this.userInfo.headimgurl = this.thisPageBaseUrl + "home_pic_woman.png";
            } else {
              this.userInfo.headimgurl = this.thisPageBaseUrl + "home_pic_man.png";
            }
            this.percent = res.data.data.ratio.toFixed(1);
            sessionStorage.setItem("nickname", this.userInfo.nickname);
          });
        } else {
          this.userInfo.customerScore = 0;
          this.userInfo.nickname = sessionStorage.getItem("nickname");
          this.userInfo.headimgurl = !!sessionStorage.getItem('headimgurl') ? sessionStorage.getItem("imgDomain") + sessionStorage.getItem('headimgurl') : (sessionStorage.getItem('sex') == 2 ? this.thisPageBaseUrl + "home_pic_woman.png" : this.thisPageBaseUrl + "home_pic_man.png");
          this.percent = "0";
        }
      },
      toEachPage(item, index) {
        if (item.type == 'push') {
          this.$router.push(item.path);
        } else if (item.type == 'jump') {
          window.location.href = item.path;
        }
      },
      getUnreadMessageSum() {
        consultModel.getUnreadConsultSum({}, res => {
          if (res.data.data.unreadCount > 0) {
            this.mineModelList[3].messageTipShow = true;
            this.mineModelList[3].messageSum = res.data.data.unreadCount > 99 ? 99 : res.data.data.unreadCount;
          } else {
            this.mineModelList[3].messageTipShow = false;
          }
        })
      },
      toUserRegister () {
        this.$router.push('/userRegister/userRegister');
      }
    },
    created() {
      this.mineModelList = this.isAicaresHealth ? zhanghuMineModelList : mineModelList;
      this.getUserInfo();
      if (this.isAicaresHealth && !!sessionStorage.getItem('cid')) {
        this.getUnreadMessageSum();
      }
    },
    beforeCreate: function () {
      eventBus.$on(eventKey.imNewMsgForMine, target => {
        this.getUnreadMessageSum();
      })
      eventBus.$on(eventKey.imNewMsgForClear, target => {
        this.getUnreadMessageSum();
      })
    },
    beforeDestroy() {
      eventBus.$off(eventKey.imNewMsgForMine);
      eventBus.$off(eventKey.imNewMsgForClear);
    },
  }
</script>
