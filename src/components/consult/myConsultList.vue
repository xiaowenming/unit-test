<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class='fullPage'>
    <commomHeader :headerTitle='headerTitle'
                  :rightIsShow='false'
                  :showAdd='false'
                  :goBackTwo='false'
    ></commomHeader>
    <mescroll-vue class="containerScroll" ref="mescroll" :up="mescrollUp" @init="mescrollInit">
      <div class="item" v-for="item in consultList" @click="onItemClick(item)">
        <img class="imgHeader fl" v-bind:src="getHeaderImage(item)">
        <div class="itemCenter fl">
          <div class="itemTop">
            <div class="topBox" v-overFlowXConsultList>
              <span class="eachItem fontSize32">{{item.nickname}}</span>
              <!--<span v-if="!!item.job" class="eachItem dotorJob tac">{{item.userJob}}</span>-->
              <!--<span class="eachItem">({{item.userDepartmentName}})</span>-->
            </div>
          </div>
          <div class="itemBottom">
            <div class="bottomBox">
              <label class="labelOrgName color999 fontSize28" v-if="!!item.lastMessage">{{item.lastMessage.length > 12 ? item.lastMessage.substring(0 ,12) + '...' : item.lastMessage}}</label>
            </div>
          </div>
        </div>
        <label class="labelStatus" v-bind:style="getStatusColor(item.status)">{{getStatusDesc(item.status)}}</label>
        <img class="imgEnter" src="../../../static/images/customer/home_but_enter.png">
        <label class="labelUnreadCount" v-if="item.unreadCount > 0">{{item.unreadCount > 99 ? 99 :
          item.unreadCount}}</label>
      </div>
    </mescroll-vue>
  </div>
</template>

