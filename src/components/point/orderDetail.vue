<template>
  <div class="orderDetailPage fullPage">
    <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :showAdd="showAdd"
                  :rightPath="rightPath" :showText="showText" :rightText="rightText"></commomHeader>
    <!--邮寄地址-->
    <div class="addressInfo">
      <div class="consigneeInfo clearfix">
        <div class="consigneeName fl">收货人: {{orderInfomation.order.consigneeName}}</div>
        <div class="consigneePhone fr">{{orderInfomation.order.phone}}</div>
      </div>
      <div class="address tal clearfix pr">
        <p class="fl">{{orderInfomation.order.detailAddress}}</p>
      </div>
      <img src="/static/images/getPaper/address_bg.png" alt=""/>
    </div>
    <div class="content">
      <div class="content-t pr" style="position: relative;">
        <!--邮寄-->
        <div class="content-t-l clearfix">
          <img class="fl" :src="!!orderInfomation.order.goodsUrl ? imgDomain+orderInfomation.order.goodsUrl.split(',')[0] : ''" alt="">
          <p class="fl">{{orderInfomation.order.goodsName}}</p>
          <div class="remark fl tal color999">{{!!orderInfomation.order.remark ? orderInfomation.order.remark : ''}}</div>
        </div>
        <div class="content-t-r tar">X{{orderInfomation.order.number}}</div>
      </div>
      <!--邮寄-->
      <div class="content-b">
        <ul>
          <li><span class="fl">运费</span><span class="postage fr">{{!!orderInfomation.order.postage ? orderInfomation.order.postage/100 + '元' : '包邮'}}</span>
          </li>
          <li class="cost">
            <span class="fl">实消费</span>
            <div class="price clearfix fr">
              <span class="colorHight">{{orderInfomation.order.salesMode == 'score' ? getPrice(orderInfomation.order) : getPrice(orderInfomation.order)[0] ? getPrice(orderInfomation.order)[0] + '.' : ''}}</span>
              <span class="smallFont colorHight">{{orderInfomation.order.salesMode == 'score' ?'': getPrice(orderInfomation.order)[1]}}</span>
            </div>
          </li>
        </ul>
      </div>
      <!--自提-->
    </div>
    <div class="orderDetailBottom" style="border-top:1px solid #e0e0e0;height: auto;overflow: hidden;width: 100%;background:white;">
      <!--自提-->
      <div class="footer-info orderNumber">订单编号: {{orderInfomation.order.orderCode}}</div>
      <div class="footer-info orderCreatTime">创建时间: {{orderInfomation.order.createTime}}</div>
      <div class="footer-info">支付方式: {{orderInfomation.order.payType == 1 ? '微信' : '货到付款'}}</div>
      <div class="footer-info expressNumber" v-if="orderInfomation.order.payType == 1">订单状态: {{orderInfomation.order.payStatus==0?"未支付":"已支付"}}</div>
      <div class="footer-info expressNumber" v-if="orderInfomation.order.payType == 2">订单状态: {{orderInfomation.order.sendStatus==0?"未发货":"已发货"}}</div>
    </div>
    <button :class="[payMoney,{activeSpecial: isDisabled}]" v-if="payStatus" :disabled="isDisabled" style="left: 0;border: 0;" @click="subOrderDetail(orderInfomation.order.orderCode,orderInfomation.order.payAmount)">支付</button>
    <loading :loading="loading" :msg="msg"></loading>
  </div>
