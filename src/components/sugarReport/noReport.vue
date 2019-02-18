<template>
  <div class="noReportPage fullPage">
      <commomHeader :headerTitle="headerTitle" :rightIsShow="rightIsShow " :showArrow="showArrow" :showAdd="showAdd" :rightPath="rightPath" :showText="showText" :rightText="rightText" :goBackTwo="goBackTwo"></commomHeader>
      <div class="content center-y">
          <img src="/static/images/health/none_bg.png" alt="">
          <p>本{{name}}测量次数少于{{count}}次无法生成{{name}}报</p>
          <p>坚持测血糖，科学控糖</p>
      </div>
  </div>
</template>

<style lang="less" scoped>
   .content{
       width: 100%;
   }
   .content img{
       width: 3.6rem;
       height: 3.6rem;
       left:50%;
       transform: translateX(50%);
   }
   .content p{
       margin-top: 0.4rem;
       font-size: 0.36rem;
   }
   .content p:last-child{
       margin-top: 0.2rem;
       color:#999;
       font-size: 0.32rem;
   }
</style>

<script>
    import commomHeader from "../commomComponents/header" 

    export default {
        name:"noReport",
        data (){
            return {
                headerTitle:"",
                rightIsShow:false,
                showArrow:"",
                showAdd:"",
                showText:"showText",
                rightText:"",
                rightPath:"",
                count:"",
                name:"",
                goBackTwo:false
            }
        },
        components:{
            commomHeader
        }
        ,beforeMount:function(){
            this.count = this.$route.query.count;
            this.name = this.$route.query.name;
            this.headerTitle = this.$route.query.name+"报";
        }
    }
</script>