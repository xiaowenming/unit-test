<template>
    <div class="fullPage addAddressPage">
        <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :rightPath="rightPath" :showAdd="showAdd" :showText="showText" :rightText="rightText"></commomHeader>
        <div class="name bgWhite">
            <div class="text fl">收件人:</div> <input type="text" class="userName fl" v-validateEmoji placeholder="必填，最多10个字符" v-model="consigneeName" maxlength="10">
        </div>
        <div class="phone bgWhite">
            <div class="text fl">手机号:</div> <input type="number" class="userPhone fl" placeholder="必填" v-model="phoneNumber" v-on:input="noWarn" maxlength="11">
        </div>
        <div class="chooseArea bgWhite">
            <div class="text fl">选择地区:</div>
            <group style="height:98%">
                <x-address :title="title" @on-hide="logHide" v-model="value" raw-value :list="addressData" placeholder="点击选择" value-text-align="left">
                    <template slot="title" slot-scope="props">
                    <span :class="props.labelClass" :style="props.labelStyle" style="height:24px;">
                    </span>
                    </template>
                </x-address>
            </group>
        </div>
        <div class="addressDetail">
            <textarea placeholder="请填写详细地址, 不少于5个字,不多余40字" v-validateEmoji v-model="setAddress" name="" class="address fl" cols="30" rows="2" maxlength="40" @focus="addressDetailFocus"></textarea>
        </div>
        <div class="gender bgWhite" v-show="setDefaultIsShow">
            <div class="text fl">设为默认:</div>
            <div class="right fl tal">
                    <span class="item" v-for="(item,index) in genderList" @click="chooseGender(index)" :key="index">
                        <img src="/static/images/customer/btn_select_on.png" alt="">
                        <span>{{item}}</span>
                    </span>
            </div>
        </div>
        <div class="warn tac" v-show="!!warn">{{warn}}</div>
        <div class="btnSubmit" @click="subAddress">提交</div>
    </div>
