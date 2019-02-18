<template>
  <div class="fullPage pr">
      <div class="content">
          <div class="top">
              <img src="/static/images/default/icon_fail_color.png" alt="">
              <p>绑定失败</p>
          </div>
          <div class="bottom tal">
              <div class="errMsg">
                <p>可能原因：</p>
                <p>1. 扫描的二维码不是正确的二维码，请参考[如何绑定]界面；</p>
                <p>2. 您要绑定的设备您已经绑定；</p>
                <p>3. 您要绑定的设备已被他人绑定；</p>
                <p class="iemi">IMEI号: {{imei}}</p>
            </div>
          </div>
      </div>
  </div>
</template>

<style lang="less" scoped>
    img {
        width: 1.5rem;
        height: 1.5rem;
        margin-top: 25%;
        margin: 25% auto 0;
    }
    .bottom{
        width: 90%;
        padding: 0 5% 0 5%;
        font-size: 14px;
        color: #878787;
        margin-top: 0.4rem;
    }
    .errMsg p{
        margin: 0.2rem 0 0.2rem;
    }
    .top p,
    .errMsg p:first-child{
        font-weight: 900;
        color: #000;
    }
    .top p{
        font-size: 0.4rem;
    }
    .iemi{
        margin-top: 0.5rem;
        font-size: 0.36rem;
        color: #000;
    }
</style>

<script>
    export default {
        name:"bindError",
        data (){
            return {
                imei: ''
            }
        },
        created () {
            this.imei = this.$route.query.imei;
        }
    }
</script>