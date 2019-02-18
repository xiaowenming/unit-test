<template>
  <div class="commomHeaderPage pr">
      <div class="commomHeader center-y pr">
          <span class="headerTitle">{{headerTitle}}</span><i class="arrowLeft" @click="goBack"></i><router-link :to='{path:rightPath,query:{data:rightParama}}' :class="[showArrow,showAdd,showText]" v-show="rightIsShow" :replace="replace" :goBackTwo="goBackTwo">{{rightText}}</router-link>
      </div>
  </div>
</template>

<style lang="less" scoped>
    .commomHeaderPage{
        width: 100%;
        height: 8%;
        border-bottom: 1px solid #CECECE;
        background-color: #fff;
    }
    .commomHeader {
        width: 100%;
        height: 0.38rem;
        font-size: 0.36rem;
        line-height: 0.38rem;
    }
    .commomHeader .arrowLeft{
        width: 0.3rem;
        height: 0.48rem;
        position: absolute;
        top: -0.03rem;
        left: 0.4rem;
        background: url("/static/images/default/icon_left.png") no-repeat;
        background-size: cover;
    }
    .showImg-arrow{
        width: 0.3rem;
        height: 0.48rem;
        position: absolute;
        top: -0.03rem;
        right: 0.4rem;
        background: url("/static/images/default/icon_right.png") no-repeat;
        background-size: cover;
    }
    .showImg-add{
        width: 0.44rem;
        height: 0.44rem;
        position: absolute;
        top: -0.03rem;
        right: 0.4rem;
        background: url("/static/images/default/btn_add.png") no-repeat;
        background-size: cover;
    }
    .showText{
        position: absolute;
        top: -0.03rem;
        right: 0.4rem;
        color: #34b597;
    }
</style>

<script>
    export default {
        name:"commomHeader",
        data (){
            return {

            }
        },
        methods:{
            goBack:function(){
                if(window.history.length<=1){
                    WeixinJSBridge.invoke('closeWindow',{},function(res){
                    });
                }else{
                    if(this._props.goBackTwo && window.history.length > 2){
                        history.go(-2);
                    }else{
                        history.go(-1);
                    }
                }
            }
        },
        props:['headerTitle','rightIsShow','showArrow','showAdd','showText','rightIsShow','rightText','rightPath','replace','goBackTwo','rightParama']
    }
</script>