<template>
  <div class="conversionPage pr fullPage" :style="{'-webkit-overflow-scrolling': scrollMode}">
    <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :showAdd="showAdd" :rightPath="rightPath" :showText="showText" :rightText="rightText"></commomHeader>
    <div class="noRecord center-y" v-if="!!noRecord">
        <img src="/static/images/eshop/icon_coupon_none.png" alt="">
        <p class="tac">暂无兑换记录</p>
    </div>
    <mescroll-vue class="containerScroll" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <ul v-show="!noRecord">
        <li v-for="(item,index) in conversionList">
          <!--积分商城列表-->
          <div class="recordItem">
              <div class="recordInfo">
                  <div class="infoLeft fl"><span>订单号: </span><span class="conversionNumber">{{item.orderCode.slice(0,2) + "****" + item.orderCode.slice(-4)}}</span></div>
                  <div class="inforoght fr"><span class="conversionTime">{{item.createTime.slice(0,16).replace(/\-/g,'/')}}</span></div>
              </div>
              <div class="recordContent pr">
                  <div class="goodImg fl pr">
                      <img :src="imgDomain+item.goodsUrl.split(',')[0]" alt="">
                  </div>
                  <div class="goodName tal fl">{{item.goodsName}}</div>
                  <div class="remark fl tal color999">{{!!item.remark ? (item.remark.length > 10 ? item.remark.substring(0, 10) + '...' : item.remark) : ''}}</div>
                  <div class="goodInfo fl tar">
                      <div class="price clearfix fl">
                        <span class="bigFont colorHight">{{item.salesMode == 'score' ? getPrice(item) : getPrice(item)[0] ? getPrice(item)[0] + '.' : ''}}</span>
                        <span class="smallFont colorHight">{{item.salesMode == 'score' ?'': getPrice(item)[1]}}</span>
                      </div>
                      <p class="bigFont sum fr">X{{item.number}}</p>
                  </div>
              </div>
              <div class="recordFooter" v-if="item.payType==1">
                  <a class="fr" style="float: left;border: 0;color: #E95959;" v-if="item.payStatus==0" href="javascript:void(0)">未支付</a>
                  <a class="fr" style="float: left;border: 0;color: #E95959;" v-if="item.payStatus==1" href="javascript:void(0)">已支付</a>
                  <a class="fr" style="float: left;border: 0;color: #E95959;" v-if="item.auditStatus==2" href="javascript:void(0)">审核不通过</a>
                  <a class="fr" style="float: left;border: 0;color: #EDB344;" v-if="item.payStatus==1&&item.sendStatus==0" href="javascript:void(0)">未发货</a>
                  <a class="fr" style="float: left;border: 0;color: #3BC083;" v-if="item.payStatus==1&&item.sendStatus==1" href="javascript:void(0)">已发货</a>
                  <a class="fr pay" v-if="item.needPay==1&&item.payStatus==0" @click="subOrderList(item.orderCode,item.orderId,item.payAmount)" href="javascript:void(0)"><span>支付</span></a>
                  <a class="fr" href="javascript:void(0)"><span @click="toOderDetail(conversionList,index)">订单详情</span></a>
                  <a class="fr pr"  href="javascript:void(0)" v-if="item.needPay==1&&item.payStatus==0"><span>取消订单</span><span class="groupBox" @click="showConfirm(item.orderId)"><group></group></span></a>
                  <a class="fr" href="javascript:void(0)" v-if="item.goodsType=='virtual' && item.payStatus==1 && item.sendStatus==1"><span @click="toLogistics(item,index)">查看物流</span></a>
              </div>
              <!-- 货到付款 -->
              <div class="recordFooter" v-if="item.payType==2">
                  <a class="fr" style="float: left;border: 0;color: #EDB344;" v-if="item.payType==2" href="javascript:void(0)">货到付款</a>
                  <a class="fr" style="float: left;border: 0;color: #E95959;" v-if="item.auditStatus==2" href="javascript:void(0)">审核不通过</a>
                  <a class="fr" style="float: left;border: 0;color: #EDB344;" v-if="item.sendStatus==0 && item.asignStatus == -1" href="javascript:void(0)">未发货</a>
                  <a class="fr" style="float: left;border: 0;color: #3BC083;" v-if="item.sendStatus==1  && item.asignStatus == -1" href="javascript:void(0)">已发货</a>
                  <a class="fr" style="float: left;border: 0;color: #EDB344;" v-if="item.asignStatus==0" href="javascript:void(0)">拒收</a>
                  <a class="fr" style="float: left;border: 0;color: #EDB344;" v-if="item.asignStatus==1" href="javascript:void(0)">已签收</a>
                  <a class="fr" href="javascript:void(0)"><span @click="toOderDetail(conversionList,index)">订单详情</span></a>
                  <a class="fr" href="javascript:void(0)" v-if="item.goodsType=='virtual' && item.sendStatus==1"><span @click="toLogistics(item,index)">查看物流</span></a>
              </div>
          </div>
        </li>
      </ul>
    </mescroll-vue>
    <div v-transfer-dom>
      <confirm v-model="show"
      :title="('')"
      @on-confirm="onConfirm">
          <p style="text-align:center;">{{ ('确定取消并删除该订单吗?') }}</p>
      </confirm>
    </div>
  </div>
