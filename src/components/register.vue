<template>
  <div class="fullPage">
    <commomHeader :headerTitle="isHuaweiLogin ? '绑定手机号' : '用户注册' " :rightIsShow="rightIsShow" :showArrow="showArrow" :showAdd="showAdd" :rightPath="rightPath" :showText="showText" :rightText="rightText" :goBackTwo='false'></commomHeader>

    <div class="eachLine bgWhite">
      <div class="text fl">姓名:</div>
      <input class="inputCode tar edit edit-width fr" type="text" placeholder="请输入姓名" v-model="userName" maxlength="10">
    </div>

    <!-- <div class="gender-edit eachLine pr">
      <div class="text fl">性别:</div>
      <div class="right-edit fr">
        <div v-for="(item,index) in genderList" @click="chooseGender(index)" :class="{genderItem:true,fl:true,current:selected==index}">
          <span :class="{current:selected==index}">{{item}}</span>
        </div>
      </div>
    </div>

    <div class="eachLine">
      <div class="text fl" style="width:30%">糖尿病类型:</div>
      <input class="inputCode fr tar edit edit-width" type="text" placeholder="点击选择" v-model="diabetesType" maxlength="10" @click="showSelect" readonly>
    </div> -->

    <div class="phone eachLine bgWhite">
      <div class="text fl">手机号:</div>
      <input class="edit fl" type="text" placeholder="请输入手机号" v-model="phoneNumber" maxlength="11">
      <button :class="buttonClass" @click="getCode" :disabled="disabled">{{codeText}}</button>
    </div>

    <div class="validCode eachLine bgWhite">
      <div class="text fl">验证码:</div>
      <input class="inputCode fr tar edit edit-width" type="text" placeholder="请输入验证码" v-model="validCode" maxlength="6">
    </div>

    <span :class="{btn:isCheck, btnDisable:!isCheck }" @click="submit">{{isHuaweiLogin ? "确定" : "注册"}}</span>
    <!-- 协议 -->
    <div class="protocolBox">
      <check-icon :value.sync="isCheck"></check-icon>
      我已阅读并同意<span class="colorBase" @click="showProtocol">《双平泰平台使用协议》</span>
    </div>
    <!-- v-if="!isHuaweiLogin" -->
    <div class="fastLogin pr" v-if="!isHuaweiLogin&&!isAicaresHealth">
      <div class="divider center-y left"></div>
      <span class="fastLoginText">快捷方式登录</span>
      <div class="divider center-y right"></div>
    </div>
    <!-- v-if="!isHuaweiLogin" -->
    <div class="huaweiLogo" v-if="!isHuaweiLogin&&!isAicaresHealth">
      <img class="huaweiImage" src="../../static/images/register/huawei_but.png" @click="huaweiOAuth" />
    </div>


    <!-- <div class="selectBox fullPage" v-show="selectIsShow">
      <div class="content">
        <div class="chooseBox">
          <span class="fl" @click="cancel">取消</span>
          <span class="fr" @click="confirm">确定</span>
        </div>
        <ul>
          <li class="item pr" v-for="(item, index) in diabetesTypeArray" @click="chooseLi(index,item.itemKey,item.itemValue)">
            <i class="center-y" v-show="index == diabetesChoosePosition"></i>
            <span>{{item.itemValue}}</span>
          </li>
        </ul>
      </div>
    </div> -->

    <!-- 用户协议弹窗 -->
    <div class="registerMask fullPage" v-show="show" @click="onCancel">
      <div class="registerProtocol" @click="prevent">
        <div class="header tac fw700">用户服务协议</div>
        <div class="content" v-html="content"></div>
        <div class="footer fw700">
          <!-- <span class="cancel fl" @click="onCancel">取消</span>
          <span class="confirm fl colorBase" @click="onConfirm">确定</span> -->
        </div>
      </div>
    </div>

  </div>
</template>

