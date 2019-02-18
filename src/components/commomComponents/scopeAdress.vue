<template>
    <div class="addressBox bgWhite">
        <div class="mainModel pr">
            <div class="left fl">
                <img class="icon fl" :style="{marginTop:0.85/2 + 'rem'}" :src="iconSrc"/>
                <span class="text fl">{{inputTitle}}</span>
            </div>
            <group>
                <x-address 
                    :title="''"
                    v-model="value"
                    :list="addressData"
                    @on-hide="onHide"
                    raw-value
                    placeholder="请选择地址">
                </x-address>
            </group>
            <div class="arrow center-y-right" v-if="arrowIsShow || false"></div>
        </div>
    </div>
</template>
<style>
    .addressBox .vux-no-group-title{
        margin-top: 0;
    }
    .addressBox .weui-cell{
        padding: 0;
        height: 1.2rem;
    }
    .addressBox .weui-cell_access .weui-cell__ft{
        padding-right: 0.6rem;
    }
    .addressBox .weui-cells:after{
        border-bottom: none;
    }
    .addressBox .weui-cells:before{
        border-top: none;
    }
</style>

<style scoped lang='less'>
    .addressBox{
        width: 100%;
        line-height: 1.2rem;
        font-size: 0.35rem;
    }
    .mainModel{
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
import { Group, XAddress, ChinaAddressV4Data, Value2nameFilter as value2name } from 'vux'
export default {
    name: 'scopeAdress',
    data () {
        return {
            addressData: ChinaAddressV4Data,
            value: []
        }
    },
    methods: {
        onHide () {
            let addressArr = value2name(this.value, ChinaAddressV4Data).split(" ");
            this.$emit('changeValue', addressArr, this.inputName);
        }
    },
    watch: {
        'inputValue': function () {
            this.value = this.inputValue;
        }
    },
    components: {
        Group,
        XAddress
    },
    props:['inputName', 'arrowIsShow', 'inputTitle', 'iconSrc', 'inputValue']
}
</script>
