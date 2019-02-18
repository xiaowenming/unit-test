<template>
  <div class="pointRulePage fullPage">
      <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :showAdd="showAdd" :rightPath="rightPath" :showText="showText" :rightText="rightText"></commomHeader>
      <div class="setting-info" v-show="ruleList.length>0" v-for="(item,index) in ruleList">
		<div>{{item.settingName}}</div>
		<div>规则失效时间：{{!!item.expirTime?item.expirTime+"":"永久"}}</div>
		<div>规则说明：</div>
        <div class="remark" v-html="paragraphList[index]"></div>
	  </div>
      <div class="noRule center-y" v-if="ruleList.length==0">
          <img src="/static/images/eshop/icon_setting_none.png" alt="">
          <p class="tac">暂无积分规则</p>
      </div>
  </div>
</template>

<style lang="less" scoped>
    .setting-info {
        width: 100%;
        margin-top: 30px;
    }
    .setting-info div:first-child {
        padding: 0px 10px 0px 10px;
        height: 35px;
        line-height: 35px;
        text-align: left;
        color: #FFF;
        font-size: 18px;
        background-color: #34B597;
    }
    .setting-info div {
        margin: 0px 15px 0px 15px;
        text-align: left;
        color: #333333;
        font-size: 15px;
        background-color: #FFF;
        margin-top: 10px;
        line-height: 25px;
    }
    .pointRulePage .noRule{
        width: 100%;
        top:40%;
    }
    .noRule img{
        margin: 0 auto 0.3rem;
        width: 1.32rem;
        height: 1.32rem;
    }
    .noRule p{
        width: 100%;
        font-size: 0.48rem;
        color: #999;
    }
</style>

<script>
    import commomHeader from "../commomComponents/header"
    import {commonApiModel} from '../../api'
    export default {
        name:"pointRule",
        data (){
            return {
                headerTitle:"积分规则",
                rightIsShow:false,
                showArrow:"",
                showAdd:"",
                showText:"showText",
                rightText:"",
                rightPath:null,
                //积分配置
                ruleName:"",
                ruleTime:"",
                ruleList:[],
                paragraphList:[]
            }
        },
        components:{
            commomHeader
        },
        created:function(){
            let _this = this;
            commonApiModel.getScoreRule({}, function(res){
                _this.ruleList = res.data.data.settings;
                _this.paragraphList = (res.data.data.settings).map(v=>{
                    return v.remark.replace(/#/g,'<br>');
                });
            })
        }
    }
</script>