<style lang="less" scoped>
.eachLine {
  width: 100%;
  height: 1.2rem;
  line-height: 1.2rem;
  font-size: 0.32rem;
  border-bottom: 0.01rem solid #e0e0e0;
}
.phone .validCode {
  width: 60%;
  height: 1.2rem;
  line-height: 1.2rem;
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 0.08rem;
  padding: 0.32rem 0.24rem;
  box-sizing: border-box;
}
.phone .edit{
  padding-left: 0.2rem;
}
.eachLine .inputCode {
  padding: 0.2rem 0.24rem;
  height: 1.17rem;
}
.text {
  width: 20%;
  color: #111;
  padding-left: 0.2rem;
  text-align: left;
  font-size: 0.36rem;
}
.getValidCode {
  background-color: #00c2b1;
  float: right;
  height: 0.9rem;
  line-height: 0.9rem;
  width: 2.4rem;
  border: none;
  color: #fff;
  border-radius: 0.08rem;
  text-align: center;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  margin-right: 0.2rem;
  margin-top: 0.15rem;
}
.noUse {
  background-color: #999;
  float: right;
  height: 0.9rem;
  line-height: 0.9rem;
  width: 2.4rem;
  border: none;
  color: #fff;
  border-radius: 0.08rem;
  text-align: center;
  padding: 0 0.2rem;
  margin: 0.15rem 0.2rem 0 0 ;

}

.edit {
  color: #111;
  width: 40%;
  display: inline-block;
  height: 1.17rem;
  line-height: 1.17rem;
}
.edit-width {
  width: 70%;
}
.fastLogin {
  width: 100%;
  margin-top: 0.5rem;
}
.huaweiLogo {
  width: 100%;
  margin-top: 0.4rem;
}
.huaweiLogo img{
  margin: 0 auto;
}
.divider {
  width: 33%;
  height: 1px;
  background-color: #e0e0e0;
  padding-left: 0.32rem;
  padding-right: 0.32rem;
}
.divider.left{
  left:2%;
}
.divider.right{
  left:65%;
}
.fastLoginText {
  font-size: 0.28rem;
  color: #111111;
}

.huaweiImage {
  width: 0.8rem;
  height: 0.8rem;
}

.btn {
  width: 92%;
  background-color: #00c2b1;
  border-radius: 0.08rem;
  margin-left: 0.3rem;
  margin-right: 0.3rem;
  margin-top: 0.6rem;
  color: #ffffff;
  font-size: 0.4rem;
  display: block;
  text-align: center;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
}
.btnDisable{
  width: 92%;
  background-color: #ccc;
  border-radius: 0.08rem;
  margin-left: 0.3rem;
  margin-right: 0.3rem;
  margin-top: 0.6rem;
  color: #ffffff;
  font-size: 0.4rem;
  display: block;
  text-align: center;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
}

