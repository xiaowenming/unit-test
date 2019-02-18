<template>
  <div class="unbindPage pr fullPage">
      <div class="content center-y">
          是否解除<span class="userNickname colorBase">{{userNickName}}</span>和设备<span class="deviceName colorBase">{{devicesName}}</span><span class="ImeiNumber  colorBase">[{{imeiNumber}}]</span>之间的绑定
      </div>
      <buttons :btnText1="btnText1" :btnText2="btnText2" :bindPath2="bindPath2" :callBackBtn1="callBackBtn1"></buttons>
  </div>
</template>

<style lang="less" scoped>
.content {
  width: 80%;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.32rem;
}
</style>

<script>
    import buttons from './commomComponents/buttonsComponents';
    import {deviceModel} from '../api'
    export default {
        name:"unbindDevices",
        data (){
            return {
                btnText1:"确定",
                btnText2:"取消",
                imeiNumber: this.$route.query.devicesNumber,
                devicesName: this.$route.query.deviceName,
                deviceId: this.$route.query.deviceId,
                userNickName: sessionStorage.getItem('nickname'),
                bindPath2:"/bindDevices/byButton"
            }
        },
        methods:{
            //设备解绑
            callBackBtn1:function(){
                deviceModel.unBindDevice({id:this.deviceId}, function(res){
                    sessionStorage.setItem("fourthFlag", "444");
                    history.go(-1);
                })
            }
        },
        components:{
            buttons
        }
    }
</script>
