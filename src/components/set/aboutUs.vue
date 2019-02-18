<template>
  <div class="aboutUsPage fullPage">
      <commomHeader :headerTitle="headerTitle"></commomHeader>
      <div class="content">
          <img src="/static/images/aboutUs/about.png" alt="">
          <img src="/static/images/aboutUs/about_s.png" alt="">
      </div>
  </div>
</template>

<style lang="less" scoped>
    .content{
        width: 100%;
    }
    .content img{
        width: 100%;
        height: auto;
    }
</style>

<script>
    import commomHeader from "../commomComponents/header"
    export default {
        name:"guess",
        data (){
            return {
                headerTitle:"关于小糖医",
            }
        },
        components:{
            commomHeader
        }
    }
</script>