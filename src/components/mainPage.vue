<template>
  <div class="mainPage fullPage">
    <keep-alive>
      <component :is="currentComponents"></component>
    </keep-alive>
    <div class="footerTab w100">
      <ul>
        <li class="eachTab fl w33 h100" v-for="(item, index) in tabList" :key="index" @click="changeTab(index)">
          <div class="top">
            <img v-show="currentIndex != index" :src="mainUrl + item.normalIcon" alt="图片被火星人吃了">
            <img v-show="currentIndex == index" :src="mainUrl + item.choosedIcon" alt="图片被火星人吃了">
          </div>
          <div :class="{bottom:true, tac: true, textChooseColor:index == currentIndex}">{{item.text}}</div>
        </li>
      </ul>
      <label class="labelUnreadCount" v-show="unreadCount!==0">{{unreadCount}}</label>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .footerTab {
    height: 1rem;
    position: fixed;
    bottom: 0;
    border-top: 1px solid #CFD9DF;
    background-color: #fff;

  .eachTab {

  .top {
    height: 0.6rem;
    padding-top: 0.15rem;

  img {
    width: 0.45rem;
    height: 0.45rem;
    margin: 0 auto;
  }

  }
  .bottom {
    height: 0.4rem;
    line-height: 0.4rem;
  }

  .textChooseColor {
    color: #29D1A8;
  }

  }
  }

  .labelUnreadCount {
    display: inline-block;
    position: absolute;
    right: 12%;
    bottom: 0.55rem;
    width: 0.32rem;
    height: 0.32rem;
    background-color: #ff2e33;
    font-size: 0.22rem;
    color: #ffffff;
    border-radius: 0.32rem;
    text-align: center;
  }
</style>

<script>
  import md5 from 'js-md5'
  import {tabList,tabListZhangHu} from '../config/home'
  import healthModel from './home/healthModel'
  import pointStore from './point/pointStore'
  import mineModel from './home/mineModel'
  import {eventBus, eventKey} from '../utils/eventBus'
  import {consultModel} from '../api'
  import {imManager} from '../imModel/imManager'
  export default {
    name: "mainPage",
    data() {
      return {
        tabList: [],
        mainUrl: '/static/images/home/',
        currentIndex: 0,
        componentsList: ['healthModel', 'pointStore', 'mineModel'],
        unreadCount: 0,
      }
    },
    methods: {
      changeTab(index) {
        this.currentIndex = index;
      },
      getUnreadCount: function () {
        consultModel.getUnreadConsultSum({}, res => {
          this.unreadCount = res.data.data.unreadCount
        })
      }
    },
    created: function () {
      this.tabList = this.isAicaresHealth ? tabListZhangHu : tabList;
      if (this.isAicaresHealth && !!sessionStorage.getItem('cid')) {
        imManager.initIM()
        this.getUnreadCount()
        eventBus.$on(eventKey.imNewMsgForMine, target => {
          console.log("mainPage receive imNewMsgForMine")
          this.getUnreadCount();
        })
        eventBus.$on(eventKey.imNewMsgForClear, target => {
          console.log("mainPage receive imNewMsgForClear")
          this.getUnreadCount();
        })
      }
    },
    beforeDestroy() {
      eventBus.$off(eventKey.imNewMsgForMine);
      eventBus.$off(eventKey.imNewMsgForClear);
    },
    computed: {
      currentComponents() {
        return this.componentsList[this.currentIndex];
      }
    },
    components: {
      healthModel,
      pointStore,
      mineModel
    },
    beforeCreate: function () {
      eventBus.$on(eventKey.imNewMsgForClear, target => {
        this.getUnreadCount();
      })
    },
    beforeDestroy() {
      eventBus.$off(eventKey.imNewMsgForClear);
    },
  };
</script>
