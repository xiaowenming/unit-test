<template>
  <div class="couponPage pr fullPage" :style="{'-webkit-overflow-scrolling': scrollMode}">
      <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :showAdd="showAdd" :rightPath="rightPath" :showText="showText" :rightText="rightText"></commomHeader>
      <div class="noCoupon center-y" v-if="!!noCoupon">
          <img src="/static/images/eshop/icon_coupon_none.png" alt="">
          <p class="tac">暂无优惠券</p>
      </div>
      <div class="canUseCoupon">
            <mescroll-vue class="containerScroll" ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
                <ul class="couponList">
                    <li class="couponListItem tal" v-for="(item,index) in couponList" @click="chooseCoupon(item)">
                        <p class="top"><span class="couponPoint">{{item.couponValue}}<i>积分</i></span><span class="couponInfo">{{item.couponName}}</span></p>
                        <p class="bottom">
                            <span class="startTime">{{item.startTime.substring(0,10)}}</span>至
                            <span class="endTime">{{item.endTime.substring(0,10)}}</span>
                            <span class="couponRangeType fr">{{item.rangeType=="all"?"全网通用":"限指定商品"}}</span>
                        </p>
                    </li>
                </ul>
            </mescroll-vue>
      </div>
  </div>
</template>

<style lang="less" scoped>
    .couponPage .noCoupon{
        width: 100%;
        top:40%;
    }
    .noCoupon img{
        margin: 0 auto 0.3rem;
        width: 1.32rem;
        height: 1.32rem;
    }
    .noCoupon p{
        width: 100%;
        font-size: 0.48rem;
        color: #999;
    }
    .canUseCoupon {
        width: 100%;
    }
    .couponList{
        width: 100%;
        padding-bottom: 0.9rem;
        overflow: scroll;
    }
    .couponListItem{
        width: 7.1rem;
        height: 2.4rem;
        margin: 0.2rem auto 0;
        padding-left: 0.6rem;
        color: #fff;
        font-size: 0.26rem;
        background: url("/static/images/eshop/coupon_background.png") no-repeat center center/100% 100%;
    }
    .couponListItem .top{
        height: 1.45rem;
        line-height: 1.45rem;
        margin-bottom: 0.02rem;
    }
    .couponListItem .bottom{
        height: 0.93rem;
        line-height: 0.93rem;
        padding-right: 0.5rem;
    }
    .couponListItem .couponPoint{
        margin-right: 0.3rem;
        font-size: 0.6rem;
    }
    .couponListItem .couponPoint i{
        font-size: 0.32rem;
    }
</style>

<script>
    import commomHeader from "../commomComponents/header"
    import {userModel} from '../../api'
    import MescrollVue from 'mescroll.js/mescroll.vue'
    export default {
        name:"myCoupon",
        data (){
            return {
                noCoupon:false,
                headerTitle:"我的优惠券",
                rightIsShow:false,
                showArrow:"",
                showAdd:"",
                showText:"showText",
                rightText:"兑换记录",
                rightPath:null,
                couponList:[],
                allLoaded: false,
                scrollMode:"touch",
                startPageNo:1,
                couponList:[],
                canUseCoupon:false,//判断请求抵用券类型
                mescroll: null,
                mescrollDown: {
                    use: false
                },
                mescrollUp: { // 上拉加载的配置.
                    callback: this.init,
                    page: {
                        num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                        size: 5 //每页数据条数,默认10
                    },
                    noMoreSize: 5,
                    isLock: false
                }
            }
        },
        methods:{
            init (page, mescroll) {
                let data = {pageNo: page.num, pageSize: page.size};
                if (this.canUseCoupon==0) {
                    //从我的抵用券进入
                    userModel.getCouponAll(data, res => {
                        if(res.data.data.pageNo >= res.data.data.pageCount){
                            this.mescrollUp.isLock = true;
                        } else {
                            this.mescrollUp.isLock = false;
                        }
                        let result = res.data.data.coupons;
                        this.couponList = this.couponList.concat(result);
                        if(this.couponList.length==0){
                            this.noCoupon = true;
                        }
                        this.$nextTick(() => {
                            mescroll.endSuccess(result.length);
                        });
                    }, err => {
                        mescroll.endErr();
                    })
                } else {
                    data.goodsId = this.$route.query.goodsId;
                    userModel.getCouponCanuser(data, res => {
                        if (res.data.data.pageNo === res.data.data.pageCount) {
                            this.allLoaded = true;
                        }
                        let result = res.data.data.coupons;
                        result.forEach(item => {
                            this.couponList.push(item);
                        });
                        if (this.couponList.length == 0) {
                            this.noCoupon = true;
                        }
                        this.$nextTick(() => {
                            mescroll.endSuccess(result.length);
                        });
                    }, err => {
                        mescroll.endErr();
                    })
                }
            },
            chooseCoupon:function(item){
                if(this.$route.query.canUseCoupon==1){
                  this.$router.push({path:"/getPaper/sendOrder",query:{currentCouponId:item.couponId,currentCouponName:item.couponName,goodsId:this.$route.query.goodsId,currentCouponValue:item.couponValue,goodsSum:this.$route.query.goodsSum}});
                }
            },
            mescrollInit (mescroll) {
                this.mescroll = mescroll;
            }
        },
        components:{
            commomHeader,
            MescrollVue
        },
        beforeMount:function(){
            this.canUseCoupon = this.$route.query.canUseCoupon;
            this.couponList = [];
        }
    }
</script>
