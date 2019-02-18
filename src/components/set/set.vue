<template>
  <div class="setPage fullPage bgWhite">
      <commomHeader :headerTitle="headerTitle"></commomHeader>
      <group>
        <x-switch title="个人测量消息通知" v-model="value" :on-change="change(value)"></x-switch>
      </group>
      <div class="toAboutUs pr tal" @click="toAboutUs">
          <span>关于小糖医</span>
          <i class="arrow"></i>
      </div>
  </div>
</template>
<style>
    .setPage .vux-x-switch.weui-cell_switch{
        padding-top: 0.3rem;
        padding-bottom: 0.3rem;
    }
    .setPage .weui-cells{
        font-size: 0.36rem;
    }
    .setPage .vux-no-group-title{
        margin: 0;
    }
    .setPage .weui-cells:after{
        border-bottom:none;
    }
    .setPage .weui-label{
        text-align: left;
    }
    .setPage .weui-switch:checked{
        border-color: #00C2B1;
        background-color: #00C2B1;
    }
    .setPage .weui-switch:before, .weui-switch-cp__box:before{
        background-color: #7fb3ae;        
    }
</style>

<style lang="less" scoped>
    .toAboutUs{
        width:100%;
        height: 62px;
        line-height: 62px;
        padding:0 15px;
        font-size:0.36rem;
        border-top: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
    }
    .arrow{
        width: 0.18rem;
        height: 0.3rem;
        position: absolute;
        top:50%;
        transform:translateY(-50%);
        right:15px;
        background: url("/static/images/customer/home_but_enter.png") no-repeat;
        background-size: cover;
    }
</style>

<script>
    import commomHeader from "../commomComponents/header"
    import { XSwitch, Group } from 'vux'
    import {userModel, friendModel} from '../../api'
    export default {
        name:"guess",
        data (){
            return {
                headerTitle:"设置",
                value:true,
                time:0,//组件第一次渲染会有值的改变 , 此变量用来阻断第一次请求
            }
        },
        components:{
            commomHeader,
            XSwitch,
            Group
        },
        methods:{
            change:function(value){
                // console.log(value);
                let data = {category:"wechatMsg",code:"sugarTest"};
                data.isReceive = !!value?"1":"0";
                if(this.time!=0){
                    userModel.updateUserMessageSet(data);
                }
            },
            toAboutUs:function(){
                this.$router.push("/set/aboutUs");
            }
        },
        created:function(){
            let _this = this;
            userModel.getUserMessageSet({category:"wechatMsg",code:"sugarTest"}, function(res){
                _this.value = res.data.data.isReceive==0?false:true;
                _this.time = 1;
            });
        }
    }
</script>