</template>
<style lang="less" scoped>
  .orderDetailPage{
    .logistics{
      padding: 0 20px;
      margin-top:18px;
      button{
        outline: none;
        border: 0;
        background: white;
      }
    }
    .logisticsInfo{
      height: auto;
      overflow: hidden;
      width: 100%;
      .title{
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        background: #F4f4f4;
      }
    }
    .logisticsContent{
      padding:0.4rem 0 0 1.33rem;
      .times {
        display:block;
        margin:0.4rem 0 0.2rem;
        ul{
          margin-left: 0.15rem;
          div{
            margin-left: -0.2rem
          }
          li:last-child{
            border-left-color:white!important;
          }
          li:nth-of-type(1){
            color: #00c2B1;
            b{
              background-image:url("/static/images/getPaper/logistics/wuliu_icon_rounding.png");
            }
            .bSpecial{
              background-image:url("/static/images/getPaper/logistics/wuliu_icon_sus.png")
            }
            a{
              color: #00c2B1;
            }
          }
          li{
            width:100%;
            color: #666;
            text-align: left;
            border-left:2px solid #ddd;
            padding-bottom: 0.2rem;
            b{
              width:0.36rem;
              height:0.36rem;
              background-image:url("/static/images/getPaper/logistics/wuliu_icon_round.png");
              background-repeat: no-repeat;
              background-size: cover;
              display:inline-block;
              float:left;
            }
            a{
              margin-left: 0.2rem;
              font-size: 16px;
              color: #666;
            }
            span{
              font-size:12px;
              position: absolute;
              display: block;
              width: 15%;
              text-align: right;
              margin-left: -1.2rem;
              i{
                width: 90%;
                text-align: right;
              }
              i:nth-of-type(1){
                font-size: 16px;
              }
              i:nth-of-type(2){
                font-size: 12px;
              }
            }
            p{
              padding-left:0.55rem;
              font-size:12px;
              width: 90%;
            }
          }
        }
      }
      .addAddress{
        height: auto;
        overflow:hidden;
        width: 100%;
        img{
          float: left;
          width: 15px;
          margin-right: 0.2rem;
          margin-top: 0.05rem;
        }
        p{
          float: left;
          font-size: 14px;
          color: #00c2B1;
          width:80%;
          text-align: left;
        }
      }

    }
  }
  .activeSpecial{
    background: gainsboro!important;
  }
  .sendUp{
    margin-bottom: 0.4rem;
  }
  .sendUp p {
    display: inline-block;
    padding: 5px 10px;
    border-radius:20px;
    background: #00c2b1;
    color: white;
    font-size: 14px;
  }
  .orderDetailPage{
    background-color: #f4f4f4;
  }
  .orderDetailPage .payMoney{
    color: #FFF;
    line-height: 0.9rem;
    text-align: center;
    background-color: #dd4242;
    width: 100%;
    bottom: 0px;
    position: fixed;
  }
  .addressInfo{
    width: 100%;
    padding: 0.3rem 0 0;
    font-size: 0.32rem;
    margin-bottom: 0.4rem;
    background-color: #fff;
  }
  .addressInfo img{
    width: 100%;
    height: 0.28rem;
    margin-top: 0.3rem;
  }
  .address{
    width: 100%;
    padding: 0 0.4rem 0 0.3rem;

  }
  .consigneeInfo{
    padding: 0 0.4rem 0 0.3rem;
  }
  .address p{
    width: 95%;
    padding-top: 0.1rem;
  }
  .content{
    background-color: #fff;
    font-size: 0.32rem;
  }
  .content-t-l{
    padding: 0.3rem 0.4rem 0.2rem 0.3rem;
    border-bottom: 1px solid #e0e0e0;
  }
  .content-t-l img{
    width: 1.28rem;
    height: 1.28rem;
  }
  .content-t-l p{
    padding-left: 0.4rem;
    font-size: 0.36rem;
  }
  .content-t-r{
    font-size: 0.32rem;
    width: 100%;
    height: 0.5rem;
    line-height: 0.5rem;
    position: absolute;
    right: 0.3rem;
    bottom: 0;
  }
  .content-b li{
    height: 0.8rem;
    line-height: 0.8rem;
    padding: 0 0.3rem;
    /* border-bottom: 1px solid #e0e0e0; */
    text-align: left;
  }
  .postage,
  .sum{
    color: #ed4949;
  }
  .cost{
    border-top: 1px solid #e0e0e0;
  }
  .addressIcon{
    height: 0.8rem;
    line-height: 0.8rem;
    margin-top: 0.1rem;
    padding: 0 0.4rem 0 0.8rem;
    border-top: 1px solid #e0e0e0;
  }
  .addressIcon .icon{
    width: 0.32rem;
    height: 0.4rem;
    margin-right: 0.2rem;
    margin-left: 0.3rem;
    background: url("/static/images/eshop/icon_map.png") no-repeat ;
    background-size: cover;
  }
  .footer-info{
    padding-left: 0.3rem;
    font-size: 0.32rem;
    margin-top: 0.2rem;
    text-align: left;
  }
  .orderDetailBottom{
    margin-bottom: 0.9rem;
  }
  .remark{
    width: 5.1rem;
    padding-left: 0.4rem;
  }
