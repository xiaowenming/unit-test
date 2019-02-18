<template>
  <div class="pointStorePage fullPage">
    <!-- 商品列表, 与用户中心模块切换显示 -->
    <ul class="goods-List clearfix">
      <li class="goods-info fl" v-for="(info,i) in (goodsList)"  @click="toOrder(info, i)" :key="i">
        <div>
              <img :src="imgDomain+(info.goodsUrl.split(','))[0]" class="goods-img-small">
        </div>
        <div class="goodsInfomation">
          <div class="top">
            <h4 class="tal">{{!!info.goodsName ? (info.goodsName.length > 10 ? info.goodsName.substring(0, 10) + '...' : info.goodsName) : ''}}</h4>
            <p class="goodsService tal color999">{{!!info.remark ? (info.remark.length > 10 ? info.remark.substring(0, 10) + '...' : info.remark) : ''}}</p>
          </div>
          <div class="bottom">
            <div class="price fl verticalBottom colorHight">
              <span class="bigFont">{{info.salesMode == 'score' ? getPrice(info) : getPrice(info)[0] ? getPrice(info)[0] + '.' : ''}}</span>
              <span class="smallFont">{{info.salesMode == 'score' ?'': getPrice(info)[1]}}</span>
            </div>
            <div class="buyBtn fr"></div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="less" scoped>
html{
  background-color: #f4f4f4;
}
.pointStorePage{
  background-color: #f4f4f4;
}
// 商品列表
.goods-List {
  width: 100%;
  background-color: #f4f4f4;
  height: 92%;
  padding-bottom: 1rem;
  box-sizing: border-box;
  overflow: scroll;
}
.goods-info {
  width: 47%;
  margin-top: 0.4rem;
  margin-left: 2%;
  background-color: #fff;
}
.goods-info img.goods-img-small {
  width: 100%;
  height: auto;
}
.goods-info .goodsInfomation {
  padding: 0 0.2rem;
}
.goods-info .goodsInfomation h4 {
  height: 0.42rem;
  color: #000;
  font-size: 0.26rem;
}
.goodsInfomation .goodsService {
  font-size: 0.18rem;
  min-height: 0.36rem;
  line-height: 0.36rem;
}
.goodsInfomation .bottom {
  height: 0.86rem;
  line-height: 0.86rem;
}
.buyBtn{
  width: 1.12rem;
  height: 0.46rem;
  margin-top: 0.20rem;
  background: url('/static/images/eshop/shop_button_buy.png') no-repeat;
  background-size: cover;
}
// 用户中心部分
.bannerBox .pointSum,
.bannerBox .couponSum {
  height: 100%;
  position: absolute;
  top: 0;
  color: #fff;
  padding-top: 0.85rem;
}
.bannerBox .pointSum {
  left: 1.9rem;
}
.bannerBox .couponSum {
  right: 1.9rem;
}
.bannerBox .pointSum p:nth-child(1),
.bannerBox .couponSum p:nth-child(1){
  font-size: 0.38rem;
}
.bannerBox .pointSum p:nth-child(2),
.bannerBox .couponSum p:nth-child(2){
  font-size: 0.28rem;
}
// 用户中心列表
.userItems ul{
  background-color: #fff;
  margin-top: 0.2rem;
  font-size: 0.32rem;
  font-weight: 700;
}
.userItems li{
  height: 1rem;
  line-height: 1rem;
  padding: 0 1rem;
  border-bottom: 1px solid #EFEFF4;
}
.userItems li img{
  width: 0.44rem;
  height: 0.44rem;
  position: absolute;
  left: 0.28rem;
  top: 0.28rem;
}
.userItems li .arrow{
  width: 0.18rem;
  height: 0.3rem;
  background: url('/static/images/customer/home_but_enter.png') no-repeat;
  background-size: cover;
  position: absolute;
  right: 0.28rem;
  top: 0.35rem;
}
//底部样式
.pointStoreFooter {
  height: 1rem;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
}
.pointStoreFooter .item {
  width: 50%;
  height: 100%;
}
.pointStoreFooter .item p {
  width: 0.6rem;
}
.pointStoreFooter .left{
  border-right: 1px solid #e0e0e0;
}
.pointStoreFooter .leftImgBox,
.pointStoreFooter .rightImgBox{
  width: 0.5rem;
  height: 100%;
  margin: 0 auto;
}
.pointStoreFooter .btnLeftIcon,
.pointStoreFooter .btnRightIcon {
  width: 0.4rem;
  height: 0.4rem;
  margin-top: 0.15rem;
}
// .pointStoreFooter .btnLeftIcon{
//   margin-right: 0.05rem;
// }
.pointStoreFooter .btnRightIcon{
  margin-left: 0.1rem;
}
</style>

<script>
import {pointStoreModel} from '../../api'
export default {
  name: "pointStore",
  data() {
    return {
      imgDomain:"",
      goodsList: [],
      containerId: ""
    };
  },
  methods: {
    getPostage:function(num){
      return !num?"包邮":num/100+"元";
    },
    // 获取商品货柜
    getBannerImg:function(){
      let _this = this;
      pointStoreModel.getGoodsContainer({}, function(res){
        _this.containerId = res.data.data.goodsContainerList[0].containerId;
        _this.getGoodsList();
      });
    },
    // 获取商品列表
    getGoodsList:function(){
      let _this = this;
      pointStoreModel.getGoodsByContainerId({containerId:this.containerId}, function(res){
        _this.imgDomain = res.data.data.imgDomain;
        _this.goodsList = res.data.data.goodsList;
      })
    },
    // 前往下单页面
    toOrder (info, index) {
      this.$router.push({path:'/getPaper/getPaper', query: {containerId: info.containerId,index: index}});
    },
    // 获取价格
    getPrice (obj) {
      if (!!obj.goodsValue) {
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
          }
        }
      } else {
        return [];
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name == 'conversionRecord' || to.name == 'addressManage' || to.name == 'pointRule' || to.name == 'myCoupon') {
      from.meta.keepAlive = true;
      next();
    } else {
      from.meta.keepAlive = false;
      next();
    }
  },
  created: function() {
    this.getBannerImg();
  }
};
</script>