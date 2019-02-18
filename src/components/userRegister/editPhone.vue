<template>
  <div class="editPhonePage fullPage bgWhite">
      <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :showAdd="showAdd"
      :rightPath="rightPath" :showText="showText" :rightText="rightText"></commomHeader>
      <div class="validCode eachLine">
        <div class="icon fl pr"><img class="center-y" src="/static/images/health/phone_icon.png" alt=""></div>  
        <input type="text" class="userPhone fl" v-on:input="noWarn" v-model="phoneNumber" placeholder="请输入未注册过的手机号">
      </div>
      <div class="validCode eachLine">
        <div class="icon fl pr"><img class="center-y" src="/static/images/health/phone_yanzhengm.png" alt=""></div>          
        <input type="text" class="userValidCode fl" v-model="validCode" placeholder="验证码">
        <button :class="buttonClass" @click="getCode" :disabled="isDisabled">{{codeText}}</button>
      </div>
      <div class="confirm" @click="subPhone">确定</div>
      <div class="warn tac" v-show="!!warn">{{warn}}</div>
  </div>
</template>

<style lang="less" scoped>
    .eachLine {
        width: 100%;
        height: 1.2rem;
        padding-left: 0.4rem;
        /* line-height: 1.2rem; */
        font-size: 0.32rem;
        border-bottom: 1px solid #e0e0e0;
    }
    .eachLine .icon{
        width: 0.35rem;
        height: 100%;
        padding-right: 0.72rem;
    }
    .eachLine input{
        height: 98%;
        padding: 0.24rem 0 ;
        width: 5.5rem;
        color: #999;
    }
    .eachLine .userValidCode{
        width: 30%;        
    }
    .eachLine .icon img{
        width: 0.35rem;
        height: 0.35rem;
    }
    .confirm{
        width: 90%;
        margin-left: 5%;
        color: #FFF;
        height: 0.9rem;
        line-height: 0.9rem;
        margin-top: 0.8rem; 
        text-align: center;
        background-color: #4ec69d;
        border-radius: 0.1rem;
        font-size: 0.32rem;
    }
    .getValidCode{
        width: 35%;
        height: 0.76rem;
        line-height: 0.76rem;
        text-align: center;
        border-radius: .32em;
        background-color: #34b597;
        color: #FFF;
        margin-right: 5%;
        margin-top: 0.17rem;
        border: none;
        float: right;
    }
    .noUse {
        width: 35%;
        height: 0.76rem;
        line-height: 0.76rem;
        text-align: center;
        border-radius: .32em;
        background-color: #999;
        color: #FFF;
        margin-right: 5%;
        margin-top: 0.17rem;
        border: none;
        float: right;
    }
    .warn {
        width: 100%;
        height: 0.4rem;
        font-size: 0.36rem;
        line-height: 0.4rem;
        padding-top: 0.2rem;
        color:#f00;
    }
</style>

<script>
    import commomHeader from "../commomComponents/header"
    import {isEmptyString} from '../../utils/utils'
    import {validatePhoneNumber} from '../../utils/validate'
    import {commonApiModel, userModel} from '../../api'
    export default {
        name:"guess",
        data (){
            return {
                headerTitle: "更改手机号",
                rightIsShow: false,
                showArrow: "",
                showAdd: "",
                showText: "showText",
                rightText: "",
                rightPath: "",
                isDisabled: false,
                codeText:"获取验证码",
                buttonClass:"getValidCode",
                phoneNumber:"",
                validCode:"",
                warn: "",
            }
        },
        components: {
            commomHeader
        },
        methods:{
            getCode:function(){
                if (validatePhoneNumber(this.phoneNumber)) {
                    let _this = this;
                    commonApiModel.getPhoneValidateCode({phone: this.phoneNumber}, function (res) {
                        let time = 120;
                        _this.isDisabled = true;
                        _this.codeText = time + "秒后重新获取";
                        let Timer = setInterval(function () {
                        time--;
                        _this.codeText = time + "秒后重新获取";
                        _this.buttonClass = "noUse"
                        if (time == 0) {
                            clearInterval(Timer);
                            _this.isDisabled = false;
                            _this.codeText = "获取验证码";
                            _this.buttonClass = "getValidCode";
                        }
                        }, 1000);
                    });
                } else {
                    this.warn = "手机号不可用";
                }
            },
            noWarn:function(){
                this.warn = "";
            },
            subPhone:function(){
                let _this = this;
                if(isEmptyString(this.phoneNumber)==""){
                    this.showToast("手机号不能为空");
                }else if(!validatePhoneNumber(this.phoneNumber)){
                    this.showToast("手机号不正确");
                }else if(isEmptyString(this.validCode)==""){
                    this.showToast("验证码不能为空");
                }else{
                    userModel.userEditPhone({phone:this.phoneNumber,validCode:this.validCode}, function(res){
                        if(res.data.meta.code=="0"){
                            _this.showToast("更改成功");
                            _this.$router.go(-1);
                        }
                    },function(err){
                        _this.showToast(err.data.meta.msg);
                    });
                }
            }
        }
    }
</script>