</template>
<style>
    /* 修改ivew默认样式 */
    .conversionPage ul{
        background-color: #f4f4f4;
    }
    .conversionPage .vux-popup-mask{
       background-color: rgba(0,0,0,0.5) !important;
   } 
</style>

<style lang="less" scoped>
    .conversionPage{
        overflow: scroll;
    }
    .conversionPage .noRecord{
        width: 100%;
        top:40%;
    }
    .noRecord img{
        margin: 0 auto 0.3rem;
        width: 1.32rem;
        height: 1.32rem;
    }
    .noRecord p{
        width: 100%;
        font-size: 0.48rem;
        color: #999;
    }
    .recordItem{
        box-sizing:content-box;
        margin-bottom:0.4rem;
        background-color: #fff;
    }
    .recordInfo{
        height: 0.6rem;
        font-size:0.26rem;
        line-height: 0.6rem;
        padding:0 0.2rem;
    }
    .recordInfo .conversionTime{
        color:#666;
    }
    .recordContent{
        height: 2.5rem;
        padding-top:0.2rem;
        padding-left: 0.2rem;
        border-top: 1px solid #cecece;
        border-bottom: 1px solid #cecece;
    }
    .recordContent .goodImg{
        width: 2.2rem;
        height: 100%;
    }
    .recordContent .goodImg img{
        width: 2.2rem;
        height: 2.2rem;
        position: absolute;
        right: 0;
        top: 0;
    }
    .recordContent .goodName,
    .recordContent .remark,
    .recordContent .goodInfo{
        width: 5.1rem;
        padding:0.1rem 0 0 0.2rem;
        font-size:0.3rem;
    }
    .recordContent .goodInfo{
        position: absolute;
        bottom: 0.2rem;
        right: 0;
        padding-right:0.3rem;
        font-size:0.3rem;
    }
    .recordContent .goodInfo .score{
        padding-top:0.1rem;
        color:#f00;
    }
    .recordContent .goodInfo .sum{
        font-weight: 700;
    }
    .recordFooter{
        height: 1rem;
    }
    .recordFooter a{
        display: block;
        height: 0.56rem;
        padding: 0 0.15rem;
        font-size:0.2rem;
        line-height: 0.56rem;
        margin: 0.22rem 0.2rem;
        border: 1px solid #999;
        border-radius:0.05rem;
        color:#666;
    }
    .recordFooter a.pay{
      border: 1px solid #E95959;
      color: #E95959;
    }
    .groupBox{
      width:100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
</style>
<script>
  import axios from 'axios'
  import qs from 'qs'
  import { Group,Confirm, TransferDomDirective as TransferDom } from 'vux'
  import commomHeader from "../commomComponents/header"
  import md5 from 'js-md5'
  import {callpay, payCallBack} from '../../utils/pay.js'
  import {orderModel} from '../../api'
  import MescrollVue from 'mescroll.js/mescroll.vue'
  export default {
    data:function() {
      return {
        noRecord:false,
        headerTitle:"我的订单",
        rightIsShow:false,
        showArrow:"",
        showAdd:"",
        showText:"showText",
        rightText:"兑换记录",
        rightPath:null,
        conversionList:[],
        allLoaded: false, //是否可以上拉属性，false可以上拉，true为禁止上拉，就是不让往上划加载数据了
        scrollMode:"touch", //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
        startPageNo:1,
        oId:'',
        show:false,//二次确认弹窗显示
        toBeDeleteId:"",//将要删除的订单
        imgDomain:"",
        mescroll: null,
        mescrollDown: {
            use: false
        },
        mescrollUp: { // 上拉加载的配置.
            callback: this.loadPageList,
            page: {
                num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                size: 4 //每页数据条数,默认10
            },
            noMoreSize: 5,
            isLock: false
        }
      }
    },
    components: {
      commomHeader,
      Confirm,
      Group,
      MescrollVue
    },
    directives:{
      TransferDom
    },
    methods: {
        paySuccessCallback () {
            this.$router.push({path:"/point/orderDetail",query:{id:this.oId}});
        },
        //订单列表支付
        subOrderList:function(orderCode,orderId,postage){
            this.oId = orderId;
            let that = this;
            var sign = md5('8ddec3c487ae4af29c1579f44240e05e'+postage);
            var data = {
              orderCode:orderCode,
              appType:'1',
              payType	:'1',
              feeType:'CNY',
              postage:postage,//邮费，单位：分
              tradeType:'JSAPI',
              body:'邮费明细',
              sign:sign
            }
            orderModel.orderPay(data, (res) => {
              var data = res.data.data.wxData;
              callpay(data, res => {
                let callBackObj = {successCallBack: this.paySuccessCallback};
                payCallBack(res, callBackObj);
              });
            })
        },
        //二次确认弹窗
        showConfirm(id){
            this.show = true;
            this.toBeDeleteId = id;
        },
        //确定并删除订单      
        onConfirm () {
          let _this = this;
          orderModel.deleteOrder({orderId:this.toBeDeleteId}, function(res){
            _this.conversionList.forEach((item,index) => {
              if(item.orderId==_this.toBeDeleteId){
                _this.conversionList.splice(index,1);
                if(_this.conversionList.length==0){
                  _this.noRecord = true;
                }
              }
            });  
          },function(err){
            _this.showToast(err.data.meta.msg);
          })
        },
        loadPageList (page, mescroll) {
            let data = {pageNo: page.num, pageSize: page.size};
            orderModel.getOrderList(data, (res) => {
                if(res.data.data.pageNo >= res.data.data.pageCount){
                    this.mescrollUp.isLock = true;
                } else {
                    this.mescrollUp.isLock = false;
                }
                let result = res.data.data.scoreExchangeOrderVos;
                if(result.length==0){
                    this.noRecord = true;
                }else{
                  this.imgDomain = res.data.data.imgDomain;
                  this.conversionList = this.conversionList.concat(result);
                }
                this.$nextTick(() => {
                    mescroll.endSuccess(result.length);
                });
            }, err => {
              mescroll.endErr();
            })
        },
        toOderDetail:function(conversionList,index){
          this.$router.push({path:"/point/orderDetail",query:{id:conversionList[index].orderId}});
        },
        // 去往物流详情页面
        toLogistics (item) {
          this.$router.push({path: "/point/logistics", query: {orderId:item.orderId}});
        },
        // 获取价格
        getPrice (obj) {
          if (obj.salesMode == 'score') {
            return obj.goodsValue + '积分';
          } else {
            if (!!obj.payAmount) {
              let str = obj.payAmount.toString();
              let arr = [];
              if (str.length >= 5) {
                return arr = ('¥' + obj.payAmount/100 + '.' + str.substring(str.length-2, str.length)).split('.');
              } else if (str.length == 4) {
                return arr = ('¥' + obj.payAmount/100 + '.' + str.substring(str.length-1, str.length) + '0').split('.');
              } else {
                return arr = ('¥' + obj.payAmount/100 + '.00').split('.');
              }
            }
          }
        },
        mescrollInit (mescroll) {
            this.mescroll = mescroll;
        }
    }
  }
</script>
