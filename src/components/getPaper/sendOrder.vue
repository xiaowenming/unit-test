<template>
  <div class="subOrderPage fullPage">
    <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :showAdd="showAdd" :rightPath="rightPath" :showText="showText" :rightText="rightText"></commomHeader>
    <div class="information-person bgWhite">
      <div class="addressInfo">
        <!--邮寄-->
        <div @click="toAddressManage">
          <div class="consigneeInfo clearfix">
            <div class="consigneeName fl">收件人：{{defaultAddress.consigneeName}}</div>
            <div class="consigneePhone fr">{{defaultAddress.phone}}</div>
          </div>
          <div class="address tal clearfix pr">
            <p class="fl">{{defaultAddress.detailAddress}}</p>
            <div class="arrow">
              <img src="/static/images/default/icon_right_gray.png" alt="">
            </div>
          </div>
        </div>
      </div>
      <img src="/static/images/getPaper/address_bg.png" alt="">
    </div>
    <div class="content bgWhite">
      <div class="content-t pr">
        <div class="content-t-l clearfix tal">
          <img class="fl" :src="imgUrl" alt="">
          <p class="fr title">{{thisGoodsInfo.goodsName}}</p>
          <p class="fr smallFont color999 tal remark">{{thisGoodsInfo.remark}}</p>
        </div>
        <div class="content-t-r tar">X{{goodsSum}}</div>
      </div>
      <div class="content-b">
        <ul>
          <li @click="toCanUseCoupon" class="pr">
            <span class="fl">兑换券</span>
            <span class="coupon fr">{{defaultCoupon.couponName}}<i></i></span>
          </li>
          <li class="pr" @click="showChoosePayTypeBox">
            <span class="fl">支付方式</span>
            <span class="fr payType">{{payType}}<i></i></span>
          </li>
          <li class="pr">
            <span class="fl">运费</span>
            <span class="fr">{{getPostage}}</span>
          </li>
          <li class="pr sum">
            <span class="fl">合计</span>
            <span class="smallFont fr colorHight">{{thisGoodsInfo.salesMode == 'score' ?'': getPrice(thisGoodsInfo)[1]}}</span>
            <span class="bigFont colorHight fr">{{thisGoodsInfo.salesMode == 'score' ? getPrice(thisGoodsInfo) : getPrice(thisGoodsInfo)[0] ? getPrice(thisGoodsInfo)[0] + '.' : ''}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="sendOrder clearfix bgWhite">
      <div class="sub-l fl">当前积分: {{userScore}}</div>
      <button :class="[subR, fr, h100, { activeSpecial: isDisabled}]" style="outline: none;border: 0;" :disabled="isDisabled" @click="subOrder">提交订单</button>
    </div>
    <div class="payTypeChooseBox fullPage bgWhite" v-show="showPayTypeBox">
      <ul>
        <li class="pr" v-for="(item, index) in payTypeList" :key="index" @click="choosePayType(index)">
          <i v-show="payTypeSelected == index"></i>
          <span>{{item.type}}</span>
        </li>
      </ul>
    </div>
    <div v-transfer-dom>
      <confirm v-model="show"
      :title="('')"
      :confirm-text="'继续支付'"
      @on-confirm="onConfirm">
          <p style="text-align:center;">{{ ('存在未支付订单') }}</p>
      </confirm>
    </div>
  </div>
</template>
<style lang="less" scoped>
.activeSpecial {
  background: gainsboro !important;
}
.information-person {
  margin-bottom: 0.4rem;
  height: auto;
  overflow: hidden;
  width: 100%;
  .xuan-group {
    label {
      position: absolute !important;
      top: 0;
      bottom: 0;
      font-size: 14px;
    }
  }
  .xuan-group input {
    display: none;
    opacity: 0;
  }
  .xuan-group input[type="checkbox"] + label,
  .xuan-group input[type="radio"] + label {
    line-height: 1;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    margin: 2px;
  }
  .xuan-group input[type="checkbox"] + label:before,
  .xuan-group input[type="radio"] + label:before {
    line-height: 20px;
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 8px;
    content: "";
    color: #fff;
    border: 1px solid #dce4e6;
    border-radius: 100%;
  }
  .xuan-group input[type="checkbox"]:checked + label:before,
  .xuan-group input[type="radio"]:checked + label:before {
    content: " ";
    background: url(/static/images/getPaper/adress_select_but.png) 0 no-repeat;
    background-size: cover;
  }
  .addressInfo {
    width: 100%;
    padding: 0.3rem 0.4rem 0.2rem 0.3rem;
    font-size: 0.32rem;
    background-color: #fff;
  }
  img{
    width: 100%;
    height: 0.28rem;
  }
}
.subOrderPage {
  background-color: #eee;
  overflow: scroll;
  padding-bottom: 1rem;
}
.address {
  width: 100%;
}
.address p {
  width: 95%;
  padding-top: 0.1rem;
}
.address .arrow {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.address .arrow img {
  width: auto;
  height: 0.3rem;
}
.content {
  background-color: #fff;
  font-size: 0.32rem;
  box-sizing: content-box;
  padding-bottom: 1rem;
}
.content-t-l {
  padding: 0.3rem 0.4rem 0.2rem 0.3rem;
  border-bottom: 1px solid #e0e0e0;
}
.content-t-l img {
  width: 1.78rem;
  height: 1.78rem;
}
.content-t-l p {
  padding-left: 0.4rem;
  font-size: 0.36rem;
  width: 5rem;
}
.content-t-l .smallFont{
  font-size: 14px;
}
.content-t-l .remark {
  width: 5.1rem;
}
.content-t-r {
  font-size: 0.32rem;
  width: 100%;
  height: 0.5rem;
  line-height: 0.5rem;
  position: absolute;
  right: 0.3rem;
  bottom: 0;
}
.content-b li {
  height: 0.9rem;
  line-height: 0.9rem;
  padding: 0 0.6rem 0 0.3rem;
  border-bottom: 1px solid #e0e0e0;
  text-align: left;
}
.coupon i ,
.payType i{
  width: 0.18rem;
  height: 0.32rem;
  position: absolute;
  right: 0.2rem;
  top: 0.29rem;
  background: url("/static/images/default/icon_right_gray.png") no-repeat;
  background-size: cover;
  vertical-align: middle;
}
.sum {
  margin-bottom: 1rem;
}
.sendOrder {
  height: 1rem;
  line-height: 1rem;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  font-size: 0.32rem;
}
.sendOrder .sub-l{
    width: 40%;
    background-color: #fff;
}
.sendOrder .sub-r {
  width: 60%;
  background-color: #ed4949;
  color: #fff;
  font-size: 18px;
}
// 支付方式选择框
.payTypeChooseBox {
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.payTypeChooseBox ul {
  width: 60%;
  margin: 0 auto;
  margin-top: 3rem;
  background-color: #fff;
  font-size: 0.36rem;
}
.payTypeChooseBox ul li {
  height: 1.1rem;
  line-height: 1.1rem;
  border-bottom: 1px solid #E0E0E0;
}
.payTypeChooseBox ul li i{
  width: 0.46rem;
  height: 0.46rem;
  position: absolute;
  top: 0.32rem;
  left: 0.3rem;
  background: url('/static/images/getPaper/adress_select_but1.png') no-repeat;
  background-size: cover;
}
</style>

<script>
import commomHeader from "../commomComponents/header";
import { Toast } from "mint-ui";
import { Radio } from "mint-ui";
import md5 from "js-md5";
import {isEmptyString} from '../../utils/utils'
import {callpay, payCallBack} from '../../utils/pay.js'
import {pointStoreModel, userModel, orderModel} from '../../api';
import {Confirm, TransferDomDirective as TransferDom } from 'vux'
import {requestCode} from '../../config/requestCode'
export default {
  name: "sendOrder",
  data() {
    return {
      subR: "sub-r",
      fr: "fr",
      h100: 'h100',
      headerTitle: "提交订单",
      rightIsShow: false,
      showArrow: "",
      showAdd: "",
      showText: "",
      rightText: "",
      rightPath: "",
      defaultAddress: {},
      thisGoodsInfo: {},
      userScore: "",
      defaultCoupon: {},
      isDisabled: false,
      // addressName: {},
      orderId: "",
      userScore: "",
      defaultCoupon: {},
      showPayTypeBox: false,
      payType: '微信', // 支付类型
      payTypeList: [
        {type: '微信'},
        {type: '货到付款'},
      ],
      payTypeSelected: 0,
      goodsSum: '1',
      imgUrl: '',
      show: false
    };
  },
  components: {
    commomHeader,
    Confirm
  },
  methods: {
    toCanUseCoupon:function(){
      if (this.defaultCoupon.couponName != '暂无兑换券') {
        this.$router.push({path:"/point/myCoupon",query:{canUseCoupon:1,goodsId:this.thisGoodsInfo.goodsId,userScore:this.userScore,goodsSum:this.goodsSum}});
      }
    },
    getGoodsInfoById:function(){
      let _this = this ;
      pointStoreModel.getGoodsInfoById({goodsId:this.$route.query.goodsId}, function(res){
        _this.thisGoodsInfo = res.data.data.goodsVo;
        _this.imgUrl =sessionStorage.getItem("imgDomain") + (_this.thisGoodsInfo.goodsUrl.split(',')[0]);
      });
    },
    getDefaultAddress: function() {
      let _this = this;
      userModel.getUserDefaultAddress({}, function(res) {
        if (res.data.data.existsFlag) {
          _this.defaultAddress = res.data.data.address;
        } else {
          _this.$router.push({
            path: "/point/addressManage",
            query: { backTwo: true }
          });
        }
      });
    },
    toAddressManage: function() {
      this.$router.push({
        path: "/point/addressManage",
        query: { isSend: this.isSend }
      });
    },
    paySuccessCallback () {
      this.$router.push("/point/conversionRecord");
    },
    //发送提交订单请求
    sendOrder:function(data){
      orderModel.addOrder(data, (res) => {
        if(res.data.data.order.needPay==1){
          this.orderId = res.data.data.order.orderId;
          var sign = md5(
            "8ddec3c487ae4af29c1579f44240e05e" +
              res.data.data.order.payAmount
          );
          var data = {
            orderCode: res.data.data.order.orderCode,
            appType: "1",
            payType: "1",
            feeType: "CNY",
            postage: res.data.data.order.payAmount,
            tradeType: "JSAPI",
            body: "邮费明细",
            sign: sign
          };
          orderModel.orderPay(data, (res) => {
            var data = res.data.data.wxData;
            callpay(data, (res) => {
              let callBackObj = {
                successCallBack: this.paySuccessCallback,
                cancelCallBack: this.paySuccessCallback
              };
              payCallBack(res, callBackObj);
            });
          });
        }else{
          this.showToast("提交成功");
          this.$router.push("/point/conversionRecord");
        }
      }, (res) => {
        if(res.data.meta.code=="90002"){
          pointStoreModel.goodsBuyValid({goodsId:this.thisGoodsInfo.goodsId}, (res) => {
            let code = res.data.data.result.code;
            let payCode = res.data.data.result.data;
            if(code == requestCode.successCode){
              let data = {
                goodsId:this.$route.query.goodsId,
                receiveType:"0",
                addressId:this.defaultAddress.addressId,
                token:res.data.data.token,
                number: this.goodsSum,
                payType: this.payType == '微信' ? '1' : '2' // 1为微信支付 , 2为货到付款
              }
              this.sendOrder(data);
            } else if (payCode == requestCode.orderUnPayCode) {
              this.show = true;
            } else {
              this.showToast(res.data.data.result.errMsg);
            }
          })
        }else{
          this.showToast(res.data.meta.msg);
        }
      });
    },
    //提交订单
    subOrder: function () {
      if (!this.isDisabled && this.$route.query.goodsId && this.defaultAddress.addressId) {
        this.isDisabled = true;
        let data = {
          goodsId: this.$route.query.goodsId,
          receiveType: "0",
          addressId: this.defaultAddress.addressId,
          number: this.goodsSum,
          payType: this.payType == '微信' ? '1' : '2' // 1为微信支付 , 2为货到付款
        }

        if (!!this.$route.query.token) {
          data.token = this.$route.query.token;
          this.sendOrder(data);
        } else {
          if (this.thisGoodsInfo.goodsId) {
            pointStoreModel.goodsBuyValid({goodsId:this.thisGoodsInfo.goodsId,couponId:this.defaultCoupon.couponId}, (res) => {
              let code = res.data.data.result.code;
              let payCode = res.data.data.result.data;
              if (code == requestCode.successCode) {
                data.token = res.data.data.token;
                data.couponId = this.defaultCoupon.couponId;
                this.sendOrder(data);
              } else if (payCode == requestCode.orderUnPayCode) {
                this.show = true;
              } else {
                this.showToast(res.data.data.result.errMsg);
              }
            });
          } else {
            this.isDisabled = false;
          }
        }
      }
    },
    getScore:function(){
      let _this = this;
      userModel.getUserInfo({}, function(res){
          let result = res.data.data.customerVo;
          _this.userScore = result.customerScore;
      });
    },
    choosePayType (index) {
      this.payTypeSelected = index;
      this.showPayTypeBox = false;
      this.payType = this.payTypeList[index].type;
    },
    showChoosePayTypeBox () {
      if (this.thisGoodsInfo.payType == '1,2') {
        this.showPayTypeBox = true;
      }
    },
    // 获取价格
    getPrice (obj) {
      if (obj.salesMode == 'score') {
        return obj.goodsValue * this.goodsSum * 1 + '积分';
      } else {
        if (!!obj.goodsValue) {
          let str = (obj.goodsValue * this.goodsSum).toString();
          let arr = [];
          if (str.length >= 5) {
            return arr = ('¥' + obj.goodsValue/100 * this.goodsSum + '.' + str.substring(str.length-2, str.length)).split('.');
          } else if (str.length == 4) {
            return arr = ('¥' + obj.goodsValue/100 * this.goodsSum + '.' + str.substring(str.length-1, str.length) + '0').split('.');
          } else {
            return arr = ('¥' + obj.goodsValue/100 * this.goodsSum + '.00').split('.');
          }
        } else if (!!obj.postage) {
          let str = obj.postage.toString();
          let arr = [];
          if (str.length >= 5) {
            return arr = ('¥' + obj.postage/100 + '.' + str.substring(str.length-2, str.length)).split('.');
          } else if (str.length == 4) {
            return arr = ('¥' + obj.postage/100 + '.' + str.substring(str.length-1, str.length) + '0').split('.');
          } else {
            return arr = ('¥' + obj.postage/100 + '.00').split('.');
          }
        }  else {
          return ['','']
        }
      }
    },
    onConfirm () {
      this.$router.push('/point/conversionRecord');
    }
  },
  computed:{
    getNeedScore:function(){
      return (this.thisGoodsInfo.salesMode=="rmb"||(this.thisGoodsInfo.salesMode=="score"&&this.thisGoodsInfo.goodsValue==0))?"无":this.thisGoodsInfo.goodsValue||""+"积分";
    },
    getPostage:function(){
      return (!this.thisGoodsInfo.postage||this.thisGoodsInfo.postage==0)?"包邮":(this.thisGoodsInfo.postage/100||"")+"元";
    }
  },
  directives: {
    TransferDom
  },
  created: function() {
    let that = this;
    this.getDefaultAddress();
    if(isEmptyString(this.$route.query.currentCouponName) == ''){
      userModel.getCouponCanuser({goodsId:this.$route.query.goodsId}, function(res){
        if(res.data.data.coupons.length!=0){
            that.defaultCoupon = res.data.data.coupons[0];
        }else{
            that.defaultCoupon = {couponName:"暂无兑换券",couponValue:0,couponId:""};
        }
      })
    }else{
      this.defaultCoupon.couponName = this.$route.query.currentCouponName;
      this.defaultCoupon.couponId = this.$route.query.currentCouponId;
      this.defaultCoupon.couponValue = this.$route.query.currentCouponValue;
    }
    this.getGoodsInfoById();
    this.getScore();
    var aa = this.$route.query.isSend;
    if (aa == false) {
      that.isSend = JSON.parse(aa);
    }
    this.goodsSum = this.$route.query.goodsSum;
  }
};
</script>
