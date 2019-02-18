<template>
  <div class="buttonFullPage">
        <div class="devicesfooter">
            <a href="javascript:void(0)" style="cursor:pointer" @click="fncBtn1" class="bindButton toBindDevice">{{btnText1}}</a>
            <router-link :to='{path:bindPath2}' style="margin: 0 auto;" class="bindButton howToBind">{{btnText2}}</router-link>
        </div>
  </div>
</template>

<style lang="less" scoped>
    .devicesfooter{
        height: 2.56rem;
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        background: #f4f4f4;
    }
    .bindButton{
        display: block;
        width: 7rem;
        height: 0.9rem;
        line-height: 0.9rem;
        margin: 0 auto 0.38rem;
        font-size: 0.36rem;
        border-radius: 0.12rem;
        box-sizing: content-box;
        color: #fff;
        background-color: #34b597;
        border: 1px solid #34b597;
    }
    .howToBind{
        background-color: #fff;
        color: #34b597;
    }
</style>

<script>
    export default {
        name:"buttons",
        data (){
            return {

            }
        },
        methods:{
            fncBtn1:function(){
                this._props.callBackBtn1();
            }
        },
        props:['btnText1','btnText2','bindPath2','callBackBtn1']
    }
</script>

