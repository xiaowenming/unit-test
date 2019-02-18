<template>
  <div class="getPaperPage">
    <commomHeader :headerTitle="headerTitle"></commomHeader>
    <div class="main">
      <!-- 商品大图 标题 价格-->
      <div class="goods-img tal bgWhite">
        <!-- <img :src="imgDomain + goodsInfo.goodsUrl"/> -->
        <swiper :list="imgList" :loop="true" :show-dots="false" :show-desc-mask="false"></swiper>
        <p class="goodsTitle fw700">{{goodsInfo.goodsName}}</p>
        <p class="packageDetail color999">{{goodsInfo.remark}}</p>
        <div class="price clearfix">
          <span class="bigFont colorHight">{{goodsInfo.salesMode == 'score' ? getPrice(goodsInfo) : getPrice(goodsInfo)[0] ? getPrice(goodsInfo)[0] + '.' : ''}}</span>
          <span class="smallFont colorHight">{{goodsInfo.salesMode == 'score' ?'': getPrice(goodsInfo)[1]}}</span>
          <span class="fr tar bigFont">{{getpostage}}</span>
        </div>
      </div>
      <!-- 分隔线 -->
      <div class="bgBaseGray hei20"></div>
      <!-- 商品数量 -->
      <div class="buySum bgWhite">
        <div class="left fl">购买数量</div>
        <div class="right fr">
          <span class="reduce" @click="changeSum('reduce')">-</span>
          <span class="sum">{{buyGoodsSum}}</span>
          <span class="add" @click="changeSum('add')">+</span>
        </div>
      </div>
      <!-- 分隔线 -->
      <div class="bgBaseGray hei20"></div>
      <!-- 用户权益 -->
      <div class="goods-img pr bgWhite">
        <div v-if="hasPackage" class="userProfit clearfix">
          <div class="icon fl pr">
            <img src="/static/images/getPaper/thing_but_yhqy.png" alt="">
          </div>
          <div class="content fr tal" v-for="(item,index) in packageList">
            <div><span>{{!!item.remark?item.remark:""}}</span></div>
            <div class="time" v-if="packageList.length>=0"><span>有效时间: </span><span>{{!!item.startTime?item.startTime.substring(0,10)+"至"+item.endTime.substring(0,10):""}}</span></div>
          </div>
          <div class="noPackage content fr tal" v-if="packageList.length==0">
            <div><span>不可领取</span></div>
          </div>
        </div>
      </div>
      <!-- 分隔线 -->
      <div class="bgBaseGray hei20"></div>
      <!-- 商品详情 -->
      <div class="goodsDetail bgWhite">
        <div class="title tal pr">
          <span class="icon"></span>
          <span>商品详情</span>
        </div>
        <img v-if="!!goodsInfo.goodsDetailImgUrl" :src="imgDomain + goodsInfo.goodsDetailImgUrl" >
      </div>
      <!-- 京东链接 -->
      <div v-if="!!goodsInfo.adHrefUrl" class="goods-explain">
      	<img @click="goBuy(goodsInfo.adHrefUrl)" :src="imgDomain + goodsInfo.adUrl" alt="" />
      </div>
      <!-- 客服电话 小糖医4008851066 掌护4008882408 -->
      <div class="kfInfo tal kfPhone"><span>客服电话: </span><span class="colorBase">{{isAicaresHealth ? 4008882408 : 4008851066}}</span></div>
      <div class="kfInfo tal last"><span>客服邮箱: </span><span class="colorBase">kf@spt-tek.com</span></div>
    </div>

    <div class="footer">
      <div class="affirm fullPage" @click="exchange()">{{buttonText}}</div>
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
<style>
  #getPaperMask .weui-dialog{
    height: 6rem;
  }
  #getPaperMask .weui-dialog{
    height: 6rem;
  }
  #getPaperMask .weui-dialog__bd{
    height: 100%;
    overflow: scroll;
  }
  #getPaperMask .weui-dialog__ft{
    position: absolute;
    width: 100%;
    bottom: 0;
    background-color: #fff;
  }
  .getPaperPage .goods-img .vux-slider > .vux-swiper > .vux-swiper-item > a > .vux-img {
    display: block;
    width: 100%;
    height: 100%;
    background: center center no-repeat;
    background-size: contain;
  }