<style scoped lang="less">
  ::-webkit-scrollbar{width:0;height:0}
  .fullPage {
    width: 100%;
    height: 100%;
    background-color: #efeff4;
  }

  .item {
    position: relative;
    width: 100%;
    height: 1.4rem;
    border-bottom: 1px solid #e0e0e0;
    background: white;
    text-align: left;
  }

  .imgHeader {
    width: 0.8rem;
    height: 0.8rem;
    background-color: #ffffff;
    border: solid 0.04rem #f4f4f4;
    border-radius: 0.8rem;
    margin: 0.3rem 0.3rem 0 0.3rem;
  }

  .itemCenter {
    width: 4.3rem;
    height: 1.4rem;
    .itemTop,.itemBottom{
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.3rem;
      width: 200%;
    }
    .itemTop{
      margin-top: 0.3rem;
      width: 4rem;
      overflow-x: scroll;
      .topBox{
        min-width: 100%;
        .dotorJob{
          display: inline-block;
          height: 0.4rem;
          line-height: 0.4rem;
          background-color: #78adf7;
          border-radius: 2px;
          color: #ffffff;
          padding: 0 0.1rem;
        }
      }
    }
    .itemBottom{
      width: 4.3rem;
      .bottomBox{
        min-width: 110%;
      }
    }
  }

  .labelStatus {
    position: absolute;
    font-size: 0.34rem;
    color: #fb9120;
    right: 0.7rem;
    top: 0.44rem;
  }

  .imgEnter {
    position: absolute;
    width: 0.18rem;
    height: 0.3rem;
    top: 0.55rem;
    right: 0.3rem;
  }

  .labelUnreadCount {
    display: inline-block;
    position: absolute;
    left: 0.8rem;
    top: 0.25rem;
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
  import commomHeader from '../commomComponents/header';
  import MescrollVue from 'mescroll.js/mescroll.vue'
  import {eventBus, eventKey} from '../../utils/eventBus'
  import {consultModel} from '../../api'
  import {overFlowXConsultList} from '../../directives'
  import {imModel} from '../../imModel/imModel';
  import {imManager} from "../../imModel/imManager";
  const STATUS_CLOSED = 0 // 已关闭
  const STATUS_WAITING = 1 // 待咨询
  const STATUS_CONSULTING = 2 // 咨询中
  export default {
    name: 'myConsultList', // 我的咨询列表
    data() {
      return {
        headerTitle: '我的消息',
        consultList: [],
        pageSize: 10,
        currentPage: 1,

        mescroll: null, // mescroll实例对象
        mescrollUp: { // 上拉加载的配置.
          callback: this.upCallback,
          page: {
            num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
            size: 10 //每页数据条数,默认10
          },
          noMoreSize: 5,
          webim: require('../../../static/js/tencentIMJS/webim.js'),
        },
      }
    },
    methods: {
      mescrollInit(mescroll) {
        this.mescroll = mescroll
      },
      upCallback (page, mescroll) {
        consultModel.getConsultList({pageNo: this.mescrollUp.page.num, pageSize: this.mescrollUp.page.size}, res => {
          this.consultList = this.consultList.concat(res.data.data.consultList);
          let resultArray = res.data.data.consultList
          if (page.num === 1) {
            this.consultList = [];
          }
          this.consultList = this.consultList.concat(resultArray)
          this.$nextTick(() => {
            mescroll.endSuccess(resultArray.length);
          })
        }, (res) => {
          mescroll.endErr();
        });
      },
      getStatusDesc(status) {
        if (status == STATUS_CLOSED) {
          return '结束咨询'
        } else if (status == STATUS_WAITING) {
          return '待咨询'
        } else if (status == STATUS_CONSULTING) {
          return '咨询中'
        } else {
          return ''
        }
      },
      getStatusColor(status) {
        if (status == STATUS_CLOSED) {
          return 'color:#999999;'
        } else if (status == STATUS_WAITING) {
          return 'color:#fb9120;'
        } else if (status == STATUS_CONSULTING) {
          return 'color:#29d1a8;'
        }
      },
      getConsultList() {
        consultModel.getConsultList({pageNo: this.currentPage, pageSize: this.pageSize}, res => {
          this.consultList = this.consultList.concat(res.data.data.consultList);
        });
      },
      onItemClick(item) {
        if (item.type === imModel.TYPE_CONSULT && item.status === STATUS_WAITING) { // 类型为咨询，且状态为待咨询，跳转提交咨询页面
          this.$router.push({
            path: '/consult/subConsult',
            query: {
              sessionId: item.sessionId, // sessionId
              doctorId: item.targetId, // 医生id
              doctorName: item.nickname // 医生名称
            }
          })
        } else { // 其他情况都跳转聊天页面
          this.$router.push({
            path: '/consult/C2CChat',
            query: {
              toId: item.type === imModel.TYPE_CONSULT ? item.targetId : item.groupId, // 发送方id(咨询为患者id，群聊为群id)
              toName: item.nickname, // 接收方昵称
              sessionId: item.sessionId, // 服务端sessionId
              status: item.status, // 咨询状态
              type: item.type // 类型：1.咨询，2.开处方
            }
          })
        }
      },
      getHeaderImage: function (item) {
        if (item.type === 1) {
          return item.sex === 1 ? '../../../static/images/findDoctor/doctor_man.png' : '../../../static/images/findDoctor/doctor_women.png'
        } else {
          return '../../../static/images/recipe/ic_group.png'
        }
      }
    },
    components: {
      commomHeader,
      MescrollVue
    },
    directives: {
      overFlowXConsultList
    },
    created() {

    },
    beforeCreate: function () {
      if (!webim.checkLogin()) {
         imManager.initIM();
      }
      eventBus.$on(eventKey.imNewMsgForMsgList, target => {
        this.mescrollUp.page.num = 1
        console.log("myConsultList on receive")
        consultModel.getConsultList({pageNo: this.mescrollUp.page.num, pageSize: this.mescrollUp.page.size}, res => {
          this.consultList = this.consultList.concat(res.data.data.consultList);
          let resultArray = res.data.data.consultList
          this.consultList = [];
          this.consultList = this.consultList.concat(resultArray)
        }, (res) => {

        });
      })
    },
    beforeDestroy() {
      eventBus.$off(eventKey.imNewMsgForMsgList);
    },
  }
</script>