</style>

<script>
  import commomHeader from "../commomComponents/header"
  import md5 from 'js-md5'
  import loading from '../common/LoadingView'
  import {callpay, payCallBack} from '../../utils/pay.js'
  import {orderModel} from '../../api'
  export default {
    name:"guess",
    data (){
      return {
        payMoney:'payMoney',
        headerTitle:"订单详情",
        rightIsShow:false,
        showArrow:"",
        showAdd:"",
        showText:"showText",
        rightText:"",
        rightPath:"",
        isDisabled:false,
        orderInfomation:{order:{consigneeName:'',expressName:''}},
        payStatus:false,
        isLogistics:false,
        logisticsInfoShow:false,
        logisticsList:[],
        isGet:false,
        loading:false,
        msg:'加载中…',
        logisticsStatus:false,
        imgDomain:""
      }
    },
    methods:{
      GetQueryString:function(){
        return this.$route.params.id;
      },
      paySuccessCallback () {
        this.payStatus = false;
      },
      //详情支付
      subOrderDetail:function(orderCode,postage){
        let that = this;
        this.isDisabled = true;
        var sign = md5('8ddec3c487ae4af29c1579f44240e05e'+postage);
        var data = {
          orderCode:orderCode,
          appType:'1',
          payType	:'1',
          feeType:'CNY',
          postage:postage,
          tradeType:'JSAPI',
          body:'邮费明细',
          sign:sign
        }
        orderModel.orderPay(data, res => {
          var data = res.data.data.wxData;
          callpay(data, res => {
            let callBackObj = {successCallBack: this.paySuccessCallback};
            payCallBack(res, callBackObj);
          });
        })
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
              return arr = !!str ? ('¥' + obj.payAmount/100 + '.' + str.substring(str.length-2, str.length)).split('.') : ['', ''];
            } else if (str.length == 4) {
              return arr = !!str ? ('¥' + obj.payAmount/100 + '.' + str.substring(str.length-1, str.length) + '0').split('.') : ['', ''];
            } else {
              return arr = !!str ? ('¥' + obj.payAmount/100 + '.00').split('.') : ['', ''];
            }
          } else {
            return ['', '']
          }
        }
      }
    },
    created:function () {
      let _this = this ;
      let data = {orderId:this.$route.query.id};
      orderModel.getOrderInfoById(data, function(res){
        _this.imgDomain = res.data.data.imgDomain;
        _this.orderInfomation = res.data.data;
        _this.orderInfomation.order.expressPhone = res.data.data.express.expressPhone;
        _this.orderInfomation.order.expressName = res.data.data.express.expressName;
        _this.orderInfomation.postage = res.data.data.order.payAmount;
        if(res.data.data.order.payType != '2' && res.data.data.order.payStatus == '0'){
          _this.payStatus = true;
        }else {
          _this.payStatus = false;
        }
      })
    },

    components:{
      commomHeader,
      loading
    }
  }
</script>