</style>

<style lang="less" scoped>
  .commomHeaderPage{
    height: 1rem!important;
  }
  .goods-explain{
  	padding: 0 10px;
    height: auto;
    overflow: hidden;
    img{
      margin-bottom:20px;
    }
  }
  .main .goods-img{
    img {
      width: 100%;
      height: auto;
    }
  }
  .userProfit{
    width: 100%;
    margin-top: 0.42rem;
  }
  .userProfit .icon{
    width: 1.60rem;
  }
  .userProfit .icon img{
    width: 1.1rem;
    position: absolute;
    right: 0;
    top: 0.09rem;
  }
  .userProfit .content{
    width: 5.9rem;
    padding-left: 0.15rem;
    font-size: 0.32rem;
    color: #111;
    margin-bottom: 0.24rem;
  }
  .userProfit .content .time{
    font-size: 0.28rem;
    color:#666;
  }
  .goods-img .goodsTitle,
  .goods-img .packageDetail,
  .goods-img .price,
  .buySum,
  .goodsDetail .title {
    padding: 0 0.3rem;
  }
  .goods-img .goodsTitle{
    font-size: 0.32rem;
    margin-top: 0.1rem;
    line-height: 0.48rem;
  }
  .goods-img .packageDetail{
    font-size: 0.24rem;
    line-height: 0.36rem;
    margin-bottom: 0.3rem;
  }
  .buySum {
    height: 1.28rem;
    font-size: 0.36rem;
    line-height: 1.28rem;
  }
  .buySum .right span{
    padding: 0.05rem 0.25rem;
  }
  .buySum .right .reduce,
  .buySum .right .add{
    background-color: #eee;
  }
  .goods-remark {
    padding-top: 0.2rem;
    line-height: 0.44rem;
  }
  .goodsDetail .title {
    height: 0.95rem;
    line-height: 0.95rem;
    font-size: 0.36rem;
    border-bottom: 1px solid #EFEFF4;
  }
  .goodsDetail .title .icon {
    position: absolute;
    width: 0.1rem;
    height: 0.35rem;
    top: 0.3rem;
    background-color: #FF8D46;
  }
  .goodsDetail .title span:nth-child(2) {
    padding-left: 0.3rem;
  }
  .footer{
    width: 100%;
    height: 0.9rem;
    bottom: 0px;
    position: fixed;
  }
  .affirm{
    color: #FFF;
    line-height: 45px;
    text-align: center;
    background-color: #dd4242;
    font-size: 18px;
  }
  .coupon-tip{
    width: 100%;
    height: 0.4rem;
    bottom: 0.9rem;
    padding-left: 0.3rem;
    position: fixed;
    font-size: 0.24rem;
    text-align: left;
    line-height: 0.4rem;
    color: #FFF;
    background-color: #E98559;
  }
  .kfInfo {
    padding-left: 0.5rem;
    font-size: 0.32rem;
    color: #666;
  }
  .kfPhone{
    margin-top: 0.5rem; 
  }
  .kfInfo.last{
    margin-top: 0.2rem;
    padding-bottom: 1.3rem;
  }
  .noPackage {
    color: #e95959;
  }
