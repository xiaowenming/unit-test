<template>
    <div>
        <div class="selectBox fullPage" @click="clickMask"> <!-- @touchmove.prevent -->
            <ul class="selectList">
                <li :class="{isSelected: selectIndex == item.key}" v-for="(item, index) in list" :key="index" @click="clickLi(item)">{{item.value}}</li>
            </ul>
        </div>
    </div>
</template>
<style lang="less" scoped>
    .selectBox{
        background-color: rgba(0, 0, 0, 0.4);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 125;
    }
    .selectList{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        background-color: #fff;
    }
    .selectList li{
        height: 0.8rem;
        line-height: 0.8rem;
        font-size: 0.36rem;
        border-bottom: 1px solid #cecece;
    }
    .isSelected{
        background-color: #34b597;
        color: #fff;
    }
</style>
<script>
export default {
    data () {
        return{
            selectIndex: -1
        }
    },
    methods: {
        clickLi (item) {
            this.selectIndex = item.key;
            this.clickCallBack(item);
        },
        clickMask () {
            if (this.clickMaskCallBack) {
                this.clickMaskCallBack();
            }
        }
    },
    created () {
        this.selectIndex = this.defaultShow;
    },
    props: ['list', 'clickCallBack', 'clickMaskCallBack', 'defaultShow']
}
</script>
