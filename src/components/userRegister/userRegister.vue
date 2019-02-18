<template>
  <div class="fullPage">
    <commomHeader :headerTitle="headerTitle"></commomHeader>
    <!-- 编辑用户 -->
    <div class="header-img-edit eachLine">
      <div class="text fl">头像</div>
      <div class="right-edit fr pr">
        <img class="headImg" :src="userHeadImg" alt="">    
      </div>        
    </div>
    <div class="name-edit eachLine">
      <div class="text fl">姓名</div>
      <input type="text" class="userName fr tar" placeholder="必填，最多10个字符" v-validateEmoji v-model="userName" maxlength="10">      
    </div>
    <div class="gender-edit eachLine">
      <div class="text fl">性别</div>
      <div class="right-edit fr">
          <div v-for="(item,index) in genderList" :key="index" @click="chooseGender(index)" :class="{genderItem:true,fl:true,current:selected==index}">
            <span :class="{current:selected==index}">{{item}}</span>
          </div>
      </div>
    </div>
    <div class="diabetes-edit eachLine">
        <div class="text fl" style="width:30%">糖尿病类型:</div>
        <input class="inputCode fr tar edit edit-width noCursor" style="border:none" type="text" placeholder="点击选择"
                v-model="diabetesType" maxlength="10" @click="showSelect" readonly>
    </div>
    <div class="diabetes-edit eachLine">
        <div class="text fl" style="width:30%">高血压类型:</div>
        <input class="inputCode fr tar edit edit-width noCursor" style="border:none" type="text" placeholder="点击选择"
                v-model="hypertensionType" maxlength="10" @click="showHypertensionSelect" readonly>
    </div>
    <div class="phone-edit eachLine pr">
      <div class="text fl">手机号</div>
      <div class="right-edit fr pr" @click="editPhone">{{phoneNumber}}<i class="arrowRight"></i></div>
    </div>
    <div class="btnSubmit" @click="bindPhone">提交</div>
    <div class="warn tac" v-show="!!warn">{{warn}}</div>


    <div class="selectBox fullPage" v-show="selectIsShow">
        <div class="content">
            <div class="chooseBox">
                <span class="fl" @click="cancel">取消</span>
                <span class="fr" @click="confirm">确定</span>
            </div>
            <ul>
                <li class="item pr bgWhite" v-for="(item, index) in diabetesTypeArray" :key="index" @click="chooseLi(index,item.itemKey,item.itemValue)">
                    <i class="center-y" v-show="index == diabetesChoosePosition"></i><span>{{item.itemValue}}</span>
                </li>
            </ul>
        </div>
    </div>
    <div class="selectBox fullPage" v-show="hypertensionSelectShow">
        <div class="content">
            <div class="chooseBox">
                <span class="fl" @click="hypertensionSelectShow = false">取消</span>
                <span class="fr" @click="confirmHypertension">确定</span>
            </div>
            <ul>
                <li class="item pr bgWhite" v-for="(item, index) in hypertensionTypeArray" :key="index" @click="hypertensionChooseLi(index,item.itemKey,item.itemValue)">
                    <i class="center-y" v-show="index == hypertensionChoosePosition"></i><span>{{item.itemValue}}</span>
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  /*完善信息*/
  .btnSubmit-updata{
    color: #FFF;
    height: 0.9rem;
    line-height: 0.9rem;
    text-align: center;
    position: fixed;
    font-size: 0.36rem;
    bottom: 0;
    width: 100% ;
    background: #00c2b1;
  }
  /*用户认证*/
  .eachLine {
    width: 100%;
    height: 1.2rem;
    font-size: 0.32rem;
    background-color: #fff;
  }
  .eachLine input {
    font-size: 0.32rem;
  }
  .header-img-edit,
  .name-edit,
  .gender-edit,
  .phone-edit,
  .diabetes-edit
  {
    border-bottom: 1px solid #ceceec;
  }
  //height: 1.18rem;
  .eachLine .right-edit{
    padding-right: 0.2rem;
    line-height: 1.2rem;
  } 
  .right-edit .genderItem{
    height: 0.52rem;
    line-height: 0.52rem;
    margin-left: 0.2rem;
    margin-top: 0.35rem;
    font-size: 0.28rem;
    box-sizing: border-box;
    border: 1px solid #cecece;
  }  
  .right-edit .genderItem span{
    color: #666;
    padding: 0 0.15rem;
  }
   
  .right-edit .current{
    background-color: #00c2b1;
    border: none;
    color:#fff;
  }
  .right-edit .genderItem span.current{
    color: #fff;
  }
  .right-edit .headImg{
    width: 0.8rem;
    height: 0.8rem;
    margin-top: 0.2rem;
  }
  .phone-edit .right-edit{
    height: 100%;
    padding-right: 0.6rem;
  }
  .phone-edit .arrowRight{
    width: 0.18rem;
    height: 0.30rem;
    position: absolute;
    right: 0.2rem;
    top: 50%;
    transform: translateY(-50%);
    background: url("/static/images/customer/home_but_enter.png") no-repeat;
    background-size: cover;
  }
  .name .userName,
  .phone .userPhone,
  .validCode .userValidCode,
  .diabetes-edit .inputCode{
    width: 70%;
    height: 1.2rem;
    line-height: 1.2rem;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 0.08rem;
    padding: 0.32rem 0.24rem;
    box-sizing: border-box;
  }

   .name-edit .userName, .diabetes-edit .inputCode{
      padding:0.24rem 0.2rem 0.24rem 0;
      height: 1.17rem;
      line-height: 1.17rem;
    }

  .validCode .userValidCode {
    width: 30%;
  }

  .text {
    width: 20%;
    color: #111;
    padding-left: 0.2rem;
    text-align-last: left;
    line-height: 1.2rem;
  }

  .gender .right {
    width: 70%;
  }

  .name {
    margin-top: 0.1rem;
  }

  .getValidCode {
    width: 35%;
    height: 0.76rem;
    line-height: 0.76rem;
    text-align: center;
    border-radius: .32em;
    background-color: #34b597;
    color: #FFF;
    margin-left: 5%;
    margin-top: 0.06rem;
    border: none;
    float: left;
  }

  .noUse {
    width: 35%;
    height: 0.76rem;
    line-height: 0.76rem;
    text-align: center;
    border-radius: .32em;
    background-color: #999;
    color: #FFF;
    margin-left: 5%;
    margin-top: 0.06rem;
    border: none;
    float: left;
  }

  .right img {
    display: inline-block;
    width: 0.4rem;
    height: 0.4rem;
    vertical-align: middle;
  }

  .right span {
    margin: 0 0.2rem;
  }

  .btnSubmit {
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

  .warn {
    width: 100%;
    height: 0.4rem;
    font-size: 0.36rem;
    line-height: 0.4rem;
    color:#f00;
  }

  .phone .editClass {
    border: none;
    color: #111;
  }


  .selectBox{
        width: 100%;
        position: fixed;
        left: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.3);
        z-index: 101;
    }
    .selectBox .chooseBox{
        widows: 100%;
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: 0.32rem;
        padding: 0 0.2rem;
        background-color: #fff;
    }
    .chooseBox span{
        display: block;
        width: 50%;
        text-align: center;
    }
    .selectBox .item{
        height: 1.1rem;
        line-height: 1.1rem;
        font-size: 0.36rem;
        border-top: 1px solid #e0e0e0;
    }
    .selectBox ul{
        background-color: #fff;
        max-height: 4.4rem;
        overflow: scroll;
    }
    .selectBox .content{
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 120;
        overflow: scroll;
    }
    .selectBox .item i{
        width: 0.4rem;
        height: 0.4rem;
        vertical-align: middle;
        position: absolute;
        left: 10%;
        background:url("/static/images/patient/jkda_select_icon.png") no-repeat;
        background-size: cover;
    }
    .noCursor{
        //readonly消除光标
        -webkit-user-select:none;
    }
