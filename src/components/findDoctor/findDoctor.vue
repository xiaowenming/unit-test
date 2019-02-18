<template xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class='findDoctorPage fullPage'>
    <commomHeader
        :headerTitle='headerTitle'
        :rightIsShow='false'
        :showAdd='false'
        :goBackTwo='false'
    ></commomHeader>
    <mescroll-vue class="containerScroll" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <div class="item" v-for="(item, index) in doctorList" :key="index" @click="toDoctorDetail(item)">
        <img v-if="item.sex == '1'" class="imgHeader fl" src="/static/images/findDoctor/doctor_man.png">
        <img v-if="item.sex == '2'" class="imgHeader fl" src="/static/images/findDoctor/doctor_women.png">
          <div class="itemCenter fl tal">
              <div class="itemTop">
                <div class="topBox" v-overFlowXFindDoctor>
                  <span class="eachItem">{{item.nickname}}</span>
                  <span v-if="!!item.job" class="eachItem dotorJob tac">{{item.job}}</span>
                  <span class="eachItem">({{item.departmentName}})</span>
                </div>
              </div>
              <div class="itemBottom">
                <div class="bottomBox">
                  <span>{{item.organizationName.length > 16 ? item.organizationName.substring(0, 16) + '...' : item.organizationName}}</span>
                </div>
              </div>
          </div>
        <img class="imgEnter" src="../../../static/images/customer/home_but_enter.png">
      </div>
    </mescroll-vue>
  </div>
</template>

<style scoped lang="less">
  ::-webkit-scrollbar{
    width: 0;
    height: 0
  }
  .findDoctorPage{
    overflow: scroll;
  }
  .fullPage {
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
    width: 5.4rem;
    height: 1.4rem;
    .itemTop,.itemBottom{
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0.3rem;
      width: 200%;
    }
    .itemTop{
      margin-top: 0.3rem;
      width: 5.4rem;
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
      width: 5.4rem;
      overflow-x: scroll;
      .bottomBox{
        min-width: 100%;
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
</style>

<script>
    import commomHeader from '../commomComponents/header';
    import {consultModel} from '../../api'
    import {overFlowXFindDoctor} from '../../directives'
    import MescrollVue from 'mescroll.js/mescroll.vue'
    export default {
        name: 'myConsultList', // 我的咨询列表
        data () {
        return {
            headerTitle: '找医生',
            doctorList: [],
            allLoaded: false,
            mescroll: null,
            mescrollDown: {
                use: false
            },
            mescrollUp: { // 上拉加载的配置.
                callback: this.getDoctorList,
                page: {
                    num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                    size: 10 //每页数据条数,默认10
                },
                noMoreSize: 5,
                isLock: false
            },
            webim: require('../../../static/js/tencentIMJS/webim.js'),
        }
        },
        methods: {
            getDoctorList (page, mescroll) {
                let data = {pageNo: page.num, pageSize: page.size}
                consultModel.getConsultDoctorList(data, res => {
                    if (res.data.data.pageNo >= res.data.data.pageCount) {
                      this.mescrollUp.isLock = true;
                    } else {
                      this.mescrollUp.isLock = false;
                    }
                    this.doctorList = this.doctorList.concat(res.data.data.doctorList);
                    this.$nextTick(() => {
                        mescroll.endSuccess(res.data.data.doctorList.length);
                    });
                }, err => {
                    mescroll.endErr();
                });
            },
            toDoctorDetail (item) {
                this.$router.push({path: '/findDoctor/doctorDetail', query: {doctorId: item.userId}});
            },
            mescrollInit (mescroll) {
                this.mescroll = mescroll;
            }
        },
        components: {
            commomHeader,
            MescrollVue
        },
        directives: {
          overFlowXFindDoctor
        }
    }
</script>