.genderItem {
  height: 0.52rem;
  line-height: 0.52rem;
  margin-left: 0.2rem;
  font-size: 0.28rem;
  box-sizing: border-box;
  border: 1px solid #cecece;
}
.genderItem span {
  color: #666;
  padding: 0 0.15rem;
}
.right-edit {
  position: absolute;
  right: 0.2rem;
  top: 50%;
  transform: translateY(-50%);
}
.right-edit .current {
  background-color: #00c2b1;
  border: none;
  color: #fff;
}
.selectBox {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 101;
}
.selectBox .chooseBox {
  widows: 100%;
  height: 0.8rem;
  line-height: 0.8rem;
  font-size: 0.32rem;
  padding: 0 0.2rem;
  background-color: #fff;
}
.chooseBox span {
  display: block;
  width: 50%;
  text-align: center;
}
.selectBox .item {
  height: 1.1rem;
  line-height: 1.1rem;
  font-size: 0.36rem;
  border-top: 1px solid #e0e0e0;
}
.selectBox ul {
  background-color: #fff;
  max-height: 4.4rem;
  overflow: scroll;
}
.selectBox .content {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 120;
  overflow: scroll;
}
.selectBox .item i {
  width: 0.4rem;
  height: 0.4rem;
  vertical-align: middle;
  position: absolute;
  left: 10%;
  background: url("/static/images/patient/jkda_select_icon.png") no-repeat;
  background-size: cover;
}
.registerMask{
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.registerMask .registerProtocol{
  width: 80%;
  height: 350px;
  font-size: 14px;
  background-color: #fff;
  margin: 0 auto;
  margin-top: 100px;
}
.registerProtocol .header,
.registerProtocol .footer{
  height: 35px;
  line-height: 35px;
  font-size: 16px;
}
.registerProtocol .content{
  height: 280px;
  padding: 0 10px;
  overflow: scroll;
}
.registerProtocol .footer span{
  display: block;
  width: 50%;
}
.protocolBox{
  margin-top: 20px;
  font-size: 0.24rem;
}
</style>

<style>
.protocolBox .vux-check-icon > .weui-icon-success:before, .vux-check-icon > .weui-icon-success-circle:before{
  color: #00C2B1;
}
.protocolBox .weui-icon-success{
font-size: 0.28rem;
margin-bottom: 0.05rem;
}
.protocolBox .weui-icon-circle{
font-size: 0.28rem;
margin-bottom: 0.05rem;
}
input{
  font-size: 0.36rem;
}
</style>
<script>
import commomHeader from "./commomComponents/header";
import {userProtocolContent} from '../js/protocol';
import { CheckIcon } from 'vux';
import {validatePhoneNumber} from '../utils/validate'
import {validateEmoji} from '../directives'
import {commonApiModel, userModel} from '../api'
export default {
  name: "register",
  data() {
    return {
      rightIsShow: false,
      showArrow: "",
      showAdd: "",
      showText: "showText",
      rightText: "",
      rightPath: "",
      isHuaweiLogin: false,
      phoneNumber: "",
      validCode: "",
      codeText: "获取验证码",
      buttonClass: "getValidCode",
      huaweiOAuthCode: "",
      disabled: false,
      huaweiOAuthUrl: "",
      genderList: ["男", "女", "保密"],
      selected: 0, //性别选中position
      userName: "",
      diabetesType: "",
      diabetesTypeArray: [],
      selectIsShow: false,
      diabetesChoosePosition: -1,
      // 用户服务协议弹窗控制器
      show: false,
      content: userProtocolContent,
      isCheck: true
    };
  },
  methods: {
    // 获取验证码
    getCode: function() {
      if (this.phoneNumber === "") {
        this.showToast("手机号不能为空");
        return;
      }
      if (validatePhoneNumber(this.phoneNumber)) {
        let _this = this;
        commonApiModel.getPhoneValidateCode(
          { phone: this.phoneNumber },
          function(res) {
            let time = 120;
            _this.codeText = time + "秒后获取";
            _this.buttonClass = "noUse";
            _this.disabled = true;
            let Timer = setInterval(function() {
              time--;
              _this.codeText = time + "秒后获取";
              _this.buttonClass = "noUse";
              if (time === 0) {
                clearInterval(Timer);
                _this.codeText = "获取验证码";
                _this.buttonClass = "getValidCode";
                _this.disabled = false;
              }
            }, 1000);
          }
        );
      } else {
        this.showToast("请输入正确手机号");
      }
    },
    //华为OAuth认证
    huaweiOAuth: function() {
      // if(this.isTest){
      // this.huaweiOAuthUrl = "https://login.cloud.huawei.com/oauth2/v2/authorize?response_type=code&client_id=100185673&redirect_uri=http%3A%2F%2Ftfwx.aicares.net%2Fregister&scope=https%3A%2F%2Fwww.huawei.com%2Fhealth%2Fprofile+https%3A%2F%2Fwww.huawei.com%2Fhealth%2Fhealth.bg&display=mobile&access_type=offline";
      // }
      if (this.huaweiOAuthUrl === "") {
        //授权地址为空，先从服务端获取
        var url = this.huaweiBizBaseUrl + "/huawei/auth/v1/getOauthUrl";
        var _this = this;
        this.ajax(
          "get",
          url,
          {},
          function(res) {
            _this.huaweiOAuthUrl = res.data.data;
            window.location.href = _this.huaweiOAuthUrl;
          },
          function(error) {
            console.log(error);
          },
          true
        );
      } else {
        window.location.href = this.huaweiOAuthUrl;
      }
    },
    submit: function() {
      var phone = this.phoneNumber;
      var validCode = this.validCode;
      var _this = this;
      if (this.isCheck) {
        if (this.userName.trim().length == 0) {
          this.showToast("用户名不能为空");
        } else if (!validatePhoneNumber(phone)) {
          this.showToast("请输入正确手机号");
        } else if (validCode.length != 6) {
          this.showToast("请输入6位验证码");
        } else {
          let gender = _this.selected == 0 ? 1 : _this.selected == 1 ? 2 : 0;
          var data = {
            phone: this.phoneNumber,
            validCode: this.validCode,
            nickname: this.userName,
            // sex: gender,
            publicAccount:sessionStorage.getItem('publicAccount'),
            openid:sessionStorage.getItem('openid'),
            headimgurl:sessionStorage.getItem('headimgurl')
            // diabetesType: this.diabetesTypeArray[this.diabetesChoosePosition]
            //   .itemKey
          };
          let url = sessionStorage.getItem('url');
          userModel.userRegister(data, function(res) {
            sessionStorage.setItem("cid",res.data.data.customerId);
            userModel.getUserInfo({}, function(res) {
              let result = res.data.data.customerVo;
              sessionStorage.setItem("userType", result.userType);
              _this.userType = result.userType;
              if (_this.isHuaweiLogin) {
                _this.bindHuaweiAccount();
              } else {
                _this.$router.push(url); 
              }
            });
          });
        }
      }

    },
    //绑定华为帐号
    bindHuaweiAccount: function() {
      var _this = this;
      var url = this.huaweiBizBaseUrl + "/huawei/auth/v1/bindHuaweiAccount?";
      var data =
        "code=" +
        this.huaweiOAuthCode +
        "&customerId=" +
        sessionStorage.getItem("cid");
      this.ajax(
        "get",
        url + data,
        null,
        function(res) {
          let currentUrl = sessionStorage.getItem('url');
          _this.$router.push(currentUrl);
        },
        null,
        true
      );
    },
    //获取当前url中参数名为name的值，没有则返回空
    getQueryVariable: function(name) {
      var url = window.location.href;
      var position = url.indexOf("?");
      if (position !== -1) {
        var temp = url.substring(position + 1);
        var tempArray = temp.split("&");
        for (var i = 0; i < tempArray.length; i++) {
          if (tempArray[i].indexOf(name) !== -1) {
            var retCode = tempArray[i].split("=")[1];
            return retCode;
          }
        }
      }
      return null;
    },
    chooseGender: function(index) {
      this.selected = index;
    },
    chooseLi: function(index, key, text) {
      this.diabetesChoosePosition = index;
    },
    confirm: function() {
      var position = this.diabetesChoosePosition;
      if (position != -1) {
        this.diabetesType = this.diabetesTypeArray[position].itemValue;
      }
      this.selectIsShow = false;
    },
    cancel: function() {
      this.selectIsShow = false;
    },
    showSelect: function() {
      this.selectIsShow = true;
    },
    onCancel () {
      // if(window.history.length<=1){
      //     WeixinJSBridge.invoke('closeWindow',{},function(res){
      //     });
      // }else{
      //   this.$router.go(-1);
      // }
      this.show = false;
    },
    onConfirm () {
        this.show = false;
    },
    // 点击协议显示协议内容
    showProtocol () {
      this.show = true;
    },
    prevent (e) {
      e.stopPropagation();
    }
  },
  components: {
    // 注册组件
    commomHeader,
    CheckIcon
  },
  directives: {
    validateEmoji
  },
  // beforeRouteEnter: function (to, from, next) {
  //   sessionStorage.setItem('url', from.path);
  //   next();
  // },
  beforeMount: function() {
    if (sessionStorage.getItem("userType") != 1) {
      var huaweiOAuthCode = this.getQueryVariable("authorization_code"); //获取华为oauthCode
      this.isHuaweiLogin = huaweiOAuthCode !== null; // 不为空则是认证通过的页面
      this.huaweiOAuthCode = huaweiOAuthCode;
    }
  },
  beforeDestroy: function() {
    if (sessionStorage.getItem("userType") == 0) {
      this.$router.go(-2);
    }
  }
};
</script>