</style>
<script>
  import commomHeader from "../commomComponents/header"
  import { Toast } from 'mint-ui';
  import { Group,Confirm,Swiper, TransferDomDirective as TransferDom } from 'vux'
  import {pointStoreModel, userModel} from '../../api'
  import {requestCode} from '../../config/requestCode'
  export default {
    name: "getPaper",
    data() {
      return {
        headerTitle:"试纸领取",
        goodsInfo:{},
        imgDomain:'',
        rightParama:"",
        couponMessage:"",
        hasPackage:false,// 是否有套餐
        packageList:[],// 套餐列表
        imgDomain:"",
        flag:true, // 领取试纸防重复标记
        buttonText:'立即领取',
        buyGoodsSum: 1, // 商品购买数量 , 默认为1
        show: false,
        imgList: []
      };
    },
    methods: {
      exchange:function (){
        if(this.flag){
          this.flag = false;
          if(this.goodsInfo.salesMode!="score"){
            pointStoreModel.goodsBuyValid({goodsId:this.goodsInfo.goodsId}, (res) => {
              this.flag = true;
              let code = res.data.data.result.code;
              let payCode = res.data.data.result.data; 
              if(code == requestCode.successCode){
                this.$router.push({path:'/getPaper/sendOrder',query:{goodsId:this.goodsInfo.goodsId,token:res.data.data.token,goodsSum:this.buyGoodsSum}});
              } else{
                if (payCode == requestCode.orderUnPayCode) {
                  this.show = true;
                } else {
                  this.showToast(res.data.data.result.errMsg);
                }
              }
            })
          }else{
            this.$router.push({path:'/getPaper/sendOrder',query:{goodsId:this.goodsInfo.goodsId,goodsSum:this.buyGoodsSum}});
          }
        }
      },
      goBuy:function(url){
        window.location.href = url;
      },
      getInviolable:function(goodsId){//获取用户权益
        let _this = this;
        userModel.getUserLegal({goodsId:goodsId}, function(res){
          _this.hasPackage=!!res.data.data.packages;
          _this.packageList = res.data.data.packages;

        })
      },
      getGoodsInfoByID:function(){
        let _this = this;
        pointStoreModel.getGoodsByContainerId({containerId:this.$route.query.containerId}, function(res){
          let index = _this.$route.query.index||0;
          let imgTempArr;
          if (_this.isAicaresHealth) {
            _this.headerTitle = '商品详情';
            _this.buttonText = '立即购买';
          }
          
          _this.goodsInfo = res.data.data.goodsList[index];
          _this.imgDomain = res.data.data.imgDomain;
          imgTempArr = res.data.data.goodsList[index].goodsUrl.split(',');
          _this.imgList = imgTempArr.map(item => {
            return {img: _this.imgDomain + item};
          }); 
          _this.getInviolable(_this.goodsInfo.goodsId);
        });
      },
      changeSum (type) {
          this.buyGoodsSum = (type == 'add' ? (this.buyGoodsSum < this.goodsInfo.maximum *1 ? this.buyGoodsSum + 1 : this.goodsInfo.maximum) : (this.buyGoodsSum == 1 ? 1 : this.buyGoodsSum - 1));
      },
      // 获取价格
      getPrice (obj) {
        if (obj.salesMode == 'score') {
          return obj.goodsValue + '积分';
        } else {
          if (!!obj.goodsValue) {
            let str = obj.goodsValue.toString();
            let arr = [];
            if (str.length >= 5) {
              return arr = ('¥' + obj.goodsValue/100 + '.' + str.substring(str.length-2, str.length)).split('.');
            } else if (str.length == 4) {
              return arr = ('¥' + obj.goodsValue/100 + '.' + str.substring(str.length-1, str.length) + '0').split('.');
            } else {
              return arr = ('¥' + obj.goodsValue/100 + '.00').split('.');
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
          } else {
            return ['','']
          }
        }
      },
      onConfirm () {
          this.$router.push('/point/conversionRecord');
      }
    },
    computed:{
      getpostage:function(){
        return !this.goodsInfo.postage?"包邮":'邮费' + (this.goodsInfo.postage/100||"") + "元";
      }
    },
    created:function(){
      let _this = this;
      this.getGoodsInfoByID();
    },
    components:{
      commomHeader,
      Confirm,
      Group,
      Swiper
    },directives:{
      TransferDom
    }
  };
</script>
