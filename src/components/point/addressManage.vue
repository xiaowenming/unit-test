<template>
  <div class="addressManagePage fullPage pr" :style="{'-webkit-overflow-scrolling': scrollMode}">
        <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :rightPath="rightPath" :showAdd="showAdd" :showText="showText" :rightText="rightText" :goBackTwo="goBackTwo"></commomHeader>
        <div class="noAddress tac" v-show="isShow">您还没有收货地址,请添加收货地址</div>
        <div class="addressContent" v-show="!isShow">
            <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
                <ul class="addressList" v-show="!isShow">
                    <li class="addressListItem bgWhite" v-for="(item,index) in addressData" :key="index">
                        <div class="addressTop">
                            <div class="receiverInfo">
                                <span class="tal fl">收件人: <i class="receiver">{{item.name}}</i></span><span class="telephoneNumber fr">{{item.phoneNumber}}</span>
                            </div>
                            <div class="receiverAddress tal">
                                <span class="address">{{item.address}}</span>
                            </div>
                        </div>
                        <div class="addressBottom pr">
                            <div class="content center-y">
                                <div class="addressBottomLeft fl"><i :class="{choosed:item.isDefault==1,normal:item.isDefault!=1}" @click="setDefault(item.addressId)"></i><span>设为默认</span></div>
                                <div class="addressBottomright fr">
                                    <span @click="editAddress(item)"><i class="edit"></i><span>编辑</span></span>
                                    <span  @click="deletAddress(item.addressId)"><i class="del"></i><span>删除</span></span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </mescroll-vue>
        </div>
        <div class="block w100"></div>
        <div class="addAddress bgBase tac" @click="addNewAddress">添加新地址</div>
        <div class="popup-div" id="deleteConfirm" v-show="maskIsShow">
            <div class="rl-div">
                <div>
                    确定删除地址吗?
                </div>
                <div class="err tac" style="color:#ff0000;font-size:0.7em;" v-show="errIsShow">存在默认地址,请先删除默认地址</div>
                <div class="edit-btn-div">
                    <div class="cancel cancelDelete" @click="cancel">取消</div>
                    <div class="affirm affirmDelete" @click="confirm">确认</div>
                </div>
            </div>
        </div>
  </div>
</template>
<style>
   .addressManagePage .vux-popup-mask{
       background-color: rgba(0,0,0,0.5) !important;
   } 
  .special-address{
    width: calc(100% - 0.6rem);
    height: auto;
    overflow: hidden;
    padding: 0.3rem;
  }
</style>
<style lang="less" scoped>
    .addressManagePage{
        background-color: #eee;
    }
    .addressContent .addressList{
        overflow: scroll;
        background-color: #eee;
    }
    .addressList .addressListItem{
        width: 100%;
        min-height: 2.62rem;
        margin-bottom: 0.4rem;
        background-color: #fff;
    }
    .addressListItem .addressTop{
        min-height: 1.82rem;
        padding: 0 0.3rem;
        font-size: 0.32rem;
        border-bottom: 1px solid #CECECE;
    }
    .addressTop .receiverInfo{
        min-height: 0.86rem;
        line-height: 0.86rem;
    }
    .addressTop .receiverAddress{
        min-height: 0.96rem;
    }
    .addressListItem .addressBottom{
        height: 0.8rem;
    }
    .addressBottom .content{
        width: 100%;
        height: 0.36rem;
        line-height: 0.36rem;
        padding: 0 0.3rem;
        font-size: 0.32rem;
    }
    .addressBottom .content i{
        vertical-align: bottom;
        width: 0.36rem;
        height: 0.36rem;
        box-sizing: content-box;
    }
    .addressBottom .addressBottomLeft .normal{
        margin-right: 0.2rem;
        background: url("/static/images/eshop/address_unselect1.png") no-repeat;
        background-size: cover;
    }
    .addressBottom .addressBottomLeft .choosed{
        margin-right: 0.2rem;
        background: url("/static/images/eshop/address_select1.png") no-repeat;
        background-size: cover;
    }
    .addressBottomright .edit{
        margin-left: 0.2rem;
        background: url("/static/images/eshop/btn_adress_edit.png") no-repeat;
        background-size: cover;
    }
    .addressBottomright .del{
        margin-left: 0.2rem;
        background: url("/static/images/eshop/btn_adress_del.png") no-repeat;
        background-size: cover;
    }
    .addAddress{
        width: 100%;
        height: 0.9rem;
        position: fixed;
        left: 0;
        bottom: 0;
        line-height: 0.9rem;
        font-size: 0.36rem;
        color: #fff;
    }
    .noAddress{
        height: 3rem;
        line-height: 3rem;
        font-size: 0.36rem;
    }
    .popup-div{
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1111111;
        width: 100%;
        height: 100%;
    }
    .rl-div {
        position: fixed;
        width: 100%;
        float: left;
        padding-top: 50px;
        bottom: 0px;
        background-color: #FFF;
        font-size: 0.36rem;
        text-align: center;
    }
    .edit-btn-div {
        margin-top: 0.6rem;
        margin-bottom: 0.6rem;
    }
    .cancel {
        display: inline-block;
        width: 40%;
        color: #FFF;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        background-color: #cccccc;
        border-radius: 0.1rem;
        border: 1px solid #cccccc;
    }
    .affirm {
        display: inline-block;
        width: 40%;
        color: #FFF;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        background-color: #34b597;
        border-radius: 0.1rem;
    }
    .err{
        color: #f00;
    }
    .block{
        height: 0.9rem;
    }
