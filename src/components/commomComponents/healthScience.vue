<template>
    <div class="healthTips">
        <div class="tipsBox">
            <div class="header"></div>
            <div class="body tal" v-text="tipsContent">

            </div>
            <div class="footer"></div>
        </div>
    </div>
</template>
<style scoped lang='less'>
    .healthTips{
        background-color: #F4F4F4;
        padding: 0.3rem 0;
    }
    .healthTips .tipsBox{
        width: 6.9rem;
        margin: 0 auto;
        color: #326899;
    }
    .healthTips .tipsBox .header{
        height: 0.66rem;
        background: url('/static/images/sugarTest/healthTipsHeader.png');
        background-size: cover;
    }
    .healthTips .tipsBox .body{
        background-color: #fff;
        padding: 0.4rem 0.4rem 0;
        text-indent: 2em;
        font-size: 0.32rem;
    }
    .healthTips .tipsBox .footer{
        height: 0.9rem;
        background: url('/static/images/sugarTest/healthTipsFooter.png');
        background-size: cover;
    }
</style>
<script>
export default {
    name:'healthScience',
    data () {
        return {
            tipsContent: ''
        }
    }
}
</script>
