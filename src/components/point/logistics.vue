<template>
  <div class="fullPage">
      <commomHeader :headerTitle="headerTitle"></commomHeader>
      <div class="banner">
          <div class="expressCompany tal">快递公司: {{expressDetail.shipperName}}</div>
          <div class="expressNumber tal">快递单号: {{expressDetail.logisticCode}}</div>
      </div>
      <div class="bgBaseGray topFengexian"></div>
      <div class="address clearfix">
          <div class="icon">
              <img class="fl" src="/static/images/eshop/dingdan_icon_adress.png" alt="">
          </div>
          <div class="content smallFont fr tal color999">[收货地址] {{orderInfomation.order.detailAddress}}</div>
      </div>
      <div class="eachStep">
          <div :class="{item:true, clearfix:true, color999: index != 0}" v-for="(item, index) in logisticsList" :key="index">
              <div class="time fl tar">
                  <span class="bigFont">{{item.acceptTime.substring(5, 10)}}</span>
                  <span class="smallFont">{{item.acceptTime.substring(10, 16)}}</span>
              </div>
              <div class="lineBox fl">
                  <div :class="{dot: true, bgBase: index == 0, bgNormal: (index != 0 && index != logisticsList.length-1), circle: index == logisticsList.length-1}"></div>
                  <div class="line"></div>
              </div>
              <div class="content fr smallFont tal">{{item.acceptStation}}</div>
          </div>
          <div class="item clearfix color999" v-if="logisticsList.length > 0">
              <div class="time fl tar">
                  <span class="bigFont">{{logisticsList[logisticsList.length-1].acceptTime.substring(5, 10)}}</span>
                  <span class="smallFont">{{logisticsList[logisticsList.length-1].acceptTime.substring(10, 16)}}</span>
              </div>
              <div class="lineBox fl">
                  <div class="circle"></div>
              </div>
              <div class="content fr smallFont tal">卖家已发货</div>
          </div>
      </div>
  </div>
</template>

<style lang="less" scoped>
    .banner {
        height: 2.24rem;
        color: #fff;
        background: url('/static/images/eshop/bg_logistics.png') no-repeat;
        background-size: cover;
        padding-top: 0.62rem;
    }
    .banner .expressCompany,
    .banner .expressNumber {
        height: 0.5rem;
        line-height: 0.5rem;
        font-size: 0.32rem;
        padding-left: 0.5rem;
    }
    .topFengexian {
        height: 0.2rem;
    }
    .address {
        margin-top: 0.5rem;
    }
    .address .icon{
        width: 1.6rem;
    }
    .address .icon img{
        width: 0.42rem;
        height: 0.55rem;
        margin-left: 1.09rem;
        margin-right: 0.2rem;
    }
    .address .content {
        width: 4.9rem;
    }
    .eachStep{
        margin-top: 0.3rem;
    }
    .eachStep .item,
    .address{
        width: 100%;
        min-height: 0.36rem;
        padding: 0 0.2rem;
    }
    .eachStep .time{
        width: 1.4rem;
    }
    .eachStep .item .lineBox{
        width: 0.6rem;
        height: 100%;
    }
    .eachStep .item .content{
        width: 4.9rem;
    }
    .item .lineBox .dot{
        width: 0.2rem;
        height: 0.2rem;
        border-radius: 50%;
        margin: 0 auto;
        margin-bottom: 0.1rem;
        margin-top: 0.1rem;
    }
    .item .lineBox .circle{
        width: 0.3rem;
        height: 0.3rem;
        margin: 0 auto;
        margin-top: 0.1rem;
        border-radius: 50%;
        border: 1px solid #cecece;
    }
    .item .lineBox .line{
        width: 1px;
        height: 100%;
        min-height: 54px;
        background-color: #cecece;
        margin: 0 auto;
    }
    .bgNormal{
        background-color: #cecece;
    }
</style>

<script>
    import commomHeader from "../commomComponents/header"
    import {orderModel} from '../../api'
    export default {
        name:"logistics",
        data (){
            return {
                headerTitle:"物流",
                orderInfomation:{order:{consigneeName:'',expressName:''}},
                logisticsList: [],
                logisticsStatus: '',
                expressDetail: ''
            }
        },
        components: {
            commomHeader
        },
        methods: {
            // 物流
            logistics () {
                let that = this;
                var data = {
                    expressCode:this.orderInfomation.order.expressCode,
                    trackingNumber:this.orderInfomation.order.trackingNumber,
                    orderCode	:this.orderInfomation.order.orderCode
                }
                orderModel.getLogisticsDetail(data, function (res) {
                    that.expressDetail = res.data.data.expressDetail;
                    that.logisticsList = res.data.data.expressDetail.traces;
                })
            },
            // 根据订单id获取订单信息
            getOrderDetail () {
                let _this = this;
                orderModel.getOrderInfoById({orderId:this.$route.query.orderId}, function(res){
                    _this.orderInfomation = res.data.data;
                    _this.orderInfomation.order.expressPhone = res.data.data.express.expressPhone;
                    _this.orderInfomation.order.expressName = res.data.data.express.expressName;
                    _this.orderInfomation.postage = res.data.data.order.payAmount;
                    _this.logistics();
                })
            }
        },
        created () {
            this.getOrderDetail();
        }
    }
</script>