</template>
<style>
    .addAddressPage .weui-cells:before{
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: none;
        color: #D9D9D9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
    .addAddressPage .vux-cell-value{
        color: #000;
    }
    .addAddressPage .weui-cells:after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: 1px;
        border-bottom: none;
        color: #D9D9D9;
        -webkit-transform-origin: 0 100%;
        transform-origin: 0 100%;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
    .addAddressPage .weui-cells {
        margin-top: 0;
        background-color: #FFFFFF;
        line-height: 0.8rem;
        font-size: 0.32rem;
        overflow: hidden;
        position: relative;
    }
    .addAddressPage .weui-cell {
        padding-right:0 0.4rem 0;
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }
    .vux-popup-header{
        display: block !important;
    }
    .vux-popup-header-left{
        float: left;
    }
    .vux-popup-header-right{
        float: right;
    }
</style>

<style lang="less" scoped>
   .name,
   .phone,
   .addressDetail,
   .gender,
   .chooseArea
   {
       width: 100%;
       height: 1.2rem;
       /* line-height: 1.2rem; */
       font-size: 0.32rem;
       border-bottom:1px solid #e0e0e0;
   }
   .chooseArea{
       padding-bottom:2.1rem;
   }
   .addressDetail{
       height: 1.42rem;
       margin-top:0.2rem;
   }
   .name .userName,
   .phone .userPhone,
   .addressDetail textarea
   {
        width: 70%;
        height: 1.18rem;
        /* line-height: 1.18rem; */
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 0.08rem;
        padding: 0.2rem 0.24rem;
        font-size: 0.32rem;
   }
   .text{
       width: 25%;
       color:#000;
       padding-left: 0.2rem;
       text-align-last: left;
       line-height: 1.2rem;
   }
   .gender .right{
       width: 60%;
       line-height: 1.2rem;
   }
   .name{
       margin-top: 0.1rem;
   }
   .addressDetail textarea{
       width: 100%;
       height: 1.4rem;
       padding: 0.12rem 0.24rem;
       border: none;
       line-height: 0.5rem;
   }
   .right img{
       display: inline-block;
       width: 0.4rem;
       height: 0.4rem;
       vertical-align: middle;
   }
   .right span{
       margin: 0 0.2rem;
   }
   .btnSubmit{
        width: 90%;
        margin-left: 5%;
        color: #FFF;
        height: 0.9rem;
        line-height: 0.9rem;
        text-align: center;
        position: fixed;
        bottom: 0.4rem;
        background-color: #4ec69d;
        border-radius: 0.1rem;
        font-size: 0.32rem;
    }
    .warn{
        width: 100%;
        height: 0.4rem;
        font-size: 0.36rem;
        line-height: 0.4rem;
    }
</style>

<script>
    import commomHeader from "../commomComponents/header"
    import {validateEmoji} from '../../directives'
    import { Group, XAddress, ChinaAddressV4Data, XButton, Cell, Value2nameFilter as value2name } from 'vux'
    import {isEmptyString} from '../../utils/utils'
    import {validatePhoneNumber} from '../../utils/validate'
    import {userModel} from '../../api'
    export default {
        name:"addAddress",
        data (){
            return {
                headerTitle:"新增地址",
                rightIsShow:false,
                showArrow:"",
                showAdd:"",
                showText:"",
                rightText:"",
                rightPath:null,
                genderList:["是"],
                address:"",
                consigneeName:"",//收货人名字
                phoneNumber:"",
                warn:"",
                setAddress:"",
                setDefaultIsShow:true,
                isEdit:false,
                addressInfo:{},
                addFlag:true,//保存地址标志 , 防止重复保存
                //省市区选择
                title: '默认为空',
                value: [],
                addressData: ChinaAddressV4Data,
                province:"",
                city:"",
                district:""
            }
        },
        components:{
            commomHeader,
            Group,
            XAddress,
            XButton,
            Cell,
        },
        methods:{
            noWarn:function(){
                this.warn ="";
            },
            subAddress:function(){
                let _this = this ;
                if(_this.addFlag){
                    if(this.isEdit==1){
                        if(isEmptyString(_this.consigneeName) == ''){
                            _this.showToast('收货人不能为空');
                        }else if(isEmptyString(_this.phoneNumber) == ''){
                            _this.showToast('手机号不能为空');
                        }else if(!validatePhoneNumber(_this.phoneNumber)){
                            _this.showToast('手机号不正确');
                        } else if(isEmptyString(_this.setAddress) == ''){
                            _this.showToast('详细地址不能为空');
                        }else if(_this.setAddress.length<5){
                            _this.showToast('详细地址不能少于5个字');
                        }else{
                            _this.addFlag = false;//置为false防止重复提交地址
                            let data = {detailAddress:_this.setAddress,consigneeName:_this.consigneeName,phone:_this.phoneNumber,province:this.province || '',city:this.city || '',district:this.district || ''};
                            userModel.addUserAddress(data, function(res){
                                _this.addFlag = true;
                                _this.$router.go(-1);
                            });
                        }
                    }else if(this.isEdit==0){
                        if(isEmptyString(_this.consigneeName) == ''){
                            _this.showToast('收货人不能为空');
                        }else if(isEmptyString(_this.phoneNumber) == ''){
                            _this.showToast('手机号不能为空');
                        }else if(!validatePhoneNumber(_this.phoneNumber)){
                            _this.showToast('手机号不正确');
                        } else if(isEmptyString(_this.setAddress) == ''){
                            _this.showToast('详细地址不能为空');
                        }else if(_this.setAddress.length<5){
                            _this.showToast('详细地址不能少于5个字');
                        }else{
                            _this.addFlag = false;//置为false防止重复提交地址
                            let data = {addressId:_this.$route.query.id,detailAddress:_this.setAddress.trim(),consigneeName:_this.consigneeName.trim(),phone:_this.phoneNumber.trim(),province:this.province || '',city:this.city || '',district:this.district || ''};
                            userModel.editUserAddress(data, function(res){
                                _this.addFlag = true;
                                _this.$router.go(-1);
                            });
                        }
                    }
                }

            },
            getName (value) {
                return value2name(value, ChinaAddressV4Data)
            },
            logHide:function(str) {
                let that = this;
                //坐标转化为名称
                let getAddress = this.getName(this.value).split(" ");
                for(var key in getAddress){
                    that.province = getAddress[0] || '';
                    that.city = getAddress[1] || '';
                    that.district = getAddress[2] || '';
                }
            },
            addressDetailFocus:function(){
                this.focusEvent(".addAddressPage");
            }
        },
        beforeMount:function(){
            this.isEdit = this.$route.query.isEdit;
            this.addressId = this.$route.query.id;
            if(this.isEdit==0){
                this.setDefaultIsShow = false;
                this.headerTitle = "修改地址";
                this.consigneeName = this.$route.query.name;
                this.phoneNumber = this.$route.query.phoneNumber;
                this.setAddress = this.$route.query.address;
                this.value.push(this.$route.query.province);
                this.value.push(this.$route.query.city);
                this.value.push(this.$route.query.district);
                this.province = this.$route.query.province;
                this.city = this.$route.query.city;
                this.district = this.$route.query.district;
            }
        },
        directives: {
            validateEmoji
        }
    }
</script>
