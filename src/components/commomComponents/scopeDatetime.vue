<template>
    <div class="dateTimeBox bgWhite pr">
        <div class="left fl">
            <img v-if="!!iconSrc" class="icon fl" :style="{marginTop:0.85/2 + 'rem'}" :src="iconSrc"/>
            <span class="text fl">{{inputTitle}}</span>
        </div>
        <group>
            <datetime
                v-model="value"
                :start-date="startDate"
                :end-date="endDate"
                :readonly="isReadonly || false"
                :format="format || 'YYYY-MM-DD'" 
                :placeholder="placeHolderText"
                @on-confirm="onConfirm">
            </datetime>
        </group>
        <div class="arrow center-y-right" v-if="arrowIsShow || false"></div>
    </div>
</template>
<style>
    .dateTimeBox .vux-no-group-title{
        margin-top: 0;
    }
    .dateTimeBox .weui-cell{
        padding: 0;
        height: 1.2rem;
    }
    .dateTimeBox .weui-cell_access .weui-cell__ft, 
    .dateTimeBox .weui-cell__ft.vux-cell-primary.vux-datetime-value{
        padding-right: 0.6rem;
    }
    .dateTimeBox .weui-cells:after{
        border-bottom: none;
    }
    .dateTimeBox .weui-cells:before{
        border-top: none;
    }
</style>

<style scoped lang='less'>
    .dateTimeBox{
        width: 100%;
        line-height: 1.2rem;
        font-size: 0.35rem;
        padding-left: 0.4rem;
        border-bottom: 1px solid #EFEFF4;
    }
    .left{
        height: 100%;
        color: #111;
    }
    .left img{
        display: inline-block;
        width: 0.35rem;
        height: 0.35rem;
        margin-right: 0.2rem;
    }
    .arrow{
        width: 0.18rem;
        height: 0.3rem;
        right: 0.25rem;
        background: url('/static/images/customer/home_but_enter.png') no-repeat;
        background-size: cover;
    }
</style>
<script>
import { Datetime, Group} from 'vux'
import {FormDate} from '../../utils/utils'
export default {
    name:'scopeDatetime',
    data () {
        return {
            value: '',
            startDate: "1900-01-01",
            endDate: ''
        }
    },
    methods: {
        onConfirm (value) {
            this.$emit('sendInputValue', value, this.inputName);
        },
        setValue () {
            this.value = this.inputValue;
        }
    },
    beforeMount () {
        this.endDate = FormDate(new Date(),"yyyy-MM-dd");
        this.value = this.inputValue;
    },
    components: {
        Datetime,
        Group
    },
    watch: {
        'inputValue': function () {
            this.setValue();
        }
    },
    props: ['iconSrc', 'inputName', 'format','inputTitle', 'placeHolderText', 'arrowIsShow', 'inputValue', 'isReadonly']
}
</script>

