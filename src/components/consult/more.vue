<template>
    <div class="morePage fullPage pr">
        <commomHeader 
            :headerTitle='headerTitle'
            :rightIsShow='false'
            :showAdd='false'
            :goBackTwo='false'>
        </commomHeader>
        <div class="doctorDetail w100 bgWhite tal" @click="toDoctorDetail"><div class="icon fl"></div>医生详情<div class="arrow fr"></div></div>
        <div class="btn bgBase" @click="closeConsult">结束咨询</div>
        <p class="customerPhone color999 w100">投诉反馈请拨打电话: 4008882408</p>
        <div v-transfer-dom>
            <confirm v-model="show"
                :title="('结束咨询')"
                @on-cancel="onCancel"
                @on-confirm="onConfirm">
                    <p class="colorBlack" style="text-align:left;">{{ ('点击确定结束咨询，结束后您将不能再向医生发送消息。') }}</p>
            </confirm>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .morePage{
        background-color: #EFEFF4;
        .doctorDetail{
            height: 1.4rem;
            line-height: 1.4rem;
            padding: 0 0.3rem;
            font-size: 0.34rem;
            .icon{
                width: 0.45rem;
                height: 0.52rem;
                background: url('/static/images/consult/icon_d.png') no-repeat;
                background-size: cover;
                padding-left: 0.3rem;
                margin-top: 0.44rem;
                margin-right: 0.3rem;
            }
            .arrow{
                width: 0.15rem;
                height: 0.24rem;
                background: url('/static/images/customer/home_but_enter.png') no-repeat;
                background-size: cover;
                margin-top: 0.58rem;
            }
        }
        .btn{
            width: 6.9rem;
            height: 0.9rem;
            line-height: 0.9rem;
            margin: 0 auto;
            color: #fff;
            font-size: 0.36rem;
            border-radius: 0.1rem;
            margin-top: 0.6rem;
        }
        .customerPhone{
            position: absolute;
            bottom: 0.5rem;
            font-size: 0.28rem;
        }
    }
</style>
<script>
import { Group,Confirm, TransferDomDirective as TransferDom } from 'vux'
import commomHeader from '../commomComponents/header';
import {consultModel} from '../../api'
export default {
    data () {
        return{
            headerTitle: '更多',
            show: false
        }
    },
    methods: {
        toDoctorDetail () {
            this.$router.push({path: '/findDoctor/doctorDetail', query: {doctorId: ''}})
        },
        closeConsult () {
            this.show = true;
        },
        onCancel () {

        },
        onConfirm () {
            consultModel.closeConsult({sessionId: ''}, res => {

            });
        }
    },
    components: {
        commomHeader,
        Confirm,
        Group
    },
    directives: {
        TransferDom
    }
}
</script>