</style>

<script>
  import commomHeader from "../commomComponents/header"
  import { Checker, CheckerItem, Divider, Group, Cell, Popup, TransferDom } from 'vux'
  import {validateEmoji} from '../../directives'
  import {isEmptyString} from '../../utils/utils'
  import {validatePhoneNumber} from '../../utils/validate'
  import {commonApiModel, userModel} from '../../api'
  export default {
    name: "userRegister",
    data() {
      return {
        headerTitle: "完善信息",
        phoneNumber: "",
        userName: "",
        warn: "",
        codeText: "获取验证码",
        isDisabled: false,
        genderList: ["男", "女", "保密"],
        selected: 0,
        validCode: "",
        buttonClass: "getValidCode",
        editClass: false,
        isEditInfo: false,
        userHeadImg: "",
        diabetesType: "",//糖尿病类型文本
        diabetesTypeArray: [],//糖尿病数组
        selectIsShow: false,//是否显示选择器
        diabetesChoosePosition: -1,//当前选中位置
        // 高血压选择控制器
        hypertensionSelectShow: false,
        hypertensionType: '',
        // hypertensionTypeArray: [],
        hypertensionTypeArray: [],
        hypertensionChoosePosition: -1
      }
    },
    components: {
      commomHeader
    },
    methods: {
      editPhone () {
        this.$router.push("/userRegister/editPhone");
      },
      getCode () {
        if (validatePhoneNumber(this.phoneNumber)) {
          commonApiModel.getPhoneValidateCode({phone: this.phoneNumber},(res) => {
            let time = 120;
            this.isDisabled = true;
            this.codeText = time + "秒后重新获取";
            let Timer = setInterval(function () {
              time--;
              this.codeText = time + "秒后重新获取";
              this.buttonClass = "noUse"
              if (time == 0) {
                clearInterval(Timer);
                this.isDisabled = false;
                this.codeText = "获取验证码";
                this.buttonClass = "getValidCode";
              }
            }, 1000);
          });
        } else {
          this.warn = "手机号不可用";
        }
      },
      noWarn () {
        this.warn = "";
      },
      bindPhone () {
        let gender = this.selected == 0 ? 1 : (this.selected == 1 ? 2 : 0);
        let data = {
          nickname: this.userName, 
          sex: gender,
          headimgurl:sessionStorage.getItem('headimgurl'),
        };
          if (((this.userName.trim()).length) == 0) {
            this.showToast('用户名不能为空');
          } else if (((this.userName.trim()).length) > 10) {
            this.showToast('用户名不能多于10个字符');
          } else if (this.diabetesChoosePosition == -1) {
            this.showToast("请选择糖尿病类型");
          } else if (this.hypertensionChoosePosition == -1) {
            this.showToast("请选择高血压类型");
          } else {
            data.ratio = "yes";
            data.diabetesType = this.diabetesTypeArray[this.diabetesChoosePosition].itemKey;
            data.bloodPressureType = this.hypertensionTypeArray[this.hypertensionChoosePosition].itemKey;
            userModel.editUserInfo(data, (res) => {
              userModel.getUserInfo({}, (res) => {
                let result = res.data.data.customerVo;
                sessionStorage.setItem("nickname", result.nickname);
                this.$router.push("/");
              })
            })
          }
      },
      chooseGender (index) {
        this.selected = index;
      },
      toEdit () {
        this.editClass = true;
        //获取用户头像
        if(this.$route.query.headImg){
          this.userHeadImg = this.$route.query.headImg;
        }
        userModel.getUserInfo({ratio:"yes"}, (res) => {
          let result = res.data.data.customerVo;
          if (!!result.headimgurl && result.headimgurl != "undefined") {
              this.userHeadImg = sessionStorage.getItem("imgDomain") + result.headimgurl;  
          } else if (result.sex == '2'){
            this.userHeadImg = "/static/images/customer/home_pic_woman.png";
          } else {
            this.userHeadImg = "/static/images/customer/home_pic_man.png";
          }
          this.userName = result.nickname;
          this.phoneNumber = result.phone;
          this.selected = result.sex == 1 ? 0 : (result.sex == 2 ? 1 : 2);
          var dicData = {typeCode:"diabetes_type"};
          commonApiModel.getDcByCode(dicData, (response) => {
            this.diabetesTypeArray = response.data.data.items;
            this.setDiabetesType(res);
          });
          let hypertentionDicData = {typeCode:"bloodPressure_type"};
          commonApiModel.getDcByCode(hypertentionDicData, (resp) => {
            this.hypertensionTypeArray = resp.data.data.items;
            this.setHypertensionType(res);
          })
        })
      },
      setDiabetesType (res) { // 设置糖尿病类型
        var resultDiabetesType = res.data.data.diabetesType;
        if (isEmptyString(resultDiabetesType) != '') {
          for (var i = 0; i<this.diabetesTypeArray.length; i++) {
              if (this.diabetesTypeArray[i].itemKey == resultDiabetesType) {
                  this.diabetesType = this.diabetesTypeArray[i].itemValue;
                  this.diabetesChoosePosition = i;
                  break;
              }
          }
        }
      },
      setHypertensionType (res) {
        var resultHypertensionType = res.data.data.bloodPressureType;
        if (isEmptyString(resultHypertensionType) != '') {
          for (var i = 0; i < this.hypertensionTypeArray.length; i++) {
              if (this.hypertensionTypeArray[i].itemKey == resultHypertensionType) {
                  this.hypertensionType = this.hypertensionTypeArray[i].itemValue;
                  this.hypertensionChoosePosition = i;
                  break;
              }
          }
        }
      },
      chooseLi (index,key,text) {
          this.diabetesChoosePosition = index;
      },
      hypertensionChooseLi (index,key,text) {
          this.hypertensionChoosePosition = index;
      },
      confirm () {
          var position = this.diabetesChoosePosition;
          if(position != -1){
              this.diabetesType = this.diabetesTypeArray[position].itemValue;
          }
          this.selectIsShow = false;
      },
      cancel () {
          this.selectIsShow = false;
      },
      showSelect () {
        this.selectIsShow = true;
      },
      showHypertensionSelect () {
        this.hypertensionSelectShow = true;
      },
      confirmHypertension () {
          var position = this.hypertensionChoosePosition;
          if(position != -1){
              this.hypertensionType = this.hypertensionTypeArray[position].itemValue;
          }
          this.hypertensionSelectShow = false;
      },
    },
    directives: {
      validateEmoji
    },
    beforeMount () {
      var _this = this; 
      if (sessionStorage.getItem("userType") == 1) {
          _this.toEdit();
      }
    }
  }
</script>
