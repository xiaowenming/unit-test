<template>
    <div class="fullPage">
        <ul>
            <li class="deviceItem bgWhite" v-for="(item,index) in devicesBindListData" :key="index">
                <div class="top pr">
                    <div class="content center-y">
                        <div class="left devicesIcon fl">
                            <img class="fl center-y" src="/static/images/device/btn_device.png" alt="">
                            <p class="title fl"><span class="titleTxet">{{item.deviceName}}</span></p>
                        </div>
                        <div class="right fr">
                            <i class="editIcon boxs-c" @click="editBtnCallBack(item.deviceImei, item.deviceName, index)"></i>
                            <div class="unbind fr pr">
                                <img 
                                    class="unbindImg center-y"
                                    src="/static/images/device/btn_unbind.png" alt="" 
                                    @click="unBindBtnCallBack(item.deviceImei, item.deviceName, item.id, item.nickname)">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="devicesInfo fl tal">
                        <div class="devicesInfoContent">
                            <p class="imeiNumber fl"><span class="imeiNumberText">IMEI号: </span><span class="devicesNumber">{{item.deviceImei}}</span></p>
                            <p class="bindTime fr"><span class="bindTimeText">绑定时间: </span><span class="devicesBindTime">{{item.createTime.substring(0,16)}}</span></p>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<style lang="less" scoped>
    .deviceItem{
        height: 1.8rem;
        padding: 0 0.3rem;
        border-bottom: 0.01rem solid #e0e0e0;
    }
    .deviceItem .top{
        height: 1.2rem;
    }
    .deviceItem .top .content{
        height: 0.5rem;
        width: 100%;
    }
    .devicesIcon{
        height: 100%;
        padding-left: 0.4rem;
    }
    .devicesIcon .title{
        font-size: 0.32rem ;
        color: #000;
    }
    .devicesIcon img{
        width: 0.22rem;
        height: 0.34rem;
        margin: 0 auto;
    }
    .content .right{
        height: 100%;
    }
    .right .editIcon{
        width: 1.28rem;
        height: 100%;
        margin-right: 0.3rem;
        background: url("/static/images/device/btn_edit.png") no-repeat;
        background-size: 100% 100%;
    }
    .deviceItem .bottom{
        height: 0.6rem;
    }
    .devicesInfo{
        width: 100%;
        height: 100%;
        font-size: 0.24rem;
        color: #666;
    }
    .unbind{
        width: 1.2rem;
        height: 100%;
    }
    .unbindImg{
        width: 1.2rem;
        height: 100%;
        left: 0;
    }
</style>
<script>
export default {
    data () {
        return{

        }
    },
    props: ['devicesBindListData', 'editBtnCallBack', 'unBindBtnCallBack']
}
</script>

