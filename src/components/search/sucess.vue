<template>
  <div class="main">
    <div class="apply" v-if="myCode==0">
        <img src="/static/images/default/icon_success_color.png" alt="">
        <p>已成功提交好友申请，请耐心等待验证！</p>
    </div>
    <div class="apply" v-if="myCode==1">
        <img src="/static/images/default/icon_fail_color.png" alt="">
        <p>提交好友申请失败！</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
    .main{
        position: relative;
        width: 100%;
        height: 100%;
    }

    .apply{
        position: absolute;
        top: 50%;
        margin-top:-1.6rem;
        text-align: center;
        width: 100%;
        height:2rem;
    }

    .apply img{
        width: 1rem;
        height: 1rem;
        position: absolute;
        left:50%;
        margin-left:-0.5rem;
    }

    .apply p{
        font-size: 0.3rem;
        margin-top: 1rem;
    }    
</style>

<script>
    import Vue from 'vue'
    import {eventBus} from '../../utils/eventBus'
    export default {
        name:"sucess",
        data (){
            return {
                myCode:""
            }
        },
        beforeMount:function(){
            this.myCode = eventBus.code;
        }
    }
</script>