</style>

<script>
    import commomHeader from "../commomComponents/header"
    import {isEmptyString} from '../../utils/utils'
    import {userModel} from '../../api'
    import MescrollVue from 'mescroll.js/mescroll.vue'
    export default {
        name:"addressManage",
        data (){
            return {
                addressData:[],
                headerTitle:"管理地址",
                rightIsShow:false,
                showArrow:"",
                showAdd:"",
                showText:"",
                rightText:"",
                rightPath:null,
                goBackTwo:false,
                // isDefault:0,
                isShow:false,
                errIsShow:false,
                maskIsShow:false,
                delId:"",
                startPageNo:1,
                allLoaded: false,
                scrollMode:"touch",
                isSend:true,
                mescroll: null,
                mescrollDown: {
                    use: false
                },
                mescrollUp: { // 上拉加载的配置.
                    callback: this.getAddressManage,
                    page: {
                        num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
                        size: 5 //每页数据条数,默认10
                    },
                    noMoreSize: 5,
                    isLock: false
                }
            }
        },
        components:{
            commomHeader,
            MescrollVue
        },
        methods:{
            loadBottom:function() {
                // 上拉加载
                this.more();// 上拉触发的分页查询
                this.$refs.loadmore.onBottomLoaded();// 固定方法，查询完要调用一次，用于重新定位
            },
            setDefault:function(id){
                userModel.setAnAddressDefault({addressId:id}, (res) => {
                    this.addressData = [];
                    this.getAddressManage(this.mescrollUp.page, this.mescroll)
                })
            },
            getAddressManage (page, mescroll) {
                let data = {pageNo: page.num, pageSize:page.size};
                userModel.getUserAddressList(data, (res) => {
                    if(res.data.data.pageNo >= res.data.data.pageCount){
                        this.mescrollUp.isLock = true;
                    } else {
                        this.mescrollUp.isLock = false;
                    }
                    let result = res.data.data.addressList;
                    if(result.length == 0){
                        this.isShow = true;
                    }else{
                        // let dataArr = [];
                        for(let i=0;i<result.length;i++){
                            let dataObj = {};
                            dataObj.name = result[i].consigneeName;
                            dataObj.phoneNumber = result[i].phone;
                            dataObj.addressId = result[i].addressId;
                            dataObj.userId = result[i].customerId;
                            dataObj.isDefault = result[i].isDefault;
                            dataObj.province = result[i].province;
                            dataObj.city = result[i].city;
                            dataObj.district = result[i].district;
                            dataObj.detailAddress = result[i].detailAddress;
                            if(isEmptyString(result[i].province) == ''){
                                dataObj.address = result[i].detailAddress;
                            }else{
                                dataObj.address = result[i].province + result[i].city + result[i].district + result[i].detailAddress;
                            }
                            this.addressData.push(dataObj);
                        }
                    }
                    this.$nextTick(() => {
                        mescroll.endSuccess(result.length);
                    });
                }, err => {
                    mescroll.endErr();
                });
            },
            deletAddress:function(id){
                this.maskIsShow = true;
                this.errIsShow = false;
                this.delId = id;
            },
            cancel:function(){
                this.maskIsShow = false;
            },
            confirm:function(){
                userModel.deleteAddress({addressId:this.delId}, (res) => {
                    this.addressData = [];
                    this.getAddressManage(this.mescrollUp.page, this.mescroll);
                    this.maskIsShow = false;
                }, (err) => {
                    this.errIsShow = true;
                })
            },
            addNewAddress:function(){
                this.$router.push({path:"/point/addAddress",query:{isEdit:1,addressInfo:{}}});
            },
            editAddress:function(item){
                this.$router.push({path:"/point/addAddress",query:{isEdit:0,name:item.name,phoneNumber:item.phoneNumber,address:item.detailAddress,id:item.addressId,province:item.province,city:item.city,district:item.district}});
            },
            more:function (){
                // 分页查询
                this.startPageNo = parseInt(this.startPageNo) + 1;
                this.getAddressManage(this.mescrollUp.page, this.mescroll);
            },
            mescrollInit (mescroll) {
                this.mescroll = mescroll;
            }
        },
        created:function () {
            this.isSend = this.$route.query.isSend;
        },
        beforeMount:function(){
            if(this.$route.query.backTwo){
                this.goBackTwo = true;
            }else{
                this.goBackTwo = false;
            }
        }
    }
</script>
